import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { REQUESTS } from '../api';
import PostItem from '../components/PostItem';
import { QUERY_KEYS } from '../constants';
import { Navigate, useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { titleInitials } from '../lib/utils';
import { useUser } from '../hooks/useUser';

const UserPosts = () => {
   const { id } = useParams();
   const { user: loggedInUser, isUserLoading: isLoggedInUserLoading } = useUser();
   const { data: user, isLoading: isUserLoading } = useQuery({
      queryKey: [QUERY_KEYS.USER, id],
      queryFn: () => REQUESTS.GET_USER(+id),
      enabled: !!id && +id !== loggedInUser?.id && !isLoggedInUserLoading,
      retry: false
   });
   const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
      queryKey: [QUERY_KEYS.USER_POSTS],
      staleTime: 30000,
      queryFn: ({ pageParam }: { pageParam: number }) => REQUESTS.GET_USER_POSTS(+id, { page: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
         if (!lastPage.hasMore) {
            return null;
         }
         return lastPageParam + 1;
      },
      enabled: !!user,
      placeholderData: {
         pages: [],
         pageParams: []
      }
   });

   if (+id === loggedInUser?.id) {
      return <Navigate to="/my" replace />;
   }
   if (isUserLoading || isLoggedInUserLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
         </div>
      );
   }
   if (!user) {
      return <NotFound />;
   }
   return (
      <>
         <div className="flex sm:px-10 px-3 gap-2 items-center mb-4">
            <Avatar className="pointer-events-none select-none w-[50px] h-[50px]">
               <AvatarImage src={user.avatar} />
               <AvatarFallback className="bg-linear-to-t text-2xl from-cyan-500 to-blue-500">
                  {titleInitials(user.username || '')}
               </AvatarFallback>
            </Avatar>
            <p className="text-lg font-semibold">{user.username}</p>
         </div>
         <ScrollArea className="w-full sm:px-10 px-3">
            <div className="flex w-full flex-col items-center gap-3">
               {data.pages?.length === 1 && data.pages?.[0]?.data?.length === 0 ? (
                  <p className="text-gray-500 text-center">No visible posts found.</p>
               ) : (
                  <>
                     {data.pages.map(page => page.data.map(post => <PostItem key={post.id} post={post} />))}
                     <InfiniteScroll hasMore={hasNextPage} isLoading={isLoading} next={fetchNextPage} threshold={1}>
                        {hasNextPage && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
                     </InfiniteScroll>
                  </>
               )}
            </div>
         </ScrollArea>
      </>
   );
};

export default UserPosts;
