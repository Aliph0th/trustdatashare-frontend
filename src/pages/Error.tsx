import { CircleX } from 'lucide-react';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ErrorProps {
   allowedHome?: boolean;
   text?: string;
}

const Error: FC<ErrorProps> = ({ allowedHome = true, text = 'Some error occurred' }) => {
   return (
      <div className="flex justify-center items-center h-full flex-col">
         <CircleX size={130} className="text-red-600" />
         <h1 className="text-5xl text-red-600 font-bold text-center mb-3">{text}</h1>
         {allowedHome && (
            <NavLink to="/" className="underline hover:text-blue-700">
               <Button className="mt-4">Go to Homepage</Button>
            </NavLink>
         )}
      </div>
   );
};

export default Error;
