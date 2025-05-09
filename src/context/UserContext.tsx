import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { User } from '../types';
import { UserContext } from './contexts';
export const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
   const [user, setUser] = useState<User | null>();
   const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
   const [verificationCooldown, setVerificationCooldown] = useState(0);

   useEffect(() => {
      if (verificationCooldown > 0) {
         const interval = setInterval(() => {
            if (verificationCooldown === 0) {
               clearInterval(interval);
               return;
            }
            setVerificationCooldown(prev => prev - 1);
         }, 1000);

         return () => clearInterval(interval);
      }
   }, [verificationCooldown]);

   return (
      <UserContext.Provider
         value={{ user, isUserLoading, setUser, setIsUserLoading, verificationCooldown, setVerificationCooldown }}
      >
         {children}
      </UserContext.Provider>
   );
};
