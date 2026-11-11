'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ICategory } from '@/types';

interface CategoryBrowseSectionProps {
  categories: ICategory[];
}

interface CategoryItem {
  key: string;
  label: string;
  slug: string;
  image: string;
  quadrantIndex: number; // 0: top-left (necklace), 1: top-right (earrings), 2: bottom-left (rings), 3: bottom-right (bracelets)
}

export function CategoryBrowseSection({ categories }: CategoryBrowseSectionProps) {
  // Find matching database categories by keyword
  const ringCat = categories.find(
    (c) => c.slug.includes('ring') || c.name.toLowerCase().includes('ring')
  );
  const necklaceCat = categories.find(
    (c) => c.slug.includes('necklace') || c.name.toLowerCase().includes('necklace')
  );
  const earringCat = categories.find(
    (c) => c.slug.includes('earring') || c.name.toLowerCase().includes('earring')
  );
  const braceletCat = categories.find(
    (c) =>
      c.slug.includes('bracelet') ||
      c.slug.includes('bangle') ||
      c.name.toLowerCase().includes('bracelet') ||
      c.name.toLowerCase().includes('bangle')
  );

  const items: CategoryItem[] = [
    {
      key: 'rings',
      label: 'Rings',
      slug: ringCat?.slug || 'statement-rings',
      image: '/hero-gold-ring-hq.png',
      quadrantIndex: 2, // bottom-left
    },
    {
      key: 'necklaces',
      label: 'Necklaces',
      slug: necklaceCat?.slug || 'necklaces-pendants',
      image: '/products/celeste-pendant-hq.png',
      quadrantIndex: 0, // top-left
    },
    {
      key: 'earrings',
      label: 'Earrings',
      slug: earringCat?.slug || 'earrings-jhumkas',
      image: '/products/chandbali-earrings-hq.png',
      quadrantIndex: 1, // top-right
    },
    {
      key: 'bracelets',
      label: 'Bracelets',
      slug: braceletCat?.slug || 'bangles-bracelets',
      image: '/products/tennis-bracelet-hq.png',
      quadrantIndex: 3, // bottom-right
    },
  ];

  // Default active is 'necklaces' to match the reference design exactly
  const [activeKey, setActiveKey] = useState<string>('necklaces');

  return (
    <section className="bg-[#FFFBF5] text-charcoal-900 py-8 sm:py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header Row: "Browse by categories" on left, "See All" on right */}
        <div className="flex items-center justify-between pb-4 sm:pb-6">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-charcoal-900 tracking-tight">
            Browse by categories
          </h2>

          <Link
            href="/products"
            className="px-6 sm:px-7 py-2.5 sm:py-3 bg-charcoal-900 hover:bg-black text-white text-xs font-semibold tracking-wider rounded-full shadow-sm hover:shadow transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            <span>See All</span>
          </Link>
        </div>

        {/* Main Content: Left Emblem + Right Category List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6 sm:pt-8">
          {/* -------------------------------------------------------------
              LEFT COLUMN: ULTRA-HIGH-DEFINITION 4-POD GOLDEN COMPASS EMBLEM
              ------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[450px] aspect-square flex items-center justify-center p-3">
              {/* 2x2 Grid of Circular Pods */}
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 relative">
                {/* 1. Top-Left Pod: Necklaces */}
                <Link
                  href={`/products?category=${necklaceCat?.slug || 'necklaces-pendants'}`}
                  onMouseEnter={() => setActiveKey('necklaces')}
                  className={`relative w-full h-full rounded-full bg-[#FAF2E8] border transition-all duration-300 flex items-center justify-center p-4 sm:p-5 group ${
                    activeKey === 'necklaces'
                      ? 'border-[#D5B477] shadow-lg ring-4 ring-[#D5B477]/15 scale-[1.03]'
                      : 'border-[#EAE4D9] hover:border-charcoal-400'
                  }`}
                  aria-label="Browse Necklaces"
                >
                  <img
                    src="/products/celeste-pendant-hq.png"
                    alt="Necklaces & Pendants"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                {/* 2. Top-Right Pod: Earrings */}
                <Link
                  href={`/products?category=${earringCat?.slug || 'earrings-jhumkas'}`}
                  onMouseEnter={() => setActiveKey('earrings')}
                  className={`relative w-full h-full rounded-full bg-[#FAF2E8] border transition-all duration-300 flex items-center justify-center p-4 sm:p-5 group ${
                    activeKey === 'earrings'
                      ? 'border-[#D5B477] shadow-lg ring-4 ring-[#D5B477]/15 scale-[1.03]'
                      : 'border-[#EAE4D9] hover:border-charcoal-400'
                  }`}
                  aria-label="Browse Earrings"
                >
                  <img
                    src="/products/chandbali-earrings-hq.png?v=2"
                    alt="Earrings & Jhumkas"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                {/* 3. Bottom-Left Pod: Rings */}
                <Link
                  href={`/products?category=${ringCat?.slug || 'statement-rings'}`}
                  onMouseEnter={() => setActiveKey('rings')}
                  className={`relative w-full h-full rounded-full bg-[#FAF2E8] border transition-all duration-300 flex items-center justify-center p-4 sm:p-5 group ${
                    activeKey === 'rings'
                      ? 'border-[#D5B477] shadow-lg ring-4 ring-[#D5B477]/15 scale-[1.03]'
                      : 'border-[#EAE4D9] hover:border-charcoal-400'
                  }`}
                  aria-label="Browse Rings"
                >
                  <img
                    src="/hero-gold-ring-hq.png"
                    alt="Statement Rings"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                {/* 4. Bottom-Right Pod: Bracelets */}
                <Link
                  href={`/products?category=${braceletCat?.slug || 'bangles-bracelets'}`}
                  onMouseEnter={() => setActiveKey('bracelets')}
                  className={`relative w-full h-full rounded-full bg-[#FAF2E8] border transition-all duration-300 flex items-center justify-center p-4 sm:p-5 group ${
                    activeKey === 'bracelets'
                      ? 'border-[#D5B477] shadow-lg ring-4 ring-[#D5B477]/15 scale-[1.03]'
                      : 'border-[#EAE4D9] hover:border-charcoal-400'
                  }`}
                  aria-label="Browse Bracelets"
                >
                  <img
                    src="/products/tennis-bracelet-hq.png"
                    alt="Bangles & Bracelets"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
              </div>

              {/* Central Flared 4-Point Golden Compass Star */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <svg
                  viewBox="0 0 100 100"
                  className="w-28 h-28 sm:w-36 sm:h-36 text-[#F6E5B8] drop-shadow-md"
                  fill="currentColor"
                >
                  <path d="M50 0 C50 30 30 50 0 50 C30 50 50 70 50 100 C50 70 70 50 100 50 C70 50 50 30 50 0 Z" />
                </svg>

                {/* Circular Mint Atelier Seal in Exact Center */}
                <div className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#D4ECE6] border border-[#2E8B75]/40 flex items-center justify-center shadow-md">
                  <div className="w-4 h-4 rounded-full bg-white border border-[#2E8B75]/50 flex items-center justify-center" />
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: CATEGORY LIST WITH SLENDER RIGHT ARROWS
              ------------------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col justify-center divide-y divide-[#EAE4D9]/80">
            {items.map((item) => {
              const isActive = activeKey === item.key;
              return (
                <Link
                  key={item.key}
                  href={`/products?category=${item.slug}`}
                  onMouseEnter={() => setActiveKey(item.key)}
                  className={`w-full py-5 sm:py-7 flex items-center justify-between group transition-colors duration-300 ${
                    isActive ? 'text-[#9E802A]' : 'text-charcoal-800 hover:text-[#9E802A]'
                  }`}
                >
                  <span className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal tracking-tight leading-tight select-none transition-colors duration-300">
                    {item.label}
                  </span>

                  <span
                    className={`inline-flex items-center transform transition-all duration-300 ${
                      isActive
                        ? 'translate-x-2 text-[#9E802A]'
                        : 'text-charcoal-700 group-hover:translate-x-2 group-hover:text-[#9E802A]'
                    }`}
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
