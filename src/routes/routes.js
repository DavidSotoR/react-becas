import React, { Suspense } from "react"
import { Navigate } from "react-router-dom";
import PathConstants from "./pathsConstants";

const Home = React.lazy(() => import("../components/HomePage/HomePage"))
const Login = React.lazy(() => import("../components/Login/login"))
const CatFamilia = React.lazy(()=> import('../components/Catalogos/Familias/Familias'))
const FormBP2 = React.lazy(()=> import('../components/Formularios/ESEBP2/FormBP2'))
const FormFamilaFiles = React.lazy(()=> import('../components/Formularios/FamiliaSubirArchivos/FAmiliaFormSubirArchivos'))
//const Details = React.lazy(() => import("../pages/details/details"))

const isAuthenticated = () => {
  console.log('islogged?');
  return localStorage.getItem('login') === 'true';
};
  
const PrivateRoute = ({ element }) => {
  console.log('private route?');
  return isAuthenticated() ? element : <Navigate to={PathConstants.LOGIN} replace />;
};

const routes = [
    { path: PathConstants.HOME, 
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<Home />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIAS, 
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<CatFamilia />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIASFILES, 
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<FormFamilaFiles />} />
        </Suspense>
      )},
    { path: PathConstants.ESEBP2, element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute element={<FormBP2 />} />
      </Suspense>
    )},
    { path: PathConstants.LOGIN, element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    )},
]

export default routes
