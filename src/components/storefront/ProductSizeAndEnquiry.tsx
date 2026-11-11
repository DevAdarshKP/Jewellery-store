'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { generateWhatsAppEnquiryLink, formatWhatsAppPhone } from '@/lib/whatsapp/link-generator';

interface ProductSizeAndEnquiryProps {
  productTitle: string;
  productSku: string;
  categoryName?: string;
  priceGuidance?: string;
  whatsappPhone: string;
  whatsappTemplate?: string;
  productUrl: string;
}

export function ProductSizeAndEnquiry({
  productTitle,
  productSku,
  categoryName = 'Fine Jewellery',
  priceGuidance,
  whatsappPhone,
  whatsappTemplate,
  productUrl,
}: ProductSizeAndEnquiryProps) {
  const isRing = categoryName.toLowerCase().includes('ring');
  const isBangle =
    categoryName.toLowerCase().includes('bangle') ||
    categoryName.toLowerCase().includes('bracelet');

  const defaultSizes = isRing
    ? ['US 5 (15.7mm)', 'US 6 (16.5mm)', 'US 7 (17.3mm)', 'US 8 (18.1mm)', 'Bespoke Custom Fit']
    : isBangle
    ? ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)', 'Custom Atelier Sizing']
    : ['Standard Length (16")', 'Opera Length (18")', 'Princess Length (20")', 'Custom Fit'];

  const [selectedSize, setSelectedSize] = useState<string>(defaultSizes[1] || defaultSizes[0]);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);

  // Build personalized WhatsApp message with selected size
  const customMessage =
    `Hello Lumière Atelier, I would like to enquire about the ${productTitle} (SKU: ${productSku}) in size "${selectedSize}". ` +
    (priceGuidance ? `Price Guidance: ${priceGuidance}. ` : '') +
    `Please share availability and private viewing details.`;

  const waLink = `https://wa.me/${formatWhatsAppPhone(whatsappPhone)}?text=${encodeURIComponent(
    customMessage
  )}`;

  return (
    <div className="space-y-6 pt-2">
      {/* -------------------------------------------------------------
          1. INTERACTIVE SIZE SELECTOR (MATCHING REFERENCE "SELECT SIZE")
          ------------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-luxury-widest text-charcoal-500 font-semibold font-sans">
            Size / Sizing Fit
          </span>
          <span className="text-champagne-metallic text-[11px] font-medium">
            Selected: <strong className="text-charcoal-900">{selectedSize}</strong>
          </span>
        </div>

        {/* Size Pills Container */}
        <div className="flex flex-wrap gap-2 pt-1">
          {defaultSizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-sans tracking-wide transition-all duration-200 border active:scale-95 ${
                  isSelected
                    ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm font-semibold'
                    : 'bg-white text-charcoal-700 border-[#EAE4D9] hover:border-charcoal-400 hover:text-charcoal-900'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. PROPER ENQUIRY BUTTONS (WHATSAPP CONCIERGE + ATELIER VISIT)
          ------------------------------------------------------------- */}
      <div className="space-y-3 pt-2">
        {/* Primary Luxury WhatsApp Enquiry Button */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 bg-charcoal-900 hover:bg-black text-white text-xs font-semibold tracking-luxury-widest uppercase rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center space-x-2.5 group"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
          <span>Enquire via WhatsApp Concierge</span>
          <ArrowRight className="w-4 h-4 text-champagne-gold group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Secondary Atelier Consultation Action */}
        <Link
          href={`/contact?enquiry=${encodeURIComponent(productTitle)}&sku=${encodeURIComponent(
            productSku
          )}&size=${encodeURIComponent(selectedSize)}`}
          className="w-full py-3.5 px-6 bg-white hover:bg-[#FAF7F2] border border-[#EAE4D9] hover:border-charcoal-400 text-charcoal-800 text-xs font-semibold tracking-luxury-widest uppercase rounded-xl transition-all duration-200 active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          <span>Book Atelier Private Viewing</span>
          <ArrowRight className="w-3.5 h-3.5 text-champagne-metallic" />
        </Link>

        {/* Discreet Micro-Reassurance */}
        <p className="text-center text-[11px] text-charcoal-500 font-light leading-relaxed pt-1">
          Direct consultation with our master gemmologist. Bespoke alterations, certificate verification &amp; insured delivery included.
        </p>
      </div>
    </div>
  );
}

