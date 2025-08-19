import React, { Suspense, useContext, useState } from "react"
import { Navigate } from "react-router-dom";
import PathConstants from "./pathsConstants";
import { AuthContext } from "../context/AuthContext";
import Cookies from 'js-cookie';

const Home = React.lazy(() => import("../components/HomePage/HomePage"))
const Login = React.lazy(() => import("../components/Login/login"))
const Registrar = React.lazy(()=> import("../components/RegistroPage/RegistroPage"))

const CatEncuestas = React.lazy(()=> import('../components/Catalogos/Encuestas/Encuestas'))
const CatEncuestasID = React.lazy(()=> import('../components/Catalogos/Encuestas/CreacionEncuesta'))
const CatFamilia = React.lazy(()=> import('../components/Catalogos/Familias/Familias'))
const CatFamiliaAlta = React.lazy(()=> import('../components/Catalogos/Familias/FamiliaAlta'))

const CatUsuarios = React.lazy(()=> import('../components/Catalogos/Usuarios/Usuarios'))
const CatUsuariosCrear = React.lazy(()=> import('../components/Catalogos/Usuarios/PageCrearUsuario'))
const CatUsuariosActualizar = React.lazy(()=> import('../components/Catalogos/Usuarios/PageUpdateUsuario'))
const CatUsuariosVer = React.lazy(()=>import('../components/Catalogos/Usuarios/PageVerUsuario'))

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
const EstudioSocioeconomicoID = React.lazy(() => import('../components/Estudios/Socioeconomico'))
const EstudioSocioeconomicoIDFamilia = React.lazy(() => import('../components/Catalogos/ServicioEstudio/EditarFamiliaEstudioSocioeconomico'))
const EncuestaProyectoID = React.lazy(() => import('../components/HomePageEmpresa/Proyecto/Proyecto'))
const EmpresaEstudio = React.lazy(() => import('../components/HomeCom/Estudio'))
const EmpresaConfig = React.lazy(() => import('../components/HomePageEmpresa/Configuraciones/ConfiguracionPage'))

const FormEsecDB = React.lazy(() => import('../components/Formularios/ESECDB/FormEsecDB'))

const OrdenesServicio = React.lazy(()=> import('../components/Catalogos/OrdenesServicios/OrdenesServicios'))
//const Details = React.lazy(() => import("../pages/details/details"))

const PageDatosFamilia = React.lazy(()=> import('../components/HomePageFamilia/PageDatosFamilia'))

const isAuthenticated = () => {
  const login = localStorage.getItem('login');
  const token = localStorage.getItem('token');
  return login === 'true' && token;
};
  
const PrivateRoute = ({ path, element }) => {
  const { logout, roleSession } = useContext(AuthContext);
  const role = localStorage.getItem('role') ?? '';
  console.log(path);
  
  if (!isAuthenticated()) {
    return <Navigate to={PathConstants.LOGIN} replace />;
  }

  if (role === '' || role !== roleSession) {
    localStorage.clear();
    logout();
    return <Navigate to={PathConstants.LOGIN} replace />;
  }

  const allowedPathsByRole = {
    Administrador: [
      PathConstants.HOME,
      PathConstants.ENCUESTAS,
      PathConstants.USUARIOS,
      PathConstants.PERFILES,
      PathConstants.ESEBP2,
      PathConstants.DATOSFAMILIA,
      PathConstants.COLABORADOR,
      PathConstants.CALIDAD,
      PathConstants.CLIENTES,
      PathConstants.CLIENTEACTUALIZAR,
      PathConstants.CLIENTENUEVO,
      PathConstants.COLEGIOSCOMUNES,
      PathConstants.ENCUESTAS,
      PathConstants.ENCUESTASID,
      PathConstants.TIPOSCLIENTES,
      PathConstants.FAMILIAS,
      PathConstants.FAMILIASALTA,
      PathConstants.FAMILIASFILES,
      PathConstants.PERFILES,
      PathConstants.USUARIOS,
      PathConstants.USUARIOCREAR,
      PathConstants.USUARIOACTUALIZAR,
      PathConstants.USUARIOVER,
      PathConstants.CICLOSESCOLARES,
      PathConstants.PROYECTOS,
      PathConstants.PROYECTO,
      PathConstants.SERVICIOESTUDIO,
      PathConstants.ORDENESSERVICIOS,
      PathConstants.ESTUDIOSOCIOECONOMICO,
      PathConstants.ESTUDIOSOCIOECONOMICOID,
      PathConstants.ESTUDIOSOCIOECONOMICOIDFAMILIA,
      PathConstants.ESTUDIOSOCIOECONOMICONUEVO,
      PathConstants.ESTUDIOLABORAL,
      PathConstants.ESTUDIOLABORALNUEVO,
      PathConstants.ESTUDIOS,
      PathConstants.ESTUDIOID,
      PathConstants.ESTUDIOSID,
      PathConstants.ESTUDIO_SOCIOECONOMICO_ID,
      PathConstants.ENCUESTAPROYECTOID,
      PathConstants.CONFIGURACIONES,
      PathConstants.ESECDB,
      // Agrega más rutas aquí
    ],
    Empresas: [
      PathConstants.HOME,
      PathConstants.ENCUESTAPROYECTOID,
      PathConstants.ESTUDIOSID,
      PathConstants.ESECDB,
      PathConstants.CONFIGURACIONES,
    ],
    Familias: [
      PathConstants.HOME,
      PathConstants.FAMILIASFILES,
      PathConstants.DATOSFAMILIA,
      PathConstants.CONFIGURACIONES,
    ],
  };

  if (!allowedPathsByRole[role]) {
    console.error(`Rol no definido: ${role}`);
    return <Navigate to={PathConstants.HOME} replace />;
  }

  if (allowedPathsByRole[role].includes(path)) {
    return element;
  } else {
    return <Navigate to={PathConstants.HOME} replace />;
  }
};

