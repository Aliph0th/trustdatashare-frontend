import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/FloatingInput';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createDataSchema } from '../validation/create-data.schema';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXPIRATION_OPTIONS, MAX_GUEST_EXPIRATION } from '../constants';
import { useUser } from '../hooks/useUser';
import { CircleHelp, Loader2 } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const Main = () => {
   const { user, isUserLoading } = useUser();
   const form = useForm<z.infer<typeof createDataSchema>>({
      resolver: zodResolver(createDataSchema),
      defaultValues: {
         content: '',
         hideOwner: false
      }
   });

   function onSubmit(values: z.infer<typeof createDataSchema>) {
      console.log(values);
   }

   if (isUserLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
         </div>
      );
   }
   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-[3fr_1fr] grid-rows-[auto_1fr] gap-5 h-full"
         >
            <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <FloatingLabelInput label="Title" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit">Submit</Button>
            <FormField
               control={form.control}
               name="content"
               render={({ field }) => (
                  <FormItem className="h-full grid-rows-[1fr_auto]">
                     <FormControl>
                        <Textarea placeholder="Content" className="h-full resize-none" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex flex-col gap-3">
               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem className="grid-rows-[1fr_auto]">
                        <FormControl>
                           <Textarea placeholder="Description" className="h-fit" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input placeholder="Password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="flex gap-4 items-center">
                  <FormField
                     control={form.control}
                     name="hideOwner"
                     render={({ field }) => (
                        <FormItem className="flex">
                           <FormLabel className={`font-normal ${user ? '' : 'text-gray-500'}`}>Hide owner</FormLabel>
                           <FormControl>
                              <Checkbox disabled={!user} checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  {!user && (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger>
                              <CircleHelp size={18} className="text-gray-500" />
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Login or signup to enable this feature</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  )}
               </div>
               <FormField
                  control={form.control}
                  name="ttl"
                  render={({ field }) => (
                     <FormItem>
                        <div className="flex gap-4">
                           <FormLabel className="font-normal">Expiration</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                              <FormControl>
                                 <SelectTrigger>
                                    <SelectValue placeholder="Select expiration" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {EXPIRATION_OPTIONS.map(option => (
                                    <SelectItem
                                       disabled={!user && (option.value === -1 || option.value > MAX_GUEST_EXPIRATION)}
                                       value={option.value.toString()}
                                       key={option.value}
                                    >
                                       {option.title}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                        {!user && (
                           <FormDescription>
                              Your post will be automatically deleted after 1 day (or less) if you don't log in
                           </FormDescription>
                        )}
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>
         </form>
      </Form>
   );
};

export default Main;
