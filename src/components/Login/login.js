import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  //const [ typeRol, setTypeRol ] = useState("admin")
  const [inputEmail, setInputEmail] = useState("");
  const [inputPass, setInputPass] = useState("");
  const navigate = useNavigate();
  const { login, isLoggedIn, execShowAlert  } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);

  const changeEmail = (e) => {
    setInputEmail(e.target.value);
  };

  const changePass = (e) => {
    setInputPass(e.target.value);
  };

  const enterPress = (e) => {
    if (e.code === "Enter") {
      sendLogin();
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

  useEffect(() => {}, []);

  return (
    <div className="d-flex justify-content-center">
      <div className="card mt-5 card-login" >
          {/* div-login mt-5 d-flex flex-column justify-content-center align-items-center */}
          <div className="row">
            <div className="col-12 d-flex justify-content-center">
              <img
                src="/img/logo_principal_colores.png"
                style={{ width: "150px", height: "150px" }}
              ></img>
            </div>
            <div className="col-12">
              <h3 className="text-center fw-bold">Inicio de Sesion</h3>
            </div>
            <div className="col-12 px-4 mb-2">
              <label
                htmlFor="exampleFormControlInput1"
                className="form-label text-align-right fw-bold"
              >
                Usuario:
              </label>
              <input
                onKeyDown={(e) => {
                  enterPress(e);
                }}
                onChange={(e) => {
                  changeEmail(e);
                }}
                type="email"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Usuario"
              />
            </div>
            <div className="col-12 px-4 mb-3">
              <label
                htmlFor="exampleFormControlInput2"
                className="form-label text-align-left fw-bold"
              >
                Contraseña:
              </label>
              <input
                onKeyDown={(e) => {
                  enterPress(e);
                }}
                onChange={(e) => {
                  changePass(e);
                }}
                type="password"
                className="form-control"
                id="exampleFormControlInput2"
                placeholder="Contraseña"
              />
            </div>
            <div className="col-12 mb-3 d-flex justify-content-center">
              { showSpinner ? (
                <div class="spinner-border text-info" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button onClick={sendLogin} className="btn btn-primary">
                  Iniciar Sesión
                </button>
              ) }    
            </div>
          </div>
      </div>
    </div>
    
  );
}

export default Login;
