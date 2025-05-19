import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMutation } from '@tanstack/react-query';
import { Check, CircleHelp, Upload, X } from 'lucide-react';
import { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useRef, useState } from 'react';
import { toast } from 'sonner';
import { REQUESTS } from '../../api';
import { Input } from '../../components/ui/input';
import { ApiException } from '../../exceptions';
import { titleInitials } from '../../lib/utils';
import { User } from '../../types';

interface ChangeAvatarProps {
   user?: User;
   setUser?: Dispatch<SetStateAction<User>>;
}

const ChangeAvatar: FC<ChangeAvatarProps> = ({ user, setUser }) => {
   const hiddenInputRef = useRef<HTMLInputElement>();
   const [preview, setPreview] = useState<string>();

   const mutation = useMutation({
      mutationFn: REQUESTS.CHANGE_AVATAR,
      onError(error: ApiException) {
         toast.error(error.message);
      },
      onSuccess(data) {
         if (!data) {
            toast.error('Failed to change avatar');
            return;
         }
         setUser({ ...user, avatar: data.url });
         cancelHandle();
         toast.success('Avatar changed successfully');
      }
   });

   const changeHandle = () => {
      if (hiddenInputRef.current) {
         hiddenInputRef.current.click();
      }
   };
   const cancelHandle = () => {
      setPreview(null);
      if (hiddenInputRef.current) {
         hiddenInputRef.current.value = '';
      }
   };
   const inputChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files[0];
      const urlImage = URL.createObjectURL(file);
      setPreview(urlImage);
   };
   const submitHandle = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutation.mutate(new FormData(e.currentTarget));
   };

   return (
      <CardHeader className="flex justify-between">
         <div className="flex flex-col gap-2">
            <Avatar className="pointer-events-none select-none w-[100px] h-[100px]">
               <AvatarImage src={preview || user?.avatar} className="w-full h-full" />
               <AvatarFallback className="bg-linear-to-t text-3xl from-cyan-500 to-blue-500">
                  {titleInitials(user.username || '')}
               </AvatarFallback>
            </Avatar>
            <form onSubmit={submitHandle} className="flex gap-2 items-center">
               <Input type="file" name="file" ref={hiddenInputRef} onChange={inputChangeHandle} hidden />
               <Button variant="outline" disabled={!!preview} type="button" onClick={changeHandle}>
                  <Upload /> Change
               </Button>
               {preview && (
                  <>
                     <Button variant="default" type="submit" size="sm">
                        <Check />
                     </Button>
                     <Button variant="outline" type="button" size="sm" onClick={cancelHandle}>
                        <X />
                     </Button>
                  </>
               )}
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger type="button">
                        <CircleHelp size={18} className="text-gray-500" />
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>Only PNG or JPEG with size less than 1mb is acceptable</p>
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </form>
         </div>
      </CardHeader>
   );
};

export default ChangeAvatar;
