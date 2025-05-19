import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../../api';
import { ApiException } from '../../exceptions';
import { useDebounce } from '../../hooks/useDebounce';
import { useUser } from '../../hooks/useUser';
import { fetchAvailability } from '../../lib/utils';
import { signupSchema } from '../../validation';

const Signup = () => {
   const { setUser } = useUser();
   const navigate = useNavigate();
   const form = useForm<z.infer<typeof signupSchema>>({
      resolver: zodResolver(signupSchema),
      defaultValues: {
         username: '',
         email: '',
         password: '',
         repeatedPassword: ''
      }
   });

   const debouncedUsername = useDebounce(form.watch('username'), 900);
   const debouncedEmail = useDebounce(form.watch('email'), 900);
   useEffect(() => {
      fetchAvailability('username', debouncedUsername, form.setError, form.clearErrors);
   }, [debouncedUsername, form]);
   useEffect(() => {
      fetchAvailability('email', debouncedEmail, form.setError, form.clearErrors);
   }, [debouncedEmail, form]);

   const mutation = useMutation({
      mutationFn: REQUESTS.SIGN_UP,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess(data) {
         if (!data) {
            toast.error('Failed to register');
            return;
         }
         setUser(data);
         toast.success('Successfully registered. Verify your email now');
         navigate('/verify', { replace: true });
      }
   });

   function onSubmit(data: z.infer<typeof signupSchema>) {
      mutation.mutate(data);
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5 h-full">
            <FormField
               control={form.control}
               name="username"
               render={({ field }) => (
                  <FormItem className="lg:w-4/12 sm:w-8/12 w-11/12">
                     <FormLabel required>Username</FormLabel>
                     <FormControl>
                        <Input placeholder="John Smith" {...field} />
                     </FormControl>
                     <FormMessage className="first-letter:capitalize" />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem className="lg:w-4/12 sm:w-8/12 w-11/12">
                     <FormLabel required>Email</FormLabel>
                     <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                     </FormControl>
                     <FormDescription>We'll send a verification code to it</FormDescription>
                     <FormMessage className="first-letter:capitalize" />
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
                     <FormDescription>Password should contain at least 8 characters</FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="repeatedPassword"
               render={({ field }) => (
                  <FormItem className="lg:w-4/12 sm:w-8/12 w-11/12">
                     <FormLabel required>Repeat password</FormLabel>
                     <FormControl>
                        <Input type="password" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" className="lg:w-4/12 sm:w-8/12 w-11/12" disabled={mutation.isPending}>
               {mutation.isPending && <Loader2 className="animate-spin" />}
               Sign up
            </Button>
         </form>
      </Form>
   );
};

export default Signup;
