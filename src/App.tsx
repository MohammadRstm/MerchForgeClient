import { useEffect } from 'react';
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './services/toast'
import { setupInterceptors } from './services/api/interceptors';
import useAuth from './context/Auth/useAuth';
import { useNavigate } from 'react-router';
import { authenticatedApi } from './services/api/api';

function App(){

  const { logout } = useAuth();
  const navigate = useNavigate;

  useEffect(() => {

    const id = setupInterceptors(logout, navigate);

    return () => {
      authenticatedApi.interceptors.response.eject(id.autheticatedRespInterceptor);
    };

  }, [logout, navigate]);


  return <>
    <ToastProvider />
    <AppRoutes />
  </>
}

export default App
