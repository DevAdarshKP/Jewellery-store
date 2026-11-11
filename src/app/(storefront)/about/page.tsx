import { Award, Gem, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { buildStorefrontMetadata, JEWELLERY_IMAGE_FALLBACKS } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = buildStorefrontMetadata({
  title: 'Artisanal Heritage & Craftsmanship | Lumière Atelier',
  description:
    'Discover the legacy of Lumière Atelier: centuries of goldsmithing mastery, 22K BIS hallmarking, and ethical diamond sourcing.',
  path: '/about',
  image: JEWELLERY_IMAGE_FALLBACKS.craftsmanship,
});

export default function AboutPage() {
  return (
    <div className="space-y-24 py-16 text-charcoal-900 bg-[#FFFBF5]">
      {/* Editorial Hero */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-[11px] uppercase tracking-luxury-widest font-semibold text-champagne-metallic font-sans block">
          Since 1984
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-charcoal-900 tracking-tight leading-tight">
          The Heritage of Lumière Atelier
        </h1>
        <div className="w-16 h-0.5 bg-champagne-metallic mx-auto" />
        <p className="text-base sm:text-lg text-charcoal-600 font-light leading-relaxed max-w-2xl mx-auto">
          Honoring classical goldsmithing traditions, we create heirloom jewellery designed to celebrate life&apos;s most precious milestones with timeless dignity.
        </p>
      </section>

      {/* Narrative Section with Visual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-charcoal-100 border border-[#EAE4D9]">
            <img
              src={JEWELLERY_IMAGE_FALLBACKS.craftsmanship}
              alt="Jeweller Handcrafting Choker"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-[11px] uppercase tracking-luxury-widest font-semibold text-champagne-metallic font-sans block">
              Centuries of Mastery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 leading-snug">
              Every Piece is Born from Fire, Patience &amp; Precision
            </h2>
            <p className="text-sm text-charcoal-600 leading-relaxed font-light">
              At Lumière Atelier, jewellery is never mass-produced. Each creation begins as an artist&apos;s sketch, brought to life through hundreds of hours of meticulous hand-hammering, die-engraving, and Jadau setting by hereditary artisans.
            </p>
            <p className="text-sm text-charcoal-600 leading-relaxed font-light">
              From our royal Polki diamond chokers to delicate solitaire pendants, we use pure 22K and 18K BIS-hallmarked gold, paired exclusively with natural, laboratory-verified gemstones.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="bg-[#FFFBF5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] uppercase tracking-luxury-widest font-semibold text-champagne-metallic font-sans block">
              Authenticity &amp; Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900">
              Our Uncompromising Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-[#EAE4D9] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-champagne-gold/20 border border-champagne-gold/40 text-champagne-metallic flex items-center justify-center">
                <Award className="w-6 h-6 text-champagne-metallic" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-900">BIS Hallmarked Purity</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                Every ounce of gold utilized in our creations is stamped with official government BIS hallmark certifications, guaranteeing exact 91.6% (22K) or 75.0% (18K) pure gold.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-[#EAE4D9] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-champagne-gold/20 border border-champagne-gold/40 text-champagne-metallic flex items-center justify-center">
                <Gem className="w-6 h-6 text-champagne-metallic" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-900">Natural Diamonds</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                We strictly adhere to ethical sourcing protocols. All diamonds are natural, untreated, and accompanied by laboratory grading reports verifying cut, color, and clarity.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-[#EAE4D9] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-champagne-gold/20 border border-champagne-gold/40 text-champagne-metallic flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-champagne-metallic" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal-900">Heirloom Longevity</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed font-light">
                Crafted with heavy structural bezels and reinforced clasps to ensure each piece endures generations of wear, passing down as treasured family heirlooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="font-serif text-3xl font-semibold text-charcoal-900">
          Experience the Jewellery in Person
        </h2>
        <p className="text-sm text-charcoal-600 font-light max-w-xl mx-auto">
          We invite you to our flagship salon for a private viewing of our latest bridal collections and bespoke ornaments.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-charcoal-900 hover:bg-black text-white rounded-full text-xs uppercase tracking-luxury-widest font-bold transition shadow-md flex items-center space-x-2"
          >
            <span>Visit Our Atelier</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
          <Link
            href="/products"
            className="px-8 py-3.5 bg-white text-charcoal-900 border border-[#EAE4D9] rounded-full text-xs uppercase tracking-luxury-widest font-semibold transition hover:border-charcoal-900"
          >
            Explore Catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}
