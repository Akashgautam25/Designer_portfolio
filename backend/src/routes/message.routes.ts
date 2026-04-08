import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { MessageService } from '../services/message.service';
import { NotificationService } from '../services/notification.service';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { getSocketEngine } from '../websocket/socket';
import { z } from 'zod';
import prisma from '../config/database';

const createMessageSchema = z.object({
  projectId: z.string(),
  content: z.string().min(1),
});

export default async function messageRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth);

  fastify.get('/:projectId', async (request: any, reply: FastifyReply) => {
    const messages = await MessageService.getMessagesByProject(request.params.projectId);
    return messages;
  });

  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = (request as AuthenticatedRequest).user;
      const { projectId, content } = createMessageSchema.parse(request.body);

      const message = await MessageService.createMessage({
        projectId,
        senderId: user.userId,
        content,
      });

      // Real-time: broadcast to project room
      try {
        const engine = getSocketEngine();
        engine.emitToProject(projectId, 'new-message', message);

        // Notify the other party
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { clientId: true, title: true },
        });
        if (project) {
          const notifyUserId =
            user.role === 'ADMIN' ? project.clientId : undefined;

          if (notifyUserId) {
            const notif = await NotificationService.create({
              userId: notifyUserId,
              type: 'message',
              title: 'New message',
              message: `New message on project "${project.title}"`,
              actionUrl: `/dashboard/messages`,
            });
            engine.emitToUser(notifyUserId, 'notification', notif);
          }
        }
      } catch {}

      return reply.status(201).send(message);
    } catch (e) {
      if (e instanceof z.ZodError) return reply.status(400).send({ error: e.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Mark messages as read
  fastify.patch('/:projectId/read', async (request: any, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    await prisma.message.updateMany({
      where: { projectId: request.params.projectId, senderId: { not: user.userId } },
      data: { read: true },
    });
    return { success: true };
  });
}
