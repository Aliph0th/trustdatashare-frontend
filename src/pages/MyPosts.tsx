import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { REQUESTS } from '../api';
import { QUERY_KEYS } from '../constants';
import { PostsResponse } from '../types';
import { NavLink } from 'react-router-dom';
import PostItem from '../components/PostItem';

const MyPosts = () => {
   const queryClient = useQueryClient();
   const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
      queryKey: [QUERY_KEYS.POSTS],
      queryFn: ({ pageParam }: { pageParam: number }) => REQUESTS.GET_MY_POSTS({ page: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
         if (!lastPage.hasMore) {
            return null;
         }
         return lastPageParam + 1;
      },
      placeholderData: {
         pages: [],
         pageParams: []
      }
   });

   useEffect(() => {
      return () => {
         queryClient.resetQueries({ queryKey: [QUERY_KEYS.POSTS] });
      };
   }, [queryClient]);

   const onPostDelete = useCallback(
      (id: string, index: number) => {
         const pages = data.pages.map<PostsResponse>((page, idx) => {
            if (index !== idx) {
               return page;
            }
            return { hasMore: page.hasMore, data: page.data.filter(post => post.id !== id) };
         });
         queryClient.setQueryData([QUERY_KEYS.POSTS], { pages, pageParams: data.pageParams });
      },
      [data, queryClient]
   );

   if (data.pages?.length === 1 && data.pages?.[0]?.data?.length === 0) {
      return (
         <p className="text-gray-500 text-center">
            No your posts found.{' '}
            <NavLink to="/" className="text-blue-500 hover:underline">
               Create
            </NavLink>
         </p>
      );
   }
   return (
      <>
         <p className="sm:px-10 px-2 text-2xl mb-4 font-semibold">Your posts</p>
         <ScrollArea className="w-full sm:px-10 px-2">
            <div className="flex w-full flex-col items-center gap-3">
               {data.pages.map((page, index) =>
                  page.data.map(post => (
                     <PostItem
                        key={post.id}
                        post={post}
                        index={data.pageParams[index] as number}
                        onPostDelete={onPostDelete}
                        controls
                     />
                  ))
               )}
               <InfiniteScroll hasMore={hasNextPage} isLoading={isLoading} next={fetchNextPage} threshold={1}>
                  {hasNextPage && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
               </InfiniteScroll>
            </div>
         </ScrollArea>
      </>
   );
};

export default MyPosts;
