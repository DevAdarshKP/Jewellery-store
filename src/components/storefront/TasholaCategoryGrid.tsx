'use client';

import Link from 'next/link';

interface CategoryTile {
  title: string;
  italicWord: string;
  slug: string;
  imageUrl: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    title: 'Bracelets',
    italicWord: 'Collection',
    slug: 'bangles-bracelets',
    imageUrl: '/editorial/category-bracelets.jpg',
  },
  {
    title: 'Necklaces',
    italicWord: 'Collection',
    slug: 'necklaces-pendants',
    imageUrl: '/editorial/category-necklaces.jpg',
  },
  {
    title: 'Rings',
    italicWord: 'Collection',
    slug: 'statement-rings',
    imageUrl: '/editorial/category-rings.jpg',
  },
  {
    title: 'Earrings',
    italicWord: 'Collection',
    slug: 'earrings-jhumkas',
    imageUrl: '/editorial/category-earrings.jpg',
  },
];

export function TasholaCategoryGrid() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 sm:gap-1 bg-white">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.title}
            href={`/products?category=${cat.slug}`}
            className="group relative aspect-square sm:aspect-[4/5] lg:aspect-[1/1] overflow-hidden block bg-[#F5F2EB]"
          >
            {/* Background Editorial High-Fashion Photo */}
            <img
              src={cat.imageUrl}
              alt={`${cat.title} ${cat.italicWord}`}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
            />

            {/* Subtle Gradient Vignette at Bottom for High-Contrast Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

            {/* Serif Overlay Title at Bottom — Sized gracefully to prevent wrapping on tablet */}
            <div className="absolute bottom-6 sm:bottom-8 inset-x-0 text-center px-4 z-10">
              <h3 className="font-serif text-2xl sm:text-[26px] md:text-2xl lg:text-3xl xl:text-4xl text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <span>{cat.title} </span>
                <span className="italic font-normal">{cat.italicWord}</span>
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

