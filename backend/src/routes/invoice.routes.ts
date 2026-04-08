import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { InvoiceService } from '../services/invoice.service';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';

export default async function invoiceRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth);

  // Client: get all their invoices
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as AuthenticatedRequest).user;
    const invoices = await InvoiceService.getInvoicesByUser(user.userId);
    return invoices;
  });

  // Get invoices for a specific project
  fastify.get('/project/:projectId', async (request: any, reply: FastifyReply) => {
    const invoices = await InvoiceService.getInvoicesByProject(request.params.projectId);
    return invoices;
  });
}
