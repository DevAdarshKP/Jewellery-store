import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/lib/db/models/Category';
import { Product } from '@/lib/db/models/Product';

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: any) => {
        const count = await Product.countDocuments({
          categoryId: cat._id,
          status: 'PUBLISHED',
        });
        return {
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          imageUrl: cat.imageUrl || '',
          displayOrder: cat.displayOrder ?? 0,
          productCount: count,
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error: any) {
    console.error('Fetch public categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

