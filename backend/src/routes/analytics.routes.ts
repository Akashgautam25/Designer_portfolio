import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AnalyticsService } from '../services/analytics.service';
import { z } from 'zod';

const eventSchema = z.object({
  type: z.string().min(1),
  page: z.string().min(1),
  meta: z.any().optional(),
  device: z.string().optional(),
  country: z.string().optional(),
  referrer: z.string().optional(),
  sessionId: z.string().optional(),
});

export default async function analyticsRoutes(fastify: FastifyInstance) {
  // Public — event ingestion
  fastify.post('/events', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = eventSchema.parse(request.body);
      const ipHash = Buffer.from(request.ip).toString('base64');
      await AnalyticsService.bufferEvent({ ...data, ipHash });
      return { status: 'ok' };
    } catch (e) {
      if (e instanceof z.ZodError) return reply.status(400).send({ error: e.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
