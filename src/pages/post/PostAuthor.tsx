import { CircleUserRound, Edit2, EyeOff, User } from 'lucide-react';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Data } from '../../types';

interface PostAuthorProps {
   isOwnerHidden?: boolean;
   owner?: Data['owner'];
   id: string;
   isYours: boolean;
}

const PostAuthor: FC<PostAuthorProps> = ({ isOwnerHidden, owner, id, isYours }) => {
   return (
      <p className="flex items-center gap-2.5">
         by
         <span className="flex items-center">
            {isOwnerHidden ? (
               <>
                  <EyeOff size={20} />
                  &nbsp;Anonymous
                  {isYours && <>&nbsp;(your post)</>}
               </>
            ) : (
               <>
                  {owner ? (
                     <NavLink to={`/user/${owner.id}`} className="hover:underline flex items-center">
                        <User size={20} />
                        &nbsp;
                        {owner.username}
                     </NavLink>
                  ) : (
                     <>
                        <CircleUserRound size={20} />
                        &nbsp;Guest
                     </>
                  )}
               </>
            )}
         </span>
         {isYours && (
            <NavLink to={`/post/${id}/edit`}>
               <Edit2 size={15} />
            </NavLink>
         )}
      </p>
   );
};

export default PostAuthor;
