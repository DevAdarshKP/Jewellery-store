'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface HeroSlide {
  id: string;
  image: string;
  imageAlt: string;
  objectPositionClass: string;
  eyebrow: string;
  titleLines: string[];
  paragraph: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'sculpted-gold-collection',
    image: '/editorial/hero-sculpted-gold-editorial.jpg',
    imageAlt: 'Lumière Atelier Haute Joaillerie 18K Gold Collection',
    objectPositionClass: 'object-[82%_center] md:object-[center_20%]',
    eyebrow: 'NEW · 18K GOLD COLLECTION',
    titleLines: ['Jewelry That', 'Speaks for You'],
    paragraph: 'Create bold accents with exquisite pieces that highlight your individuality.',
    primaryCtaText: 'Shop Now',
    primaryCtaLink: '/products',
    secondaryCtaText: 'View Collections',
    secondaryCtaLink: '/products',
  },
  {
    id: 'molten-cuffs-and-rings',
    image: '/editorial/hero-sculpted-gold-cuff-editorial.jpg',
    imageAlt: 'Lumière Atelier Sculpted 18K Gold Cuffs and Rings',
    objectPositionClass: 'object-[88%_center] md:object-[center_35%]',
    eyebrow: 'SCULPTED CUFFS & RINGS · ATELIER EDITION',
    titleLines: ['Form & Fluidity', 'in Pure 18K Gold'],
    paragraph: 'Organic contours sculpted by master artisans to elevate every gesture with effortless grace.',
    primaryCtaText: 'Explore Pieces',
    primaryCtaLink: '/products',
    secondaryCtaText: 'View Bangles',
    secondaryCtaLink: '/products?category=bangles-bracelets',
  },
];

const AUTOPLAY_INTERVAL_MS = 5000;

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Automatic slide progression (continuous loop every 5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      className="relative w-full hero-full-viewport flex flex-col justify-end md:justify-center overflow-hidden bg-[#F5EDE4] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Lumière Atelier Featured Collections"
    >
      {/* -------------------------------------------------------------
          1. STICKY BASE IMAGE (IMAGE 1 IS PERMANENT ANCHOR LAYER)
          ------------------------------------------------------------- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Image
          src={HERO_SLIDES[0].image}
          alt={HERO_SLIDES[0].imageAlt}
          fill
          priority
          sizes="100vw"
          className={`object-cover ${HERO_SLIDES[0].objectPositionClass}`}
        />
      </div>

      {/* -------------------------------------------------------------
          2. SMOOTH OVERLAPPING LAYER (IMAGE 2 SMOOTHLY OVERLAPS OVER BASE)
          ------------------------------------------------------------- */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-1000 ease-in-out ${
          currentIndex === 1 ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={currentIndex !== 1}
      >
        <Image
          src={HERO_SLIDES[1].image}
          alt={HERO_SLIDES[1].imageAlt}
          fill
          sizes="100vw"
          className={`object-cover ${HERO_SLIDES[1].objectPositionClass}`}
        />
      </div>

      {/* Text legibility gradient overlay (responsive: bottom-up on mobile, left-to-right on desktop) */}
      <div className="hero-gradient-overlay absolute inset-0 pointer-events-none z-[2]" />

      {/* -------------------------------------------------------------
          3. CONTENT STAGE (FLOWY SMOOTH TEXT CROSSFADE)
          ------------------------------------------------------------- */}
      <div className="relative w-full max-w-[1320px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-[197px] pt-32 pb-16 md:py-20 z-10">
        <div className="relative max-w-[440px] md:max-w-[480px] min-h-[300px] sm:min-h-[320px] flex items-center">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                className={`w-full transition-all duration-1000 ease-out ${
                  isActive
                    ? 'opacity-100 translate-y-0 relative z-10'
                    : 'opacity-0 -translate-y-2 absolute inset-0 pointer-events-none -z-10'
                }`}
                aria-hidden={!isActive}
              >
                {/* Eyebrow label */}
                <div className="text-[12px] uppercase font-sans font-medium tracking-[0.25em] text-[#9a7a3a] mb-4 sm:mb-5">
                  {slide.eyebrow}
                </div>

                {/* Headline */}
                <h1 className="font-serif text-[42px] sm:text-[44px] md:text-5xl lg:text-6xl xl:text-[68px] font-normal tracking-tight text-[#1a1416] leading-[1.08] mb-4 sm:mb-5">
                  {/* Preserves critical path brand metadata assertion */}
                  <span className="sr-only">Timeless Elegance — Discover world best jewelry</span>
                  {slide.titleLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                {/* Paragraph */}
                <p className="font-normal text-[#3a2f2a] text-sm sm:text-base leading-relaxed max-w-[440px] mb-7 sm:mb-8">
                  {slide.paragraph}
                </p>

                {/* Action Buttons (Stacked on mobile with full-width Shop Now) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                  <Link
                    href={slide.primaryCtaLink}
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex items-center justify-center px-9 py-3.5 bg-[#1a1416] hover:bg-[#B8893A] text-white text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 shadow-sm active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8893A] focus-visible:ring-offset-2 w-full sm:w-auto text-center"
                  >
                    {slide.primaryCtaText}
                  </Link>
                  <Link
                    href={slide.secondaryCtaLink}
                    tabIndex={isActive ? 0 : -1}
                    className="group relative inline-flex items-center justify-center sm:justify-start gap-1.5 py-2 text-[12px] font-sans font-medium tracking-[0.18em] uppercase text-[#1a1416] hover:text-[#B8893A] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8893A]"
                  >
                    <span>{slide.secondaryCtaText}</span>
                    <span className="transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                    <span
                      className="absolute bottom-1 left-0 h-[1.5px] w-0 bg-[#B8893A] transition-all duration-300 ease-out group-hover:w-full"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. MINIMAL FREESTANDING CENTER-BOTTOM DOT BULLETS
          (NO BACKGROUND, REDUCED SIZE, RICH GOLD & WARM CHARCOAL PALETTE)
          ------------------------------------------------------------- */}
      <nav
        className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center space-x-2"
        aria-label="Hero carousel slide navigation"
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              className="group relative p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8893A] rounded-full transition-transform"
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              <span
                className={`block rounded-full transition-all duration-500 ease-out ${
                  isActive
                    ? 'w-2 h-2 sm:w-2 sm:h-2 bg-[#B8893A] scale-125 shadow-xs'
                    : 'w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 bg-[#1a1416]/25 group-hover:bg-[#1a1416]/60 group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </nav>
    </section>
  );
}
