import { FC } from 'react';
import { ActiveSession } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Device from '@/components/Device';
import { Map } from 'lucide-react';

interface SessionProps {
   session: ActiveSession;
}

const Session: FC<SessionProps> = ({ session: { createdAt, metadata } }) => {
   return (
      <Card className="p-4 rounded-sm text-sm shadow-none flex-row gap-0">
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
      </Card>
   );
};

export default Session;
// {
//   "createdAt": "2025-05-01T21:09:07.998Z",
//   "metadata": {
//     "ip": "104.174.125.138",
//     "location": {
//       "latitude": 34.0544,
//       "longitude": -118.2441,
//       "country": "United States",
//       "city": "Los Angeles"
//     },
//     "device": {
//       "client": "Chrome 135.0",
//       "os": "Windows 10.0 x64",
//       "device": "desktop"
//     }
//   }
// }
