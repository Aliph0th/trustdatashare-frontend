import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../../api';
import { useUser } from '../../hooks/useUser';
import { loginSchema } from '../../validation';
import { NavLink, useNavigate } from 'react-router-dom';
import { ApiException } from '../../exceptions';

const Login = () => {
   const navigate = useNavigate();
   const { setUser } = useUser();
   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         login: '',
         password: ''
      }
   });

   const mutation = useMutation({
      mutationFn: REQUESTS.LOGIN,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess(data) {
         if (!data) {
            toast.error('Failed to login');
            return;
         }
         setUser(data);
         navigate('/', { replace: true });
      }
   });

   function onSubmit(data: z.infer<typeof loginSchema>) {
      mutation.mutate(data);
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5 h-full">
            <FormField
               control={form.control}
               name="login"
               render={({ field }) => (
                  <FormItem className="lg:w-4/12 sm:w-8/12 w-11/12">
                     <FormLabel required>Login</FormLabel>
                     <FormControl>
                        <Input placeholder="John Smith" {...field} />
                     </FormControl>
                     <FormDescription>It can be either an email or an username</FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem className="lg:w-4/12 sm:w-8/12 w-11/12">
                     <FormLabel required>Password</FormLabel>
                     <FormControl>
                        <Input type="password" {...field} />
                     </FormControl>
                     <FormDescription>
                        <NavLink to="/forgot-password" className="text-blue-600/60 hover:text-blue-600/80">
                           I forgot my password
                        </NavLink>
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" className="lg:w-4/12 sm:w-8/12 w-11/12" disabled={mutation.isPending}>
               {mutation.isPending && <Loader2 className="animate-spin" />}
               Login
            </Button>
         </form>
      </Form>
   );
};

export default Login;
