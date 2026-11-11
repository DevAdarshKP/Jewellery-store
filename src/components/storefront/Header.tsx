'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, MessageCircle } from 'lucide-react';
import { formatWhatsAppPhone } from '@/lib/whatsapp/link-generator';
import { ICategory } from '@/types';

interface HeaderProps {
  categories?: ICategory[];
  announcement?: string;
  brandName?: string;
  whatsappPhone?: string;
}

export function Header({
  categories = [],
  brandName = 'Lumière Atelier',
  whatsappPhone = '918129440790',
}: HeaderProps) {
  const pathname = usePathname() || '';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [cursorNearTop, setCursorNearTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 15);

      if (currentY <= 20) {
        // At the very top, always show
        setVisible(true);
      } else if (currentY > lastY + 8 && currentY > 70) {
        // Scrolling down: smoothly hide
        setVisible(false);
      } else if (currentY < lastY - 8) {
        // Scrolling up: smoothly reveal
        setVisible(true);
      }

      lastY = currentY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // If cursor is within top 70px of viewport, smoothly reveal navbar
      if (e.clientY <= 70) {
        setCursorNearTop(true);
      } else if (e.clientY > 110) {
        setCursorNearTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Close mobile drawer on route change and lock body scroll when open
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isHeaderVisible = visible || cursorNearTop || isHovered || mobileMenuOpen;

  const directConciergeLink = `https://wa.me/${formatWhatsAppPhone(whatsappPhone)}?text=${encodeURIComponent(
    'Hello, I would like to enquire about your fine jewellery collection and bespoke appointment availability.'
  )}`;

  return (
    <header
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="sticky top-0 z-50 w-full"
    >
      {/* Luxury Clean Editorial Navigation Shell */}
      <div
        className={`w-full transition-all duration-300 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3.5 border-b border-black/[0.06]'
            : 'bg-white py-4 sm:py-5 border-b border-black/[0.06]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Navigation: CATALOG, ABOUT US, SHOWROOMS */}
          <nav className="hidden md:flex items-center justify-start md:flex-1 space-x-7 lg:space-x-9 text-[11px] font-sans font-medium tracking-[0.18em] text-[#171316] uppercase">
            <Link
              href="/products"
              className={`transition-colors duration-200 hover:text-charcoal-400 py-1 ${
                pathname?.startsWith('/products') ? 'font-semibold text-charcoal-900' : 'text-charcoal-700'
              }`}
            >
              <span>Catalog</span>
              <span className="sr-only">All Jewellery Collection</span>
            </Link>
            <Link
              href="/about"
              className={`transition-colors duration-200 hover:text-charcoal-400 py-1 ${
                pathname === '/about' ? 'font-semibold text-charcoal-900' : 'text-charcoal-700'
              }`}
            >
              <span>About Us</span>
              <span className="sr-only">Craftsmanship &amp; Heritage</span>
            </Link>
            <Link
              href="/contact"
              className={`transition-colors duration-200 hover:text-charcoal-400 py-1 ${
                pathname === '/contact' ? 'font-semibold text-charcoal-900' : 'text-charcoal-700'
              }`}
            >
              <span>Showrooms</span>
              <span className="sr-only">The Atelier Showrooms</span>
            </Link>
          </nav>

          {/* Center Brand Logo: Lumière Atelier (Precisely Centered on Desktop) */}
          <div className="flex items-center justify-center shrink-0">
            <Link href="/" className="inline-flex items-center group focus:outline-none">
              <span className="font-serif text-2xl sm:text-3xl lg:text-[30px] font-semibold tracking-tight text-[#171316] transition-opacity duration-200 group-hover:opacity-85">
                {brandName}
              </span>
              <span className="sr-only">Lumière Atelier — Haute Joaillerie</span>
            </Link>
          </div>

          {/* Right Action: WhatsApp Concierge + Mobile Menu */}
          <div className="flex items-center justify-end md:flex-1 space-x-3 sm:space-x-5 text-[#171316]">
            {/* Concierge WhatsApp Action */}
            <a
              href={directConciergeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-[#DED9D0] text-[10px] font-sans font-medium tracking-wider uppercase text-charcoal-800 hover:bg-[#FAF9F6] hover:border-charcoal-400 active:scale-[0.98] transition-all duration-200 shadow-sm"
              title="Concierge WhatsApp Service"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Concierge</span>
            </a>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-charcoal-900 focus:outline-none active:scale-95 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center rounded-md hover:bg-black/5"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer with Backdrop Click Dismiss */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-r border-[#EAE4D9] w-4/5 max-w-sm h-full p-6 shadow-2xl overflow-y-auto space-y-6 cursor-auto"
          >
            {/* Primary Nav Links Header with Close Action */}
            <div className="space-y-4">
              <div className="text-[10px] uppercase tracking-luxury-widest text-charcoal-400 font-semibold border-b border-[#F0ECE4] pb-2 flex items-center justify-between">
                <span>Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 -mr-1 text-charcoal-500 hover:text-charcoal-900 focus:outline-none transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col space-y-3 text-sm font-sans tracking-[0.15em] uppercase">
                <Link
                  href="/products"
                  className={`py-1 transition ${
                    pathname?.startsWith('/products') ? 'text-charcoal-900 font-semibold' : 'text-charcoal-700'
                  }`}
                >
                  Catalog
                </Link>
                <Link
                  href="/about"
                  className={`py-1 transition ${
                    pathname === '/about' ? 'text-charcoal-900 font-semibold' : 'text-charcoal-700'
                  }`}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className={`py-1 transition ${
                    pathname === '/contact' ? 'text-charcoal-900 font-semibold' : 'text-charcoal-700'
                  }`}
                >
                  Showrooms
                </Link>
              </div>
            </div>

            {/* Categories in Drawer */}
            {categories.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-[10px] uppercase tracking-luxury-widest text-charcoal-400 font-semibold border-b border-[#F0ECE4] pb-2">
                  Collections
                </div>
                <div className="flex flex-col space-y-2 text-xs text-charcoal-600">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}`}
                      className="py-1 px-2 rounded hover:bg-black/5 hover:text-charcoal-900 transition flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Concierge Action in Drawer */}
            <div className="pt-4 border-t border-[#F0ECE4] space-y-3">
              <a
                href={directConciergeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#171316] hover:bg-black text-white rounded-none text-xs font-medium tracking-widest uppercase flex items-center justify-center space-x-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
