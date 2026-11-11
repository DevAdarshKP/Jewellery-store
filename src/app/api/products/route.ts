import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(48, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    const query: any = { status: 'PUBLISHED' };

    if (categorySlug && categorySlug !== 'all') {
      const cat = await Category.findOne({ slug: categorySlug, isActive: true });
      if (cat) {
        query.categoryId = cat._id;
      } else {
        return NextResponse.json({
          items: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
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
      ];
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'title_asc') {
      sortOptions = { title: 1 };
    } else if (sort === 'title_desc') {
      sortOptions = { title: -1 };
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('categoryId', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const items = products.map((prod: any) => ({
      id: prod._id.toString(),
      title: prod.title,
      slug: prod.slug,
      sku: prod.sku,
      categoryId: prod.categoryId?._id ? prod.categoryId._id.toString() : '',
      categoryName: prod.categoryId?.name || 'Jewellery',
      categorySlug: prod.categoryId?.slug || '',
      summary: prod.summary,
      description: prod.description,
      metal: prod.metal || '',
      purity: prod.purity || '',
      stones: prod.stones || '',
      priceGuidance: prod.priceGuidance || '',
      quoteOnly: prod.quoteOnly ?? true,
      status: prod.status,
      isFeatured: prod.isFeatured ?? false,
      images: prod.images || [],
      attributes: prod.attributes || [],
      publishedAt: prod.publishedAt?.toISOString(),
      createdAt: prod.createdAt.toISOString(),
    }));

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Fetch public products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
