import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/lib/db/models/Category';
import { Product } from '@/lib/db/models/Product';
import { CategorySchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 }).lean();

    // Attach product counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: any) => {
        const count = await Product.countDocuments({ categoryId: cat._id });
        return {
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          imageUrl: cat.imageUrl || '',
          displayOrder: cat.displayOrder ?? 0,
          isActive: cat.isActive ?? true,
          productCount: count,
          createdAt: cat.createdAt.toISOString(),
          updatedAt: cat.updatedAt.toISOString(),
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const parseResult = CategorySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check unique slug
    const existing = await Category.findOne({ slug: parseResult.data.slug });
    if (existing) {
      return NextResponse.json({ error: 'A category with this URL slug already exists' }, { status: 409 });
    }

    const created = await Category.create(parseResult.data);

    // Revalidate public storefront caches
    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json(
      {
        id: created._id.toString(),
        name: created.name,
        slug: created.slug,
        description: created.description,
        imageUrl: created.imageUrl,
        displayOrder: created.displayOrder,
        isActive: created.isActive,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create category error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}

