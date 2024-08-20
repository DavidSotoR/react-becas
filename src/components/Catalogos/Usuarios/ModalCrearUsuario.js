import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import ControllerUsuarios from "./ControllersUsuarios";

function ModalCrearUsuario({ show, handleClose }) {
    const [ formValid, setFormValid ] = useState(false);
    const [ inputChanged, setInputChanged ] = useState('')
    const [errorsArray, setErrorsArray] = useState([]);
    const APIURL = process.env.REACT_APP_API_URL
    const { GenerarPassword } = ControllerUsuarios();
    const { logout } = useContext(AuthContext);
    const [ btnDisable, setBtnDisable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ allClientes, setAllClientes ] = useState([])
    const [ showPassword, setShowPassword ] = useState(false)
    const [ dataPostUsuario, setDataPostUsuario ] = useState({
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "0",
        id_cliente: "0"
    })

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const popoverContraseña = (
        <Popover id="popover-basic">
          <Popover.Body>
            { showPassword ? ('Ocultar Contraseña') : ('Mostrar Contraseña') }
          </Popover.Body>
        </Popover>
      );
    const popoverGenerarContraseña = (
    <Popover id="popover-basic">
        <Popover.Body>
        Generar Contraseña
        </Popover.Body>
    </Popover>
    );

    const getPerfilesList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/perfiles', config);
            setListaPerfiles(resp.data);
        } catch (error) {
            setListaPerfiles([])
            console.error("Error fetching perfiles:", error);
        }
    }

    const getAllClientes = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes', config)
            setAllClientes(resp.data)
        } catch (error) {
            if (error.response.status === 401) {
                logout()
            }
        }
    }

    const agregarOpcionesSelect = () => {
        return [
            <option key="default" value="0" selected>
                Seleccione uno
            </option>,
            ...listaPerfiles.map((perfil) => (
                <option key={perfil.id} value={`${perfil.id}`}>
                    {perfil.nombre}
                </option>
            ))
        ];
    }

    const renderFiltroClientes = () => {
        return [<option key="cliente-0" value="0" selected>
            Seleccione uno
        </option>,,...allClientes.map((cliente) => (
            <option key={cliente.id} value={`${cliente.id}`}>
                { cliente.nombre }
            </option>
        ))]
    }

    const asignarContraseñaAutomatico = () =>{
        var newPass = GenerarPassword()
        var data = dataPostUsuario
        data.password = newPass
        data.password_confirmation = newPass

        setDataPostUsuario(data)
        /* validateField('password',newPass)
        validateField('password_confirmation',newPass) */
        console.log(dataPostUsuario);
    }

    const changeShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const contieneError = (idError)=>{
        var exists = errorsArray?.some(function(error) {
            return error.idError === idError;
        });
        return exists;
    }

    const eliminarErrorDelArray = (idError) => {
        var newArray = errorsArray.filter((error)=>{
            return error.idError !== idError
        })

        return newArray
    }

    const validateCorreo = (value) => {
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexCorreo.test(value);
    }

    const validateContieneEspacios = ( value ) =>{
        return /^\s|\s$|\s{2,}/.test(value);
    }

    const validatePassword = (value) => {
        const tieneMayuscula = /[A-Z]/.test(value);
        const tieneNumero = /\d/.test(value);
        const tieneLongitudMinima = value.length >= 12;
        const sinEspacios = !/\s/.test(value);

        if (sinEspacios && tieneMayuscula && tieneNumero && tieneLongitudMinima) {
            return true;
        } else {
            return false;
        }
    }

    const getErrorMsg = (idError) => {
        var index = errorsArray.findIndex(function(error) {
            return error.idError === idError;
        });

        return errorsArray[index].msg
    }

    const validateDataFormBtn = (obj) => {
        for (let key in obj) {
            // Verifica si alguna propiedad del objeto tiene un valor "" o "0"
            if (obj[key] === "" || obj[key] === "0") {
                return false; // El objeto es inválido
            }
        }
        return true; // El objeto es válido
    }

    const validateForm = (dataForm) => {
        var errorObject = { idError: null, msg: null}

        if (inputChanged === 'id_perfil') {
            if (dataForm.id_perfil === '0') {
                errorObject.idError = 1
                errorObject.msg = 'Perfil es Obligario, seleccione una opcion.'
                if (!contieneError(errorObject.idError)) {
                    setErrorsArray([ ...errorsArray, errorObject ])
                }

            } else {
                if (contieneError(1)) {
                    setErrorsArray(eliminarErrorDelArray(1))
                }
            }
        }

        if (inputChanged === 'id_cliente') {
            if( dataForm.id_cliente === '0' ){                
                errorObject.idError = 2
                errorObject.msg = "El campo CLIENTE es obligatorio. Seleccione una opcion."
                if (!contieneError(errorObject.idError)) {
                    setErrorsArray([ ...errorsArray, errorObject ])
                }

            } else {
                if (contieneError(2)) {
                    setErrorsArray(eliminarErrorDelArray(2))
                }
            }
        }
        
        if (inputChanged === 'name') {
            if (dataForm.name === '' || validateContieneEspacios(dataForm.name)) {
                errorObject.idError = 3
                errorObject.msg = "El campo NOMBRE es obligatorio. No debe contener espaciones vacios seguidos."
                if (!contieneError(errorObject.idError)) {
                    setErrorsArray([ ...errorsArray, errorObject ])
                }
            } else {
                if (contieneError(3)) {
                    setErrorsArray(eliminarErrorDelArray(3))
                }
            }
        }

        if (inputChanged === 'email') {
            if (!validateCorreo(dataForm.email)) {
                errorObject.idError = 4
                errorObject.msg = "El campo EMAIL es obligatorio. Debe ingresar un correo valido."
                if (!contieneError(errorObject.idError)) {
                    setErrorsArray([ ...errorsArray, errorObject ])
                }
            } else {
                if (contieneError(4)) {
                    setErrorsArray(eliminarErrorDelArray(4))
                }
            }
        }
        
        if (inputChanged === 'password') {
            let errorObjectP = { idError: null, msg: null }
            if (!validatePassword(dataForm.password)) {
                errorObjectP.idError = 5
                errorObjectP.msg = "El campo PASSWORD es obligatorio. No debe contener espacios. Minimo 12 caracteres."
                if (!contieneError(5)) {
                    setErrorsArray([ ...errorsArray, errorObjectP ])
                }

            } else {
                if (contieneError(5)) {
                    setErrorsArray(eliminarErrorDelArray(5))
                }
            }
            let errorObjectE = { idError: null, msg: null }
            if (dataForm.password !== dataForm.password_confirmation) {
                errorObjectE.idError = 0
                errorObjectE.msg = "El campo PASSWORD y CONFIRMAR deben ser iguales."
                if (!contieneError(0)) {
                    setErrorsArray([ ...errorsArray, errorObjectE ])
                }

            } else {
                if (contieneError(0)) {
                    setErrorsArray(eliminarErrorDelArray(0))
                }
            }
        }

        if (inputChanged === 'password_confirmation') {
            let errorObjectPC = { idError: null, msg: null }
            if (!validatePassword(dataForm.password_confirmation)) {
                errorObjectPC.idError = 6
                errorObjectPC.msg = "El campo Confirmar PASSWORD es obligatorio. No debe contener espacios. Minimo 12 caracteres."
                if (!contieneError(6)) {
                    setErrorsArray([ ...errorsArray, errorObjectPC ])
                }

            } else {
                if (contieneError(6)) {
                    setErrorsArray(eliminarErrorDelArray(6))
                }
            }
            let errorObjectE = { idError: null, msg: null }
            if (dataForm.password !== dataForm.password_confirmation) {
                errorObjectE.idError = 0
                errorObjectE.msg = "El campo PASSWORD y CONFIRMAR deben ser iguales."
                if (!contieneError(0)) {
                    setErrorsArray([ ...errorsArray, errorObjectE ])
                }

            } else {
                if (contieneError(0)) {
                    setErrorsArray(eliminarErrorDelArray(0))
                }
            }
            
        }

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputChanged(name)
        setDataPostUsuario(prevState => ({  
            ...prevState,
            [name]: value
        }));
    
    };

    useEffect(() => {
            getPerfilesList();
            getAllClientes();   
    }, []);
    
    useEffect(()=>{
        console.log(errorsArray);
        if (errorsArray.length === 0 && validateDataFormBtn(dataPostUsuario) ) {
            setBtnDisable(false)
        } else {
            setBtnDisable(true)
        }
    }, [errorsArray])

    useEffect(() =>{
        validateForm( dataPostUsuario )
    },[dataPostUsuario])

    /* useEffect(()=>{
        if (!formValid) {
            setFormValid(true)
        }
    },[formValid]) */
    return ( 
        <Modal show={ show } onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="mb-3">
                        <label htmlFor="inputPerfil" className="form-label">Perfil</label>
                        <select id="inputPerfil" 
                                name="id_perfil"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataPostUsuario.id_perfil}
                                onChange={handleInputChange}>
                            { agregarOpcionesSelect() }
                        </select>
                        {contieneError(1) && <div className="text-danger fw-medium">{getErrorMsg(1)}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputCliente" className="form-label">Cliente</label>
                        <select id="inputCliente" 
                                name="id_cliente"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataPostUsuario.id_cliente}
                                onChange={handleInputChange}>
                            { renderFiltroClientes() }
                        </select>
                        {contieneError(2) && <div className="text-danger fw-medium">{ getErrorMsg(2) }</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputName" className="form-label">Nombre:</label>
                        <input type="text" className="form-control mb-2" id="inputName" name="name"
                                placeholder="Nombre:"
                                value={dataPostUsuario.name}
                                onChange={handleInputChange}/>
                        {contieneError(3) && <div className="text-danger fw-medium">{ getErrorMsg(3) }</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email"
                                placeholder="name@example.com"
                                value={dataPostUsuario.email}
                                onChange={handleInputChange}/>
                        {contieneError(4) && <div className="text-danger fw-medium">{ getErrorMsg(4) }</div>}
                    </div>
                    <div className="mb-3">
                            <div className="row d-flex justify-content-start align-items-center m-0">
                                <div className="col m-0 ps-0">
                                    <label htmlFor="inputPassword" className="form-label">Password</label>
                                    <input type={ showPassword ? ('text') : ('password') } id="inputPassword" className="form-control" 
                                    aria-describedby="passwordHelpBlock" name="password" value={dataPostUsuario.password}
                                    onChange={handleInputChange}/>
                                </div>
                                <div className="col-1 m-0 ps-0 mt-4 pt-1">
                                    <OverlayTrigger trigger={'hover'} overlay={popoverGenerarContraseña}>
                                        <button className="btn btn-primary btn-sm btn-icon-fix btn-icon-style" onClick={ asignarContraseñaAutomatico }>
                                            <ion-icon name="reload-outline"></ion-icon>
                                        </button>
                                    </OverlayTrigger>
                                    
                                </div>
                            </div>
                            {contieneError(5) && <div className="text-danger fw-medium">{getErrorMsg(5)}</div>}
                            {contieneError(0) && <div className="text-danger fw-medium">{ getErrorMsg(0) }</div>}
                    </div>
                    <div className="mb-3">
                        <div className="row d-flex justify-content-start align-items-center m-0">
                            <div className="col m-0 ps-0">
                                <label htmlFor="inputPasswordConfirmar" className="form-label">Confirmar Password</label>
                                <input type={ showPassword ? ('text') : ('password') } id="inputPasswordConfirmar" name="password_confirmation"
                                    className="form-control" 
                                    aria-describedby="passwordHelpBlock"
                                    value={dataPostUsuario.password_confirmation}
                                    onChange={handleInputChange}/>
                            </div>
                            <div className="col-1 m-0 ps-0 mt-4 pt-1">
                            <OverlayTrigger trigger={'hover'} overlay={popoverContraseña}>
                                <button className="btn btn-primary btn-sm btn-icon-fix btn-icon-style" onClick={ changeShowPassword }>
                                    { !showPassword ? (<ion-icon name="eye-off-outline"></ion-icon>) : (<ion-icon name="eye-outline"></ion-icon>)}
                                </button>
                            </OverlayTrigger>
                            </div>
                        </div>
                        {contieneError(6) && <div className="text-danger fw-medium">{ getErrorMsg(6) }</div>}
                        {contieneError(0) && <div className="text-danger fw-medium">{ getErrorMsg(0) }</div>}
                    </div>
                    
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" disabled={btnDisable}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>

     )
}

export default ModalCrearUsuario;