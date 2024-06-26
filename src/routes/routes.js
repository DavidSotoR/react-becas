import React, { Suspense } from "react"
import { Navigate } from "react-router-dom";
import PathConstants from "./pathsConstants";

const Home = React.lazy(() => import("../components/HomePage/HomePage"))
const Login = React.lazy(() => import("../components/Login/login"))
const CatFamilia = React.lazy(()=> import('../components/Catalogos/Familias/Familias'))
const CatFamiliaAlta = React.lazy(()=> import('../components/Catalogos/Familias/FamiliaAlta'))
const CatUsuarios = React.lazy(()=> import('../components/Catalogos/Usuarios/Usuarios'))
const CatPerfiles = React.lazy(()=> import('../components/Catalogos/Perfiles/Perfiles'))
const CatCiclosEscolares = React.lazy(()=> import('../components/Catalogos/CiclosEscolares/CiclosEscolares'))
const CatClientes = React.lazy(()=> import('../components/Catalogos/Clientes/Clientes'))
const CatTiposClientes = React.lazy(()=>import('../components/Catalogos/ClientesTipos/TiposClientes'))
const FormBP2 = React.lazy(()=> import('../components/Formularios/ESEBP2/FormBP2'))
const FormFamilaFiles = React.lazy(()=> import('../components/Formularios/FamiliaSubirArchivos/FAmiliaFormSubirArchivos'))
//const Details = React.lazy(() => import("../pages/details/details"))

const isAuthenticated = () => {
  console.log('islogged?');
  return localStorage.getItem('login') === 'true';
};
  
const PrivateRoute = ({ path,perfil ,element }) => {
  console.log('private route?');
  console.log(path);
  console.log(perfil);
  return isAuthenticated() ? element : <Navigate to={PathConstants.LOGIN} replace />;
};

const routes = [
    { path: PathConstants.HOME, perfil:'todos', 
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<Home />} />
        </Suspense>
      )},
    { path: PathConstants.USUARIOS, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<CatUsuarios />} />
        </Suspense>
      )},
    { path: PathConstants.PERFILES, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<CatPerfiles />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIAS, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<CatFamilia />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIASALTA, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<CatFamiliaAlta />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIASFILES, perfil:'familias',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute element={<FormFamilaFiles />} />
        </Suspense>
      )},
      { path: PathConstants.CICLOSESCOLARES, perfil:'Administrador',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PrivateRoute element={<CatCiclosEscolares />} />
          </Suspense>
        )},
    { path: PathConstants.ESEBP2,perfil:'Administrador', element: ( 
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute element={<FormBP2 />} />
      </Suspense>
    )},
    { path: PathConstants.CLIENTES,perfil:'Administrador',element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute element={ <CatClientes /> }/>
      </Suspense>
    )},
    { path: PathConstants.TIPOSCLIENTES, perfil:'Administrador',element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute element={ <CatTiposClientes /> }/>
      </Suspense>
    )},
    { path: PathConstants.LOGIN, perfil:'todos',element: (
      <Suspense path={PathConstants.LOGIN} perfil='todos' fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    )},
]

export default routes
