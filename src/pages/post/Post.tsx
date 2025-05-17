import PostAuthor from '@/pages/post/PostAuthor';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { REQUESTS } from '../../api';
import { QUERY_KEYS } from '../../constants';
import { ApiException } from '../../exceptions';
import { formatSeconds, getExpiration } from '../../lib/utils';
import { Data } from '../../types';
import { confirmPasswordSchema } from '../../validation';
import NotFound from '../NotFound';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

const Post = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const form = useForm<z.infer<typeof confirmPasswordSchema>>({
      resolver: zodResolver(confirmPasswordSchema),
      defaultValues: {
         password: ''
      }
   });
   const [expiration, setExpiration] = useState(-1);

   const { data, isLoading, refetch, error } = useQuery<Data, ApiException>({
      queryKey: [QUERY_KEYS.DATA, id],
      queryFn: () => REQUESTS.GET_POST({ id, password: form.getValues().password }),
      enabled: !!id,
      retry: false,
      staleTime: 30000
   });

   useEffect(() => {
      if (data?.ttl > 0) {
         setExpiration(getExpiration(data.createdAt, data.ttl));
         const interval = setInterval(() => {
            setExpiration(prev => prev - 1);
         }, 1000);
         return () => clearInterval(interval);
      }
   }, [data]);

   useEffect(() => {
      if (expiration === 0) {
         navigate('/', { replace: true });
         toast.info('Post has expired');
      }
   }, [expiration, navigate]);

   function onSubmit() {
      refetch();
   }
   if (isLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
         </div>
      );
   }
   if (error?.code === 401) {
      toast.error(error.message);
      return (
         <>
            <span className="text-center text-lg mb-3 font-semibold">Confirm the password to access to this post</span>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-4 h-full">
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem className="w-4/12">
                           <FormLabel required>Password</FormLabel>
                           <FormControl>
                              <Input type="password" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit" className="w-4/12" disabled={isLoading}>
                     {isLoading && <Loader2 className="animate-spin" />}
                     Confirm
                  </Button>
               </form>
            </Form>
         </>
      );
   }
   if (error?.code === 404) {
      return <NotFound />;
   }
   return (
      <div className="flex flex-col gap-5">
         <div>
            <h2 className={`${data?.title ? '' : 'italic'} text-4xl font-bold flex gap-2`}>
               {data?.title || 'Untitled post'}
               {!data?.isPublic && <Lock size={16} className="text-gray-500 inline mt-1" />}
            </h2>
            <div className="text-gray-500/90">
               <PostAuthor isOwnerHidden={data?.isOwnerHidden} owner={data?.owner} />
               <p>Created at: {data.createdAt.toLocaleString('ru-RU')}</p>
               {data.createdAt.getTime() !== data.updatedAt.getTime() && (
                  <p>Edited: {data.updatedAt.toLocaleString('ru-RU')}</p>
               )}
               {data.ttl > 0 && <p>Expires in: {formatSeconds(expiration)}</p>}
            </div>
         </div>
         {data?.description && <p className="text-gray-900">{data.description}</p>}
         <p className="mt-5">{data.content}</p>
      </div>
   );
};

export default Post;
