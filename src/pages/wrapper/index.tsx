import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { Toaster } from '@/components/ui/sonner';
import { useUser } from '../../hooks/useUser';

const Wrapper = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { isUserLoading, user } = useUser();
   if (!isUserLoading && user && !user.isEmailVerified && !location.pathname.match(/^\/verify.*$/)) {
      navigate('/verify', { replace: true });
   }
   return (
      <div className="h-screen flex flex-col">
         <Header />
         <main className="flex-1 px-5 py-5 flex flex-col">
            <Outlet />
            <Toaster expand richColors theme="light" className="select-none" />
         </main>
      </div>
   );
};

export default Wrapper;
