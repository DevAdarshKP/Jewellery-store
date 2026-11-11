'use client';

import { useState } from 'react';
import { IProductImage } from '@/types';
import { getSafeImageUrl } from '@/lib/seo';

interface ProductGalleryProps {
  images: IProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            url: '/products/solitaire-diamond-ring.png',
            alt: title,
            isPrimary: true,
            displayOrder: 1,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];
  const safeCurrentUrl = getSafeImageUrl(currentImage.url, 'rings');

  return (
    <div className="w-full flex flex-col items-center">
      {/* -------------------------------------------------------------
          1. MAIN LARGE VISUAL STAGE (CLEAN BACKGROUND-LESS FLOATING PNG)
          ------------------------------------------------------------- */}
      <div className="relative w-full aspect-[4/3] sm:aspect-square max-h-[360px] sm:max-h-[500px] lg:max-h-[540px] flex items-center justify-center p-4 sm:p-12 select-none group">
        {/* Soft Ambient Radial Glow Behind the Piece */}
        <div className="absolute inset-0 bg-radial-gradient from-champagne-gold/10 via-transparent to-transparent pointer-events-none rounded-full blur-2xl" />

        <img
          key={safeCurrentUrl}
          src={safeCurrentUrl}
          alt={currentImage.alt || title}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] transition-all duration-700 ease-out group-hover:scale-105"
          fetchPriority="high"
        />

        {/* Discreet Photo Counter Badge */}
        {displayImages.length > 1 && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md text-charcoal-700 text-[10px] font-sans font-medium tracking-luxury-widest px-2.5 sm:px-3 py-1 rounded-full uppercase border border-[#EAE4D9] shadow-sm">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          2. CENTERED HORIZONTAL THUMBNAILS (MATCHING REFERENCE DESIGN)
          ------------------------------------------------------------- */}
      {displayImages.length > 1 && (
        <div className="flex items-center justify-center gap-3 sm:gap-6 pt-3 sm:pt-6">
          {displayImages.map((img, idx) => {
            const thumbUrl = getSafeImageUrl(img.url, 'rings');
            const isSelected = selectedIndex === idx;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 sm:w-24 sm:h-24 p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition-all bg-white border focus:outline-none ${
                  isSelected
                    ? 'border-[#EAE4D9] shadow-sm'
                    : 'border-[#EAE4D9]/60 hover:border-charcoal-400 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={thumbUrl}
                  alt={img.alt || `${title} view ${idx + 1}`}
                  className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
                />

                {/* Signature Gold Underline Indicator for Selected Thumbnail */}
                {isSelected && (
                  <span className="absolute -bottom-1 sm:-bottom-1.5 left-3 sm:left-4 right-3 sm:right-4 h-[2px] bg-[#B8934A] rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
