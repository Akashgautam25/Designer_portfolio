import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ProjectService } from '../services/project.service';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware/auth.middleware';
import { Role, ProjectStatus } from '@prisma/client';
import { z } from 'zod';

const createProjectSchema = z.object({
  title: z.string().min(1),
  clientId: z.string().uuid(),
});

const updateProjectSchema = z.object({
  title: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export default async function projectRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth);

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    const projects = await ProjectService.getAllProjects(user.userId, user.role);
    return projects;
  });

  fastify.get('/:id', async (request: any, reply: FastifyReply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const project = await ProjectService.getProjectById(id, user.userId, user.role);
    if (!project) return reply.status(404).send({ error: 'Project not found' });
    return project;
  });

  // Admin only
  fastify.post('/', { preHandler: requireAdmin }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = createProjectSchema.parse(request.body);
      const project = await ProjectService.createProject(data);
      return project;
    } catch (error) {
      if (error instanceof z.ZodError) return reply.status(400).send({ error: error.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.patch('/:id', { preHandler: requireAdmin }, async (request: any, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const data = updateProjectSchema.parse(request.body);
      const project = await ProjectService.updateProject(id, data);
      return project;
    } catch (error) {
      if (error instanceof z.ZodError) return reply.status(400).send({ error: error.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
