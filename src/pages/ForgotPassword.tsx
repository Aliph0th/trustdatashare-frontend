import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../api';
import { Button } from '../components/ui/button';
import { ApiException } from '../exceptions';
import { emailSchema } from '../validation';
import { useUser } from '../hooks/useUser';

const ForgotPassword = () => {
   const { forgotPasswordCooldown, setForgotPasswordCooldown } = useUser();
   const form = useForm<z.infer<typeof emailSchema>>({
      resolver: zodResolver(emailSchema),
      defaultValues: {
         email: ''
      }
   });

   const mutation = useMutation({
      mutationFn: REQUESTS.RESET_PASSWORD,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess(data) {
         toast.success('If the email is registered, you will receive a confirmation code to your email address', {
            duration: 5000
         });
         setForgotPasswordCooldown(data.cooldown);
      }
   });

   function onSubmit(data: z.infer<typeof emailSchema>) {
      mutation.mutate(data.email);
   }

   return (
      <>
         <h2 className="text-center text-lg mb-3 font-semibold">Enter your email address to recover your password</h2>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4 h-full">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem className="w-4/12">
                        <FormLabel required>Email</FormLabel>
                        <FormControl>
                           <Input placeholder="example@example.com" {...field} />
                        </FormControl>
                        <FormDescription>We will send you a confirmation code to this email address</FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" className="w-4/12" disabled={mutation.isPending || forgotPasswordCooldown > 0}>
                  {mutation.isPending && <Loader2 className="animate-spin" />}
                  Send code
               </Button>
               {forgotPasswordCooldown > 0 && (
                  <p className="text-sm text-gray-500">You can try again in {forgotPasswordCooldown} seconds</p>
               )}
            </form>
         </Form>
      </>
   );
};

export default ForgotPassword;
