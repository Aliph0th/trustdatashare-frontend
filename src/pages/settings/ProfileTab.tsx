import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../../api';
import { ApiException } from '../../exceptions';
import { useUser } from '../../hooks/useUser';
import { patchUserSchema } from '../../validation';
import ChangeAvatar from './ChangeAvatar';

const ProfileTab = () => {
   const { user, setUser } = useUser();
   const [isEditing, setIsEditing] = useState(false);

   const form = useForm<z.infer<typeof patchUserSchema>>({
      resolver: zodResolver(patchUserSchema),
      defaultValues: {
         username: user.username
      }
   });

   const mutation = useMutation({
      mutationFn: REQUESTS.PATCH_USER,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess(data) {
         if (!data) {
            toast.error('Failed to update your profile');
            return;
         }
         toast.success('Profile was updated successfully');
         setUser({ ...user, ...data });
         setIsEditing(false);
         form.reset({ password: '', repeatedPassword: '', username: user.username });
      }
   });

   function onSubmit(data: z.infer<typeof patchUserSchema>) {
      if (data.password === '') {
         delete data.password;
      }
      if (data.repeatedPassword === '') {
         delete data.repeatedPassword;
      }
      if (data.username === user.username) {
         delete data.username;
      }
      mutation.mutate(data);
   }

   const handleCancelEditing = () => {
      setIsEditing(false);
      form.setValue('username', user.username, { shouldDirty: true });
   };

   return (
      <>
         <ChangeAvatar username={user.username} avatar={user.avatar} />
         <CardContent className="space-y-2">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2.5 h-full">
                  <FormItem>
                     <div className="flex gap-2">
                        <FormLabel className="text-md">Email</FormLabel>
                        <span>{user.email}</span>
                     </div>
                     {!user.isEmailVerified && (
                        <NavLink
                           to="/verify"
                           className="block bg-yellow-400 hover:bg-yellow-500 rounded-lg py-2 px-3.5"
                        >
                           Verify email
                        </NavLink>
                     )}
                  </FormItem>
                  <FormField
                     control={form.control}
                     name="username"
                     render={({ field }) => (
                        <FormItem className="flex">
                           <FormLabel className="text-md">Username</FormLabel>
                           <FormControl>
                              {isEditing ? (
                                 <div className="flex gap-2 w-full">
                                    <Input {...field} />
                                    <Button type="button" variant="outline" onClick={handleCancelEditing}>
                                       <X />
                                    </Button>
                                 </div>
                              ) : (
                                 <span className="flex items-center gap-1 h-[36px]">
                                    {user.username}
                                    <Button size="sm" type="button" variant="ghost" onClick={() => setIsEditing(true)}>
                                       <Pencil />
                                    </Button>
                                 </span>
                              )}
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem className="mt-6">
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input type="password" {...field} value={field.value || ''} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="repeatedPassword"
                     render={({ field }) => (
                        <FormItem className="">
                           <FormLabel>Repeat password</FormLabel>
                           <FormControl>
                              <Input type="password" {...field} value={field.value || ''} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit" className="w-4/12" disabled={!form.formState.isDirty || mutation.isPending}>
                     {mutation.isPending && <Loader2 className="animate-spin" />}
                     Apply
                  </Button>
               </form>
            </Form>
         </CardContent>
      </>
   );
};

export default ProfileTab;
