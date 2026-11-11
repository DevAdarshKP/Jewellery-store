# API Specification
# Project: Women's Jewellery & Ornaments Catalogue

## 1. Overview
The application exposes Next.js Route Handlers (`src/app/api/...`). Standard JSON responses and HTTP status codes are used throughout.

---

## 2. Public API Endpoints

### 2.1 `GET /api/categories`
Returns active categories ordered by `displayOrder`.
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "6723a101...",
      "name": "Necklaces & Pendants",
      "slug": "necklaces-pendants",
      "description": "Handcrafted diamond and gold necklaces...",
      "imageUrl": "/uploads/category-necklaces.jpg",
      "displayOrder": 1
    }
  ]
  ```

### 2.2 `GET /api/products`
Query parameters:
- `category`: Category slug
- `search`: Search string (searches title, SKU, summary, description)
- `featured`: `true` to filter featured items
- `sort`: `newest` (default), `title_asc`, `title_desc`
- `page`: Page index (1-based, default 1)
- `limit`: Items per page (default 12)
- **Response `200 OK`**:
  ```json
  {
    "items": [
      {
        "id": "6723a102...",
        "title": "Celeste Polki Diamond Choker",
        "slug": "celeste-polki-diamond-choker",
        "sku": "LUM-NK-001",
        "category": { "id": "...", "name": "Necklaces & Pendants", "slug": "necklaces-pendants" },
        "summary": "Exquisite 22K yellow gold choker with uncut diamonds.",
        "metal": "22K Yellow Gold",
        "purity": "91.6% Pure Gold",
        "priceGuidance": "Price on Request",
        "isFeatured": true,
        "primaryImage": "/uploads/celeste-choker-1.jpg"
      }
    ],
    "pagination": { "page": 1, "limit": 12, "total": 24, "totalPages": 2 }
  }
  ```

### 2.3 `GET /api/products/[slug]`
Returns complete product data, specifications, gallery images, and up to 4 related products from the same category.

### 2.4 `GET /api/settings/public`
Returns public branding, hero content, promotional announcement, and WhatsApp contact number.

---

## 3. Administrative API Endpoints (Protected)
*All admin endpoints require an active, authenticated HTTP-only session cookie.*

### 3.1 Authentication
- `POST /api/auth/login`: Accepts `{ "email": "...", "password": "..." }`, validates credentials against bcrypt hash, sets HTTP-only session cookie.
- `POST /api/auth/logout`: Clears the session cookie.
- `GET /api/auth/me`: Returns `{ "authenticated": true, "user": { "name": "...", "email": "...", "role": "ADMIN" } }`.

### 3.2 Dashboard Statistics
- `GET /api/admin/dashboard/stats`: Returns `{ "totalProducts": 32, "publishedProducts": 28, "draftProducts": 4, "totalCategories": 6, "featuredProducts": 8 }`.

### 3.3 Category Management
- `GET /api/admin/categories`: List all categories (including inactive).
- `POST /api/admin/categories`: Create category.
- `PUT /api/admin/categories/[id]`: Update category.
- `DELETE /api/admin/categories/[id]`: Delete category (validates that no active products are assigned).

### 3.4 Product Management
- `GET /api/admin/products`: List all products with status filter and pagination.
- `POST /api/admin/products`: Create product.
- `GET /api/admin/products/[id]`: Retrieve product for editing.
- `PUT /api/admin/products/[id]`: Update product.
- `DELETE /api/admin/products/[id]`: Delete product.
- `PATCH /api/admin/products/[id]/status`: Toggle status (`PUBLISHED` $\leftrightarrow$ `DRAFT`) or `isFeatured`.

### 3.5 Media Management
- `POST /api/admin/uploads`: Multipart file upload. Validates magic bytes/MIME (`image/jpeg`, `image/png`, `image/webp`), enforces size limit ($\le 5\text{MB}$), generates unique UUID filename, persists to `public/uploads/`, and returns `{ "url": "/uploads/<fileKey>", "fileKey": "<fileKey>" }`.

### 3.6 Settings Management
- `GET /api/admin/settings`: Retrieve all system and WhatsApp configurations.
- `PUT /api/admin/settings/[key]`: Update settings for key (`whatsapp`, `homepage`, `general`).

