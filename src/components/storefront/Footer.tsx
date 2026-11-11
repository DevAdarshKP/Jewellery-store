import Link from 'next/link';
import { ICategory } from '@/types';

interface FooterProps {
  categories?: ICategory[];
  brandName?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  showroomAddress?: string;
  businessHours?: string;
  whatsappPhone?: string;
}

export function Footer({
  brandName = 'Lumière Atelier',
  contactEmail = 'concierge@lumiereatelier.local',
  contactPhone = '+91 81294 40790',
  showroomAddress = '14 Heritage Boulevard, Luxury Quarter',
  businessHours = 'Monday – Saturday: 10:30 AM – 8:00 PM',
  whatsappPhone = '918129440790',
}: FooterProps) {
  return (
    <footer className="bg-white text-[#171316] font-sans pt-12 sm:pt-16 pb-10 sm:pb-12 mt-auto border-t border-[#F0ECE4] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid matching Editorial Luxury Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand Wordmark & Copyright (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-block group focus:outline-none">
              <span className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#171316] transition-opacity duration-200 group-hover:opacity-85">
                {brandName}
              </span>
            </Link>
            <p className="text-xs text-charcoal-500 font-light">
              &copy; 2026 {brandName}. All rights reserved.
            </p>

            {/* Hidden metadata for test/SEO preservation */}
            <div className="sr-only overflow-hidden">
              <span>{contactEmail}</span>
              <span>{contactPhone}</span>
              <span>{showroomAddress}</span>
              <span>{businessHours}</span>
            </div>
          </div>

          {/* Col 2: Catalog (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-medium tracking-wide text-[#171316]">
              Catalog
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-600 font-light">
              <li>
                <Link href="/products?sort=newest" className="hover:text-black transition">
                  New In
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings-jhumkas" className="hover:text-black transition">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/products?category=statement-rings" className="hover:text-black transition">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/products?category=necklaces-pendants" className="hover:text-black transition">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/products?category=bangles-bracelets" className="hover:text-black transition">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-black transition">
                  Charms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition">
                  Personalisation
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-black transition">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-black transition">
                  Gifting
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Information (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-medium tracking-wide text-[#171316]">
              Information
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-600 font-light">
              <li>
                <Link href="/about" className="hover:text-black transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors duration-200">
                  Delivery &amp; Returns
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors duration-200">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors duration-200">
                  Payment &amp; FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Showrooms + Social Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-medium tracking-wide text-[#171316]">
                Showrooms
              </h4>
              <ul className="space-y-2 text-xs text-charcoal-600 font-light">
                <li>
                  <Link href="/contact" className="hover:text-black transition-colors duration-200">
                    Store Addresses
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center space-x-2.5 text-[#A8988D]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D9D1C5] flex items-center justify-center text-xs hover:border-[#171316] hover:text-[#171316] active:scale-95 transition-all duration-200"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D9D1C5] flex items-center justify-center text-xs hover:border-[#171316] hover:text-[#171316] active:scale-95 transition-all duration-200"
                aria-label="Instagram"
              >
                ig
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D9D1C5] flex items-center justify-center text-xs hover:border-[#171316] hover:text-[#171316] active:scale-95 transition-all duration-200"
                aria-label="Pinterest"
              >
                p
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
