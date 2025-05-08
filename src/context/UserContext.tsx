import { FC, PropsWithChildren, useState } from 'react';
import { User } from '../types';
import { UserContext } from './contexts';
export const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
   const [user, setUser] = useState<User | null>();
   const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

   return (
      <UserContext.Provider value={{ user, isUserLoading, setUser, setIsUserLoading }}>{children}</UserContext.Provider>
   );
};
