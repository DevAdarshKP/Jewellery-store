import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { ProductStatus } from '@/types';

export interface IProductDocument extends Document {
  title: string;
  slug: string;
  sku: string;
  categoryId: Types.ObjectId;
  summary: string;
  description: string;
  metal?: string;
  purity?: string;
  stones?: string;
  priceGuidance?: string;
  quoteOnly: boolean;
  status: ProductStatus;
  isFeatured: boolean;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
    displayOrder: number;
  }>;
  attributes: Array<{
    group: string;
    key: string;
    value: string;
  }>;
  viewsCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductAttributeSchema = new Schema(
  {
    group: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    summary: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    metal: { type: String, trim: true },
    purity: { type: String, trim: true },
    stones: { type: String, trim: true },
    priceGuidance: { type: String, trim: true },
    quoteOnly: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    isFeatured: { type: Boolean, default: false },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    attributes: {
      type: [ProductAttributeSchema],
      default: [],
    },
    viewsCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ status: 1, isFeatured: 1, createdAt: -1 });
ProductSchema.index({ status: 1, categoryId: 1, createdAt: -1 });
ProductSchema.index({
  title: 'text',
  summary: 'text',
  description: 'text',
  sku: 'text',
  metal: 'text',
  stones: 'text',
});

export const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

