import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/FloatingInput';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createDataSchema } from '../validation/create-data.schema';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXPIRATION_OPTIONS } from '../constants';

const Main = () => {
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
               <FormField
                  control={form.control}
                  name="hideOwner"
                  render={({ field }) => (
                     <FormItem className="flex">
                        <FormLabel className="font-normal">Hide owner</FormLabel>
                        <FormControl>
                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="ttl"
                  render={({ field }) => (
                     <FormItem className="flex">
                        <FormLabel className="font-normal">Expiration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="Select expiration" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {EXPIRATION_OPTIONS.map(option => (
                                 <SelectItem value={option.value.toString()} key={option.value}>
                                    {option.title}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
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
