import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Wrapper from './pages/wrapper';
import Error from './pages/Error';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import Verify from './pages/Verify';
import AuthWrapper from './components/AuthWrapper';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './constants';
import { REQUESTS } from './api';
import { useEffect } from 'react';
import { useUser } from './hooks/useUser';

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
                  element: <Signup />,
                  path: 'signup'
               },
               {
                  element: <Login />,
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
      queryFn: REQUESTS.MYSELF,
      retry: 1
   });

   useEffect(() => {
      setIsUserLoading(isLoading);
   }, [isLoading, setIsUserLoading]);
   useEffect(() => {
      if (data) {
         setUser(data);
      }
   }, [data, setUser]);

   return <RouterProvider router={router} />;
}

export default App;
