import { useQuery } from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { API } from '../api';
import { QUERY_KEYS } from '../constants';
import { Album as AlbumType, Photo, User } from '../types';
import Loader from '../ui/Loader';
import PhotoComponent from '../ui/Photo';

const Album = () => {
   const { albumID } = useParams();

   const { data: album, isLoading: isAlbumLoading } = useQuery({
      queryKey: [QUERY_KEYS.ALBUM_ID, albumID],
      queryFn: () => API.get<AlbumType[]>(`/albums?id=${albumID}`),
      select: response => response.data[0],
      enabled: !!albumID
   });

   const { data: user, isLoading: isUserLoading } = useQuery({
      queryKey: [QUERY_KEYS.USER_ID, album?.userId],
      queryFn: () => API.get<User[]>(`/users?id=${album?.userId}`),
      select: response => response.data[0],
      enabled: !!album?.id
   });
   const { data: photos, isLoading: isPhotosLoading } = useQuery({
      queryKey: [QUERY_KEYS.PHOTOS_ALBUM_ID, album?.id],
      queryFn: () => API.get<Photo[]>(`/photos?albumId=${album?.id}`),
      select: response => response.data,
      enabled: !!album?.id
   });

   if (isAlbumLoading || isUserLoading) {
      return <Loader />;
   }

   return (
      <>
         {!album || !user ? (
            <span className="text-gray-400 text-lg text-center block">No data for album #{albumID} was found</span>
         ) : (
            <div className="mb-10">
               <h1 className="font-bold text-3xl">{album.title}</h1>
               <p className="text-sm text-gray-400">
                  Created by&nbsp;
                  <NavLink to={`/users/${user.id}`} className="underline hover:text-blue-700">
                     {user.name}
                  </NavLink>
               </p>
            </div>
         )}
         {isPhotosLoading ? (
            <Loader />
         ) : (
            <>
               {photos?.length && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                     {photos.map(photo => (
                        <PhotoComponent key={photo.id} photo={photo} />
                     ))}
                  </div>
               )}
            </>
         )}
      </>
   );
};

export default Album;
