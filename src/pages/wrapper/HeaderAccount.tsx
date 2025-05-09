import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { NavLink } from 'react-router-dom';
import { titleInitials } from '../../lib/utils';
import { useUser } from '../../hooks/useUser';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { REQUESTS } from '../../api';
import { LogOut } from 'lucide-react';
import { ApiException } from '../../exceptions';
import { QUERY_KEYS } from '../../constants';

const HeaderAccount = () => {
   const { user, setUser } = useUser();
   const queryClient = useQueryClient();

   const mutation = useMutation({
      mutationFn: REQUESTS.LOGOUT,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess() {
         setUser(null);
         toast.info('Logged out', { icon: <LogOut size={20} /> });
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      }
   });

   const handleLogout = () => {
      mutation.mutate();
   };

   return (
      <>
         {user ? (
            <>
               <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full focus-visible:ring-3 ring-black">
                     <Avatar className="pointer-events-none select-none">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-sm bg-linear-to-t from-cyan-500 to-blue-500">
                           {titleInitials(user?.username || '')}
                        </AvatarFallback>
                     </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                     <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     {!user?.isEmailVerified && (
                        <>
                           <DropdownMenuItem asChild className="bg-yellow-400 hover:bg-yellow-500!">
                              <NavLink to="/verify" className="w-full">
                                 Verify email
                              </NavLink>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                        </>
                     )}
                     <DropdownMenuItem asChild>
                        <NavLink to="/my" className={({ isActive }) => `${isActive ? 'font-bold' : ''} w-full`}>
                           My posts
                        </NavLink>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <NavLink to="/settings" className={({ isActive }) => `${isActive ? 'font-bold' : ''} w-full`}>
                           Settings
                        </NavLink>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="p-0">
                        <Button
                           onClick={handleLogout}
                           variant="destructive"
                           size="sm"
                           className="w-full hover:bg-red-700"
                        >
                           Logout
                        </Button>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </>
         ) : (
            <>
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
            </>
         )}
      </>
   );
};

export default HeaderAccount;
