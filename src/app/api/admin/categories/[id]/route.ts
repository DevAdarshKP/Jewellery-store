import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/lib/db/models/Category';
import { Product } from '@/lib/db/models/Product';
import { CategorySchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const category = await Category.findById(params.id).lean();
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      displayOrder: category.displayOrder ?? 0,
      isActive: category.isActive ?? true,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Check slug conflict with another category
    const slugConflict = await Category.findOne({
      slug: parseResult.data.slug,
      _id: { $ne: params.id },
    });
    if (slugConflict) {
      return NextResponse.json({ error: 'A category with this URL slug already exists' }, { status: 409 });
    }

    const updated = await Category.findByIdAndUpdate(params.id, parseResult.data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Revalidate public storefront caches
    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json({
      id: updated._id.toString(),
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      imageUrl: updated.imageUrl,
      displayOrder: updated.displayOrder,
      isActive: updated.isActive,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdminSession();
    await connectToDatabase();

    // Check if products exist in this category
    const productCount = await Product.countDocuments({ categoryId: params.id });
    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category because it contains ${productCount} product(s). Please reassign or delete the products first.`,
        },
        { status: 400 }
      );
    }

    const deleted = await Category.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/products');

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

