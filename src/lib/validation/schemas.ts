import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100).trim(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
    .trim(),
  description: z.string().max(500).optional().default(''),
  imageUrl: z.string().optional().default(''),
  displayOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const ProductImageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  alt: z.string().default(''),
  isPrimary: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export const ProductAttributeSchema = z.object({
  group: z.string().min(1, 'Attribute group is required').trim(),
  key: z.string().min(1, 'Attribute key is required').trim(),
  value: z.string().min(1, 'Attribute value is required').trim(),
});

export const ProductSchema = z.object({
  title: z.string().min(2, 'Product title is required').max(200).trim(),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')
    .trim(),
  sku: z.string().min(2, 'SKU is required').max(50).trim().toUpperCase(),
  categoryId: z.string().min(1, 'Category is required'),
  summary: z.string().min(5, 'Summary is required').max(300).trim(),
  description: z.string().min(10, 'Detailed description is required'),
  metal: z.string().optional().default(''),
  purity: z.string().optional().default(''),
  stones: z.string().optional().default(''),
  priceGuidance: z.string().optional().default(''),
  quoteOnly: z.boolean().default(true),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  images: z.array(ProductImageSchema).default([]),
  attributes: z.array(ProductAttributeSchema).default([]),
});

export const WhatsAppSettingsSchema = z.object({
  phoneNumber: z.string().min(7, 'Phone number is required').trim(),
  messageTemplate: z.string().min(10, 'Message template is required'),
  enabled: z.boolean().default(true),
});

export const HomepageSettingsSchema = z.object({
  heroBadge: z.string().default('Haute Joaillerie & Ornaments'),
  heroTitle: z.string().min(3, 'Hero title is required'),
  heroSubtitle: z.string().min(3, 'Hero subtitle is required'),
  heroCtaText: z.string().default('Explore Collections'),
  announcementText: z.string().default(''),
  aboutStoryHeading: z.string().default('The Art of Fine Ornaments'),
  aboutStoryText: z.string().default(''),
  aboutStoryImage: z.string().optional().default(''),
});

export const GeneralSettingsSchema = z.object({
  brandName: z.string().min(2, 'Brand name is required'),
  tagline: z.string().default('Fine Jewellery & Ornaments'),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional().default(''),
  showroomAddress: z.string().optional().default(''),
  businessHours: z.string().optional().default(''),
});

