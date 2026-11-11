import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Setting } from '@/lib/db/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();
    const stored = await Setting.find().lean();

    const settingsMap: Record<string, any> = {};
    for (const item of stored) {
      if (item.key && item.value) {
        settingsMap[item.key] = item.value;
      }
    }

    const publicData = {
      whatsapp: {
        phoneNumber: settingsMap.whatsapp?.phoneNumber || process.env.DEFAULT_WHATSAPP_PHONE || '918129440790',
        messageTemplate:
          settingsMap.whatsapp?.messageTemplate ||
          'Hello Lumière Atelier, I would like to enquire about "{productName}" (Code: {productSku}). Link: {productUrl}',
        enabled: settingsMap.whatsapp?.enabled ?? true,
      },
      homepage: {
        heroBadge: settingsMap.homepage?.heroBadge || 'Haute Joaillerie & Ornaments',
        heroTitle: settingsMap.homepage?.heroTitle || 'Timeless Elegance, Crafted for Generations',
        heroSubtitle:
          settingsMap.homepage?.heroSubtitle ||
          "Discover exquisite bespoke jewellery designed to celebrate life's most precious milestones.",
        heroCtaText: settingsMap.homepage?.heroCtaText || 'Explore Collections',
        announcementText:
          settingsMap.homepage?.announcementText ||
          'Complimentary Private Appointments & Worldwide Bespoke Consultations Available',
        aboutStoryHeading: settingsMap.homepage?.aboutStoryHeading || 'The Heritage of Lumière Atelier',
        aboutStoryText:
          settingsMap.homepage?.aboutStoryText ||
          'Rooted in centuries-old artisanal traditions, Lumière Atelier crafts timeless high-jewellery masterpieces.',
        aboutStoryImage: settingsMap.homepage?.aboutStoryImage || '',
      },
      general: {
        brandName: settingsMap.general?.brandName || 'Lumière Atelier',
        tagline: settingsMap.general?.tagline || 'Fine Jewellery & Ornaments',
        contactEmail: settingsMap.general?.contactEmail || 'concierge@lumiereatelier.local',
        contactPhone: settingsMap.general?.contactPhone || '+91 98765 43210',
        showroomAddress: settingsMap.general?.showroomAddress || '14 Heritage Boulevard, Luxury Quarter',
        businessHours: settingsMap.general?.businessHours || 'Monday – Saturday: 10:30 AM – 8:00 PM',
      },
    };

    return NextResponse.json(publicData);
  } catch (error: any) {
    console.error('Fetch public settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

