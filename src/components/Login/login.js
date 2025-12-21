import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../../node_modules/axios/index";

function Login() {
  //const [ typeRol, setTypeRol ] = useState("admin")
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [inputEmailReset, setInputEmailReset] = useState("");
  const navigate = useNavigate();
  const { login, isLoggedIn, execShowAlert  } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSpinnerReset, setShowSpinnerReset] = useState(false);
  const APIURL = process.env.REACT_APP_API_EXT_URL;

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
                    <input
                      onKeyDown={(e) => {enterPress(e);}}
                      onChange={(e) => {changePass(e); }}
                      type="password" className="form-control" id="exampleFormControlInput2" placeholder="Contraseña"
                    />
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
