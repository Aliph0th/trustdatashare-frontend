import CopyToClipboard from '@/components/CopyToClipboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingLabelInput } from '@/components/ui/FloatingInput';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { REQUESTS } from '../../api';
import { EXPIRATION_OPTIONS, QUERY_KEYS } from '../../constants';
import { ApiException } from '../../exceptions';
import { useUser } from '../../hooks/useUser';
import { Data } from '../../types';
import { editDataSchema } from '../../validation';
import { getChangedValues } from '../../lib/getChangedValues';
import NotFound from '../NotFound';

const EditPost = () => {
   const { id } = useParams<{ id: string }>();
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const { user, isUserLoading } = useUser();

   const { data: post, isLoading: isPostLoading } = useQuery<Data>({
      queryKey: [QUERY_KEYS.EDIT_POST, id],
      queryFn: () => REQUESTS.GET_POST_FOR_EDIT(id),
      enabled: !!id,
      retry: false,
      staleTime: 30000
   });

   const form = useForm<z.infer<typeof editDataSchema>>({
      resolver: zodResolver(editDataSchema),
      defaultValues: {
         ttl: -1,
         isOwnerHidden: false,
         password: null
      }
   });
   useEffect(() => {
      if (post) {
         form.reset({
            title: post.title,
            content: post.content,
            description: post.description,
            isOwnerHidden: post.isOwnerHidden,
            ttl: post.ttl,
            password: form.getValues('password')
         });
      }
   }, [post, form]);

   const mutation = useMutation({
      mutationFn: REQUESTS.PATCH_POST,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess(data) {
         if (!data) {
            toast.error('Failed to update post');
            return;
         }
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DATA, id] });
         toast.success('Post updated successfully', {
            action: (
               <div className="flex items-center gap-2">
                  <Button
                     variant="outline"
                     size="sm"
                     className="text-sm text-black"
                     onClick={() => navigate(`/post/${id}`)}
                  >
                     View
                  </Button>
                  <CopyToClipboard text={`${window.location.origin}/post/${id}`} />
               </div>
            ),
            classNames: {
               content: 'grow'
            }
         });
      }
   });

   const handleRemovePassword = () => {
      queryClient.setQueryData([QUERY_KEYS.EDIT_POST, id], { ...post, isPublic: true });
      form.setValue('password', '');
   };

   function onSubmit(data: z.infer<typeof editDataSchema>) {
      const changedData = getChangedValues(post, data);
      if (Object.keys(changedData).length === 0) {
         toast.info('No changes were made.');
         return;
      }

      mutation.mutate({ id, data: changedData });
   }

   const onFieldChange = (field: keyof z.infer<typeof editDataSchema>, value: string) => {
      const newValue = !post.isPublic && value === '' ? null : value;
      form.setValue(field, newValue);
   };

   if (isUserLoading || isPostLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
         </div>
      );
   }

   if (!post && !isPostLoading) {
      return <NotFound />;
   }

   return (
      <Form {...form}>
         <h1 className="text-2xl font-semibold mb-4 text-center">Edit post</h1>
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
                        <FloatingLabelInput
                           label="Title"
                           {...field}
                           onChange={e => onFieldChange('title', e.target.value)}
                           value={field.value || ''}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button type="submit" disabled={mutation.isPending}>
               {mutation.isPending && <Loader2 className="animate-spin" />}
               Save Changes
            </Button>
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
                           <Textarea
                              placeholder="Description"
                              className="h-fit"
                              {...field}
                              onChange={e => onFieldChange('description', e.target.value)}
                              value={field.value || ''}
                           />
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
                           <Input
                              placeholder={post.isPublic ? 'Password' : 'New password'}
                              type="password"
                              {...field}
                              onChange={e => onFieldChange('password', e.target.value)}
                              value={field.value || ''}
                           />
                        </FormControl>
                        {!post.isPublic && (
                           <FormDescription>
                              Leave blank to keep current password or&nbsp;
                              <Popover>
                                 <PopoverTrigger>
                                    <Badge
                                       variant="outline"
                                       className="px-1 py-0 h-fit text-gray-500 hover:text-gray-800 text-[0.8rem]"
                                    >
                                       remove it
                                    </Badge>
                                 </PopoverTrigger>
                                 <PopoverContent>
                                    <p className="text-[0.8rem]">
                                       <Badge className="text-orange-700 bg-orange-200/70 border border-orange-300">
                                          <TriangleAlert />
                                          Warning
                                       </Badge>
                                       &nbsp;Anyone will be able to view this post without a password until you set a
                                       new one
                                    </p>
                                    <Button
                                       type="button"
                                       variant="destructive"
                                       className="w-full text-[0.8rem]"
                                       size="sm"
                                       onClick={handleRemovePassword}
                                    >
                                       Remove password
                                    </Button>
                                 </PopoverContent>
                              </Popover>
                           </FormDescription>
                        )}
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="flex gap-4 items-center">
                  <FormField
                     control={form.control}
                     name="isOwnerHidden"
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
               </div>
               <FormField
                  control={form.control}
                  name="ttl"
                  render={({ field }) => (
                     <FormItem>
                        <div className="flex gap-4">
                           <FormLabel className="font-normal">Expiration</FormLabel>
                           <Select
                              onValueChange={value => field.onChange(+value)}
                              value={EXPIRATION_OPTIONS.find(o => o.value === field.value)?.value.toString() || ''}
                           >
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
                        </div>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>
         </form>
      </Form>
   );
};

export default EditPost;
