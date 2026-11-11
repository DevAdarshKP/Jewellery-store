import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth/session';
import { connectToDatabase } from '@/lib/db/connection';
import { Setting } from '@/lib/db/models/Setting';

const DEFAULT_SETTINGS: Record<string, any> = {
  whatsapp: {
    phoneNumber: process.env.DEFAULT_WHATSAPP_PHONE || '918129440790',
    messageTemplate:
      'Hello Lumière Atelier, I would like to enquire about "{productName}" (Code: {productSku}). Link: {productUrl}',
    enabled: true,
  },
  homepage: {
    heroBadge: 'Haute Joaillerie & Ornaments',
    heroTitle: 'Timeless Elegance, Crafted for Generations',
    heroSubtitle:
      "Discover exquisite bespoke jewellery designed to celebrate life's most precious milestones with unmatched artisanal distinction.",
    heroCtaText: 'Explore Collections',
    announcementText: 'Complimentary Private Appointments & Worldwide Bespoke Consultations Available',
    aboutStoryHeading: 'The Heritage of Lumière Atelier',
    aboutStoryText:
      'Rooted in centuries-old artisanal traditions, Lumière Atelier crafts timeless high-jewellery masterpieces. Every gemstone is hand-selected for extraordinary fire, every gold setting forged with peerless precision, creating heirloom ornaments that honor grace, dignity, and personal legacy.',
    aboutStoryImage: '',
  },
  general: {
    brandName: 'Lumière Atelier',
    tagline: 'Fine Jewellery & Ornaments',
    contactEmail: 'concierge@lumiereatelier.local',
    contactPhone: '+91 81294 40790',
    showroomAddress: '14 Heritage Boulevard, Luxury Quarter',
    businessHours: 'Monday – Saturday: 10:30 AM – 8:00 PM',
  },
};

export async function GET() {
  try {
    await requireAdminSession();
    await connectToDatabase();

    const storedSettings = await Setting.find().lean();
    const result: Record<string, any> = { ...DEFAULT_SETTINGS };

    for (const item of storedSettings) {
      if (item.key && item.value) {
        result[item.key] = {
          ...DEFAULT_SETTINGS[item.key],
          ...item.value,
        };
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

