export interface WhatsAppLinkParams {
  phoneNumber: string;
  productName: string;
  productSku: string;
  productUrl: string;
  template?: string;
}

const DEFAULT_TEMPLATE =
  'Hello Lumière Atelier, I would like to enquire about "{productName}" (Code: {productSku}). Link: {productUrl}';

export function formatWhatsAppPhone(phone: string): string {
  // Strip non-digits
  let cleaned = (phone || '').replace(/\D/g, '');
  // If user included leading 00, trim it
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  // If 10 digits (e.g. Indian mobile number 8129440790), prepend 91 for WhatsApp international click-to-chat
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

export function generateWhatsAppEnquiryLink({
  phoneNumber,
  productName,
  productSku,
  productUrl,
  template = DEFAULT_TEMPLATE,
}: WhatsAppLinkParams): string {
  const cleanPhone = formatWhatsAppPhone(phoneNumber);
  
  const message = template
    .replace('{productName}', productName)
    .replace('{productSku}', productSku)
    .replace('{productUrl}', productUrl);

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

