# Lumière Atelier — Women's Jewellery Catalogue Website

A modern luxury editorial jewellery catalogue and back-office administrative CMS built with **Next.js App Router**, **React**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. Designed specifically for fine jewellery houses and ornament ateliers, pairing an editorial public showcase with a direct-to-artisan **WhatsApp Concierge** enquiry workflow.

---

## 1. Key Highlights & Features

### Public Storefront
- **Modern Luxury Editorial Visual Design**: Warm gold (`#B8935B`), champagne, deep onyx (`#0B0C0E`), and ivory palettes with high-contrast serif typography (*Playfair Display* & *Inter*).
- **Editorial Hero Section**: Large brand narrative banner with direct links to collections and WhatsApp concierge.
- **Curated Taxonomy & Categories**: Regal chokers, necklaces, chandelier earrings, Kada bangles, and bridal heritage suites.
- **Faceted Product Catalogue (`/products`)**: Dynamic category filter pills, keyword search, price guidance, and sorting.
- **Product Detail Showcase (`/products/[slug]`)**:
  - Multi-image gallery with interactive thumbnail switcher.
  - Purity & metal specs (22K Yellow Gold, 18K Rose Gold, Platinum 950).
  - BIS 916 hallmarking & GIA diamond certification guarantees.
  - Formatted click-to-chat WhatsApp button encoding Product Title, SKU, and direct link.
  - Technical specifications table.
  - Related items carousel from the same collection.
- **SEO & Social Sharing**: Dynamic `sitemap.xml`, `robots.txt`, OpenGraph tags, and Schema.org `Product` JSON-LD.

### Back-Office Administrative CMS (`/admin`)
- **Secure Authentication**: HttpOnly session cookies, bcrypt password hashing (12 rounds), constant-time comparisons, and brute-force rate limiting.
- **Interactive Dashboard**: Real-time inventory metrics (Total, Published, Drafts, Categories, Featured Showcase).
- **Category Management (`/admin/categories`)**: Create, edit, reorder, and delete collections with auto-slug generation, cover image upload, and referential deletion protection.
- **Product Management (`/admin/products`)**:
  - Full CRUD with multi-image gallery uploader.
  - Primary thumbnail selector.
  - Dynamic specification attribute builder.
  - Instant publication toggle (`PUBLISHED` $\leftrightarrow$ `DRAFT`).
  - Featured showcase toggle.
- **Settings & WhatsApp CMS (`/admin/settings`)**:
  - Live WhatsApp message template editor with `{productName}`, `{productSku}`, `{productUrl}` variable simulation.
  - Homepage editorial headline, subtitle, announcement bar, and craftsmanship narrative CMS.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router, Server Components by default)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Custom luxury tokens, smooth transitions, ambient shadows)
- **Database**: MongoDB (via Mongoose with schema validation and compound indexes)
- **Storage**: Local persistent file storage (`public/uploads/`) behind an `IStorageAdapter` abstraction interface (drop-in S3/R2 ready)
- **Authentication**: `jose` JWT in signed HttpOnly cookies + `bcryptjs`
- **Testing**: Vitest (Unit & Integration tests) + Playwright (Critical Path E2E tests)

---

## 3. Getting Started & Installation

### Prerequisites
- **Node.js**: v20.x or higher
- **MongoDB**: A running MongoDB instance (e.g. `mongodb://127.0.0.1:27017/jewellery_store` or MongoDB Atlas)

### Setup Steps

1. **Navigate to the project directory**:
   ```bash
   cd jewellery-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Default `.env.local` contents:*
   ```ini
   MONGODB_URI=mongodb://127.0.0.1:27017/jewellery_store
   JWT_SECRET=super_secret_lumiere_atelier_jwt_token_key_change_in_production_2026
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   STORAGE_DRIVER=local
   UPLOAD_DIR=./public/uploads
   DEFAULT_WHATSAPP_PHONE=919876543210
   ```

4. **Seed Demonstration Data & Create Admin Account**:
   ```bash
   npm run seed
   ```
   *This seeds:*
   - 1 Admin Account:
     - **Email**: `admin@jewellerystore.local`
     - **Password**: `Admin@12345`
   - 5 Luxury Collections (Necklaces, Earrings, Bangles, Statement Rings, Bridal Heritage).
   - 10 Realistic Fine Jewellery Products (with photos, metal specs, and karat purity).
   - WhatsApp concierge configuration & homepage editorial content.

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Production Build & Execution**:
   ```bash
   npm run build
   npm run start
   ```

---

## 4. Client Demonstration Walk-Through Script

Follow these 11 steps during the client demonstration:

1. **Open the Public Storefront**:
   - Navigate to `http://localhost:3000`.
   - Inspect the top announcement banner, brand typography, and large editorial hero.
2. **Browse Collections**:
   - Click any collection card (e.g., *Necklaces & Pendants* or *Bridal Heritage Sets*).
   - Note the seamless transition to filtered results.
3. **Filter and Search Catalogue**:
   - Navigate to `http://localhost:3000/products`.
   - Use the category pills (*Earrings & Jhumkas*, *Bangles & Bracelets*, *Statement Rings*).
   - Enter `Polki` or `Emerald` into the search bar to test live search matching.
4. **Open Product Details**:
   - Click on the *Royal Polki & Emerald Choker*.
   - Interact with the multi-image gallery thumbnail switcher.
   - Inspect the BIS 916 hallmarked specifications table.
5. **Trigger WhatsApp Product Enquiry**:
   - Click the prominent green **"Enquire via WhatsApp Concierge"** button.
   - Verify that it opens a WhatsApp link formatted with the product title, SKU code (`LUM-NK-001`), and product URL.
6. **Log into Administrative CMS**:
   - Open `http://localhost:3000/admin`.
   - The security guard will redirect you to `http://localhost:3000/admin/login`.
   - Enter credentials:
     - **Email**: `admin@jewellerystore.local`
     - **Password**: `Admin@12345`
   - Press **Sign In**.
7. **Inspect the CMS Dashboard**:
   - View live metric counters (Total Products, Published, Drafts, Categories, Featured Showcase).
   - Review the *Recently Added Products* table.
8. **Add a New Category**:
   - Click **Categories** in the left sidebar $\rightarrow$ click **Add New Category**.
   - Enter Name: *Cocktail Brooches & Hairpins*, URL Slug: *cocktail-brooches*, and click **Create Category**.
9. **Add a New Jewellery Item & Upload Photos**:
   - Click **Products** $\rightarrow$ click **Add New Product**.
   - Title: *Heirloom Polki Diamond Brooch*, Metal: *22K Gold*, Price: *$2,800*.
   - Upload a photo or provide an image link.
   - Mark **Feature in Homepage Showcase**.
10. **Publish the Product**:
    - Ensure publication status is set to **Published**.
    - Click **Save & Publish**.
11. **Verify Live Synchronization on Storefront**:
    - Click **View Public Storefront** in the bottom-left sidebar.
    - Refresh the homepage: observe your new piece appearing in the *Curated Featured Masterpieces* section immediately, with working WhatsApp enquiry generation.

---

## 5. Automated Testing Suite

- **Unit & Integration Tests (Vitest)**:
  ```bash
  npm test
  ```
  Runs password hashing, session tokens, storage adapter validation, catalogue query lifecycle, and WhatsApp URL generation tests.

- **TypeScript Verification**:
  ```bash
  npm run type-check
  ```

