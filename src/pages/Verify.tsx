import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../api';
import { Button } from '../components/ui/button';
import { useUser } from '../hooks/useUser';
import { verifySchema } from '../validation';
import { ApiException } from '../exceptions';

const Verify = () => {
   const { user, setUser } = useUser();

   const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: {
         token: ''
      }
   });

   const verifyMutation = useMutation({
      mutationFn: REQUESTS.VERIFY,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess() {
         setUser({ ...user!, isEmailVerified: true });
         toast.success('Email is verified');
      }
   });

   const resendMutation = useMutation({
      mutationFn: REQUESTS.RESEND,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess() {
         toast.success('Mail has been sent. Check your inbox or spam');
      }
   });

   function onSubmit(data: z.infer<typeof verifySchema>) {
      verifyMutation.mutate({ data });
   }
   const resendHandle = () => {
      resendMutation.mutate();
   };

   if (user && user.isEmailVerified) {
      return <Navigate to="/" replace />;
   }
   return (
      <>
         <h2 className="text-center text-lg mb-3 font-semibold">
            Enter code from email below or click on the link in email we sent to <i>{user?.email}</i>
         </h2>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4 h-full">
               <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                     <FormItem className="w-4/12">
                        <FormLabel required>Code</FormLabel>
                        <FormControl>
                           <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="w-4/12" disabled={verifyMutation.isPending || resendMutation.isPending}>
                  {verifyMutation.isPending && <Loader2 className="animate-spin" />}
                  Verify
               </Button>
               <Button
                  type="button"
                  variant="outline"
                  className="w-4/12"
                  onClick={resendHandle}
                  disabled={verifyMutation.isPending || resendMutation.isPending}
               >
                  {resendMutation.isPending && <Loader2 className="animate-spin" />}
                  Resend
               </Button>
            </form>
         </Form>
      </>
   );
};

export default Verify;
