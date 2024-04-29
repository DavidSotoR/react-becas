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
    <div className="d-flex flex-column justify-content-center align-items-center" style={ {width: "100vw",height:"100vh"} }>
        
        <div className="d-grid">
        <div className="d-flex" style={{ width: "100%" }}>
          <h3 className="text-start">Login</h3>
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
  );
}

export default Login;