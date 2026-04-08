import prisma from '../config/database';

export class MessageService {
  static async getMessagesByProject(projectId: string) {
    return prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: { sender: { select: { email: true, role: true } } },
    });
  }

  static async createMessage(data: { projectId: string; senderId: string; content: string }) {
    return prisma.message.create({
      data: {
        projectId: data.projectId,
        senderId: data.senderId,
        content: data.content,
      },
    });
  }
}
