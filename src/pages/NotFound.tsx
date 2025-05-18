import { SearchX } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
   return (
      <div className="flex justify-center items-center h-full flex-col">
         <SearchX size={130} />
         <h1 className="text-5xl font-bold text-center mb-3">Not found</h1>
         <NavLink to="/" className="underline hover:text-blue-700">
            <Button className="mt-4">Go to Homepage</Button>
         </NavLink>
      </div>
   );
};

export default NotFound;
