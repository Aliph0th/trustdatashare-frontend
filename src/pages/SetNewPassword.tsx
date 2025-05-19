import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../api';
import { Button } from '@/components/ui/button';
import { ApiException } from '../exceptions';
import { resetPasswordSchema } from '../validation';
import { Badge } from '@/components/ui/badge';

const SetNewPassword = () => {
   const { token } = useParams();
   const navigate = useNavigate();

   const form = useForm<z.infer<typeof resetPasswordSchema>>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
         token: token || ''
      }
   });

   const mutation = useMutation({
      mutationFn: REQUESTS.SET_NEW_PASSWORD,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess() {
         toast.success('Password has been successfully reset');
         navigate('/login');
      }
   });

   function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
      mutation.mutate(data);
   }

   if (!token) {
      return <Navigate to="/forgot-password" replace />;
   }

   return (
      <>
         <h2 className="text-center text-lg mb-3 font-semibold">Set your new password</h2>
         <p className="text-center text-sm mb-3">
            <Badge className="text-orange-700 bg-orange-200/70 border border-orange-300">
               <TriangleAlert />
               Warning
            </Badge>
            &nbsp; Please do not share token in address line with anyone.
         </p>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4 h-full">
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem className="lg:w-4/12 sm:w-8/12 w-11/12">
                        <FormLabel required>New Password</FormLabel>
                        <FormControl>
                           <Input type="password" placeholder="Enter new password" {...field} />
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
                        <FormLabel required>Repeat Password</FormLabel>
                        <FormControl>
                           <Input type="password" placeholder="Repeat your password" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="lg:w-4/12 sm:w-8/12 w-11/12" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="animate-spin" />}
                  Reset Password
               </Button>
            </form>
         </Form>
      </>
   );
};

export default SetNewPassword;
