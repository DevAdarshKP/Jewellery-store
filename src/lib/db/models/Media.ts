import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMediaDocument extends Document {
  fileKey: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  uploadedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMediaDocument>(
  {
    fileKey: { type: String, required: true, unique: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    sizeBytes: { type: Number, required: true },
    url: { type: String, required: true, trim: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const Media: Model<IMediaDocument> =
  mongoose.models.Media || mongoose.model<IMediaDocument>('Media', MediaSchema);

