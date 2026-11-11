'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TasholaProductCard, TasholaProductItem } from './TasholaProductCard';

interface TasholaCarouselRowProps {
  products: TasholaProductItem[];
  whatsappPhone?: string;
  whatsappTemplate?: string;
}

export function TasholaCarouselRow({
  products,
  whatsappPhone,
  whatsappTemplate,
}: TasholaCarouselRowProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const displayedProducts = products.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <div className="space-y-3">
      {/* 4-Column Product Grid with Clean 20-24px Gutters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {displayedProducts.map((p) => (
          <TasholaProductCard
            key={p.id}
            product={p}
            whatsappPhone={whatsappPhone}
            whatsappTemplate={whatsappTemplate}
          />
        ))}
      </div>

      {/* Pagination Controls matching Reference: Bottom Right Sleek Arrows (no dots) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-3.5 pt-2 text-[#171316]">
          <button
            onClick={() => setPage((prev) => (prev > 0 ? prev - 1 : 0))}
            disabled={page === 0}
            className={`p-1.5 transition-all duration-200 focus:outline-none min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 ${
              page === 0 ? 'text-[#D4D2D0] cursor-default hover:bg-transparent active:scale-100' : 'text-[#171316] hover:opacity-80 cursor-pointer'
            }`}
            aria-label="Previous products"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.25]" />
          </button>

          <button
            onClick={() => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
            disabled={page === totalPages - 1}
            className={`p-1.5 transition-all duration-200 focus:outline-none min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-black/5 active:scale-95 ${
              page === totalPages - 1
                ? 'text-[#D4D2D0] cursor-default hover:bg-transparent active:scale-100'
                : 'text-[#171316] hover:opacity-80 cursor-pointer'
            }`}
            aria-label="Next products"
          >
            <ArrowRight className="w-4 h-4 stroke-[1.25]" />
          </button>
        </div>
      )}
    </div>
  );
}

