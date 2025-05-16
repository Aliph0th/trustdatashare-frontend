import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { credentialsSchema } from '../validation';
import { REQUESTS } from '../api';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';

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
   return text.slice(0, start) + ' ... ' + text.slice(end);
};

export const formatSeconds = (seconds: number) => {
   const secondsInYear = 60 * 60 * 24 * 365;
   const secondsInMonth = 60 * 60 * 24 * 30;
   const secondsInDay = 60 * 60 * 24;
   const secondsInHour = 60 * 60;
   const secondsInMinute = 60;

   const years = Math.floor(seconds / secondsInYear);
   seconds %= secondsInYear;

   const months = Math.floor(seconds / secondsInMonth);
   seconds %= secondsInMonth;

   const days = Math.floor(seconds / secondsInDay);
   seconds %= secondsInDay;

   const hours = Math.floor(seconds / secondsInHour);
   seconds %= secondsInHour;

   const minutes = Math.floor(seconds / secondsInMinute);
   seconds %= secondsInMinute;

   const result = [];
   if (years > 0) result.push(`${years} year${years > 1 ? 's' : ''}`);
   if (months > 0) result.push(`${months} month${months > 1 ? 's' : ''}`);
   if (years === 0 && months === 0) {
      if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
   }
   if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
   if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
   if (seconds > 0) result.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

   return result.join(', ') || '0 seconds';
};

export function getCooldownRemaining(storageKey: string): number {
   const raw = localStorage.getItem(storageKey);
   if (raw) {
      const expiry = parseInt(raw, 10);
      const remaining = Math.ceil((expiry - Date.now()) / 1000);
      if (remaining > 0) return remaining;
      localStorage.removeItem(storageKey);
   }
   return 0;
}

export function setCooldownExpiry(storageKey: string, seconds: number) {
   if (seconds > 0) {
      const expiry = Date.now() + seconds * 1000;
      localStorage.setItem(storageKey, expiry.toString());
   } else {
      localStorage.removeItem(storageKey);
   }
}

export const fetchAvailability = async (
   field: 'username' | 'email',
   value: string,
   setError: UseFormSetError<{ username?: string; email?: string }>,
   clearError: UseFormClearErrors<{ username?: string; email?: string }>
) => {
   if (credentialsSchema.safeParse({ [field]: value }).success) {
      const response = await REQUESTS.CHECK_CREDENTIALS({ [field]: value });
      if (!response[field]) {
         setError(field, { message: `${field} is occupied` });
      } else {
         clearError(field);
      }
   }
};
