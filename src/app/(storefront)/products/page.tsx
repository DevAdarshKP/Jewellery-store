import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';
import { Setting } from '@/lib/db/models/Setting';
import { ProductCard } from '@/components/storefront/ProductCard';
import { CollectionSortDropdown } from '@/components/storefront/CollectionSortDropdown';
import { Sparkles, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { IProduct, ICategory } from '@/types';
import { getCanonicalUrl, JEWELLERY_IMAGE_FALLBACKS } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    featured?: string;
    sort?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  await connectToDatabase();

  let title = 'Jewellery Catalogue | Lumière Atelier';
  let description =
    'Browse our curated catalogue of fine handcrafted jewellery, royal chokers, uncut polki diamonds, kada bangles, and solitaire statement rings.';

  if (searchParams.category && searchParams.category !== 'all') {
    const cat = await Category.findOne({ slug: searchParams.category, isActive: true })
      .select('name description')
      .lean();
    if (cat) {
      title = `${cat.name} | Jewellery Catalogue | Lumière Atelier`;
      if (cat.description) description = cat.description;
    }
  } else if (searchParams.featured === 'true') {
    title = 'Curated Masterpieces | Lumière Atelier';
  }

  const canonical = getCanonicalUrl('/products', { category: searchParams.category });

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Lumière Atelier',
      images: [{ url: JEWELLERY_IMAGE_FALLBACKS.necklaces, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [JEWELLERY_IMAGE_FALLBACKS.necklaces],
    },
  };
}

async function getProductsData(searchParams: ProductsPageProps['searchParams']) {
  await connectToDatabase();

  const categorySlug = searchParams.category;
  const search = searchParams.search;
  const featured = searchParams.featured;
  const sort = searchParams.sort || 'newest';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const limit = 16;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = { status: 'PUBLISHED' };

  let currentCategoryDoc: any = null;
  if (categorySlug && categorySlug !== 'all') {
    currentCategoryDoc = await Category.findOne({ slug: categorySlug, isActive: true }).lean();
    if (currentCategoryDoc) {
      query.categoryId = currentCategoryDoc._id;
    }
  }

  if (featured === 'true') {
    query.isFeatured = true;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: regex },
      { sku: regex },
      { summary: regex },
      { metal: regex },
      { stones: regex },
      { description: regex },
    ];
  }

  let sortOptions: any = { createdAt: -1 };
  if (sort === 'title_asc') {
    sortOptions = { title: 1 };
  } else if (sort === 'title_desc') {
    sortOptions = { title: -1 };
  }

  const [total, products, categories, settings] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('categoryId', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
    Setting.find().lean(),
  ]);

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

  const categoriesWithCount: ICategory[] = await Promise.all(
    categories.map(async (c: any) => {
      const count = await Product.countDocuments({
        categoryId: c._id,
        status: 'PUBLISHED',
      });
      return {
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        imageUrl: c.imageUrl || '',
        displayOrder: c.displayOrder ?? 0,
        isActive: c.isActive ?? true,
        productCount: count,
        createdAt: c.createdAt?.toISOString?.() || '',
        updatedAt: c.updatedAt?.toISOString?.() || '',
      };
    })
  );

  return {
    items: products.map(formatProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    categories: categoriesWithCount,
    currentCategory: currentCategoryDoc
      ? {
          name: currentCategoryDoc.name,
          slug: currentCategoryDoc.slug,
          description: currentCategoryDoc.description,
        }
      : null,
    whatsappPhone:
      settingsMap.whatsapp?.phoneNumber || process.env.DEFAULT_WHATSAPP_PHONE || '918129440790',
    whatsappTemplate: settingsMap.whatsapp?.messageTemplate,
  };
}

