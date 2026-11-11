import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';

export async function GET() {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const [totalProducts, publishedProducts, draftProducts, totalCategories, featuredProducts, recentProducts] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ status: 'PUBLISHED' }),
        Product.countDocuments({ status: 'DRAFT' }),
        Category.countDocuments(),
        Product.countDocuments({ isFeatured: true, status: 'PUBLISHED' }),
        Product.find()
          .populate('categoryId', 'name')
          .sort({ createdAt: -1 })
          .limit(6)
          .lean(),
      ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        totalCategories,
        featuredProducts,
      },
      recentProducts: recentProducts.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        sku: p.sku,
        categoryName: p.categoryId?.name || 'Unassigned',
        status: p.status,
        isFeatured: p.isFeatured ?? false,
        image: p.images?.[0]?.url || '',
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}

