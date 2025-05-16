import { FC, PropsWithChildren, useState } from 'react';
import { User } from '../types';
import { UserContext } from './contexts';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { getCooldownRemaining, setCooldownExpiry } from '../lib/utils';
import { useCooldown } from '../hooks/useCooldown';

export const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
   const [user, setUser] = useState<User | null>();
   const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
   const [verificationCooldown, internalSetVerificationCooldown] = useState<number>(() =>
      getCooldownRemaining(LOCAL_STORAGE_KEYS.VERIFICATION_COOLDOWN_EXPIRY)
   );
   const [forgotPasswordCooldown, internalSetForgotPasswordCooldown] = useState<number>(() =>
      getCooldownRemaining(LOCAL_STORAGE_KEYS.FORGOT_PASSWORD_COOLDOWN_EXPIRY)
   );

   useCooldown(verificationCooldown, internalSetVerificationCooldown, LOCAL_STORAGE_KEYS.VERIFICATION_COOLDOWN_EXPIRY);

   useCooldown(
      forgotPasswordCooldown,
      internalSetForgotPasswordCooldown,
      LOCAL_STORAGE_KEYS.FORGOT_PASSWORD_COOLDOWN_EXPIRY
   );

   const setVerificationCooldown = (seconds: number) => {
      setCooldownExpiry(LOCAL_STORAGE_KEYS.VERIFICATION_COOLDOWN_EXPIRY, seconds);
      internalSetVerificationCooldown(seconds);
   };
   const setForgotPasswordCooldown = (seconds: number) => {
      setCooldownExpiry(LOCAL_STORAGE_KEYS.FORGOT_PASSWORD_COOLDOWN_EXPIRY, seconds);
      internalSetForgotPasswordCooldown(seconds);
   };

   return (
      <UserContext.Provider
         value={{
            user,
            isUserLoading,
            setUser,
            setIsUserLoading,
            verificationCooldown,
            setVerificationCooldown,
            forgotPasswordCooldown,
            setForgotPasswordCooldown
         }}
      >
         {children}
      </UserContext.Provider>
   );
};