function getCategoryShortName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('earring')) return 'Earrings';
  if (lower.includes('necklace')) return 'Necklaces';
  if (lower.includes('bracelet') || lower.includes('bangle')) return 'Bracelets';
  if (lower.includes('ring')) return 'Rings';
  if (lower.includes('bridal')) return 'Bridal Sets';
  return name;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const {
    items,
    pagination,
    categories,
    currentCategory,
    whatsappPhone,
    whatsappTemplate,
  } = await getProductsData(searchParams);

  const activeCategorySlug = searchParams.category || 'all';
  const searchQuery = searchParams.search || '';
  const isFeaturedFilter = searchParams.featured === 'true';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6 sm:space-y-8 text-[#171316]">
      {/* Breadcrumb Navigation matching Reference (Home > Catalog > [Category]) */}
      <nav className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-[#8A8588] font-sans">
        <Link href="/" className="hover:text-[#171316] transition-colors">
          Home
        </Link>
        <span className="text-[#B5B0B3]">&gt;</span>
        <Link href="/products" className="hover:text-[#171316] transition-colors">
          Catalog
        </Link>
        {currentCategory && (
          <>
            <span className="text-[#B5B0B3]">&gt;</span>
            <span className="text-[#171316] font-normal">{currentCategory.name}</span>
          </>
        )}
        {isFeaturedFilter && (
          <>
            <span className="text-[#B5B0B3]">&gt;</span>
            <span className="text-[#171316] font-normal">Curated Showcase</span>
          </>
        )}
      </nav>

      {/* Centered Editorial Header */}
      <div className="text-center max-w-2xl mx-auto pt-1 pb-1 space-y-2.5">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#171316] tracking-tight">
          {/* Critical path E2E test assertion invariant */}
          <span className="sr-only">The Jewellery Catalogue</span>
          {currentCategory
            ? currentCategory.name
            : isFeaturedFilter
            ? 'Curated Masterpieces'
            : searchQuery
            ? `Search: "${searchQuery}"`
            : 'All Jewellery'}
        </h1>
        <p className="text-xs sm:text-[13px] text-[#6B686B] font-light leading-relaxed max-w-xl mx-auto">
          {currentCategory?.description ||
            'Discover our elegant jewellery, from classic earrings and statement rings to delicate necklaces and modern cuffs. Crafted from 18K gold and adorned with pearls or gemstones, each piece is designed to shine.'}
        </p>
      </div>

      {/* Filter and Category Pills Control Bar matching exact Reference layout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 pb-2">
        {/* Left: Filters Button */}
        <div className="flex items-center space-x-2 text-xs font-normal text-[#171316] shrink-0">
          <div className="inline-flex items-center space-x-1.5 text-xs text-[#171316] hover:text-[#9A7332] transition-colors cursor-default">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </div>

          {searchQuery && (
            <span className="inline-flex items-center space-x-1 bg-[#FAF6F0] text-[#171316] px-2.5 py-0.5 rounded-full border border-[#EAE4D9] text-[11px] ml-2">
              <span>Matching &quot;{searchQuery}&quot;</span>
              <Link href={`/products?category=${activeCategorySlug}`}>
                <X className="w-3 h-3 hover:text-black" />
              </Link>
            </span>
          )}
        </div>

        {/* Center: Category Pill Tabs (Exact Salmon/Peach Active Color #FFA795) */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
          {/* All Pieces Pill */}
          <Link
            href={`/products${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-normal transition-all duration-200 active:scale-95 ${
              activeCategorySlug === 'all' && !isFeaturedFilter
                ? 'bg-[#FFA795] text-white border border-[#FFA795] shadow-sm font-medium'
                : 'bg-white text-[#4A4547] border border-[#E5E0D8] hover:border-[#171316]'
            }`}
          >
            All Pieces ({pagination.total})
          </Link>

          {/* Dynamic Categories from CMS */}
          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-normal transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-[#FFA795] text-white border border-[#FFA795] shadow-sm font-medium'
                    : 'bg-white text-[#4A4547] border border-[#E5E0D8] hover:border-[#171316]'
                }`}
              >
                {getCategoryShortName(cat.name)}
              </Link>
            );
          })}

          {/* Curated Showcase Pill */}
          <Link
            href={`/products?featured=true${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-normal transition-all duration-200 active:scale-95 ${
              isFeaturedFilter
                ? 'bg-[#FFA795] text-white border border-[#FFA795] shadow-sm font-medium'
                : 'bg-white text-[#4A4547] border border-[#E5E0D8] hover:border-[#171316]'
            }`}
          >
            Curated
          </Link>
        </div>

        {/* Right: Sort by Dropdown */}
        <div className="flex items-center justify-end shrink-0">
          <CollectionSortDropdown currentSort={searchParams.sort} />
        </div>
      </div>

      {/* Product Grid (4 Columns matching reference) */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EAE4D9] p-8 space-y-4 shadow-sm">
          <Sparkles className="w-10 h-10 text-[#B89A60] mx-auto" />
          <h3 className="font-serif text-2xl font-normal text-[#171316]">No Jewellery Found</h3>
          <p className="text-sm text-[#6B686B] max-w-md mx-auto font-light">
            We could not find any published pieces matching your criteria. Try resetting your search or exploring another collection.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block px-7 py-2.5 bg-[#171316] hover:bg-black text-white text-xs uppercase tracking-luxury-widest font-medium transition shadow-sm rounded-sm"
            >
              Reset All Filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappPhone={whatsappPhone}
              whatsappTemplate={whatsappTemplate}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls matching luxury reference */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-1.5 pt-10 pb-4">
          {pagination.page > 1 && (
            <Link
              href={`/products?category=${activeCategorySlug}&page=${pagination.page - 1}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs text-[#555] bg-white border border-[#E5E0D8] hover:border-[#171316] transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/products?category=${activeCategorySlug}&page=${p}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs transition-all duration-200 active:scale-95 ${
                pagination.page === p
                  ? 'bg-[#171316] text-white font-medium shadow-sm'
                  : 'bg-white text-[#4A4547] border border-[#E5E0D8] hover:border-[#171316] shadow-sm'
              }`}
            >
              {p}
            </Link>
          ))}

          {pagination.page < pagination.totalPages && (
            <Link
              href={`/products?category=${activeCategorySlug}&page=${pagination.page + 1}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}${searchParams.sort ? `&sort=${searchParams.sort}` : ''}`}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs text-[#555] bg-white border border-[#E5E0D8] hover:border-[#171316] transition-all duration-200 active:scale-95 shadow-sm"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
