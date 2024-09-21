import React, { Suspense, useContext, useState } from "react"
import { Navigate } from "react-router-dom";
import PathConstants from "./pathsConstants";
import { AuthContext } from "../context/AuthContext";
import Cookies from 'js-cookie';

const Home = React.lazy(() => import("../components/HomePage/HomePage"))
const Login = React.lazy(() => import("../components/Login/login"))

const CatEncuestas = React.lazy(()=> import('../components/Catalogos/Encuestas/Encuestas'))
const CatEncuestasID = React.lazy(()=> import('../components/Catalogos/Encuestas/CreacionEncuesta'))
const CatFamilia = React.lazy(()=> import('../components/Catalogos/Familias/Familias'))
const CatFamiliaAlta = React.lazy(()=> import('../components/Catalogos/Familias/FamiliaAlta'))

const CatUsuarios = React.lazy(()=> import('../components/Catalogos/Usuarios/Usuarios'))
const CatUsuariosCrear = React.lazy(()=> import('../components/Catalogos/Usuarios/PageCrearUsuario'))

const CatPerfiles = React.lazy(()=> import('../components/Catalogos/Perfiles/Perfiles'))
const CatCiclosEscolares = React.lazy(()=> import('../components/Catalogos/CiclosEscolares/CiclosEscolares'))
const CatProyectos = React.lazy(()=> import('../components/Catalogos/Proyectos/Proyectos'))
const CatProyecto = React.lazy(()=> import('../components/Catalogos/Proyectos/Proyecto/Proyecto'))
const CatClientes = React.lazy(()=> import('../components/Catalogos/Clientes/Clientes'))
const ClienteNuevo = React.lazy(()=>import('../components/Catalogos/Clientes/PageNuevoCliente'))
const ClienteActualizar = React.lazy(()=>import('../components/Catalogos/Clientes/PageActualizarCliente'))
const CatColegiosComunes = React.lazy(()=> import('../components/Catalogos/ColegiosComunes/ColegiosComunes'))
const CatTiposClientes = React.lazy(()=>import('../components/Catalogos/ClientesTipos/TiposClientes'))
const FormBP2 = React.lazy(()=> import('../components/Formularios/ESEBP2/FormBP2'))
const FormFamilaFiles = React.lazy(()=> import('../components/Formularios/FamiliaSubirArchivos/FAmiliaFormSubirArchivos'))
const ServicioEstudio = React.lazy(()=> import("../components/Catalogos/ServicioEstudio/ServicioEstudio"))
const EstudioSocioeconomico = React.lazy(()=> import("../components/Catalogos/ServicioEstudio/EstudioSocioeconomico"))
const AltaEstudioSocioeconomico = React.lazy(()=> import("../components/Catalogos/ServicioEstudio/AltaEstudioSocioeconomico"))
const EditarEstudioSocioeconomico = React.lazy(()=> import("../components/Catalogos/ServicioEstudio/EditarEstudioSocioeconomico"))
const EstudioLaboral = React.lazy(()=> import("../components/Catalogos/ServicioEstudio/EstudioLaboral"))
const AltaEstudioLaboral = React.lazy(()=> import("../components/Catalogos/ServicioEstudio/AltaEstudioLaboral"))
const Estudios = React.lazy(()=> import('../components/Catalogos/Estudios/Socioeconomicos/Estudios'))
const Estudio = React.lazy(()=> import('../components/Catalogos/Estudios/Socioeconomicos/Estudio'))
//const Details = React.lazy(() => import("../pages/details/details"))

const isAuthenticated = () => {
  return localStorage.getItem('login') === 'true';
};
  
const PrivateRoute = ({ path ,element }) => {
  const { logout,roleSession } = useContext(AuthContext);
  const [cookieValue, setCookieValue] = useState('');
  const value = Cookies.get('localhost');
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
    { path: PathConstants.ESTUDIOS, perfil:'todos', 
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.ESTUDIOS} element={<Estudios />} />
        </Suspense>
      )},
      { path: PathConstants.ESTUDIOID, perfil:'todos', 
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PrivateRoute path={PathConstants.ESTUDIOID} element={<Estudio />} />
          </Suspense>
        )},
    { path: PathConstants.USUARIOS, perfil:'Administrador',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <PrivateRoute path={PathConstants.USUARIOS} element={<CatUsuarios />} />
        </Suspense>
      )},
      { path: PathConstants.USUARIOCREAR, perfil:'Administrador',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PrivateRoute path={PathConstants.USUARIOCREAR} element={<CatUsuariosCrear />} />
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
    { path: PathConstants.SERVICIOESTUDIO, perfil:'Administrador',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute path={PathConstants.SERVICIOESTUDIO} element={<ServicioEstudio />} />
            </Suspense>
    )},
    { path: PathConstants.ESTUDIOSOCIOECONOMICO, perfil:'Administrador',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute path={PathConstants.ESTUDIOSOCIOECONOMICO} element={<EstudioSocioeconomico />} />
            </Suspense>
    )},
    { path: PathConstants.ESTUDIOSOCIOECONOMICONUEVO, perfil:'Administrador',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute path={PathConstants.ESTUDIOSOCIOECONOMICONUEVO} element={<AltaEstudioSocioeconomico />} />
            </Suspense>
    )},
    { path: PathConstants.ESTUDIOSOCIOECONOMICOID, perfil:'Administrador',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute path={PathConstants.ESTUDIOSOCIOECONOMICOID} element={<EditarEstudioSocioeconomico />} />
            </Suspense>
    )},
    { path: PathConstants.ESTUDIOLABORAL, perfil:'Administrador',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute path={PathConstants.ESTUDIOLABORAL} element={<EstudioLaboral />} />
            </Suspense>
    )},
    { path: PathConstants.ESTUDIOLABORALNUEVO, perfil:'Administrador',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute path={PathConstants.ESTUDIOLABORALNUEVO} element={<AltaEstudioLaboral />} />
            </Suspense>
    )},
    { path: PathConstants.PROYECTOS, perfil:'Administrador',
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <PrivateRoute path={PathConstants.PROYECTOS} element={<CatProyectos />} />
            </Suspense>
    )},
    { path: PathConstants.PROYECTO, perfil:'Administrador',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute path={PathConstants.PROYECTO} element={<CatProyecto />} />
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
    { path: PathConstants.CLIENTENUEVO, element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute path={PathConstants.CLIENTENUEVO} element={ <ClienteNuevo /> }/>
      </Suspense>
    )},
    { path: PathConstants.CLIENTEACTUALIZAR, element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivateRoute path={PathConstants.CLIENTEACTUALIZAR} element={ <ClienteActualizar /> }/>
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
