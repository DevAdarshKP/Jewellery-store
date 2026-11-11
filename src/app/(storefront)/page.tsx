import Link from 'next/link';
import Image from 'next/image';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';
import { Setting } from '@/lib/db/models/Setting';
import { TasholaCarouselRow } from '@/components/storefront/TasholaCarouselRow';
import { TasholaCategoryGrid } from '@/components/storefront/TasholaCategoryGrid';
import { TasholaMoltenSection } from '@/components/storefront/TasholaMoltenSection';
import { HeroCarousel } from '@/components/storefront/HeroCarousel';
import { TasholaProductItem } from '@/components/storefront/TasholaProductCard';
import { buildStorefrontMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildStorefrontMetadata({
  title: 'Lumière Atelier | Fine Jewellery & Bespoke Ornaments',
  description:
    'Handcrafted royal necklaces, uncut polki diamonds, bridal heritage ornaments, and contemporary sculptural fine jewellery.',
  path: '/',
});

async function getHomepageData() {
  await connectToDatabase();

  const [dbProducts, categories, settings] = await Promise.all([
    Product.find({ status: 'PUBLISHED' })
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .lean(),
    Category.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean(),
    Setting.find().lean(),
  ]);

  const settingsMap: Record<string, any> = {};
  for (const s of settings) {
    if (s.key && s.value) settingsMap[s.key] = s.value;
  }

  return {
    whatsappPhone:
      settingsMap.whatsapp?.phoneNumber || process.env.DEFAULT_WHATSAPP_PHONE || '918129440790',
    whatsappTemplate: settingsMap.whatsapp?.messageTemplate,
    dbProducts: JSON.parse(JSON.stringify(dbProducts)),
  };
}

// -----------------------------------------------------------------------------
// Curated Atelier Masterpieces (Row 1) - Tashola Signature Collection
// -----------------------------------------------------------------------------
const ROW_1_PRODUCTS: TasholaProductItem[] = [
  {
    id: 'gold-pink-stone-hoop-earrings',
    title: 'Gold Pink Stone Detail Hoop Earrings',
    price: '£28.00',
    imageUrl: '/products/tashola-pink-stone-hoops.png',
    secondaryImageUrl: '/products/tashola-pink-stone-hoops-2.png',
    badge: 'Trending',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-ER-002',
    categorySlug: 'earrings-jhumkas',
  },
  {
    id: 'gold-serpentine-flow-crystal-bangle',
    title: 'Gold Serpentine Flow Crystal Bangle',
    price: '£12.00',
    imageUrl: '/products/tashola-serpentine-bangle.png',
    secondaryImageUrl: '/products/tashola-serpentine-bangle-2.png',
    badge: 'Bestseller',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-BR-002',
    categorySlug: 'bangles-bracelets',
  },
  {
    id: 'gold-organic-clear-crystal-dangle-earrings',
    title: 'Gold Organic Clear Crystal Dangle Earrings',
    price: '£30.00',
    imageUrl: '/products/tashola-crystal-dangles.png',
    secondaryImageUrl: '/products/tashola-crystal-dangles-2.png',
    badge: 'Artisanal',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-ER-003',
    categorySlug: 'earrings-jhumkas',
  },
  {
    id: 'gold-sculptural-pebble-ring',
    title: 'Gold Sculptural Pebble Ring',
    price: '£10.00',
    imageUrl: '/products/tashola-pebble-ring.png',
    secondaryImageUrl: '/products/tashola-pebble-ring-2.png',
    badge: 'New In',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-RG-003',
    categorySlug: 'statement-rings',
  },
  {
    id: 'gold-flora-stud-earrings',
    title: 'Gold Statement Sculptural Flora Stud Earrings',
    price: '£38.00',
    imageUrl: '/products/tashola-flora-studs.png',
    secondaryImageUrl: '/products/tashola-flora-studs-2.png',
    badge: 'Signature',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-ER-004',
    categorySlug: 'earrings-jhumkas',
  },
  {
    id: 'gold-gemstone-statement-ring',
    title: 'Gold Statement Gemstone Ring',
    price: '£22.00',
    imageUrl: '/products/tashola-gemstone-ring.png',
    secondaryImageUrl: '/products/tashola-gemstone-ring-2.png',
    badge: 'Limited Edition',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-RG-006',
    categorySlug: 'statement-rings',
  },
  {
    id: 'gold-flow-open-cuff',
    title: 'Gold Golden Flow Open Cuff',
    price: '£35.00',
    imageUrl: '/products/tashola-flow-cuff.png',
    secondaryImageUrl: '/products/tashola-flow-cuff-2.png',
    badge: 'Exclusive',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-BR-003',
    categorySlug: 'bangles-bracelets',
  },
  {
    id: 'gold-drop-lariat-necklace',
    title: 'Gold Adjustable Drop Lariat Necklace',
    price: '£16.00',
    imageUrl: '/products/tashola-lariat-necklace.png',
    secondaryImageUrl: '/products/tashola-lariat-necklace-2.png',
    badge: 'Trending',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-NK-003',
    categorySlug: 'necklaces-pendants',
  },
];

// -----------------------------------------------------------------------------
// Sculptural & Signature Fine Jewellery (Row 2) - 4K High-End Studio Pieces
// -----------------------------------------------------------------------------
const ROW_2_PRODUCTS: TasholaProductItem[] = [
  {
    id: 'gold-flora-stud-earrings-r2',
    title: 'Gold Statement Sculptural Flora Stud Earrings',
    price: '£38.00',
    imageUrl: '/products/tashola-flora-studs.png',
    secondaryImageUrl: '/products/tashola-flora-studs-2.png',
    badge: 'Signature',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-ER-004',
    categorySlug: 'earrings-jhumkas',
  },
  {
    id: 'gold-gemstone-statement-ring-r2',
    title: 'Gold Statement Gemstone Ring',
    price: '£22.00',
    imageUrl: '/products/tashola-gemstone-ring.png',
    secondaryImageUrl: '/products/tashola-gemstone-ring-2.png',
    badge: 'Limited Edition',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-RG-006',
    categorySlug: 'statement-rings',
  },
  {
    id: 'gold-flow-open-cuff-r2',
    title: 'Gold Golden Flow Open Cuff',
    price: '£35.00',
    imageUrl: '/products/tashola-flow-cuff.png',
    secondaryImageUrl: '/products/tashola-flow-cuff-2.png',
    badge: 'Exclusive',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-BR-003',
    categorySlug: 'bangles-bracelets',
  },
  {
    id: 'gold-drop-lariat-necklace-r2',
    title: 'Gold Adjustable Drop Lariat Necklace',
    price: '£16.00',
    imageUrl: '/products/tashola-lariat-necklace.png',
    secondaryImageUrl: '/products/tashola-lariat-necklace-2.png',
    badge: 'Trending',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-NK-003',
    categorySlug: 'necklaces-pendants',
  },
  {
    id: 'royal-polki-choker-r2',
    title: 'Royal Polki & Colombian Emerald Choker',
    price: '£4,800.00',
    imageUrl: '/products/royal-polki-choker-hq.png',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-NK-001',
    categorySlug: 'necklaces-pendants',
  },
  {
    id: 'celeste-diamond-pendant-r2',
    title: 'Celeste Diamond Solitaire Pendant',
    price: '£1,850.00',
    imageUrl: '/products/celeste-pendant-hq.png',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-NK-002',
    categorySlug: 'necklaces-pendants',
  },
  {
    id: 'riviera-tennis-bracelet-r2',
    title: 'Riviera Brilliant Diamond Tennis Bracelet',
    price: '£3,400.00',
    imageUrl: '/products/tennis-bracelet-hq.png',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-BR-001',
    categorySlug: 'bangles-bracelets',
  },
  {
    id: 'noor-chandbali-earrings-r2',
    title: 'Noor Chandbali Diamond & Pearl Drops',
    price: '£2,600.00',
    imageUrl: '/products/chandbali-earrings-hq.png',
    slug: 'royal-polki-emerald-choker',
    sku: 'LUM-ER-001',
    categorySlug: 'earrings-jhumkas',
  },
];

// -----------------------------------------------------------------------------
// Molten Collection Showcase (Split Section 2x2 Grid matching Reference)
// -----------------------------------------------------------------------------
const MOLTEN_PRODUCTS: TasholaProductItem[] = [
  {
    id: 'gold-sculpted-wave-cuff',
    title: 'Gold Sculpted Wave Cuff',
    price: '£25.00',
    imageUrl: '/products/tashola-wave-cuff.png',
    secondaryImageUrl: '/products/tashola-wave-cuff-2.png',
    badge: 'Bestseller',
    slug: 'heritage-double-wave-open-gold-cuff',
    sku: 'LUM-BR-004',
    categorySlug: 'bangles-bracelets',
  },
  {
    id: 'gold-magma-heart-necklace',
    title: 'Gold Magma Heart Pendant Necklace',
    price: '£16.00',
    imageUrl: '/products/tashola-magma-heart-necklace.png',
    secondaryImageUrl: '/products/tashola-magma-heart-necklace-2.png',
    badge: 'Trending',
    slug: 'gold-drop-lariat-necklace',
    sku: 'LUM-NK-003',
    categorySlug: 'necklaces-pendants',
  },
  {
    id: 'gold-molten-crystal-earrings',
    title: 'Gold Molten Style Crystal Drop Pendant Earrings',
    price: '£22.00',
    imageUrl: '/products/tashola-molten-crystal-earrings.png',
    secondaryImageUrl: '/products/tashola-molten-crystal-earrings-2.png',
    badge: 'Artisanal',
    slug: 'gold-organic-clear-crystal-dangle-earrings',
    sku: 'LUM-ER-003',
    categorySlug: 'earrings-jhumkas',
  },
  {
    id: 'gold-molten-chunky-ring',
    title: 'Gold Molten Diamanté Chunky Ring',
    price: '£12.00',
    imageUrl: '/products/tashola-molten-chunky-ring.png',
    secondaryImageUrl: '/products/tashola-molten-chunky-ring-2.png',
    badge: 'Signature',
    slug: 'gold-gemstone-statement-ring',
    sku: 'LUM-RG-006',
    categorySlug: 'statement-rings',
  },
  {
    id: 'twin-heritage-bands',
    title: 'Twin Heritage Diamond Pavé Bands',
    price: '£28.00',
    imageUrl: '/products/twin-heritage-bands.png',
    secondaryImageUrl: '/products/twin-heritage-bands-2.png',
    badge: 'Bridal Atelier',
    slug: 'twin-heritage-diamond-pave-bands',
    sku: 'LUM-RG-007',
    categorySlug: 'statement-rings',
  },
  {
    id: 'gold-sculptural-pebble-ring-m',
    title: 'Gold Sculptural Pebble Ring',
    price: '£10.00',
    imageUrl: '/products/tashola-pebble-ring.png',
    secondaryImageUrl: '/products/tashola-pebble-ring-2.png',
    badge: 'New In',
    slug: 'gold-sculptural-pebble-ring',
    sku: 'LUM-RG-003',
    categorySlug: 'statement-rings',
  },
  {
    id: 'gold-flora-studs-m',
    title: 'Gold Statement Sculptural Flora Stud Earrings',
    price: '£38.00',
    imageUrl: '/products/tashola-flora-studs.png',
    secondaryImageUrl: '/products/tashola-flora-studs-2.png',
    badge: 'Trending',
    slug: 'gold-flora-stud-earrings',
    sku: 'LUM-ER-004',
    categorySlug: 'earrings-jhumkas',
  },
  {
    id: 'gold-serpentine-bangle-m',
    title: 'Gold Serpentine Flow Crystal Bangle',
    price: '£12.00',
    imageUrl: '/products/tashola-serpentine-bangle.png',
    secondaryImageUrl: '/products/tashola-serpentine-bangle-2.png',
    badge: 'Bestseller',
    slug: 'gold-serpentine-flow-crystal-bangle',
    sku: 'LUM-BR-002',
    categorySlug: 'bangles-bracelets',
  },
];

export default async function HomePage() {
  const { whatsappPhone, whatsappTemplate, dbProducts } = await getHomepageData();

  // Dynamically map backend CMS products to lookbook card items
  const cmsProducts: TasholaProductItem[] = (dbProducts || []).map((p: any) => ({
    id: p._id?.toString() || p.slug,
    title: p.title,
    price: p.priceGuidance || (p.quoteOnly ? 'Quote on Request' : 'Inquire'),
    imageUrl: p.images?.[0]?.url || '/products/tashola-pink-stone-hoops.png',
    secondaryImageUrl: p.images?.[1]?.url,
    slug: p.slug,
    sku: p.sku,
    categorySlug: p.categoryId?.slug,
  }));

  // Row 1: The primary signature lookbook items dynamically sourced from CMS
  const row1Slugs = [
    'gold-pink-stone-hoop-earrings',
    'gold-serpentine-flow-crystal-bangle',
    'gold-organic-clear-crystal-dangle-earrings',
    'gold-sculptural-pebble-ring',
    'gold-flora-stud-earrings',
    'gold-gemstone-statement-ring',
    'gold-flow-open-cuff',
    'gold-drop-lariat-necklace',
  ];
  const row1FromCms = row1Slugs
    .map((slug) => cmsProducts.find((p) => p.slug === slug))
    .filter(Boolean) as TasholaProductItem[];
  const row1Products = row1FromCms.length >= 4 ? row1FromCms : ROW_1_PRODUCTS;

  // Row 2: Atelier heritage & contemporary masterpieces from CMS
  const row2Slugs = [
    'royal-polki-emerald-choker',
    'celeste-diamond-solitaire-pendant',
    'riviera-classic-diamond-tennis-bracelet',
    'noor-chandbali-polki-earrings',
    'imperial-sapphire-diamond-cocktail-ring',
    'fine-gold-diamond-channel-band',
    'heritage-black-onyx-gold-signet-ring',
    'australian-opal-pave-diamond-ring',
  ];
  const row2FromCms = row2Slugs
    .map((slug) => cmsProducts.find((p) => p.slug === slug))
    .filter(Boolean) as TasholaProductItem[];
  const row2Products = row2FromCms.length >= 4 ? row2FromCms : ROW_2_PRODUCTS;

  // Molten Collection Section (Iconic 50/50 Split Showcase)
  const moltenProducts = MOLTEN_PRODUCTS;

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-white text-[#171316]">
      {/* =========================================================================
          SECTION 1: HERO CAROUSEL (EDITORIAL LUXURY SHOWCASE WITH SLIDES & AUTO-ADVANCE)
          ========================================================================= */}
      <HeroCarousel />

      {/* =========================================================================
          SECTION 2: CURATED PRODUCT ROW 1 (4 ATELIER MASTERPIECES + PAGINATION)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TasholaCarouselRow
          products={row1Products}
          whatsappPhone={whatsappPhone}
          whatsappTemplate={whatsappTemplate}
        />
      </section>

      {/* =========================================================================
          SECTION 3: 2x2 HIGH-FASHION CATEGORY GRID (BRACELETS, NECKLACES, RINGS, EARRINGS)
          ========================================================================= */}
      <section className="w-full">
        <TasholaCategoryGrid />
      </section>

      {/* =========================================================================
          SECTION 4: CURATED PRODUCT ROW 2 (4 CONTEMPORARY PIECES + PAGINATION)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TasholaCarouselRow
          products={row2Products}
          whatsappPhone={whatsappPhone}
          whatsappTemplate={whatsappTemplate}
        />
      </section>

      {/* =========================================================================
          SECTION 5: FULL-WIDTH EDITORIAL CAMPAIGN BANNER (MODEL IN PINK LACE)
          ========================================================================= */}
      <section className="w-full overflow-hidden bg-[#FAF9F6]">
        <div className="relative w-full aspect-[16/9] max-h-[600px] overflow-hidden">
          <img
            src="/editorial/campaign-pink-lace.jpg"
            alt="Lumière Atelier High-Fashion Editorial Campaign"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HAUTE JOAILLERIE SPLIT SECTION (50% MACRO + 50% 2x2 PRODUCTS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TasholaMoltenSection
          products={moltenProducts}
          whatsappPhone={whatsappPhone}
          whatsappTemplate={whatsappTemplate}
        />
      </section>
    </div>
  );
}
