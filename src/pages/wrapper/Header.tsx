import { NavLink } from 'react-router-dom';

const Header = () => {
   return (
      <header>
         <div className="flex flex-wrap items-center justify-between mx-auto p-4 w-full border-b border-gray-300">
            <h2 className="font-bold text-lg">
               <NavLink to="/">Trust Data Share</NavLink>
            </h2>
            <div className="flex gap-2">
               <NavLink
                  to="/login"
                  className={({ isActive }) => `${isActive ? 'text-black font-bold' : 'text-blue-800 hover:underline'}`}
               >
                  Login
               </NavLink>
               <NavLink
                  to="/signup"
                  className={({ isActive }) => `${isActive ? 'text-black font-bold' : 'text-blue-800 hover:underline'}`}
               >
                  Sign up
               </NavLink>
            </div>
         </div>
      </header>
   );
};

export default Header;
