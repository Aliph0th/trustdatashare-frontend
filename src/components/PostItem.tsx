import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeOff, Loader2, Lock, Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { REQUESTS } from '../api';
import { ApiException } from '../exceptions';
import { truncateText } from '../lib/utils';
import { ReducedData } from '../types';

interface PostItemProps {
   post: ReducedData;
   index?: number;
   onPostDelete?: (_: string, __: number) => void;
   controls?: boolean;
}

const PostItem: FC<PostItemProps> = ({ post, onPostDelete, index, controls }) => {
   const mutation = useMutation({
      mutationFn: REQUESTS.DELETE_DATA,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess(data) {
         if (!data) {
            toast.error('Failed to delete post');
            return;
         }
         toast.success('Post was deleted');
         if (onPostDelete) {
            onPostDelete(post.id, index);
         }
      }
   });

   const handleDelete = () => {
      mutation.mutate(post.id);
   };

   return (
      <Card className="w-full pb-3.5 shadow-none border-2">
         <CardHeader className="gap-0.5">
            <div className="flex justify-between items-center">
               <div>
                  <CardTitle className={`${post.title ? '' : 'italic'} flex gap-1.5 hover:underline`}>
                     <NavLink to={`/post/${post.id}`}>{post.title || 'Untitled post'}</NavLink>
                     {!post.isPublic && <Lock className="text-gray-400" size={14} />}
                     {post.isOwnerHidden && <EyeOff className="text-gray-400" size={14} />}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                     Created at: {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                  <CardDescription className="mt-2 text-gray-700">
                     {truncateText(post.description || '')}
                  </CardDescription>
               </div>
               {controls && (
                  <div>
                     <Button size="sm" variant="outline" className="mr-2" disabled={mutation.isPending}>
                        <Pencil />
                     </Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button size="sm" variant="outline" disabled={mutation.isPending}>
                              {mutation.isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                 This action cannot be undone. This will permanently delete your account and remove your
                                 data from our servers.
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction variant="destructive" onClick={handleDelete}>
                                 Yes, delete
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  </div>
               )}
            </div>
         </CardHeader>
      </Card>
   );
};

export default PostItem;
