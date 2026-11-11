export interface UploadResult {
  fileKey: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface IStorageAdapter {
  uploadFile(file: Buffer, originalName: string, mimeType: string): Promise<UploadResult>;
  deleteFile(fileKey: string): Promise<void>;
  getPublicUrl(fileKey: string): string;
  fileExists(fileKey: string): Promise<boolean>;
}

