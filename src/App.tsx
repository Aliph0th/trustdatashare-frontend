import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { REQUESTS } from './api';
import AuthWrapper from './components/AuthWrapper';
import { QUERY_KEYS } from './constants';
import { useUser } from './hooks/useUser';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Error from './pages/Error';
import Main from './pages/Main';
import MyPosts from './pages/MyPosts';
import NotFound from './pages/NotFound';
import Post from './pages/post/Post';
import Settings from './pages/settings/Settings';
import UserPosts from './pages/UserPosts';
import Verify from './pages/Verify';
import Wrapper from './pages/wrapper';

const router = createBrowserRouter([
   {
      path: '/',
      element: <Wrapper />,
      children: [
         {
            errorElement: <Error />,
            children: [
               {
                  element: <Main />,
                  index: true
               },
               {
                  element: (
                     <AuthWrapper to="/">
                        <Signup />
                     </AuthWrapper>
                  ),
                  path: 'signup'
               },
               {
                  element: <Post />,
                  path: 'post/:id'
               },
               {
                  element: <UserPosts />,
                  path: 'user/:id'
               },
               {
                  element: (
                     <AuthWrapper to="/login" isAuthRequired>
                        <MyPosts />
                     </AuthWrapper>
                  ),
                  path: 'my'
               },
               {
                  element: (
                     <AuthWrapper to="/">
                        <Login />
                     </AuthWrapper>
                  ),
                  path: 'login'
               },
               {
                  element: (
                     <AuthWrapper to="/login" isAuthRequired>
                        <Verify />
                     </AuthWrapper>
                  ),
                  path: 'verify/:token?'
               },
               {
                  element: (
                     <AuthWrapper to="/login" isAuthRequired>
                        <Settings />
                     </AuthWrapper>
                  ),
                  path: 'settings'
               },
               {
                  path: '*',
                  element: <NotFound />
               }
            ]
         }
      ]
   }
]);

function App() {
   const { setIsUserLoading, setUser } = useUser();
   const { data, isLoading } = useQuery({
      queryKey: [QUERY_KEYS.USER],
      queryFn: REQUESTS.GET_MYSELF,
      retry: false
   });

   useEffect(() => {
      setIsUserLoading(isLoading);
   }, [isLoading, setIsUserLoading]);
   useEffect(() => {
      if (!data) {
         return;
      }
      setUser(data);
   }, [data, setUser]);

   return <RouterProvider router={router} />;
}

export default App;
