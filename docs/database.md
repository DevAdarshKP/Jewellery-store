# Database Design Specification (MongoDB)
# Project: Women's Jewellery & Ornaments Catalogue

## 1. Overview & Strategy
The application stores its data in MongoDB (`jewellery_store` database). Mongoose is utilized for schema definition, strong typing, timestamps, and indexing.

---

## 2. Collections & Schemas

### 2.1 Collection: `users`
Stores administrative staff accounts. Public user registration is disabled.
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;             // Unique, indexed, lowercase
  passwordHash: string;      // Bcrypt hash (cost factor >= 12)
  role: 'ADMIN';             // Default: ADMIN
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```
**Indexes**:
- `{ email: 1 }` (Unique)

---

### 2.2 Collection: `categories`
Hierarchical taxonomy for jewellery classifications (e.g., Necklaces & Pendants, Earrings, Bangles & Bracelets, Rings, Bridal Sets).
```typescript
interface ICategory {
  _id: ObjectId;
  name: string;              // e.g., "Bridal Heritage"
  slug: string;              // Unique URL identifier, e.g., "bridal-heritage"
  description?: string;
  imageUrl?: string;         // Featured banner / thumbnail
  displayOrder: number;      // For custom sorting in navigation
  isActive: boolean;         // Default: true
  createdAt: Date;
  updatedAt: Date;
}
```
**Indexes**:
- `{ slug: 1 }` (Unique)
- `{ isActive: 1, displayOrder: 1 }`

---

### 2.3 Collection: `products`
Polymorphic jewellery item records with rich specifications, media gallery, and publication status.
```typescript
interface IProductImage {
  url: string;               // Storage URL or /uploads/filename
  alt: string;
  isPrimary: boolean;
  displayOrder: number;
}

interface IProductAttribute {
  group: string;             // e.g., "Metal & Purity", "Gemstones", "Dimensions"
  key: string;               // e.g., "Gold Purity", "Diamond Weight"
  value: string;             // e.g., "22K Yellow Gold", "1.50 Carats VVS1"
}

interface IProduct {
  _id: ObjectId;
  title: string;             // e.g., "Royal Kundan Choker Necklace"
  slug: string;              // Unique URL identifier
  sku: string;               // Unique product code, e.g., "LUM-NK-001"
  categoryId: ObjectId;      // References categories._id
  summary: string;           // Short 1-2 sentence luxury teaser
  description: string;       // Detailed description & craftsmanship story
  metal?: string;            // e.g., "Yellow Gold", "Rose Gold", "Platinum"
  purity?: string;           // e.g., "22 Karat", "18 Karat"
  stones?: string;           // e.g., "Uncut Polki & Emeralds"
  priceGuidance?: string;    // e.g., "From $1,800" or empty if quote only
  quoteOnly: boolean;        // Default: true
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;       // Display in homepage curated showcase
  images: IProductImage[];   // Ordered gallery (at least 1 image)
  attributes: IProductAttribute[];
  viewsCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```
**Indexes**:
- `{ slug: 1 }` (Unique)
- `{ sku: 1 }` (Unique)
- `{ status: 1, isFeatured: 1, createdAt: -1 }`
- `{ status: 1, categoryId: 1, createdAt: -1 }`
- Text index: `{ title: 'text', summary: 'text', description: 'text', sku: 'text' }`

---

### 2.4 Collection: `settings`
Global website configuration, WhatsApp contact numbers, and homepage content blocks.
```typescript
interface ISetting {
  _id: ObjectId;
  key: string;               // Unique identifier, e.g., "general", "whatsapp", "homepage"
  value: Record<string, any>;// Structured settings JSON payload
  updatedBy?: ObjectId;
  updatedAt: Date;
}
```
**Standard Setting Keys**:
- `whatsapp`:
  - `phoneNumber`: e.g., "919876543210" (digits only with country code)
  - `messageTemplate`: e.g., "Hello Lumière Atelier, I would like to enquire about {productName} (Code: {productSku}). Link: {productUrl}"
- `homepage`:
  - `heroBadge`: e.g., "Haute Joaillerie & Ornaments"
  - `heroTitle`: e.g., "Timeless Elegance, Crafted for Generations"
  - `heroSubtitle`: e.g., "Discover exquisite bespoke jewellery designed to celebrate life's most precious milestones."
  - `heroCtaText`: e.g., "Explore Collections"
  - `announcement`: e.g., "Complimentary Private Appointments & Worldwide Bespoke Consultations"
- `general`:
  - `brandName`: "Lumière Atelier"
  - `tagline`: "Fine Jewellery & Ornaments"
  - `contactEmail`: "concierge@lumiereatelier.local"
  - `contactPhone`: "+91 98765 43210"
  - `showroomAddress`: "14 Heritage Boulevard, Luxury Quarter"

---

### 2.5 Collection: `media`
Metadata registry of uploaded assets for tracking and audit.
```typescript
interface IMedia {
  _id: ObjectId;
  fileKey: string;           // Storage key (e.g., UUID-filename)
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  uploadedBy?: ObjectId;
  createdAt: Date;
}
```
**Indexes**:
- `{ fileKey: 1 }` (Unique)

