import { notFound } from 'next/navigation';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Setting } from '@/lib/db/models/Setting';
import { ProductGallery } from '@/components/storefront/ProductGallery';
import { ProductSizeAndEnquiry } from '@/components/storefront/ProductSizeAndEnquiry';
import { ProductCard } from '@/components/storefront/ProductCard';
import { CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { IProduct } from '@/types';
import { formatWhatsAppPhone } from '@/lib/whatsapp/link-generator';
import {
  getCanonicalUrl,
  getSafeImageUrl,
  buildProductJsonLd,
  buildBreadcrumbJsonLd,
  APP_BASE_URL,
} from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: { slug: string };
}

async function getProductBySlug(slug: string) {
  await connectToDatabase();

  const product = await Product.findOne({ slug, status: 'PUBLISHED' })
    .populate('categoryId', 'name slug')
    .lean();

  if (!product) {
    return null;
  }

  // Related items from same category
  const related = await Product.find({
    categoryId: (product.categoryId as any)._id,
    status: 'PUBLISHED',
    _id: { $ne: product._id },
  })
    .populate('categoryId', 'name slug')
    .limit(4)
    .lean();

  const settings = await Setting.find().lean();
  const settingsMap: Record<string, any> = {};
  for (const s of settings) {
    if (s.key && s.value) settingsMap[s.key] = s.value;
  }

  const formatProduct = (p: any): IProduct => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    sku: p.sku,
    categoryId: p.categoryId?._id ? p.categoryId._id.toString() : '',
    categoryName: p.categoryId?.name || 'Jewellery',
    categorySlug: p.categoryId?.slug || '',
    summary: p.summary,
    description: p.description,
    metal: p.metal || '',
    purity: p.purity || '',
    stones: p.stones || '',
    priceGuidance: p.priceGuidance || '',
    quoteOnly: p.quoteOnly ?? true,
    status: p.status,
    isFeatured: p.isFeatured ?? false,
    images: p.images || [],
    attributes: p.attributes || [],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  });

  return {
    product: formatProduct(product),
    related: related.map(formatProduct),
    whatsappPhone:
      settingsMap.whatsapp?.phoneNumber || process.env.DEFAULT_WHATSAPP_PHONE || '918129440790',
    whatsappTemplate: settingsMap.whatsapp?.messageTemplate,
    brandName: settingsMap.general?.brandName || 'Lumière Atelier',
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const data = await getProductBySlug(params.slug);
  if (!data) return { title: 'Piece Not Found | Lumière Atelier' };

  const { product, brandName } = data;
  const rawImg = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;
  const primaryImg = rawImg?.startsWith('http')
    ? rawImg
    : `${APP_BASE_URL}${rawImg || '/products/solitaire-diamond-ring.png'}`;
  const canonical = getCanonicalUrl(`/products/${product.slug}`);

  return {
    title: `${product.title} (${product.sku}) | ${brandName}`,
    description: product.summary,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${product.title} | ${brandName}`,
      description: product.summary,
      url: canonical,
      siteName: brandName,
      images: [
        {
          url: primaryImg,
          width: 1200,
          height: 1200,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | ${brandName}`,
      description: product.summary,
      images: [primaryImg],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const data = await getProductBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { product, related, whatsappPhone, whatsappTemplate, brandName } = data;

  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/products/${product.slug}`
      : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${product.slug}`;

  // Accurate Schema.org JSON-LD
  const productJsonLd = buildProductJsonLd({
    product,
    brandName,
    currentUrl,
  });

  const breadcrumbsJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Collection', url: '/products' },
    ...(product.categorySlug
      ? [{ name: product.categoryName || 'Jewellery', url: `/products?category=${product.categorySlug}` }]
      : []),
    { name: product.title || 'Fine Jewellery Piece', url: `/products/${product.slug}` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-8 sm:space-y-16 text-charcoal-900 bg-[#FFFBF5]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] text-charcoal-500 font-sans uppercase tracking-luxury-widest overflow-x-auto no-scrollbar whitespace-nowrap py-1">
        <Link href="/" className="hover:text-charcoal-900 transition shrink-0">
          Home
        </Link>
        <span className="shrink-0">/</span>
        <Link href="/products" className="hover:text-charcoal-900 transition shrink-0">
          Collection
        </Link>
        {product.categorySlug && (
          <>
            <span className="shrink-0">/</span>
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="hover:text-charcoal-900 transition shrink-0"
            >
              {product.categoryName}
            </Link>
          </>
        )}
        <span className="shrink-0">/</span>
        <span className="text-charcoal-900 font-semibold truncate max-w-[140px] sm:max-w-xs">{product.title}</span>
      </nav>

      {/* =========================================================================
          MAIN PRODUCT SHOWCASE SECTION (MATCHING EXACT REFERENCE DESIGN)
          Mobile: Product visual/gallery first (customer POV on the piece), then details below
          Desktop: 2-column layout (Left: Details, Right: Sticky Floating Gallery)
          ========================================================================= */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-1 sm:pt-2">
        {/* -------------------------------------------------------------
            GALLERY COLUMN: FIRST ON MOBILE (POV ON PRODUCT), RIGHT ON DESKTOP
            ------------------------------------------------------------- */}
        <div className="order-1 lg:order-2 lg:col-span-6 lg:sticky lg:top-28 w-full">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* -------------------------------------------------------------
            DETAILS COLUMN: SECOND ON MOBILE (UNDER PRODUCT), LEFT ON DESKTOP
            ------------------------------------------------------------- */}
        <div className="order-2 lg:order-1 lg:col-span-6 space-y-6 text-left w-full">
          {/* Category & SKU Pill */}
          <div className="flex items-center space-x-2.5">
            <span className="px-3 py-1 bg-[#FAF6F0] border border-[#EAE4D9] text-champagne-metallic text-[10px] uppercase tracking-luxury-widest font-bold rounded-full">
              {product.categoryName}
            </span>
            <span className="px-2.5 py-1 bg-charcoal-100 text-charcoal-700 text-[10px] font-mono uppercase tracking-wider rounded-md font-semibold border border-[#EAE4D9]">
              SKU: {product.sku}
            </span>
          </div>

          {/* Large All-Caps Display Serif Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-normal text-charcoal-900 tracking-tight uppercase leading-[1.08] select-none">
            {product.title}
          </h1>

          {/* Artisanal Narrative Summary */}
          <p className="text-sm sm:text-base text-charcoal-600 font-light leading-relaxed max-w-lg">
            {product.summary}
          </p>

          {/* Price Guidance Display (Matching "$ 4,100" in Reference Screenshot) */}
          <div className="pt-2">
            <span className="text-[10px] uppercase tracking-luxury-widest text-charcoal-400 font-semibold font-sans block">
              Estimated Price Guidance
            </span>
            <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900 mt-1 tracking-tight">
              {product.priceGuidance || 'Bespoke Quote on Request'}
            </div>
            <span className="text-[11px] text-charcoal-500 font-light mt-1 block">
              Taxes, BIS hallmark &amp; bespoke sizing included
            </span>
          </div>

          {/* Size Selector + Proper Enquiry Buttons */}
          <ProductSizeAndEnquiry
            productTitle={product.title}
            productSku={product.sku}
            categoryName={product.categoryName}
            priceGuidance={product.priceGuidance}
            whatsappPhone={whatsappPhone}
            whatsappTemplate={whatsappTemplate}
            productUrl={currentUrl}
          />

          {/* Key Metal & Purity Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#EAE4D9] text-xs">
            {product.metal && (
              <div className="bg-white p-3.5 rounded-xl border border-[#EAE4D9] shadow-sm">
                <span className="text-charcoal-500 text-[10px] uppercase tracking-wider block font-medium">
                  Metal &amp; Karat
                </span>
                <span className="font-semibold text-charcoal-900 mt-0.5 block">{product.metal}</span>
              </div>
            )}
            {product.purity && (
              <div className="bg-white p-3.5 rounded-xl border border-[#EAE4D9] shadow-sm">
                <span className="text-charcoal-500 text-[10px] uppercase tracking-wider block font-medium">
                  Purity Mark
                </span>
                <span className="font-semibold text-charcoal-900 mt-0.5 block">{product.purity}</span>
              </div>
            )}
            {product.stones && (
              <div className="col-span-2 bg-white p-3.5 rounded-xl border border-[#EAE4D9] shadow-sm">
                <span className="text-charcoal-500 text-[10px] uppercase tracking-wider block font-medium">
                  Gemstones &amp; Diamonds
                </span>
                <span className="font-semibold text-charcoal-900 mt-0.5 block">{product.stones}</span>
              </div>
            )}
          </div>

          {/* Full Narrative Description */}
          {product.description && (
            <div className="space-y-3 pt-4 border-t border-[#EAE4D9]">
              <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                Artisanal Description
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed font-light whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="space-y-2.5 pt-2 border-t border-[#EAE4D9] text-xs text-charcoal-600 font-light">
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Government BIS 916 / 750 Hallmarked Gold Certification</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Conflict-free natural diamonds with international laboratory credentials</span>
            </div>
            <div className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">Complimentary insured worldwide courier &amp; private atelier viewings</span>
            </div>
          </div>
          {/* Note: NO video on the left bottom per user instructions */}
        </div>
      </div>

      {/* =========================================================================
          EDITORIAL BOTTOM BAR (MATCHING REFERENCE STRIP)
          Center: Specifications, Authenticity, Certification, Atelier Care, Concierge
          Right: "Explore More →" in Solid Black Block
          ========================================================================= */}
      <div className="border border-[#EAE4D9] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 px-4 sm:px-6 py-4 text-[10.5px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider sm:tracking-luxury-widest text-charcoal-600">
          <span className="hover:text-charcoal-900 cursor-default transition-colors">BIS Certification</span>
          <span className="text-charcoal-300 select-none">•</span>
          <span className="hover:text-charcoal-900 cursor-default transition-colors">Authenticity Guarantee</span>
          <span className="text-charcoal-300 select-none">•</span>
          <span className="hover:text-charcoal-900 cursor-default transition-colors">Conflict-Free Diamonds</span>
          <span className="text-charcoal-300 select-none">•</span>
          <span className="hover:text-charcoal-900 cursor-default transition-colors">Atelier Care</span>
          <span className="text-charcoal-300 select-none">•</span>
          <a
            href={`https://wa.me/${formatWhatsAppPhone(whatsappPhone)}?text=${encodeURIComponent(
              `Hello, I would like to consult about ${product.title}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-champagne-metallic hover:text-charcoal-900 transition-colors"
          >
            WhatsApp Concierge
          </a>
        </div>

        <Link
          href="/products"
          className="w-full md:w-auto px-8 py-4 bg-charcoal-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-luxury-widest transition-all duration-200 flex items-center justify-center space-x-2 shrink-0 group active:scale-[0.99]"
        >
          <span>Explore More</span>
          <ArrowRight className="w-4 h-4 text-champagne-gold group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* =========================================================================
          RELATED CREATIONS FROM SAME COLLECTION
          ========================================================================= */}
      {related.length > 0 && (
        <div className="pt-16 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-luxury-widest text-champagne-metallic font-semibold block font-sans">
                Complementary Pieces
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900 mt-1">
                More from {product.categoryName}
              </h2>
            </div>
            {product.categorySlug && (
              <Link
                href={`/products?category=${product.categorySlug}`}
                className="text-xs uppercase tracking-luxury-widest font-semibold text-charcoal-900 hover:text-champagne-metallic transition"
              >
                View Collection &rarr;
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                whatsappPhone={whatsappPhone}
                whatsappTemplate={whatsappTemplate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Return to Catalogue */}
      <div className="pt-6">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-luxury-widest font-semibold text-charcoal-600 hover:text-charcoal-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jewellery Catalogue</span>
        </Link>
      </div>
    </div>
  );
}
