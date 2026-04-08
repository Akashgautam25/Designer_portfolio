import prisma from '../config/database';

export class NotificationService {
  static async getForUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  static async create(data: {
    userId: string;
    type: string;
    title: string;
    message?: string;
    actionUrl?: string;
  }) {
    return prisma.notification.create({ data });
  }

  static async markRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { read: true } });
  }

  static async markAllRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId }, data: { read: true } });
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, read: false } });
  }
}
