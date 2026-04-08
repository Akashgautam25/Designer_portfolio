import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import prisma from '../config/database';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10),
});

export default async function contactRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = contactSchema.parse(request.body);
      const submission = await prisma.contactSubmission.create({ data });
      return reply.status(201).send({ success: true, id: submission.id });
    } catch (e) {
      if (e instanceof z.ZodError) return reply.status(400).send({ error: e.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
