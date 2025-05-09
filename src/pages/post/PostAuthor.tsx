import { EyeOff, User, CircleUserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Data } from '../../types';
import { FC } from 'react';

interface PostAuthorProps {
   isOwnerHidden?: boolean;
   owner?: Data['owner'];
}

const PostAuthor: FC<PostAuthorProps> = ({ isOwnerHidden, owner }) => {
   return (
      <p className="flex items-center gap-2.5">
         by
         <span className="flex items-center">
            {isOwnerHidden ? (
               <>
                  <EyeOff size={20} />
                  &nbsp;Anonymous
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
      </p>
   );
};

export default PostAuthor;
