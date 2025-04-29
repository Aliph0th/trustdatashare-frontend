import { Loader2 } from 'lucide-react';
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

interface IAuthWrapperProps {
   isAuthRequired?: boolean;
   to: string;
   children: ReactNode;
}

const AuthWrapper: FC<IAuthWrapperProps> = ({ children, to, isAuthRequired = false }) => {
   const { user, isLoading } = useUser();

   if (isLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
         </div>
      );
   }

   if ((!user && isAuthRequired) || (user && !isAuthRequired)) {
      return <Navigate to={to} replace />;
   }

   return children;
};

export default AuthWrapper;
