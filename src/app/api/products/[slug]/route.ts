import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';

interface RouteParams {
  params: { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const product = await Product.findOne({
      slug: params.slug,
      status: 'PUBLISHED',
    })
      .populate('categoryId', 'name slug')
      .lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Increment views count non-blockingly
    Product.findByIdAndUpdate(product._id, { $inc: { viewsCount: 1 } }).exec();

    // Fetch related products from same category
    const relatedProducts = await Product.find({
      categoryId: (product.categoryId as any)._id,
      status: 'PUBLISHED',
      _id: { $ne: product._id },
    })
      .populate('categoryId', 'name slug')
      .limit(4)
      .lean();

    const formatItem = (item: any) => ({
      id: item._id.toString(),
      title: item.title,
      slug: item.slug,
      sku: item.sku,
      categoryId: item.categoryId?._id ? item.categoryId._id.toString() : '',
      categoryName: item.categoryId?.name || '',
      categorySlug: item.categoryId?.slug || '',
      summary: item.summary,
      description: item.description,
      metal: item.metal || '',
      purity: item.purity || '',
      stones: item.stones || '',
      priceGuidance: item.priceGuidance || '',
      quoteOnly: item.quoteOnly ?? true,
      status: item.status,
      isFeatured: item.isFeatured ?? false,
      images: item.images || [],
      attributes: item.attributes || [],
      publishedAt: item.publishedAt?.toISOString(),
      createdAt: item.createdAt.toISOString(),
    });

    return NextResponse.json({
      product: formatItem(product),
      related: relatedProducts.map(formatItem),
    });
  } catch (error: any) {
    console.error('Fetch product by slug error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

