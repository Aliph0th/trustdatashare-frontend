import { useEffect } from 'react';
import { setCooldownExpiry } from '../lib/utils';

export const useCooldown = (
   cooldownValue: number,
   setCooldownValue: React.Dispatch<React.SetStateAction<number>>,
   storageKey: string
) => {
   useEffect(() => {
      if (cooldownValue > 0) {
         const interval = setInterval(() => {
            setCooldownValue((prev: number) => {
               if (prev <= 1) {
                  clearInterval(interval);
                  setCooldownExpiry(storageKey, 0);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [cooldownValue, setCooldownValue, storageKey]);
};
