import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';
import { ProductSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50', 10)));
    const skip = (page - 1) * limit;

    const query: any = {};
    if (categoryId && categoryId !== 'all') {
      query.categoryId = categoryId;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { sku: regex }, { summary: regex }];
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const items = products.map((prod: any) => ({
      id: prod._id.toString(),
      title: prod.title,
      slug: prod.slug,
      sku: prod.sku,
      categoryId: prod.categoryId?._id ? prod.categoryId._id.toString() : prod.categoryId?.toString(),
      categoryName: prod.categoryId?.name || 'Uncategorized',
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
      viewsCount: prod.viewsCount || 0,
      publishedAt: prod.publishedAt?.toISOString(),
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString(),
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
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Fetch admin products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parseResult = ProductSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify category exists
    const categoryExists = await Category.findById(parseResult.data.categoryId);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Selected category does not exist' }, { status: 400 });
    }

    // Check unique slug and sku
    const [slugConflict, skuConflict] = await Promise.all([
      Product.findOne({ slug: parseResult.data.slug }),
      Product.findOne({ sku: parseResult.data.sku }),
    ]);

    if (slugConflict) {
      return NextResponse.json({ error: 'A product with this URL slug already exists' }, { status: 409 });
    }
    if (skuConflict) {
      return NextResponse.json({ error: 'A product with this SKU code already exists' }, { status: 409 });
    }

    const payload = {
      ...parseResult.data,
      publishedAt: parseResult.data.status === 'PUBLISHED' ? new Date() : undefined,
    };

    const created = await Product.create(payload);

    // Revalidate public storefront caches
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${created.slug}`);

    return NextResponse.json({ id: created._id.toString() }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
