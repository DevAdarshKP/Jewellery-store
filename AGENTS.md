# Agent Guidelines — Women's Jewellery Catalogue Website

## 1. Project Context & Boundaries
- **Project Name**: Women's Jewellery & Ornaments Catalogue Website
- **Working Directory**: `jewellery-store/`
- **Isolation Rule**: All project code, configurations, demonstration assets, and documentation MUST strictly reside within `jewellery-store/`.
- **Starter Kit Rule**: The sibling directory `../company-project-starter-kit/` is a read-only corporate framework. Never create, modify, rename, or delete any files in `company-project-starter-kit/`.

---

## 2. Approved Technology Stack
- **Framework**: Next.js (App Router, Server Components by default)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS (Modern Luxury Editorial theme: gold/champagne accents, serif headings, elegant spacing)
- **Database**: MongoDB (via Mongoose / official Node driver with schema validation & indexes)
- **Media Storage**: Local persistent file storage (`public/uploads/`) behind an `IStorageAdapter` abstraction interface for zero-friction local demonstration and drop-in S3 compatibility
- **Authentication**: Secure password hashing (bcrypt), signed HTTP-only session cookies, server-side route protection
- **Testing**: Vitest (unit & integration), Playwright (E2E critical paths)

---

## 3. Core Business & Architecture Rules
1. **Product Catalogue Model**: This is a curated catalogue with WhatsApp inquiry generation.
2. **Strict Exclusions**: Do NOT implement shopping cart, checkout, payment gateways, customer logins, automated inventory deductions, or shipping calculators.
3. **WhatsApp Workflow**: Generate pre-formatted `https://wa.me/<number>?text=...` links encoding Product Name, SKU/Code, Product URL, and inquiry text. User initiates click-to-chat; no WhatsApp Business API required.
4. **Admin Protection**:
   - No public user registration.
   - Admin account created solely via database seed script or administrative CLI.
   - All `/api/admin/*` and `/admin/*` routes strictly protected with server-side session checks.
   - Passwords hashed with bcrypt (salt rounds $\ge 12$).
   - Failed login attempts rate-limited.
5. **Data Freshness**: Ensure CMS updates (publishing, editing, featured toggling) trigger proper cache revalidation so updates reflect immediately on the storefront.
6. **Luxury Editorial UX**:
   - Refined serif headings paired with clean sans body.
   - High-quality, fast-loading visual presentation.
   - Consistent $8\text{px}/4\text{px}$ spacing hierarchy.
   - Full responsiveness across mobile, tablet, and desktop.
   - Accessible keyboard navigation and WCAG 2.2 AA compliant contrast.

---

## 4. Git & File Safety
- Never modify files outside `jewellery-store/`.
- Never execute git commits, pushes, branches, resets, or stashes unless explicitly instructed.
- Inspect files before modifying.

