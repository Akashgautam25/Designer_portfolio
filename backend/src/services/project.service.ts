import prisma from '../config/database';
import { ProjectStatus, Role } from '@prisma/client';

export class ProjectService {
  static async getAllProjects(userId: string, role: Role) {
    if (role === Role.ADMIN) {
      return prisma.project.findMany({
        include: {
          client: { select: { id: true, email: true, name: true } },
          _count: { select: { files: true, messages: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    return prisma.project.findMany({
      where: { clientId: userId },
      include: {
        _count: { select: { files: true, messages: true } },
        invoices: { select: { id: true, status: true, amount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getProjectById(id: string, userId: string, role: Role) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, email: true, name: true } },
        files: { orderBy: { createdAt: 'desc' } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, email: true, name: true, role: true } } },
        },
        invoices: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!project) return null;
    if (role !== Role.ADMIN && project.clientId !== userId) return null;
    return project;
  }

  static async createProject(data: {
    title: string;
    clientId: string;
    description?: string;
    budget?: number;
    dueDate?: Date;
  }) {
    return prisma.project.create({
      data: {
        title: data.title,
        clientId: data.clientId,
        description: data.description,
        budget: data.budget,
        dueDate: data.dueDate,
        status: ProjectStatus.briefing,
        progress: 0,
      },
    });
  }

  static async updateProject(id: string, data: Partial<{
    title: string;
    description: string;
    status: ProjectStatus;
    progress: number;
    budget: number;
    dueDate: Date;
  }>) {
    return prisma.project.update({ where: { id }, data });
  }

  static async deleteProject(id: string) {
    // Cascade: delete messages, files, invoices first
    await prisma.message.deleteMany({ where: { projectId: id } });
    await prisma.file.deleteMany({ where: { projectId: id } });
    await prisma.invoice.deleteMany({ where: { projectId: id } });
    return prisma.project.delete({ where: { id } });
  }
}
