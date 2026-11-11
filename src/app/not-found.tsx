import Link from 'next/link';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

export default function NotFound() {
  const directConciergeLink =
    'https://wa.me/918129440790?text=' +
    encodeURIComponent('Hello Lumière Atelier Concierge, I was browsing your website and could not locate a specific piece.');

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-ivory-warm px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-burgundy-50 border border-burgundy-200 text-burgundy-primary text-[11px] tracking-luxury-widest uppercase font-sans">
          <Sparkles className="w-3.5 h-3.5 text-champagne-gold" />
          <span>Atelier Archive</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl text-burgundy-deep font-semibold tracking-tight">
          Piece Not Located
        </h1>

        <div className="w-16 h-0.5 bg-champagne-gold mx-auto" />

        <p className="text-base text-charcoal-muted max-w-lg mx-auto font-light leading-relaxed">
          The jewellery creation or exhibition page you seek may have been acquired, retired to our private archives, or relocated. Our master concierge remains at your disposal to assist with bespoke commissions.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-burgundy-primary hover:bg-burgundy-deep text-ivory-warm text-xs font-semibold uppercase tracking-widest rounded-full shadow-luxury transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Explore All Jewellery</span>
            <ArrowRight className="w-4 h-4 text-champagne-gold" />
          </Link>

          <a
            href={directConciergeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-blush-soft text-burgundy-deep border border-burgundy-200 text-xs font-semibold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4 text-champagne-antique" />
            <span>Enquire with Concierge</span>
          </a>
        </div>
      </div>
    </div>
  );
}

