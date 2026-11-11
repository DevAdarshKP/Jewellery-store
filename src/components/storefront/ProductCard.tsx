'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import { IProduct } from '@/types';
import { generateWhatsAppEnquiryLink } from '@/lib/whatsapp/link-generator';
import { getSafeImageUrl } from '@/lib/seo';

interface ProductCardProps {
  product: IProduct;
  whatsappPhone?: string;
  whatsappTemplate?: string;
  variant?: 'light' | 'dark';
}

export function ProductCard({
  product,
  whatsappPhone = '918129440790',
  whatsappTemplate,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const rawPrimary =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  const rawSecondary =
    product.images && product.images.length > 1
      ? product.images[1].url
      : rawPrimary;

  const primaryImage = getSafeImageUrl(rawPrimary, 'necklaces');
  const secondaryImage = getSafeImageUrl(rawSecondary, 'default');
  const currentDisplayImage = isHovered ? secondaryImage : primaryImage;

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/products/${product.slug}`
      : `http://localhost:3000/products/${product.slug}`;

  const waLink = generateWhatsAppEnquiryLink({
    phoneNumber: whatsappPhone,
    productName: product.title,
    productSku: product.sku,
    productUrl,
    template: whatsappTemplate,
  });

  return (
    <div
      className="group flex flex-col h-full transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Image Stage (Tashola Showcase Card on Soft Neutral #F4F3EF) */}
      <div className="relative w-full aspect-[230/280] overflow-hidden bg-[#F4F3EF] rounded-sm border border-stone-200/40">
        <Link
          href={`/products/${product.slug}`}
          className="w-full h-full flex items-center justify-center p-4 sm:p-5 relative"
        >
          {/* Primary Master Studio Photograph */}
          <img
            src={primaryImage}
            alt={product.title}
            className={`max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all duration-700 ease-out group-hover:scale-[1.04] ${
              secondaryImage && secondaryImage !== primaryImage ? 'group-hover:opacity-0' : ''
            }`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/hero-gold-ring-hq.png';
            }}
          />

          {/* Secondary Alternate View on Hover */}
          {secondaryImage && secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.title} Alternate View`}
              className="absolute inset-0 w-full h-full p-4 sm:p-5 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          )}
        </Link>

        {/* Featured Badge Overlay if applicable */}
        {product.isFeatured && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[#171316] text-[8.5px] font-sans font-medium uppercase tracking-wider rounded-sm shadow-sm border border-stone-200/60">
              <Sparkles className="w-2.5 h-2.5 text-[#B89A60]" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Interactive Quick-Action Enquiry Bar (Slides up smoothly on Hover, guarded) */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-[#171316]/95 hover:bg-black text-white text-[10.5px] font-sans font-medium tracking-wider uppercase rounded-sm shadow-lg backdrop-blur-sm flex items-center justify-center space-x-1.5 transition-all duration-200 active:scale-[0.98]"
            title="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Enquire · {product.priceGuidance || 'Quote'}</span>
          </a>
        </div>
      </div>

      {/* Card Typography beneath container (Left Aligned, exactly like Reference) */}
      <div className="pt-2.5 pb-1 flex flex-col space-y-0.5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3
            className="text-[13px] sm:text-[14px] font-normal text-[#262325] hover:text-[#9A7332] transition-colors leading-snug line-clamp-1"
            title={product.title}
          >
            {product.title}
          </h3>
        </Link>

        <div className="text-[13px] sm:text-[14px] font-sans text-[#6B686B] font-light leading-snug pt-0.5">
          {product.priceGuidance || 'Quote on Request'}
        </div>
      </div>
    </div>
  );
}
