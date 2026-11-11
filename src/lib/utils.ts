import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(guidance?: string): string {
  if (!guidance || guidance.trim() === '') {
    return 'Price on Request';
  }
  return guidance;
}

