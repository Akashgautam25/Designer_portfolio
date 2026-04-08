import prisma from '../config/database';
import { InvoiceStatus } from '@prisma/client';

export class InvoiceService {
  static async getInvoicesByProject(projectId: string) {
    return prisma.invoice.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getInvoicesByUser(userId: string) {
    return prisma.invoice.findMany({
      where: { project: { clientId: userId } },
      include: { project: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createInvoice(data: {
    projectId: string;
    amount: number;
    dueDate?: Date;
  }) {
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-${String(count + 1).padStart(4, '0')}`;

    return prisma.invoice.create({
      data: {
        projectId: data.projectId,
        invoiceNumber,
        amount: data.amount,
        dueDate: data.dueDate,
        status: InvoiceStatus.draft,
      },
    });
  }

  static async updateStatus(id: string, status: InvoiceStatus) {
    return prisma.invoice.update({
      where: { id },
      data: {
        status,
        paidAt: status === InvoiceStatus.paid ? new Date() : undefined,
      },
    });
  }
}
