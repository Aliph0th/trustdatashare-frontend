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
