import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/layout';
import NotFound from './components/NotFound/NotFound';
import routes from './routes/routes';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout/>,
      errorElement: <NotFound/>,
      children: routes
    }
  ])

  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  )
}

export default App;