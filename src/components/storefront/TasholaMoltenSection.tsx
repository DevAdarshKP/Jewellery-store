'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { TasholaProductItem } from './TasholaProductCard';
import { generateWhatsAppEnquiryLink } from '@/lib/whatsapp/link-generator';

interface TasholaMoltenSectionProps {
  products: TasholaProductItem[];
  whatsappPhone?: string;
  whatsappTemplate?: string;
}

export function TasholaMoltenSection({
  products,
  whatsappPhone = '918129440790',
  whatsappTemplate,
}: TasholaMoltenSectionProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  const displayedProducts = products.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <section className="w-full bg-white">
      {/* 
        Desktop: Strict Equal-Height Viewport Layout (lg:h-[600px] or lg:h-[620px])
        Tablet & Mobile: Fluid Stacked Proportional Layout 
      */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch lg:h-[600px]">
        {/* =========================================================================
            LEFT COLUMN: FULL-HEIGHT EDITORIAL FEATURE BANNER (MOLTEN COLLECTION)
            ========================================================================= */}
        <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full overflow-hidden bg-[#FAF9F6] rounded-sm group shadow-sm shrink-0">
          <img
            src="/editorial/molten-collection-feature.jpg"
            alt="Molten Collection — Classic jewelry to embody timeless elegance"
            className="w-full h-full object-cover object-[center_35%] transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Vignette Overlay for Crisp Typography Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

          {/* Molten Collection Typography Overlay */}
          <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 inset-x-0 text-center px-4 sm:px-6 z-10 space-y-1 sm:space-y-1.5 pointer-events-none">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-white tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Molten Collection
            </h2>
            <p className="font-serif text-xs sm:text-sm text-white/95 italic font-light tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Classic jewelry to embody timeless elegance
            </p>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: 2x2 PRODUCT GRID + SLEEK PAGINATION CONTROLS
            ========================================================================= */}
        <div className="w-full lg:w-1/2 lg:h-full flex flex-col justify-between">
          {/* 2x2 Grid: flex-1 ensures it matches the exact height of the editorial image */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 flex-1 min-h-0">
            {displayedProducts.map((p) => {
              const productHref = p.slug
                ? `/products/${p.slug}`
                : `/products?search=${encodeURIComponent(p.title)}`;

              const productUrl =
                typeof window !== 'undefined'
                  ? `${window.location.origin}${productHref}`
                  : `http://localhost:3000${productHref}`;

              const waLink = generateWhatsAppEnquiryLink({
                phoneNumber: whatsappPhone,
                productName: p.title,
                productSku: p.sku || p.id,
                productUrl,
                template: whatsappTemplate,
              });

              return (
                <div key={p.id} className="group flex flex-col h-full min-h-0 relative">
                  {/* Image Container with Transparent Floating Master Jewelry */}
                  <div className="relative w-full aspect-square lg:aspect-auto lg:flex-1 lg:min-h-0 overflow-hidden bg-[#F4F3EF] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-stone-200/50">
                    <Link
                      href={productHref}
                      className="w-full h-full flex items-center justify-center p-3 sm:p-4 lg:p-5 relative"
                    >
                      {/* Master High-Res Transparent Studio Jewelry */}
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className={`max-w-full max-h-full object-contain filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)] transition-all duration-700 ease-out group-hover:scale-105 ${
                          p.secondaryImageUrl ? 'group-hover:opacity-0' : ''
                        }`}
                        loading="lazy"
                      />

                      {/* Secondary Alternate View on Hover */}
                      {p.secondaryImageUrl && (
                        <img
                          src={p.secondaryImageUrl}
                          alt={`${p.title} Alternate View`}
                          className="absolute inset-0 w-full h-full p-3 sm:p-4 lg:p-5 object-contain filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.06)] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </Link>

                    {/* Floating Luxury Price Badge (Top-Right) */}
                    <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
                      <Link
                        href={productHref}
                        className="inline-flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md text-[#171316] text-[11px] sm:text-[12px] font-sans font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#EBE3D5] group-hover:bg-[#171316] group-hover:text-white group-hover:border-[#171316] transition-all duration-300"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#B89A60] group-hover:text-[#E6C682] transition-colors" />
                        <span>{p.price}</span>
                      </Link>
                    </div>

                    {/* Quick WhatsApp Enquiry Action on Hover */}
                    <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-2.5 bg-[#171316]/95 hover:bg-black text-white text-[10px] font-sans font-medium tracking-wider uppercase rounded-sm shadow-md flex items-center justify-center space-x-1.5 transition-colors"
                        title="Enquire on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-[#25D366]" />
                        <span>Enquire</span>
                      </a>
                    </div>
                  </div>

                  {/* Product Title and Price Section */}
                  <div className="pt-2 sm:pt-2.5 pb-0.5 flex flex-col space-y-0.5 shrink-0">
                    <Link
                      href={productHref}
                      className="text-[12.5px] sm:text-[13.5px] font-serif font-normal text-[#262325] hover:text-[#9A7332] transition-colors leading-snug line-clamp-1"
                      title={p.title}
                    >
                      {p.title}
                    </Link>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[13px] sm:text-[14px] font-sans font-bold tracking-tight text-[#171316]">
                        {p.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================================================
              PAGINATION CONTROLS (EXACTLY ALIGNED AT BOTTOM-RIGHT)
              ========================================================================= */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-3.5 pt-3 shrink-0 text-[#171316]">
              <button
                onClick={() => setPage((prev) => (prev > 0 ? prev - 1 : 0))}
                disabled={page === 0}
                className={`p-1.5 transition-all duration-200 focus:outline-none min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 ${
                  page === 0
                    ? 'text-[#D8D6D4] cursor-default hover:bg-transparent active:scale-100'
                    : 'text-[#171316] hover:opacity-80 cursor-pointer'
                }`}
                aria-label="Previous products"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.25]" />
              </button>

              <button
                onClick={() =>
                  setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
                }
                disabled={page === totalPages - 1}
                className={`p-1.5 transition-all duration-200 focus:outline-none min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 ${
                  page === totalPages - 1
                    ? 'text-[#D8D6D4] cursor-default hover:bg-transparent active:scale-100'
                    : 'text-[#171316] hover:opacity-80 cursor-pointer'
                }`}
                aria-label="Next products"
              >
                <ArrowRight className="w-4 h-4 stroke-[1.25]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
