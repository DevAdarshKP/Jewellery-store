import { connectToDatabase } from '@/lib/db/connection';
import { Category } from '@/lib/db/models/Category';
import { Setting } from '@/lib/db/models/Setting';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export const dynamic = 'force-dynamic';

async function getStorefrontData() {
  await connectToDatabase();

  const [categories, settings] = await Promise.all([
    Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
    Setting.find().lean(),
  ]);

  const settingsMap: Record<string, any> = {};
  for (const s of settings) {
    if (s.key && s.value) {
      settingsMap[s.key] = s.value;
    }
  }

  const serializedCategories = categories.map((c: any) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    imageUrl: c.imageUrl || '',
    displayOrder: c.displayOrder ?? 0,
    isActive: c.isActive ?? true,
    createdAt: c.createdAt?.toISOString?.() || '',
    updatedAt: c.updatedAt?.toISOString?.() || '',
  }));

  return {
    categories: serializedCategories,
    settings: {
      announcement:
        settingsMap.homepage?.announcementText ||
        'Complimentary Worldwide Shipping on Fine Jewellery Orders',
      brandName: settingsMap.general?.brandName || 'Lumière Atelier',
      tagline: settingsMap.general?.tagline || 'Sculptural Fine Jewellery & Haute Joaillerie',
      contactEmail: settingsMap.general?.contactEmail || 'concierge@lumiereatelier.local',
      contactPhone: settingsMap.general?.contactPhone || '+91 81294 40790',
      showroomAddress: settingsMap.general?.showroomAddress || '14 Heritage Boulevard, Luxury Quarter',
      businessHours: settingsMap.general?.businessHours || 'Monday – Saturday: 10:30 AM – 8:00 PM',
      whatsappPhone:
        settingsMap.whatsapp?.phoneNumber || process.env.DEFAULT_WHATSAPP_PHONE || '918129440790',
    },
  };
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, settings } = await getStorefrontData();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171316] overflow-x-clip selection:bg-[#171316] selection:text-white">
      <Header
        categories={categories}
        brandName={settings.brandName}
        whatsappPhone={settings.whatsappPhone}
      />
      <main className="flex-1">{children}</main>
      <Footer
        categories={categories}
        brandName={settings.brandName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        showroomAddress={settings.showroomAddress}
        businessHours={settings.businessHours}
        whatsappPhone={settings.whatsappPhone}
      />
    </div>
  );
}
