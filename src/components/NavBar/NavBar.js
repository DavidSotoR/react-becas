import { useEffect } from "react";

const Logout = () => {
  localStorage.clear()
  window.location.replace('/')
}

function Navbar() {

  return (
    <nav className="navbar bg-primary sticky-top navbar-expand-lg" data-bs-theme="dark"> 
    <div className="container-fluid">
        <a className="navbar-brand" href="/home">Servicio de Becas</a>
        <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNavAltMarkup">
          <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/home">Inicio</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Catalogos
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Usuarios</a></li>
                  <li><a className="dropdown-item" href="#">Escuelas</a></li>
                  <li><a className="dropdown-item" href="#">Empresas</a></li>
                  <li><a className="dropdown-item" href="#">Folios</a></li>
                  <li><a className="dropdown-item" href="#">Familias</a></li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Formularios
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/form-1">ESE BP2</a></li>
                  <li><a className="dropdown-item" href="#">ESE BP3</a></li>
                  <li><a className="dropdown-item" href="#">ESE BP7</a></li>

                </ul>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Solicitud Becas
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/ese-1-2">Estudio SOCIOECONÓMICO 1/2</a></li>
                </ul>
              </li>
          </ul>
          <div>
            <a style={ { color:"white" } } className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Usuario 1
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#" onClick={ Logout }>Cerrar Sesión</a></li>
            </ul>
          </div>
        </div>
    </div>
    </nav>
  );
}

export default Navbar;
