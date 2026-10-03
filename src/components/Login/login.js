import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../../node_modules/axios/index";

function Login() {
  //const [ typeRol, setTypeRol ] = useState("admin")
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputEmailReset, setInputEmailReset] = useState("");
  const navigate = useNavigate();
  const { login, isLoggedIn, execShowAlert  } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSpinnerReset, setShowSpinnerReset] = useState(false);
  const APIURL = process.env.REACT_APP_API_URL.replace(/\/auth\/?$/, '');

  const [ cambioContrasena, setCambioContrasena ] = useState(false);

  const changeEmail = (e) => {
    setInputEmail(e.target.value);
  };

  const changeEmailReset = (e) => {
    console.log(e.target.value);
    setInputEmailReset(e.target.value);
  };

  const changePass = (e) => {
    setInputPass(e.target.value);
  };

  const enterPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!showSpinner) {
        sendLogin();
      }
    }
  };

  const sendLogin = async () => {
    setShowSpinner(true);
    var dataPost = {
      login: inputEmail,
      password: inputPass,
    };

    const loged = await login(dataPost);
    console.log(loged);
    
    if (loged) {
      setShowSpinner(false);
      navigate("/");
      
    } else {
      setShowSpinner(false);
      execShowAlert({type: 'danger', title: 'Error de Autorización', message: 'Credenciales no validas.'})
    }
  };

  const iniciarResetConstra = async () => {
    setCambioContrasena(prev => !prev);
  }

  const sendCambioContraseña = async ()=>{
    setShowSpinnerReset(true)
    var dataForm = {
      email_registrado: inputEmailReset
    }
    try {
      var resp = await axios.post(APIURL + '/user/reset', dataForm);
      if (resp.data.error) {
        execShowAlert({type: 'danger', title: 'Error', message: resp.data.message})
      } else{
        execShowAlert({type: 'success', title: 'Completado', message: resp.data.message })
      }
      setShowSpinnerReset(false)
    } catch (error) {
      console.log(error);
      execShowAlert({type: 'danger', title: 'Error', message: error})
      setShowSpinnerReset(false)
      
    }
    
    setCambioContrasena(prev => !prev);
  }

  //useEffect(() => {}, []);

  return (
    <div className="d-flex justify-content-center">
      <div className="card mt-5 card-login" >
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <img src="/img/logo_principal_colores.png" style={{ width: "150px", height: "150px" }}></img>
            </div>
            {
              cambioContrasena ? (
                <div className="col-12 mb-3">
                  <div className="row">
                    <div className="col-12">
                      <h3 className="text-center fw-bold">Cambio de Constraseña</h3>
                    </div>
                    <div className="col-12 mb-3 px-5">
                      <label htmlFor="exampleFormControlInput1" className="form-label text-align-right fw-bold">
                        Correo registrado:
                      </label>
                      <input
                        onChange={(e) => {
                          changeEmailReset(e);
                        }}
                        type="email" className="form-control" id="exampleFormControlInput1" placeholder="Correo de la cuenta"
                      />
                    </div>
                    { !showSpinnerReset ? (
                        <div className="col-12 d-flex justify-content-center">
                          <button className="btn btn-secondary mx-1 fw-bold" onClick={()=>{ iniciarResetConstra() }}>Cancelar</button>
                          <button className="btn btn-primary mx-1 fw-bold" onClick={()=>{ sendCambioContraseña() }}>Cambio Contraseña</button>
                        </div>
                      ) : (
                        <div className="col-12 d-flex justify-content-center">
                          <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )
                    }
                    
                    
                  </div>
                  
                </div>
              ) : (
                <div className="row">
                  <div className="col-12">
                    <h3 className="text-center fw-bold">Inicio de Sesion</h3>
                  </div>
                  <div className="col-12 px-4 mb-2">
                    <label htmlFor="exampleFormControlInput1" className="form-label text-align-right fw-bold">
                      Usuario:
                    </label>
                    <input
                      onKeyDown={(e) => {
                        enterPress(e);
                      }}
                      onChange={(e) => {
                        changeEmail(e);
                      }}
                      type="email" className="form-control" id="exampleFormControlInput1" placeholder="Usuario"
                    />
                  </div>
                  <div className="col-12 px-4 mb-3">
                    <label htmlFor="exampleFormControlInput2" className="form-label text-align-left fw-bold" >
                      Contraseña:
                    </label>
                    <div className="input-group">
                      <input
                        onKeyDown={(e) => {enterPress(e);}}
                        onChange={(e) => {changePass(e); }}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="form-control" id="exampleFormControlInput2" placeholder="Contraseña"
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-outline-white"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        aria-controls="exampleFormControlInput2"
                      >
                        {showPassword ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg> : 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                          <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                        </svg>
                      }
                      </button>
                    </div>
                    <div className="d-flex justify-content-center align-items-center pt-2">
                      <a className="btn text-gray" onClick={() => {iniciarResetConstra()}}>¿Olvidaste tu contraseña?</a>
                    </div>
                    
                  </div>
                  <div className="col-12 mb-3 d-flex justify-content-center">
                    { showSpinner ? (
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <button onClick={sendLogin} className="btn btn-primary fw-bold">
                        Iniciar Sesión
                      </button>
                    ) }    
                  </div>
                </div>
              )

            }
            
          </div>
      </div>
    </div>
    
  );
}

export default Login;
