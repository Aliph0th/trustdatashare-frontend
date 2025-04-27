import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Wrapper from './pages/wrapper';
import Error from './pages/Error';
import Main from './pages/Main';
import NotFound from './pages/NotFound';

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
