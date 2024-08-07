import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import ControllerUsuarios from "./ControllersUsuarios";

function ModalCrearUsuario({ show, handleClose }) {
    const [ formValid, setFormValid ] = useState(null)
    const [errors, setErrors] = useState({});
    const APIURL = process.env.REACT_APP_API_URL
    const { GenerarPassword } = ControllerUsuarios();
    const { logout } = useContext(AuthContext);
    const [ btnEnable, setBtnEnable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ allClientes, setAllClientes ] = useState([])
    const [ showPassword, setShowPassword ] = useState(false)
    const [ dataPostUsuario, setDataPostUsuario ] = useState({
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "0"
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
        return [...allClientes.map((cliente) => (
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
        validateField('password',newPass)
        validateField('password_confirmation',newPass)
        console.log(dataPostUsuario);
    }

    const changeShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "name":
                if (!value) errorMsg = "El nombre es requerido";
                break;
            case "email":
                if (!value) errorMsg = "El email es requerido";
                else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "El email no es válido";
                else if (value.includes(" ")) errorMsg = "El campo email no debe contener espacios vacios."
                break;
            case "password":
                if (!value) errorMsg = "La contraseña es requerida";
                else if (!/(?=.*[A-Z])(?=.*\d)/.test(value)) errorMsg = "La contraseña debe contener al menos una letra mayúscula y un número";
                break;
            case "password_confirmation":
                if (value !== dataPostUsuario.password) errorMsg = "Las contraseñas no coinciden";
                break;
            case "id_perfil":
                if(value === '0') errorMsg = "Debe seleccionar un perfil";
                break
            default:
                break;
        }

        console.log(errorMsg);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: errorMsg
        }));
        
        const hasErrors = Object.values(errors).some(err => err !== "") || errorMsg !== "";
        const allFieldsFilled = Object.values(dataPostUsuario).every(val => val !== "");
        console.log('El valor allfieldsfilled: ', allFieldsFilled);
        setBtnEnable(hasErrors, !allFieldsFilled);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        console.log(name === 'email');
        if (name === 'email' || name === 'password' || name === 'password_confirmation'){
            setDataPostUsuario(prevState => ({  
                ...prevState,
                [name]: value.trim()
            }));
        } else {
            setDataPostUsuario(prevState => ({  
                ...prevState,
                [name]: value
            }));
        }
        

        validateField(name,value)

    };

    useEffect(() => {
        if (APIURL) {
            getPerfilesList();
            getAllClientes();   
        }
    }, [APIURL]);
    
    useEffect(()=>{
        if (!formValid) {
            setFormValid(true)
        }
    },[formValid])
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
                        {errors.id_perfil && <div className="text-danger fw-medium">{errors.id_perfil}</div>}
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
                    {errors.id_perfil && <div className="text-danger fw-medium">{errors.id_perfil}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputName" className="form-label">Nombre:</label>
                        <input type="text" className="form-control mb-2" id="inputName" name="name"
                                placeholder="Nombre:"
                                value={dataPostUsuario.name}
                                onChange={handleInputChange}/>
                        {errors.name && <div className="text-danger fw-medium">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email"
                                placeholder="name@example.com"
                                value={dataPostUsuario.email}
                                onChange={handleInputChange}/>
                        {errors.email && <div className="text-danger fw-medium">{errors.email}</div>}
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
                            {errors.password && <div className="text-danger fw-medium">{errors.password}</div>}
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
                        {errors.password_confirmation && <div className="text-danger fw-medium">{errors.password_confirmation}</div>}
                    </div>
                    
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>

     )
}

export default ModalCrearUsuario;