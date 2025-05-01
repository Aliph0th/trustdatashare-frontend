import { CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { titleInitials } from '../../lib/utils';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { FC } from 'react';

interface ChangeAvatarProps {
   username?: string;
   avatar?: string;
}

const ChangeAvatar: FC<ChangeAvatarProps> = ({ avatar, username }) => {
   return (
      <CardHeader className="flex justify-between">
         <div className="flex flex-col gap-2">
            <Avatar className="pointer-events-none select-none w-[100px] h-[100px]">
               {/* <AvatarImage src={user?.photo_url} /> */}
               <AvatarFallback className="bg-linear-to-t text-3xl from-cyan-500 to-blue-500">
                  {titleInitials(username || '')}
               </AvatarFallback>
            </Avatar>
            <Button variant="outline">
               <Upload /> Change
            </Button>
         </div>
      </CardHeader>
   );
};

export default ChangeAvatar;
