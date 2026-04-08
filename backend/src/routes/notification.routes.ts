import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { NotificationService } from '../services/notification.service';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';

export default async function notificationRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth);

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    const notifications = await NotificationService.getForUser(user.userId);
    return notifications;
  });

  fastify.get('/unread-count', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    const count = await NotificationService.getUnreadCount(user.userId);
    return { count };
  });

  fastify.patch('/:id/read', async (request: any, reply: FastifyReply) => {
    const notification = await NotificationService.markRead(request.params.id);
    return notification;
  });

  fastify.patch('/read-all', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    await NotificationService.markAllRead(user.userId);
    return { success: true };
  });
}
