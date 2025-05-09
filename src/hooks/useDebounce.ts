import { useState, useEffect } from 'react';

export const useDebounce = <T>(cb: T, delay = 700): T => {
   const [debounceValue, setDebounceValue] = useState<T>(cb);
   useEffect(() => {
      const handler = setTimeout(() => {
         setDebounceValue(cb);
      }, delay);

      return () => {
         clearTimeout(handler);
      };
   }, [cb, delay]);
   return debounceValue;
};
