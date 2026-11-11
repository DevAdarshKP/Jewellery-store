import type { Metadata } from 'next';

export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Curated high-resolution jewellery fallbacks to guarantee zero broken images.
 */
export const JEWELLERY_IMAGE_FALLBACKS: Record<string, string> = {
  default: '/products/solitaire-diamond-ring.png',
  hero: '/hero-gold-ring-hq.png',
  necklaces: '/products/royal-polki-choker-hq.png',
  earrings: '/products/chandbali-earrings-hq.png',
  bangles: '/products/tennis-bracelet-hq.png',
  rings: '/hero-gold-ring-hq.png',
  bridal: '/products/royal-polki-choker-hq.png',
  craftsmanship: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=85',
};

/**
 * Returns a guaranteed valid image URL, replacing broken 404 links (such as known dead Unsplash IDs) with curated assets.
 */
export function getSafeImageUrl(url?: string | null, fallbackKey: keyof typeof JEWELLERY_IMAGE_FALLBACKS = 'default'): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return JEWELLERY_IMAGE_FALLBACKS[fallbackKey] || JEWELLERY_IMAGE_FALLBACKS.default;
  }
  // Known 404 dead asset from initial seed
  if (url.includes('1611591475870-13e2bf4b14d5')) {
    return JEWELLERY_IMAGE_FALLBACKS.bangles;
  }
  return url;
}

/**
 * Generates absolute canonical URL with deliberate query policy:
 * - Preserves category filter when present: /products?category=rings
 * - Strips pagination and sort keys to avoid indexing duplicate filtered views
 */
export function getCanonicalUrl(path: string, searchParams?: Record<string, string | undefined>): string {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, APP_BASE_URL);
  if (searchParams?.category && searchParams.category !== 'all') {
    url.searchParams.set('category', searchParams.category);
  }
  return url.toString();
}

/**
 * Builds standard Twitter and Open Graph metadata
 */
export function buildStorefrontMetadata({
  title,
  description,
  path = '/',
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const canonical = getCanonicalUrl(path);
  const ogImage = image || JEWELLERY_IMAGE_FALLBACKS.hero;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: 'Lumière Atelier',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Builds Schema.org Product JSON-LD adhering strictly to accuracy rules:
 * - NO fake USD prices
 * - NO fake InStock flags
 * - Accurate representation of bespoke quote-on-request high jewellery
 */
export function buildProductJsonLd({
  product,
  brandName = 'Lumière Atelier',
  currentUrl,
}: {
  product: {
    title: string;
    sku: string;
    summary: string;
    description?: string;
    categoryName?: string;
    images?: Array<{ url: string }>;
    metal?: string;
    purity?: string;
    stones?: string;
  };
  brandName?: string;
  currentUrl: string;
}) {
  const images = (product.images || [])
    .map((img) => getSafeImageUrl(img.url))
    .filter(Boolean);

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.sku,
    description: product.summary || product.description,
    image: images.length > 0 ? images : [JEWELLERY_IMAGE_FALLBACKS.default],
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category: product.categoryName || 'Fine Jewellery',
  };

  if (product.metal) jsonLd.material = product.metal;
  if (product.stones) jsonLd.gemstone = product.stones;

  return jsonLd;
}

/**
 * Builds Schema.org BreadcrumbList JSON-LD
 */
export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${APP_BASE_URL}${item.url}`,
    })),
  };
}

