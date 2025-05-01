import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import ProfileTab from './ProfileTab';

const Settings = () => {
   const { isUserLoading } = useUser();

   if (isUserLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
         </div>
      );
   }
   return (
      <div className="h-full flex justify-center">
         <Tabs defaultValue="profile" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="profile">Profile</TabsTrigger>
               <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
               <ProfileTab />
            </TabsContent>
            <TabsContent value="sessions"></TabsContent>
         </Tabs>
      </div>
   );
};

export default Settings;
