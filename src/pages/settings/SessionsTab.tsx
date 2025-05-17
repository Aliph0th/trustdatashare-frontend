import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { REQUESTS } from '../../api';
import { QUERY_KEYS } from '../../constants';
import { useCallback } from 'react';
import { Sessions } from '../../types';
import Session from './Session';

const SessionsTab = () => {
   const queryClient = useQueryClient();
   const { data, isLoading } = useQuery({
      queryKey: [QUERY_KEYS.SESSIONS, QUERY_KEYS.USER],
      queryFn: REQUESTS.GET_SESSIONS,
      staleTime: 30000
   });

   const onSessionDelete = useCallback(
      (id: string) => {
         const sessions: Sessions = {
            current: data.current,
            sessions: data.sessions.filter(session => session.sid !== id)
         };
         queryClient.setQueryData([QUERY_KEYS.SESSIONS, QUERY_KEYS.USER], sessions);
      },
      [data, queryClient]
   );

   if (isLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
         </div>
      );
   }
   return (
      <>
         <CardHeader>
            <CardTitle className="text-lg">Your active sessions</CardTitle>
         </CardHeader>
         <CardContent className="space-y-1">
            <div>
               <p className="text-gray-800">Current session</p>
               <Session session={data.current} />
            </div>
            <div className="mt-4">
               <p className="text-gray-800">Other sessions</p>
               {data?.sessions?.length ? (
                  <div>
                     {data.sessions.map(session => (
                        <Session key={session.sid} session={session} onSessionDelete={onSessionDelete} deletable />
                     ))}
                  </div>
               ) : (
                  <span className="block text-center text-gray-500 text-sm">You don't have any other sessions.</span>
               )}
            </div>
         </CardContent>
      </>
   );
};

export default SessionsTab;
