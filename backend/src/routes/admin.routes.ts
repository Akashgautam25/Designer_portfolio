import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AdminService } from '../services/admin.service';
import { ProjectService } from '../services/project.service';
import { InvoiceService } from '../services/invoice.service';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.middleware';
import { InvoiceStatus, ProjectStatus } from '@prisma/client';
import { z } from 'zod';

const createProjectSchema = z.object({
  title: z.string().min(1),
  clientId: z.string(),
  description: z.string().optional(),
  budget: z.number().optional(),
  dueDate: z.string().optional(),
});

const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  progress: z.number().min(0).max(100).optional(),
  budget: z.number().optional(),
  dueDate: z.string().optional(),
});

const createInvoiceSchema = z.object({
  projectId: z.string(),
  amount: z.number().positive(),
  dueDate: z.string().optional(),
});

export default async function adminRoutes(fastify: FastifyInstance) {
  // All admin routes require ADMIN role
  fastify.addHook('preHandler', requireAdmin);

  // ── Dashboard metrics ────────────────────────────────────────────────────
  fastify.get('/metrics', async (_req, reply) => {
    const metrics = await AdminService.getMetrics();
    return metrics;
  });

  // ── Live visitors ────────────────────────────────────────────────────────
  fastify.get('/visitors', async (_req, reply) => {
    return AdminService.getLiveVisitors();
  });

  // ── Heatmap data ─────────────────────────────────────────────────────────
  fastify.get('/heatmap', async (request: any, reply) => {
    const { page } = request.query as { page?: string };
    return AdminService.getHeatmap(page);
  });

  // ── Recent analytics events ───────────────────────────────────────────────
  fastify.get('/events', async (_req, reply) => {
    const metrics = await AdminService.getMetrics();
    return { events: metrics.recentEvents };
  });

  // ── All clients ───────────────────────────────────────────────────────────
  fastify.get('/clients', async (_req, reply) => {
    return AdminService.getClients();
  });

  // ── All projects ──────────────────────────────────────────────────────────
  fastify.get('/projects', async (_req, reply) => {
    return AdminService.getAllProjects();
  });

  fastify.post('/projects', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = createProjectSchema.parse(request.body);
      const project = await ProjectService.createProject({
        title: data.title,
        clientId: data.clientId,
        description: data.description,
        budget: data.budget,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });
      return reply.status(201).send(project);
    } catch (e) {
      if (e instanceof z.ZodError) return reply.status(400).send({ error: e.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.patch('/projects/:id', async (request: any, reply: FastifyReply) => {
    try {
      const data = updateProjectSchema.parse(request.body);
      const project = await ProjectService.updateProject(request.params.id, {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });
      return project;
    } catch (e) {
      if (e instanceof z.ZodError) return reply.status(400).send({ error: e.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.delete('/projects/:id', async (request: any, reply: FastifyReply) => {
    await ProjectService.deleteProject(request.params.id);
    return { success: true };
  });

  // ── Invoices ──────────────────────────────────────────────────────────────
  fastify.post('/invoices', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = createInvoiceSchema.parse(request.body);
      const invoice = await InvoiceService.createInvoice({
        projectId: data.projectId,
        amount: data.amount,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });
      return reply.status(201).send(invoice);
    } catch (e) {
      if (e instanceof z.ZodError) return reply.status(400).send({ error: e.format() });
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.patch('/invoices/:id/status', async (request: any, reply: FastifyReply) => {
    const { status } = request.body as { status: InvoiceStatus };
    const invoice = await InvoiceService.updateStatus(request.params.id, status);
    return invoice;
  });

  // ── Contact submissions ───────────────────────────────────────────────────
  fastify.get('/contacts', async (_req, reply) => {
    return AdminService.getContactSubmissions();
  });
}
