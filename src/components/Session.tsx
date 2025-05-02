import { FC } from 'react';
import { ActiveSession } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Device from '@/components/Device';
import { Loader2, Map, X } from 'lucide-react';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { REQUESTS } from '../api';
import { toast } from 'sonner';
import { ApiException } from '../exceptions';

interface SessionProps {
   session: ActiveSession;
   deletable?: boolean;
   onSessionDelete?: (_: string[]) => void;
}

const Session: FC<SessionProps> = ({ session: { createdAt, metadata, sid }, deletable, onSessionDelete }) => {
   const mutation = useMutation({
      mutationFn: REQUESTS.DELETE_SESSIONS,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess() {
         toast.success('Session terminated');
         if (onSessionDelete) {
            onSessionDelete([sid]);
         }
      }
   });
   const handleTerminate = () => {
      mutation.mutate([sid]);
   };

   return (
      <Card className="p-4 rounded-sm text-sm shadow-none flex-row gap-0 relative">
         <Device device={metadata.device.device} />
         <div className="grow">
            <CardHeader className="gap-0.5">
               <CardTitle>
                  {metadata.device.client}, {metadata.device.os}
               </CardTitle>
               <CardDescription>Logged in: {new Date(createdAt).toLocaleString('ru-RU')}</CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
               <p>
                  {metadata.location.country}, {metadata.location.city}
               </p>
               <p className="flex items-center gap-2">
                  {metadata.ip}
                  {metadata.location.latitude && metadata.location.longitude && (
                     <a
                        href={`http://maps.google.com/maps?q=${metadata.location.latitude},${metadata.location.longitude}&ll=${metadata.location.latitude},${metadata.location.longitude}&z=17`}
                        target="_blank"
                     >
                        <Map size={18} className="text-gray-900 cursor-pointer hover:text-gray-600 transition-colors" />
                     </a>
                  )}
               </p>
            </CardContent>
         </div>
         {deletable && (
            <Button
               size="sm"
               variant="ghost"
               className="absolute top-1.5 right-1"
               disabled={mutation.isPending}
               onClick={handleTerminate}
            >
               {mutation.isPending ? <Loader2 className="animate-spin" /> : <X />}
            </Button>
         )}
      </Card>
   );
};

export default Session;
