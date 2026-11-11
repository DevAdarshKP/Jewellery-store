# Product Requirements Document (PRD)
# Project: Women's Jewellery & Ornaments Catalogue Website

## 1. Document Control & Metadata
- **Project**: Women's Fancy Jewellery & Ornaments Catalogue Website
- **Brand Identity (Provisional)**: *Lumière Atelier* (Fine Jewellery & Ornaments)
- **Version**: 1.0.0
- **Submission / Demo Target**: November 9, 2026
- **Architecture**: Next.js App Router (Modular Monolith) with MongoDB & Tailwind CSS

---

## 2. Product Overview & Strategic Goals
The primary objective is to deliver a premium, modern luxury editorial catalogue website showcasing women's fancy jewellery (necklaces, earrings, bangles, rings, bridal sets). Instead of an e-commerce checkout flow, the platform channels high-intent customers directly into a personalized WhatsApp enquiry workflow. The administrative back-office provides store managers full control over categories, products, media galleries, home showcase curation, and business WhatsApp settings.

### Scope Inclusions:
- Public Storefront with modern luxury editorial design.
- Category browsing, faceted filtering, and live search.
- Product detail pages with rich photo galleries, materials specifications, and click-to-chat WhatsApp inquiry button.
- Related products recommendations.
- Protected Administrative CMS with Dashboard, Product CRUD, Category CRUD, Media Uploads, Homepage CMS, and WhatsApp settings.
- Dynamic SEO (OpenGraph, JSON-LD Schema.org, Sitemap.xml, robots.txt).
- Comprehensive local demonstration data and seed scripts.

### Explicit Scope Exclusions:
- Shopping cart, checkout, and payment gateways.
- Customer accounts and public registration.
- Real-time inventory deductions and automated stock reservation.
- Automated shipping and delivery tracking.
- WhatsApp Business Cloud API automation (uses direct client-side click-to-chat).

---

## 3. User Roles & Access Control
| Role | Privilege Scope |
|---|---|
| **Public Visitor** | Read-only access to published products, active categories, search, filter, and WhatsApp link generation. |
| **Store Administrator** | Full back-office access: authenticate via secure session, manage categories, products, media assets, homepage content, and WhatsApp contact settings. |

*Note: Public admin registration is strictly disabled. Store Administrator accounts are provisioned via administrative seed script.*

---

## 4. Key Functional Requirements

### 4.1 Public Storefront
- **FR-PUB-01 (Homepage)**: Large editorial hero banner, featured collections, curated product showcase, new arrivals, brand craftsmanship narrative, and luxury footer.
- **FR-PUB-02 (Catalog Browsing)**: Responsive product grid with category filter tabs, sort by newest/alphabetical/featured, and responsive layout.
- **FR-PUB-03 (Search & Filter)**: Instant search by product title, SKU, and description; filter by category and material/metal type.
- **FR-PUB-04 (Product Detail Page)**: High-resolution image gallery with interactive thumbnail switcher, SKU code, category breadcrumbs, specification attributes (karat, stones, weight, purity), and quotation guidance.
- **FR-PUB-05 (WhatsApp Concierge)**: Direct WhatsApp button that generates pre-filled message URL with product name, SKU, item link, and inquiry prompt.
- **FR-PUB-06 (Editorial Pages)**: About Us (craftsmanship and heritage story) and Contact Us page with store hours and inquiry links.
- **FR-PUB-07 (SEO & Social Sharing)**: SSR metadata, OpenGraph tags, JSON-LD `Product` schema, dynamic `sitemap.xml`, and strict `noindex` for admin paths.

### 4.2 Administrative CMS
- **FR-ADM-01 (Authentication)**: Secure login with bcrypt hash verification, rate-limited attempts, and HttpOnly session cookies.
- **FR-ADM-02 (Dashboard)**: Metric overview (total products, active categories, featured items, unpublished drafts).
- **FR-ADM-03 (Category Management)**: Create, update, reorder, and soft/hard delete categories with slug generation and banner image.
- **FR-ADM-04 (Product Management)**: Create, edit, publish/unpublish, feature, and archive products with multiple images, SKU, pricing notes, and structured specifications.
- **FR-ADM-05 (Media Management)**: File upload system with MIME validation, crypto-random filenames, and persistent local storage (`public/uploads`) behind `IStorageAdapter`.
- **FR-ADM-06 (Homepage & Settings)**: Configure store phone number for WhatsApp, hero headline, promotional announcements, and SEO meta tags.

---

## 5. Non-Functional Requirements
- **Visual Distinction**: Modern luxury editorial aesthetic (warm gold, champagne, deep charcoal, ivory).
- **Performance**: LCP $\le 2.5\text{s}$, fast server-rendered pages with Next.js ISR/SSR.
- **Responsiveness**: Pixel-perfect layout from mobile (360px) to wide desktop (1440px+).
- **Security**: OWASP Top 10 defenses, zero plaintext secrets, parameter sanitization, and strict route middleware protection.

