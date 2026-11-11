import { describe, it, expect } from 'vitest';
import { generateWhatsAppEnquiryLink, formatWhatsAppPhone } from './link-generator';

describe('WhatsApp Enquiry Link Generator', () => {
  it('correctly cleans and sanitizes phone numbers', () => {
    expect(formatWhatsAppPhone('+91 98765-43210')).toBe('919876543210');
    expect(formatWhatsAppPhone('0091 98765 43210')).toBe('919876543210');
    expect(formatWhatsAppPhone('(91) 9876543210')).toBe('919876543210');
    expect(formatWhatsAppPhone('8129440790')).toBe('918129440790');
    expect(formatWhatsAppPhone('918129440790')).toBe('918129440790');
  });

  it('generates a valid WhatsApp click-to-chat URL with product details', () => {
    const url = generateWhatsAppEnquiryLink({
      phoneNumber: '+91 98765 43210',
      productName: 'Celeste Diamond Choker',
      productSku: 'LUM-NK-001',
      productUrl: 'http://localhost:3000/products/celeste-diamond-choker',
    });

    expect(url).toContain('https://wa.me/919876543210?text=');
    expect(url).toContain(encodeURIComponent('Celeste Diamond Choker'));
    expect(url).toContain(encodeURIComponent('LUM-NK-001'));
    expect(url).toContain(encodeURIComponent('http://localhost:3000/products/celeste-diamond-choker'));
  });

  it('honors a custom message template with placeholders', () => {
    const customTemplate = 'Greetings! Interested in {productName} (Code: {productSku}). URL: {productUrl}';
    const url = generateWhatsAppEnquiryLink({
      phoneNumber: '919876543210',
      productName: 'Royal Bangles',
      productSku: 'LUM-BG-002',
      productUrl: 'http://localhost:3000/products/royal-bangles',
      template: customTemplate,
    });

    expect(url).toBe(
      'https://wa.me/919876543210?text=' +
        encodeURIComponent('Greetings! Interested in Royal Bangles (Code: LUM-BG-002). URL: http://localhost:3000/products/royal-bangles')
    );
  });
});

