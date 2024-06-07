import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  //const [ typeRol, setTypeRol ] = useState("admin")
  const [ inputEmail, setInputEmail ] = useState("")
  const [ inputPass, setInputPass ] = useState("")
  const navigate = useNavigate();
  const { login, isLoggedIn } = useContext(AuthContext);

  const changeEmail = (e) => {
    setInputEmail(e.target.value)
  }

  const changePass = (e) => {
    setInputPass(e.target.value)
  }

  const sendLogin = async () => {
    var dataPost = {
      "email": inputEmail,
      "password": inputPass
    }

    const loged = await login(dataPost);
    if (loged) {
      navigate('/')
    }

  }
  
  useEffect(() => {

  }, []);

  return (
    <div>
      <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
          <div className="d-grid">
            <div className="d-flex justify-content-center">
              <img src="/img/logo_principal_colores.png" style={{ width:'150px', height:'150px' }}></img>
            </div>
            <div className="d-flex" style={{ width: "100%" }}>
              <h3 className="text-start">Inicio de Sesion</h3>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label text-align-right">Usuario</label>
              <input onChange={ (e) => { changeEmail(e) } } type="email" className="form-control" id="exampleFormControlInput1" placeholder="Usuario"/>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput2" className="form-label text-align-left">Contraseña</label>
              <input onChange={ (e) => { changePass(e) } } type="password" className="form-control" id="exampleFormControlInput2" placeholder="Contraseña"/>
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <button onClick={ sendLogin } className="btn btn-primary">Iniciar Sesión</button>
            </div>
          </div>
      </div>
    </div>
    
  );
}

export default Login;