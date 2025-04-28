import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Wrapper from './pages/wrapper';
import Error from './pages/Error';
import Main from './pages/Main';
import NotFound from './pages/NotFound';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';

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
                  path: '*',
                  element: <NotFound />
               }
            ]
         }
      ]
   }
]);

function App() {
   return <RouterProvider router={router} />;
}

export default App;
