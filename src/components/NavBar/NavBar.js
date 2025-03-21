import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PathConstants from "../../routes/pathsConstants";

const Logout = () => {
  localStorage.clear()
  window.location.replace('/')
}

function Navbar() {
  const { isLoggedIn, userSession,roleSession, logout } = useContext(AuthContext);
  return (
    <nav className="navbar bg-primary sticky-top navbar-expand-lg" data-bs-theme="dark"> 
    {isLoggedIn ? (
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">SINERGIA</Link>
          <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNavAltMarkup">
            <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
                </li>
                { roleSession === 'Administrador' && (
                  <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle active" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Catalogos
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to={ PathConstants.USUARIOS }>Usuarios</Link></li>
                    <li><Link className="dropdown-item" to={ PathConstants.PERFILES }>Perfiles</Link></li>
                    <li><Link className="dropdown-item" to="#">Escuelas</Link></li>
                    <li><Link className="dropdown-item" to="#">Empresas</Link></li>
                    <li><Link className="dropdown-item" to="#">Folios</Link></li>
                    <li><Link className="dropdown-item" to="/familias">Familias</Link></li>
                    <li><Link className="dropdown-item" to={PathConstants.CICLOSESCOLARES}>Ciclos Escolares</Link></li>
                  </ul>
                </li>
                )

                }
                { roleSession === 'Administrador' &&
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle active" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Formularios
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/form-1">ESE BP2</Link></li>
                    <li><Link className="dropdown-item" to="#">ESE BP3</Link></li>
                    <li><Link className="dropdown-item" to="#">ESE BP7</Link></li>

                  </ul>
                </li>
                }

                { roleSession === 'Administrador' &&
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle active" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Solicitud Becas
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/ese-1-2">Estudio SOCIOECONÓMICO 1/2</Link></li>
                  </ul>
                </li>
                }
                { roleSession === 'Empresas' &&
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/configuracion">Configuracion</Link>
                </li>

                }
                
            </ul>
            <div>
              <a style={ { color:"white" } } className="nav-link dropdown-toggle numeros" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                { userSession }
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" to="#" onClick={ Logout }>Cerrar Sesión</a></li>
              </ul>
            </div>
          </div>
            
        </div>
      ) : (
        <div className="container-fluid">
          <a className="navbar-brand" to="">SINERGIA EN ESTUDIOS</a>
        </div>
      )}
      
    </nav>
  );
}

export default Navbar;
