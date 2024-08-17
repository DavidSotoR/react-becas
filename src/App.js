import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/layout';
import NotFound from './components/NotFound/NotFound';
import routes from './routes/routes';
import { Suspense, useContext, useEffect } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';

function App() {
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') { // Reemplaza 'yourTokenKey' por la clave que uses para almacenar tu token
        console.log(`Token cambiado: ${e.newValue}`);
        //logout()
        // Aquí puedes manejar el nuevo valor del token
        // Por ejemplo, actualizar el estado o realizar una acción
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Limpia el evento al desmontar el componente
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const router = createBrowserRouter([
    {
      element: <Layout/>,
      errorElement: <NotFound/>,
      children: routes
    }
  ])

  return (
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
  )
}

export default App;