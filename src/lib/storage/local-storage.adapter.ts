import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { IStorageAdapter, UploadResult } from './storage.port';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export class LocalStorageAdapter implements IStorageAdapter {
  private readonly uploadDir: string;
  private readonly publicPrefix: string;

  constructor(
    uploadDir = process.env.UPLOAD_DIR || './public/uploads',
    publicPrefix = '/uploads'
  ) {
    this.uploadDir = path.resolve(process.cwd(), uploadDir);
    this.publicPrefix = publicPrefix;
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private resolveSafePath(fileKey: string): string {
    const safeKey = path.basename(fileKey);
    const resolved = path.resolve(this.uploadDir, safeKey);
    if (!resolved.startsWith(this.uploadDir)) {
      throw new Error('Path traversal attempt detected in media key');
    }
    return resolved;
  }

  async uploadFile(file: Buffer, originalName: string, mimeType: string): Promise<UploadResult> {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`Unsupported MIME type: ${mimeType}. Only JPEG, PNG, and WebP are allowed.`);
    }

    // Size limit check (max 5MB)
    if (file.length > 5 * 1024 * 1024) {
      throw new Error('File exceeds maximum size of 5MB');
    }

    await this.ensureUploadDir();

    const ext = EXTENSION_MAP[mimeType] || path.extname(originalName).toLowerCase() || '.jpg';
    const uniqueId = crypto.randomUUID();
    const fileKey = `${uniqueId}${ext}`;
    const destinationPath = this.resolveSafePath(fileKey);

    await fs.writeFile(destinationPath, file);

    return {
      fileKey,
      url: this.getPublicUrl(fileKey),
      originalName: path.basename(originalName),
      mimeType,
      sizeBytes: file.length,
    };
  }

  async deleteFile(fileKey: string): Promise<void> {
    try {
      const targetPath = this.resolveSafePath(fileKey);
      await fs.unlink(targetPath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  getPublicUrl(fileKey: string): string {
    const cleanKey = path.basename(fileKey);
    return `${this.publicPrefix}/${cleanKey}`;
  }

  async fileExists(fileKey: string): Promise<boolean> {
    try {
      const targetPath = this.resolveSafePath(fileKey);
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }
}

