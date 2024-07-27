import React, { Suspense, useContext, useState } from "react"
import { Navigate } from "react-router-dom";
import PathConstants from "./pathsConstants";
import { AuthContext } from "../context/AuthContext";
import Cookies from 'js-cookie';


const Home = React.lazy(() => import("../components/HomePage/HomePage"))
const Login = React.lazy(() => import("../components/Login/login"))
const CatEncuestas = React.lazy(()=> import('../components/Catalogos/Encuestas/Encuestas'))
const CatEncuestasID = React.lazy(()=> import('../components/Catalogos/Encuestas/Editar/CreacionEncuesta'))
const CatFamilia = React.lazy(()=> import('../components/Catalogos/Familias/Familias'))
const CatFamiliaAlta = React.lazy(()=> import('../components/Catalogos/Familias/FamiliaAlta'))
const CatUsuarios = React.lazy(()=> import('../components/Catalogos/Usuarios/Usuarios'))
const CatPerfiles = React.lazy(()=> import('../components/Catalogos/Perfiles/Perfiles'))
const CatCiclosEscolares = React.lazy(()=> import('../components/Catalogos/CiclosEscolares/CiclosEscolares'))
const CatClientes = React.lazy(()=> import('../components/Catalogos/Clientes/Clientes'))
const CatColegiosComunes = React.lazy(()=> import('../components/Catalogos/ColegiosComunes/ColegiosComunes'))
const CatTiposClientes = React.lazy(()=>import('../components/Catalogos/ClientesTipos/TiposClientes'))
const FormBP2 = React.lazy(()=> import('../components/Formularios/ESEBP2/FormBP2'))
const FormFamilaFiles = React.lazy(()=> import('../components/Formularios/FamiliaSubirArchivos/FAmiliaFormSubirArchivos'))
//const Details = React.lazy(() => import("../pages/details/details"))

const isAuthenticated = () => {
  console.log('islogged?');
  return localStorage.getItem('login') === 'true';
};
  
const PrivateRoute = ({ path ,element }) => {
  const { logout,roleSession } = useContext(AuthContext);
  const [cookieValue, setCookieValue] = useState('');
  const value = Cookies.get('localhost');
  console.log(value);
  var role = localStorage.getItem('role') ?? ''
  if (isAuthenticated()) {
    if (role === '' || role !== roleSession) {
      localStorage.clear()
      logout()
    }
    if (role === 'Administrador') {
      return element 
    }

    if (role === 'Familias') {
      if (path === PathConstants.HOME || path === PathConstants.FAMILIASFILES) {
        return element
      } else {
        return window.location.replace('/')
      }
    }
  } else {
    return <Navigate to={PathConstants.LOGIN} replace />
  }
};

const routes = [
    { path: PathConstants.HOME, perfil:'todos', 
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.HOME} element={<Home />} />
        </Suspense>
      )},
    { path: PathConstants.USUARIOS, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.USUARIOS} element={<CatUsuarios />} />
        </Suspense>
      )},
    { path: PathConstants.ENCUESTASID, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.ENCUESTASID} element={<CatEncuestasID />} />
        </Suspense>
      )},
    { path: PathConstants.ENCUESTAS, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.ENCUESTAS} element={<CatEncuestas />} />
        </Suspense>
    )},
    { path: PathConstants.PERFILES, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.PERFILES} element={<CatPerfiles />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIAS, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.FAMILIAS} element={<CatFamilia />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIASALTA, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.FAMILIASALTA} element={<CatFamiliaAlta />} />
        </Suspense>
      )},
    { path: PathConstants.FAMILIASFILES, perfil:'familias',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.FAMILIASFILES} element={<FormFamilaFiles />} />
        </Suspense>
      )},
      { path: PathConstants.CICLOSESCOLARES, perfil:'Administrador',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PrivateRoute path={PathConstants.CICLOSESCOLARES} element={<CatCiclosEscolares />} />
          </Suspense>
        )},
    { path: PathConstants.ESEBP2,perfil:'Administrador', element: ( 
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute path={PathConstants.ESEBP2} element={<FormBP2 />} />
      </Suspense>
    )},
    { path: PathConstants.CLIENTES,perfil:'Administrador',element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute path={PathConstants.CLIENTES} element={ <CatClientes /> }/>
      </Suspense>
    )},
    {path:PathConstants.COLEGIOSCOMUNES,perfil:'Administrador',element:(
      <Suspense fallback={<div>Loading ..</div>}>
        <PrivateRoute path={PathConstants.COLEGIOSCOMUNES} element={ <CatColegiosComunes />} />
      </Suspense>
    )},
    { path: PathConstants.TIPOSCLIENTES, perfil:'Administrador',element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute path={PathConstants.TIPOSCLIENTES} element={ <CatTiposClientes /> }/>
      </Suspense>
    )},
    { path: PathConstants.LOGIN, perfil:'todos',element: (
      <Suspense path={PathConstants.LOGIN} perfil='todos' fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    )},
]

export default routes