const generateRoute = (path, element, perfil = 'todos') => ({
  path,
  perfil,
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <PrivateRoute path={path} element={element} />
    </Suspense>
  ),
});

const routes = [
  generateRoute(PathConstants.DATOSFAMILIA, <PageDatosFamilia />, 'Familias'),
  generateRoute(PathConstants.HOME, <Home />),
  generateRoute(PathConstants.ESTUDIOSID, <EmpresaEstudio />),
  generateRoute(PathConstants.ESTUDIOS, <Estudios />),
  generateRoute(PathConstants.ENCUESTAPROYECTOID, <EncuestaProyectoID />),
  generateRoute(PathConstants.ESTUDIOID, <Estudio />),
  generateRoute(PathConstants.CONFIGURACIONES, <EmpresaConfig />, 'Empresas'),
  generateRoute(PathConstants.ESTUDIO_SOCIOECONOMICO_ID, <EstudioSocioeconomicoID />),
  generateRoute(PathConstants.ORDENESSERVICIOS, <OrdenesServicio />, 'Administrador'),
  generateRoute(PathConstants.USUARIOS, <CatUsuarios />, 'Administrador'),
  generateRoute(PathConstants.USUARIOCREAR, <CatUsuariosCrear />, 'Administrador'),
  generateRoute(PathConstants.USUARIOACTUALIZAR, <CatUsuariosActualizar />, 'Administrador'),
  generateRoute(PathConstants.USUARIOVER, <CatUsuariosVer />, 'Administrador'),
  generateRoute(PathConstants.ENCUESTASID, <CatEncuestasID />, 'Administrador'),
  generateRoute(PathConstants.ENCUESTAS, <CatEncuestas />, 'Administrador'),
  generateRoute(PathConstants.PERFILES, <CatPerfiles />, 'Administrador'),
  generateRoute(PathConstants.FAMILIAS, <CatFamilia />, 'Administrador'),
  generateRoute(PathConstants.FAMILIASALTA, <CatFamiliaAlta />, 'Administrador'),
  generateRoute(PathConstants.FAMILIASFILES, <FormFamilaFiles />, 'familias'),
  generateRoute(PathConstants.CICLOSESCOLARES, <CatCiclosEscolares />, 'Administrador'),
  generateRoute(PathConstants.SERVICIOESTUDIO, <ServicioEstudio />, 'Administrador'),
  generateRoute(PathConstants.ESTUDIOSOCIOECONOMICO, <EstudioSocioeconomico />, 'Administrador'),
  generateRoute(PathConstants.ESTUDIOSOCIOECONOMICONUEVO, <AltaEstudioSocioeconomico />, 'Administrador'),
  generateRoute(PathConstants.ESTUDIOSOCIOECONOMICOID, <EditarEstudioSocioeconomico />, 'Administrador'),
  generateRoute(PathConstants.ESTUDIOSOCIOECONOMICOIDFAMILIA, <EstudioSocioeconomicoIDFamilia />, 'Administrador'),
  generateRoute(PathConstants.ESTUDIOLABORAL, <EstudioLaboral />, 'Administrador'),
  generateRoute(PathConstants.ESTUDIOLABORALNUEVO, <AltaEstudioLaboral />, 'Administrador'),
  generateRoute(PathConstants.PROYECTOS, <CatProyectos />, 'Administrador'),
  generateRoute(PathConstants.PROYECTO, <CatProyecto />, 'Administrador'),
  generateRoute(PathConstants.ESEBP2, <FormBP2 />, 'Administrador'),
  generateRoute(PathConstants.ESECDB, <FormEsecDB />, 'Administrador'),
  generateRoute(PathConstants.CLIENTES, <CatClientes />, 'Administrador'),
  generateRoute(PathConstants.CLIENTENUEVO, <ClienteNuevo />),
  generateRoute(PathConstants.CLIENTEACTUALIZAR, <ClienteActualizar />),
  generateRoute(PathConstants.COLEGIOSCOMUNES, <CatColegiosComunes />, 'Administrador'),
  generateRoute(PathConstants.TIPOSCLIENTES, <CatTiposClientes />, 'Administrador'),
  {
    path: PathConstants.LOGIN,
    perfil: 'todos',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: PathConstants.REGISTRO,
    perfil: 'todos',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Registrar />
      </Suspense>
    ),
  },
];

export default routes
