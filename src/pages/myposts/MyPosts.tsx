import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { REQUESTS } from '../../api';
import { QUERY_KEYS } from '../../constants';
import { MyPostsResponse } from '../../types';
import PostItem from './PostItem';

const MyPosts = () => {
   const queryClient = useQueryClient();
   const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
      queryKey: [QUERY_KEYS.POSTS],
      staleTime: 10000,
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
   const onPostDelete = useCallback(
      (id: string, index: number) => {
         const pages = data.pages.map<MyPostsResponse>((page, idx) => {
            if (index !== idx) {
               return page;
            }
            return { hasMore: page.hasMore, data: page.data.filter(post => post.id !== id) };
         });
         queryClient.setQueryData([QUERY_KEYS.POSTS], pages);
      },
      [data, queryClient]
   );

   return (
      <ScrollArea className="w-full px-10">
         <div className="flex w-full flex-col items-center gap-3">
            {data.pages.map((page, index) =>
               page.data.map(post => (
                  <PostItem
                     key={post.id}
                     post={post}
                     index={data.pageParams[index] as number}
                     onPostDelete={onPostDelete}
                  />
               ))
            )}
            <InfiniteScroll hasMore={hasNextPage} isLoading={isLoading} next={fetchNextPage} threshold={1}>
               {hasNextPage && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
            </InfiniteScroll>
         </div>
      </ScrollArea>
   );
};

export default MyPosts;
