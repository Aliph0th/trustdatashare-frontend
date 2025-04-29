import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { UserContextProvider } from './context/UserContext.tsx';

const client = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });

ReactDOM.createRoot(document.getElementById('root')!).render(
   <QueryClientProvider client={client}>
      <UserContextProvider>
         <App />
      </UserContextProvider>
   </QueryClientProvider>
);
