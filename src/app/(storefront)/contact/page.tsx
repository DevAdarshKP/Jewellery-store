import { connectToDatabase } from '@/lib/db/connection';
import { Setting } from '@/lib/db/models/Setting';
import { MessageCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { formatWhatsAppPhone } from '@/lib/whatsapp/link-generator';
import { buildStorefrontMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildStorefrontMetadata({
  title: 'Atelier Showroom & Private Consultations | Lumière Atelier',
  description:
    'Schedule a private jewellery viewing or connect directly with our concierge via WhatsApp.',
  path: '/contact',
});

async function getContactSettings() {
  await connectToDatabase();
  const settings = await Setting.find().lean();
  const settingsMap: Record<string, any> = {};
  for (const s of settings) {
    if (s.key && s.value) settingsMap[s.key] = s.value;
  }

  return {
    brandName: settingsMap.general?.brandName || 'Lumière Atelier',
    showroomAddress:
      settingsMap.general?.showroomAddress || '14 Heritage Boulevard, Luxury Quarter',
    businessHours:
      settingsMap.general?.businessHours || 'Monday – Saturday: 10:30 AM – 8:00 PM',
    contactEmail:
      settingsMap.general?.contactEmail || 'concierge@lumiereatelier.local',
    contactPhone: settingsMap.general?.contactPhone || '+91 81294 40790',
    whatsappPhone:
      settingsMap.whatsapp?.phoneNumber || process.env.DEFAULT_WHATSAPP_PHONE || '918129440790',
  };
}

export default async function ContactPage() {
  const {
    brandName,
    showroomAddress,
    businessHours,
    contactEmail,
    contactPhone,
    whatsappPhone,
  } = await getContactSettings();

  const directConciergeLink = `https://wa.me/${formatWhatsAppPhone(whatsappPhone)}?text=${encodeURIComponent(
    'Hello, I would like to schedule a private viewing appointment at the showroom.'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 text-charcoal-900 bg-[#FFFBF5]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-[11px] uppercase tracking-luxury-widest font-semibold text-champagne-metallic font-sans block">
          Showroom &amp; Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-charcoal-900 tracking-tight">
          Private Consultations
        </h1>
        <div className="w-16 h-0.5 bg-champagne-metallic mx-auto" />
        <p className="text-sm text-charcoal-600 font-light leading-relaxed pt-1">
          Whether you are seeking a customized bridal heritage suite or a distinctive gift, our senior jewellery specialists are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct WhatsApp Concierge Card in Clean White & Gold (6 cols) */}
        <div className="lg:col-span-6 bg-white text-charcoal-900 rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#EAE4D9] shadow-md space-y-8">
          <div className="space-y-3">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#EAE4D9] text-champagne-metallic text-xs font-semibold uppercase tracking-luxury-widest">
              <MessageCircle className="w-3.5 h-3.5 text-champagne-metallic" />
              <span>Fastest Response</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900">
              Direct WhatsApp Concierge
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
              Connect directly with our master goldsmiths and certified gemologists for instant quotations, high-resolution video previews of any ornament, and showroom appointment scheduling.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={directConciergeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-4 bg-charcoal-900 hover:bg-black text-white rounded-2xl text-xs uppercase tracking-luxury-widest font-bold shadow-md transition transform hover:scale-[1.01]"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Chat on WhatsApp ({contactPhone})</span>
            </a>
          </div>

          <div className="pt-4 border-t border-[#EAE4D9] text-[11px] text-charcoal-500 space-y-1 font-light">
            <div>• Available Monday to Saturday during showroom hours.</div>
            <div>• Receive 360-degree high-definition video previews of any ornament.</div>
            <div>• Bespoke quotations provided directly with hallmarking credentials.</div>
          </div>
        </div>

        {/* Right Column: Showroom Visit Details (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#EAE4D9] shadow-md space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900">
            Salon Location &amp; Hours
          </h2>

          <div className="space-y-6 text-sm">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] text-champagne-metallic flex items-center justify-center shrink-0 border border-[#EAE4D9]">
                <MapPin className="w-5 h-5 text-champagne-metallic" />
              </div>
              <div>
                <span className="font-semibold text-charcoal-900 block font-serif text-base">Atelier Address</span>
                <span className="text-xs text-charcoal-600 mt-0.5 block leading-relaxed">{showroomAddress}</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] text-champagne-metallic flex items-center justify-center shrink-0 border border-[#EAE4D9]">
                <Clock className="w-5 h-5 text-champagne-metallic" />
              </div>
              <div>
                <span className="font-semibold text-charcoal-900 block font-serif text-base">Visiting Hours</span>
                <span className="text-xs text-charcoal-600 mt-0.5 block leading-relaxed">{businessHours}</span>
                <span className="text-[11px] text-champagne-metallic mt-1 block">Private viewings on Sunday by prior appointment.</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] text-champagne-metallic flex items-center justify-center shrink-0 border border-[#EAE4D9]">
                <Phone className="w-5 h-5 text-champagne-metallic" />
              </div>
              <div>
                <span className="font-semibold text-charcoal-900 block font-serif text-base">Telephone Inquiries</span>
                <span className="text-xs text-charcoal-600 mt-0.5 block font-mono font-medium">{contactPhone}</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] text-champagne-metallic flex items-center justify-center shrink-0 border border-[#EAE4D9]">
                <Mail className="w-5 h-5 text-champagne-metallic" />
              </div>
              <div>
                <span className="font-semibold text-charcoal-900 block font-serif text-base">Concierge Correspondence</span>
                <span className="text-xs text-charcoal-600 mt-0.5 block">{contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
