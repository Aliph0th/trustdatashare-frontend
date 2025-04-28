import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '@/components/ui/sonner';

const Wrapper = () => {
   return (
      <div className="h-screen flex flex-col">
         <Header />
         <main className="flex-1 px-5 py-5 flex flex-col">
            <Outlet />
            <Toaster expand richColors theme="light" />
         </main>
         <Footer />
      </div>
   );
};

export default Wrapper;
