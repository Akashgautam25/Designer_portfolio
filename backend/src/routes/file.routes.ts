import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { FileService } from '../services/file.service';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { z } from 'zod';

const uploadSchema = z.object({
  projectId: z.string().uuid(),
  fileName: z.string().min(1),
});

export default async function fileRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth);

  // Get project files
  fastify.get('/project/:projectId', async (request: any, reply: FastifyReply) => {
    const { projectId } = request.params;
    const files = await FileService.getFilesByProject(projectId);
    return files;
  });

  // Generate upload URL (Direct to S3)
  fastify.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { projectId, fileName } = uploadSchema.parse(request.body);
      const data = await FileService.getUploadUrl(projectId, fileName);
      return data;
    } catch (error) {
       if (error instanceof z.ZodError) return reply.status(400).send({ error: error.format() });
       return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // Get download URL (Get signed URL for specific file)
  fastify.get('/download/:fileId', async (request: any, reply: FastifyReply) => {
    const { fileId } = request.params;
    const url = await FileService.getDownloadUrl(fileId);
    if (!url) return reply.status(404).send({ error: 'File not found' });
    return { downloadUrl: url };
  });
}
