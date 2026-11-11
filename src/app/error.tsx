'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, MessageCircle, AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely on client side if necessary without leaking private data
    console.error('Storefront error boundary caught:', error.message);
  }, [error]);

  const directConciergeLink =
    'https://wa.me/918129440790?text=' +
    encodeURIComponent('Hello Lumière Atelier Concierge, I encountered an issue viewing your jewellery catalogue.');

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-ivory-warm px-4 py-20">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-burgundy-50 border border-burgundy-200 text-burgundy-primary mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-burgundy-wine" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-burgundy-deep font-semibold">
          An Atelier Display Interruption
        </h1>

        <p className="text-sm text-charcoal-muted leading-relaxed font-light">
          We encountered an unexpected presentation delay while preparing this collection view. You may reload the exhibition or connect directly with our private concierge team.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-burgundy-primary hover:bg-burgundy-deep text-ivory-warm text-xs font-semibold uppercase tracking-widest rounded-full shadow-luxury transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-champagne-gold" />
            <span>Reload Exhibition</span>
          </button>

          <a
            href={directConciergeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-blush-soft text-burgundy-deep border border-burgundy-200 text-xs font-semibold uppercase tracking-widest rounded-full transition flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-3.5 h-3.5 text-champagne-antique" />
            <span>Speak with Concierge</span>
          </a>
        </div>
      </div>
    </div>
  );
}

