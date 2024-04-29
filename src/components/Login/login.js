import { useEffect } from "react";

const sendLogin = () => {
  console.log("Esta es el login");
  localStorage.setItem('login','true')
  window.location.replace('/home')
}
function Login() {
  useEffect(() => {

  }, []);

  return (
    <div>
      <nav class="navbar sticky-top bg-primary" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Servicio de becas</a>
        </div>
      </nav>
      <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
          <div className="d-grid">
            <div className="d-flex" style={{ width: "100%" }}>
              <h3 className="text-start">Iniciar Sesión</h3>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label text-align-right">Usuario</label>
              <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Usuario"/>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput2" className="form-label text-align-left">Contraseña</label>
              <input type="password" className="form-control" id="exampleFormControlInput2" placeholder="Contraseña"/>
            </div>
            <div className="mb-3">
              <button onClick={ sendLogin } className="btn btn-primary">Iniciar Sesión</button>
            </div>
          </div>
      </div>
    </div>
    
  );
}

export default Login;