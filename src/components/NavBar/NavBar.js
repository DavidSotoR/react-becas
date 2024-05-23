import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Logout = () => {
  localStorage.clear()
  window.location.replace('/')
}

function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  console.log('Inicia navbar');
  return (
    <nav className="navbar bg-primary sticky-top navbar-expand-lg" data-bs-theme="dark"> 
    {isLoggedIn ? (
        <div className="container-fluid">
        <Link className="navbar-brand" to="/">Servicio de Becas</Link>
        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNavAltMarkup">
          <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Catalogos
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="#">Usuarios</Link></li>
                  <li><Link className="dropdown-item" to="#">Escuelas</Link></li>
                  <li><Link className="dropdown-item" to="#">Empresas</Link></li>
                  <li><Link className="dropdown-item" to="#">Folios</Link></li>
                  <li><Link className="dropdown-item" to="/familias">Familias</Link></li>
                </ul>
              </li>
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
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Solicitud Becas
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/ese-1-2">Estudio SOCIOECONÓMICO 1/2</Link></li>
                </ul>
              </li>
          </ul>
          <div>
            <a style={ { color:"white" } } className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Usuario 1
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" to="#" onClick={ Logout }>Cerrar Sesión</a></li>
            </ul>
          </div>
        </div>
          
      </div>
      ) : (
        <div className="container-fluid">
          <a className="navbar-brand" to="">Servicio de Becas</a>
        </div>
      )}
      
    </nav>
  );
}

export default Navbar;
