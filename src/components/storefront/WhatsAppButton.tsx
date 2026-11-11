'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppEnquiryLink } from '@/lib/whatsapp/link-generator';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber: string;
  productName: string;
  productSku: string;
  productUrl: string;
  template?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'floating' | 'champagne';
  className?: string;
  label?: string;
}

export function WhatsAppButton({
  phoneNumber,
  productName,
  productSku,
  productUrl,
  template,
  variant = 'primary',
  className,
  label = 'Enquire on WhatsApp',
}: WhatsAppButtonProps) {
  const href = generateWhatsAppEnquiryLink({
    phoneNumber,
    productName,
    productSku,
    productUrl,
    template,
  });

  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enquire via WhatsApp"
        className={cn(
          'fixed bottom-6 right-6 z-50 p-4 rounded-full bg-champagne-gold hover:bg-[#c9a768] text-obsidian shadow-[0_10px_30px_rgba(213,180,119,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group border border-champagne-gold/60',
          className
        )}
      >
        <MessageCircle className="w-6 h-6 text-obsidian fill-obsidian" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-sans text-xs font-bold uppercase tracking-wider px-0 group-hover:pl-2">
          Concierge
        </span>
      </a>
    );
  }

  const baseStyles =
    'inline-flex items-center justify-center space-x-2 rounded-full text-xs uppercase tracking-luxury-widest font-semibold transition-all duration-200 cursor-pointer';

  const variants = {
    primary:
      'bg-champagne-gold hover:bg-[#c9a768] text-obsidian shadow-[0_10px_25px_-5px_rgba(213,180,119,0.4)] py-4 px-8 font-bold',
    secondary:
      'bg-white/10 hover:bg-white/20 backdrop-blur-md text-ivory-warm border border-white/20 py-3.5 px-6',
    outline:
      'bg-transparent hover:bg-champagne-gold/10 text-champagne-gold border border-champagne-gold/50 py-3.5 px-6',
    champagne:
      'bg-champagne-gold hover:bg-[#c9a768] text-obsidian shadow-[0_10px_25px_-5px_rgba(213,180,119,0.4)] py-4 px-8 font-bold',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseStyles, variants[variant as keyof typeof variants] || variants.primary, className)}
    >
      <MessageCircle className="w-4 h-4 shrink-0 text-obsidian fill-obsidian" />
      <span>{label}</span>
    </a>
  );
}
