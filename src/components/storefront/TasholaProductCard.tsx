'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle } from 'lucide-react';
import { generateWhatsAppEnquiryLink } from '@/lib/whatsapp/link-generator';

export interface TasholaProductItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  slug?: string;
  sku?: string;
  categorySlug?: string;
  badge?: string;
}

interface TasholaProductCardProps {
  product: TasholaProductItem;
  whatsappPhone?: string;
  whatsappTemplate?: string;
}

export function TasholaProductCard({
  product,
  whatsappPhone = '918129440790',
  whatsappTemplate,
}: TasholaProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const productHref = product.slug
    ? `/products/${product.slug}`
    : `/products?search=${encodeURIComponent(product.title)}`;

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${productHref}`
      : `http://localhost:3000${productHref}`;

  const waLink = generateWhatsAppEnquiryLink({
    phoneNumber: whatsappPhone,
    productName: product.title,
    productSku: product.sku || product.id,
    productUrl,
    template: whatsappTemplate,
  });

  return (
    <div className="group flex flex-col relative h-full">
      {/* Aspect Ratio 230:316 (~3:4) Luxury Showcase Card with Floating Transparency */}
      <div className="relative w-full aspect-[230/316] overflow-hidden bg-[#F4F3EF] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-stone-200/50">
        <Link href={productHref} className="w-full h-full flex items-center justify-center p-4 sm:p-5 relative">
          {/* Primary Master Studio Photograph (Transparent Floating with Drop Shadow) */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className={`max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all duration-700 ease-out group-hover:scale-[1.04] ${
              product.secondaryImageUrl ? 'group-hover:opacity-0' : ''
            }`}
            loading="lazy"
            onError={(e) => {
              if (!imageError) {
                setImageError(true);
                const target = e.target as HTMLImageElement;
                target.src = '/hero-gold-ring-hq.png';
              }
            }}
          />

          {/* Secondary Editorial/Detail View on Hover */}
          {product.secondaryImageUrl && (
            <img
              src={product.secondaryImageUrl}
              alt={`${product.title} Alternate View`}
              className="absolute inset-0 w-full h-full p-4 sm:p-5 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          )}
        </Link>

        {/* Floating Badge (Top-Left) — Sized safely to never collide on narrow mobile widths */}
        {product.badge && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none max-w-[48%]">
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#4A4547] text-[8.5px] sm:text-[9.5px] font-sans font-medium uppercase tracking-wider shadow-sm border border-stone-200/60 truncate block">
              {product.badge}
            </span>
          </div>
        )}

        {/* Prominent Floating Luxury Price Pill (Top-Right) */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 shrink-0">
          <Link
            href={productHref}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md text-[#171316] text-[11px] sm:text-[12.5px] font-sans font-bold shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#EBE3D5] group-hover:bg-[#171316] group-hover:text-white group-hover:border-[#171316] transition-all duration-300"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#B89A60] group-hover:text-[#E6C682] transition-colors" />
            <span>{product.price}</span>
          </Link>
        </div>

        {/* Interactive Quick-Action Enquiry Bar (Slides up smoothly on Hover, clicks guarded) */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-[#171316]/95 hover:bg-black text-white text-[10.5px] font-sans font-medium tracking-wider uppercase rounded-sm shadow-lg backdrop-blur-sm flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-[0.98]"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Enquire · {product.price}</span>
          </a>
        </div>
      </div>

      {/* Product Title and Price Section: High-End Luxury Typography */}
      <div className="pt-2.5 pb-1 flex flex-col space-y-1">
        <Link
          href={productHref}
          className="text-[13px] sm:text-[14px] font-serif font-normal text-[#262325] hover:text-[#9A7332] transition-colors leading-snug line-clamp-1"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Highlighted Price Bar with Atelier Accent */}
        <div className="flex items-center justify-between pt-0.5 min-w-0">
          <div className="flex items-baseline space-x-1.5 shrink-0">
            <span className="text-[14px] sm:text-[15.5px] font-sans font-bold tracking-tight text-[#171316] group-hover:text-[#9A7332] transition-colors">
              {product.price}
            </span>
          </div>

          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-sans font-medium tracking-wider uppercase bg-[#F8F5EE] text-[#8C6D37] border border-[#E9DEC7] truncate max-w-[45%] ml-1.5">
            {product.badge || '18K Gold'}
          </span>
        </div>
      </div>
    </div>
  );
}
