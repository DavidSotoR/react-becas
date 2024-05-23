import { useContext, useEffect, useState } from "react";
import { loginService } from "../../services/LoginService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [ typeRol, setTypeRol ] = useState("admin")
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const changeRolType = (e) => {
    setTypeRol(e.target.value)
  }

  const sendLogin = async () => {
    const roleSelected = {role: typeRol} ;
    var servLogin = await loginService(roleSelected)
    localStorage.setItem('login',servLogin.success)
    login();
    if (servLogin.success) {
      navigate('/')
    } else {
      alert('Usuario No Valido')
    }
  }
  
  useEffect(() => {

  }, []);

  return (
    <div>
      <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
          <div className="d-grid">
            <div className="d-flex" style={{ width: "100%" }}>
              <h3 className="text-start">Servicio Becas</h3>
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
              <label htmlFor="login-type"> Tipo de usuario </label>
              <select id="login-type" className="form-select" onChange={ (e) => { changeRolType(e) } }>
                <option value="admin">Adminitrados</option>
                <option value="colaborador">Colaborador</option>
                <option value="calidad">Calidad</option>
                <option value="familia">Familia</option>
              </select>
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