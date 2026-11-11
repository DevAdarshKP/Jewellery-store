import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';
import { ProductSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const product = await Product.findById(params.id).populate('categoryId', 'name slug').lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: product._id.toString(),
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      categoryId: (product.categoryId as any)?._id?.toString() || product.categoryId?.toString(),
      categoryName: (product.categoryId as any)?.name || '',
      summary: product.summary,
      description: product.description,
      metal: product.metal || '',
      purity: product.purity || '',
      stones: product.stones || '',
      priceGuidance: product.priceGuidance || '',
      quoteOnly: product.quoteOnly ?? true,
      status: product.status,
      isFeatured: product.isFeatured ?? false,
      images: product.images || [],
      attributes: product.attributes || [],
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Check slug and sku conflict
    const [slugConflict, skuConflict] = await Promise.all([
      Product.findOne({ slug: parseResult.data.slug, _id: { $ne: params.id } }),
      Product.findOne({ sku: parseResult.data.sku, _id: { $ne: params.id } }),
    ]);

    if (slugConflict) {
      return NextResponse.json({ error: 'A product with this URL slug already exists' }, { status: 409 });
    }
    if (skuConflict) {
      return NextResponse.json({ error: 'A product with this SKU code already exists' }, { status: 409 });
    }

    const current = await Product.findById(params.id);
    if (!current) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const payload: any = { ...parseResult.data };
    if (parseResult.data.status === 'PUBLISHED' && !current.publishedAt) {
      payload.publishedAt = new Date();
    }

    const updated = await Product.findByIdAndUpdate(params.id, payload, {
      new: true,
      runValidators: true,
    });

    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/products');
    if (current.slug) revalidatePath(`/products/${current.slug}`);
    if (updated?.slug) revalidatePath(`/products/${updated.slug}`);

    return NextResponse.json({ id: updated?._id.toString() });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Update product error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const slug = product.slug;
    await Product.findByIdAndDelete(params.id);

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${slug}`);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

