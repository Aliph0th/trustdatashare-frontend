import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '../../hooks/useUser';
import Session from '@/components/Session';

const SessionsTab = () => {
   const { user } = useUser();
   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-lg">Your active sessions</CardTitle>
         </CardHeader>
         <CardContent className="space-y-1">
            <div>
               <p className="text-gray-800">Current session</p>
               <Session session={user.sessions.current} />
            </div>
            <div className="mt-4">
               <p className="text-gray-800">Other sessions</p>
               {user?.sessions?.sessions?.length ? (
                  <></>
               ) : (
                  <span className="block text-center text-gray-500 text-sm">You don't have any other sessions.</span>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default SessionsTab;
