import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import prisma from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  endpoint: process.env.S3_ENDPOINT || undefined, // Support Cloudflare R2
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'designer-portfolio';

export class FileService {
  static async getFilesByProject(projectId: string) {
    return prisma.file.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUploadUrl(projectId: string, fileName: string) {
    const key = `projects/${projectId}/${Date.now()}-${fileName}`;

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      // No S3 configured — store the key and return it as the URL
      const file = await prisma.file.create({
        data: { projectId, name: fileName, url: key },
      });
      return { uploadUrl: null, fileId: file.id, key };
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: 'application/octet-stream',
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    const file = await prisma.file.create({
      data: { projectId, name: fileName, url: key },
    });

    return { uploadUrl, fileId: file.id, key };
  }

  static async getDownloadUrl(fileId: string) {
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return null;

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return null; // S3 not configured
    }

    try {
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: file.url });
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (err) {
      console.error('S3 Download URL generation failed:', err);
      return null;
    }
  }
}
