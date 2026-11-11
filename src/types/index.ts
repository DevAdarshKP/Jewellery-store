export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface IProductAttribute {
  group: string;
  key: string;
  value: string;
}

export interface IProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  summary: string;
  description: string;
  metal?: string;
  purity?: string;
  stones?: string;
  priceGuidance?: string;
  quoteOnly: boolean;
  status: ProductStatus;
  isFeatured: boolean;
  images: IProductImage[];
  attributes: IProductAttribute[];
  viewsCount?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUserSession {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN';
}

export interface IWhatsAppSettings {
  phoneNumber: string; // digits only with country code, e.g. "919876543210"
  messageTemplate: string;
  enabled: boolean;
}

export interface IHomepageSettings {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  announcementText: string;
  aboutStoryHeading: string;
  aboutStoryText: string;
  aboutStoryImage?: string;
}

export interface IGeneralSettings {
  brandName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  showroomAddress: string;
  businessHours: string;
}

export interface ISiteSettings {
  whatsapp: IWhatsAppSettings;
  homepage: IHomepageSettings;
  general: IGeneralSettings;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

