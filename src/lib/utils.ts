import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const titleInitials = (string: string) => {
   const words = string
      // eslint-disable-next-line no-useless-escape
      .split(/[\s-|\+~!@#$%^&*(){}\[\]\/,'"»«]/)
      .filter(Boolean)
      .slice(0, 2);
   return words
      .map(word => Array.from(word)[0])
      .join('')
      .toUpperCase();
};

export const getExpiration = (createdAt: Date, ttl: number) =>
   Math.round((createdAt.getTime() + ttl * 1000 - Date.now()) / 1000);

export const truncateText = (text: string, charsToKeep = 10) => {
   if (text.length <= 65) {
      return text;
   }
   const start = Math.ceil((65 - charsToKeep) / 5);
   const end = text.length - charsToKeep;
   return text.slice(0, start) + '...' + text.slice(end);
};
