import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';

export const dynamic = 'force-dynamic';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

export async function GET() {
  await connectToDatabase();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const [products, categories] = await Promise.all([
    Product.find({ status: 'PUBLISHED' }).select('slug updatedAt').lean(),
    Category.find({ isActive: true }).select('slug updatedAt').lean(),
  ]);

  const staticRoutes: SitemapEntry[] = [
    { url: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
    { url: `${baseUrl}/products`, changefreq: 'daily', priority: '0.9' },
    { url: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.7' },
  ];

  const productRoutes: SitemapEntry[] = products.map((p: any) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastmod: (p.updatedAt || new Date()).toISOString(),
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const categoryRoutes: SitemapEntry[] = categories.map((c: any) => ({
    url: `${baseUrl}/products?category=${c.slug}`,
    lastmod: (c.updatedAt || new Date()).toISOString(),
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const allEntries: SitemapEntry[] = [...staticRoutes, ...productRoutes, ...categoryRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    ${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
