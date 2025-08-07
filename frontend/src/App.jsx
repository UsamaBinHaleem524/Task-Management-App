import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { MessageProvider } from './context/MessageContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MessageProvider>
        <Router>
          <AppRoutes />
        </Router>
        </MessageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
