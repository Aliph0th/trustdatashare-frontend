import { NavLink } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import HeaderAccount from './HeaderAccount';
import { Loader2 } from 'lucide-react';

const Header = () => {
   const { isLoading } = useUser();
   return (
      <header>
         <div className="flex flex-wrap items-center justify-between mx-auto p-4 w-full border-b border-gray-300">
            <h2 className="font-bold text-lg">
               <NavLink to="/">Trust Data Share</NavLink>
            </h2>
            <div className="flex gap-2">{isLoading ? <Loader2 className="animate-spin" /> : <HeaderAccount />}</div>
         </div>
      </header>
   );
};

export default Header;
