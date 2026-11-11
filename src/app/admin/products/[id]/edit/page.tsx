import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db/connection';
import { Product } from '@/lib/db/models/Product';
import { ProductForm } from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await connectToDatabase();
  const product = await Product.findById(params.id).lean();

  if (!product) {
    notFound();
  }

  const initialData = {
    id: (product as any)._id.toString(),
    title: product.title,
    slug: product.slug,
    sku: product.sku,
    categoryId: product.categoryId.toString(),
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
  };

  return <ProductForm initialData={initialData} isEdit={true} />;
}

