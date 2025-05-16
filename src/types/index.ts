import { Dispatch, SetStateAction } from 'react';
import { User } from './api.types';

export * from './api.types';

export type UserContextType = {
   user?: User;
   isUserLoading?: boolean;
   setUser: Dispatch<SetStateAction<User | undefined>>;
   setIsUserLoading: Dispatch<SetStateAction<boolean>>;
   verificationCooldown: number;
   setVerificationCooldown: (seconds: number) => void;
   forgotPasswordCooldown: number;
   setForgotPasswordCooldown: (seconds: number) => void;
};
