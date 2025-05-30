import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../api';
import { Button } from '../components/ui/button';
import { useUser } from '../hooks/useUser';
import { verifySchema } from '../validation';
import { ApiException } from '../exceptions';
import { useEffect } from 'react';

const Verify = () => {
   const { token } = useParams();
   const { user, setUser, verificationCooldown, setVerificationCooldown } = useUser();

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
      onSuccess(data) {
         toast.success('Mail has been sent. Check your inbox or spam');
         setVerificationCooldown(data.cooldown);
      }
   });

   useEffect(() => {
      if (token) {
         verifyMutation.mutate({ token });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [token]);

   function onSubmit(data: z.infer<typeof verifySchema>) {
      verifyMutation.mutate(data);
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
                     <FormItem className="lg:w-4/12 sm:w-8/12 w-11/12">
                        <FormLabel required>Code</FormLabel>
                        <FormControl>
                           <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button
                  type="submit"
                  className="lg:w-4/12 sm:w-8/12 w-11/12"
                  disabled={verifyMutation.isPending || resendMutation.isPending}
               >
                  {verifyMutation.isPending && <Loader2 className="animate-spin" />}
                  Verify
               </Button>
               <div className="flex flex-col items-center w-full">
                  <Button
                     type="button"
                     variant="outline"
                     className="lg:w-4/12 sm:w-8/12 w-11/12"
                     onClick={resendHandle}
                     disabled={verifyMutation.isPending || resendMutation.isPending || verificationCooldown > 0}
                  >
                     {resendMutation.isPending && <Loader2 className="animate-spin" />}
                     Resend
                  </Button>
                  {verificationCooldown > 0 && (
                     <p className="text-sm text-gray-500">You can try again in {verificationCooldown} seconds</p>
                  )}
               </div>
            </form>
         </Form>
      </>
   );
};

export default Verify;
