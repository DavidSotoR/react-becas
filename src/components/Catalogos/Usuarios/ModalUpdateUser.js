import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

function ModalUpdateUser({ show, handleCloseModal, dataUser }) {
    const { logout } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [ btnEnable, setBtnEnable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ allClientes, setAllClientes ] = useState([])
    const [ user, setUser ] = useState(dataUser)
    const [ formValid, setFormValid ] = useState(true)
    const [ dataUpdateUsuario ,setDataUpdateUsuario ] = useState(undefined)
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getPerfilesList = async () => {
        try {
            const resp = await axios.get(APIURL+'/perfiles', config);
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

    const handleInputChange = (e) => {
        var { name, value } = e.target;
        console.log(name, value);
        if (name === 'id_cliente' || name === 'id_perfil') {
            value = parseInt(value,10)
        }
        setDataUpdateUsuario(prevState => ({  
            ...prevState,
            [name]: value
        }));

        validateField(name,value)

    };

    const agregarOpcionesSelect = () => {
        return [
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

    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "name":
                if (!value) errorMsg = "El nombre es requerido";
                break;
            case "email":
                if (!value) errorMsg = "El email es requerido";
                else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "El email no es válido";
                break;
            case "id_perfil":
                if(value === '0') errorMsg = "Debe seleccionar un perfil";
                break
            case "id_cliente":
                if (value === '0') errorMsg = "Debe asignar un cliente al Usuario"
            default:
                break;
        }

        if (errorMsg === "") {
            setFormValid(false)
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: errorMsg
        }));
        
    };

    const sendActualizarUsuario = () => {
        
        var dataUpdate = {
            id: dataUpdateUsuario.id,
            id_perfil: dataUpdateUsuario.id_perfil,
            name: dataUpdateUsuario.name,
            email: dataUpdateUsuario.email,
            id_cliente: dataUpdateUsuario.id_cliente
        }

        console.log(dataUpdate);
        if (dataUpdate.id_cliente === null || dataUpdate.id_cliente === undefined) {
            setFormValid(false)
            alert('Se debe asignar un cliente a Usuario')
        } else {
            axios.put(APIURL+'/usuarios',dataUpdate,config).then((resp)=>{
                console.log(resp);
                handleCloseModal()
            }).catch((error)=>{
                console.log(error);
            })
        }
        

    }

    useEffect(() => {
        getPerfilesList();
        getAllClientes();
    }, [APIURL]);

    useEffect(()=>{
        console.log(user);
        if (!dataUpdateUsuario) {
            setDataUpdateUsuario(user)
        }
    },[])
    return(
        <Modal show={ show } onHide={ handleCloseModal }>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="mb-3">
                <label htmlFor="inputCliente" className="form-label">Cliente</label>
                <select id="inputCliente" 
                        name="id_cliente"
                        className="form-select mb-2" 
                        aria-label="Default select example"
                        value={dataUpdateUsuario?.id_cliente ?? '0'}
                        onChange={handleInputChange}>
                    { user.id_cliente === null &&
                        <option key={'0'} value={'0'} selected={true}> Sin asignar </option>
                    }
                    { renderFiltroClientes() }
                </select>
                {errors.id_perfil && <div className="text-danger fw-medium">{errors.id_perfil}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="inputName" className="form-label">Nombre:</label>
                    <input type="text" className="form-control mb-2" id="inputName" name="name"
                            placeholder="Nombre:"
                            value={dataUpdateUsuario?.name ?? ''}
                            onChange={handleInputChange}/>
                    {errors.name && <div className="text-danger fw-medium">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail" name="email"
                            placeholder="name@example.com"
                            value={dataUpdateUsuario?.email ?? ''}
                            onChange={handleInputChange}/>
                    {errors.email && <div className="text-danger fw-medium">{errors.email}</div>}
                </div>
                {/* <div className="mb-3">
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
                </div> */}
                <div className="mb-3">
                    <label htmlFor="inputPerfil" className="form-label">Perfil</label>
                    <select id="inputPerfil" 
                            name="id_perfil"
                            className="form-select mb-2" 
                            aria-label="Default select example"
                            value={dataUpdateUsuario?.id_perfil ?? '1'}
                            onChange={handleInputChange}>
                        { agregarOpcionesSelect() }
                    </select>
                    {errors.id_perfil && <div className="text-danger fw-medium">{errors.id_perfil}</div>}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" disabled={formValid} onClick={ sendActualizarUsuario }>
                    Actualizar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalUpdateUser;