import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminSession();
    const body = await request.json();
    await connectToDatabase();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (body.status !== undefined) {
      if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      product.status = body.status;
      if (body.status === 'PUBLISHED' && !product.publishedAt) {
        product.publishedAt = new Date();
      }
    }

    if (body.isFeatured !== undefined) {
      product.isFeatured = Boolean(body.isFeatured);
    }

    await product.save();

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({
      success: true,
      status: product.status,
      isFeatured: product.isFeatured,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update product status' }, { status: 500 });
  }
}

