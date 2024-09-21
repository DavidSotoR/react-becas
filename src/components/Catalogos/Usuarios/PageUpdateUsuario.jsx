import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";

export default function PageUpdateUsuario() {
    const { id } = useParams();
    const { logout } = useContext(AuthContext);
    const [esExterno, setEsExterno] = useState(false);
    const navigate = useNavigate()


    const [errors, setErrors] = useState({});
    const [ btnEnable, setBtnEnable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ inputChanged, setInputChanged ] = useState('')

    const [ allClientes, setAllClientes ] = useState([])
    const [ user, setUser ] = useState({})
    const [errorsArray, setErrorsArray] = useState([]);
    const [listExterno, setListExterno] = useState([]);
    const [listInterno, setListInterno] = useState([]);
    const [ btnDisable, setBtnDisable ] = useState(true)
    const [ cuentaConUbicacion, setCuentaConUbicacion ] = useState(false)

    const [ dataUpdateUsuario, setDataUpdateUsuario ] = useState({
        id: 0,
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "0",
        id_cliente: "0",
        externo: false,
        latitud: '',
        longitud: ''
    })


    const [ formValid, setFormValid ] = useState(true)
    //const [ dataUpdateUsuario ,setDataUpdateUsuario ] = useState(undefined)
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
            var listExt = resp.data;
            var int = []
            var ext = []
            listExt.forEach(element => {
                if (element.interno) {
                    int.push(element)
                } else {
                    ext.push(element)
                }
            });
            setListExterno(ext)
            setListInterno(int)
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

    };

    const contieneError = (idError)=>{
        var exists = errorsArray?.some(function(error) {
            return error.idError === idError;
        });
        return exists;
    }


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

    const changeIsExterno = ()=> {
        setEsExterno(!esExterno)
    }

    const changeCuentaUbicacion = ()=> {
        setCuentaConUbicacion(!cuentaConUbicacion)
    }

    const renderFiltroClientesInt = () => {
        return [<option key="cliente-0" value="0" selected>
            Seleccione uno
        </option>,,...listInterno.map((cliente) => (
            <option key={cliente.id} value={`${cliente.id}`}>
                { cliente.nombre }
            </option>
        ))]
    }

    const renderFiltroClientesExt = () => {
        return [<option key="cliente-0" value="0" selected>
            Seleccione uno
        </option>,,...listExterno.map((cliente) => (
            <option key={cliente.id} value={`${cliente.id}`}>
                { cliente.nombre }
            </option>
        ))]
    }

    const validateDataFormBtn = (obj) => {
        for (let key in obj) {
            // Ignora la validación de 'id_cliente' si 'isExterno' es false
        if ((key === "longitud" && !esExterno) || (key === "latitud" && !esExterno) ||
            (key === "longitud" && esExterno) || (key === "latitud" && esExterno) || (key === "id_cliente" && !esExterno) || (obj[key] !== "" && obj[key] !== "0")) {
            continue; // Continúa con la siguiente iteración del bucle
        }
        
        // Verifica si alguna propiedad del objeto tiene un valor "" o "0"
        if (obj[key] === "" || obj[key] === "0") {
            return false; // El objeto es inválido
        }
        }
        return true; // El objeto es válido
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
    
    const validateForm = (dataForm) => {
        var errorObject = { idError: null, msg: null}

        if (inputChanged === 'id_perfil') {
            if (dataForm.id_perfil === '5' || dataForm.id_perfil === '6') {
                setEsExterno(true)
            } else {
                setEsExterno(false)
                if (contieneError(2)) {
                    setErrorsArray(eliminarErrorDelArray(2))
                }
            }
            
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
        }

        if (inputChanged === 'password_confirmation') {
            let errorObjectPC = { idError: null, msg: null }
            if (dataForm.password !== dataForm.password_confirmation) {
                errorObjectPC.idError = 0
                errorObjectPC.msg = "El campo PASSWORD y CONFIRMAR deben ser iguales."
                if (!contieneError(0)) {
                    setErrorsArray([ ...errorsArray, errorObjectPC ])
                }

            } else {
                if (contieneError(0)) {
                    setErrorsArray(eliminarErrorDelArray(0))
                }
            }
            
        }

    }


    const sendActualizarUsuario = () => {
        
        var dataUpdate = {
            id: dataUpdateUsuario.id,
            id_perfil: dataUpdateUsuario.id_perfil,
            name: dataUpdateUsuario.name,
            email: dataUpdateUsuario.email,
            id_cliente: dataUpdateUsuario.id_cliente,
            latitud: dataUpdateUsuario.latitud,
            externo: esExterno ? 1 : 0,
            longitud: dataUpdateUsuario.longitud
        }

        console.log(dataUpdate);
        if ( esExterno && (dataUpdate.id_cliente === null || dataUpdate.id_cliente === undefined)) {
            setFormValid(false)
            alert('Se debe asignar un cliente a Usuario')
        } else {
            axios.put(APIURL+'/usuarios',dataUpdate,config).then((resp)=>{
                console.log(resp);
                navigate(PathConstants.USUARIOS)
            }).catch((error)=>{
                console.log(error);
            })
        }
        

    }

    const getErrorMsg = (idError) => {
        var index = errorsArray.findIndex(function(error) {
            return error.idError === idError;
        });

        return errorsArray[index].msg
    }

    const getUsuarioID = () => {
        axios.get(APIURL+"/usuarios/"+id, config).then((resp)=>{
            console.log(resp);
            setDataUpdateUsuario(resp.data)
            var data = resp.data
            console.log(data.externo === 1);
            
            setEsExterno(data.externo === 1)
            setCuentaConUbicacion( data.latitud !== '' || data.longitud !== '' )
            if (errorsArray.length === 0 && validateDataFormBtn(resp.data)) {
                setBtnDisable(false)
                
            }
        }).catch((err)=>{
            console.log(err);
            
        })
    }

    /* useEffect(() => {
        getPerfilesList();
        getAllClientes();
    }, [APIURL]); */

    useEffect(()=>{
        console.log(errorsArray);
        if (errorsArray.length === 0 && validateDataFormBtn(dataUpdateUsuario) ) {
            setBtnDisable(false)
        } else {
            setBtnDisable(true)
        }
    }, [errorsArray])

    useEffect(() =>{
        validateForm( dataUpdateUsuario )
    },[dataUpdateUsuario])

    useEffect(()=>{
        //console.log(user);
        getPerfilesList();
        getAllClientes();
        getUsuarioID()
        /* if (!dataUpdateUsuario) {
            setDataUpdateUsuario(user)
        } */
    },[])
    return(
        <div className="container">
            <div className="">
                <h6 style={{ fontWeight: 'bold' }}>Actualizar Usuario</h6>
            </div>
            <div className="row mb-3">

                    <div className="col-12 mb-3">
                        <Form.Check type="switch" className="mx-2">
                            <Form.Check.Input checked={ esExterno } name="externo" onChange={()=> { changeIsExterno() }} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Es externo </span></Form.Check.Label>
                        </Form.Check>
                        
                    </div>

                    <div className="col-5 mb-3">
                        <label htmlFor="inputPerfil" className="form-label">Perfil</label>
                        <select id="inputPerfil" 
                                name="id_perfil"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataUpdateUsuario.id_perfil}
                                onChange={handleInputChange}>
                            { esExterno ? renderFiltroClientesExt() : renderFiltroClientesInt() }
                        </select>
                        {contieneError(1) && <div className="text-danger fw-medium">{getErrorMsg(1)}</div>}
                    </div>
                    <div className="col-5 mb-3" style={ esExterno ? { display: "block" } : { display: "none" } }>
                        <label htmlFor="inputCliente" className="form-label">Cliente</label>
                        <select id="inputCliente" 
                                name="id_cliente"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataUpdateUsuario.id_cliente}
                                onChange={handleInputChange}>
                            { renderFiltroClientes() }
                        </select>
                        {contieneError(2) && <div className="text-danger fw-medium">{ getErrorMsg(2) }</div>}
                    </div>
                    <div className="col-5 mb-3">
                        <label htmlFor="inputName" className="form-label">Nombre:</label>
                        <input type="text" className="form-control mb-2" id="inputName" name="name"
                                placeholder="Nombre:"
                                value={dataUpdateUsuario.name}
                                onChange={handleInputChange}/>
                        {contieneError(3) && <div className="text-danger fw-medium">{ getErrorMsg(3) }</div>}
                    </div>

                    <div className="col-5 mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email"
                                placeholder="name@example.com"
                                value={dataUpdateUsuario.email}
                                onChange={handleInputChange}/>
                        {contieneError(4) && <div className="text-danger fw-medium">{ getErrorMsg(4) }</div>}
                    </div>

                    <div className="col-12" style={{ display: !esExterno ? 'block' : 'none' }}>
                        <h6 className="fw-bold"> Ubicacion del Usuario </h6>
                        <div className="mb-3">
                            <Form.Check type="switch" className="mx-2">
                                <Form.Check.Input checked={cuentaConUbicacion} name="ubicacion" onChange={()=> { changeCuentaUbicacion() }} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Usuario cuenta con ubicación </span></Form.Check.Label>
                            </Form.Check>
                            
                        </div>
                        {   cuentaConUbicacion &&
                            <div className="row">
                                <div className="col-5">
                                    <label htmlFor="inputLong" className="form-label">Longitud:</label>
                                    <input type="text" className="form-control mb-2" id="inputLong" name="longitud"
                                            placeholder="Longitud:" value={ dataUpdateUsuario.longitud }
                                            onChange={handleInputChange}/>
                                </div>
                                <div className="col-5">
                                    <label htmlFor="inputLat" className="form-label">Latitud:</label>
                                    <input type="text" className="form-control mb-2" id="inputLat" name="latitud"
                                            placeholder="Latitud:" value={ dataUpdateUsuario.latitud }
                                            onChange={handleInputChange}/>
                                </div>
                            </div>
                        }
                        
                    </div>
                </div>
            <div className="d-flex">
                <Link className="btn btn-secondary mx-2" to={PathConstants.USUARIOS} variant="secondary" >
                    Cancelar
                </Link>
                <Button className="mx-2" variant="primary" disabled={btnDisable} onClick={ sendActualizarUsuario }>
                    Actualizar
                </Button>
            </div>
        </div>
            
    )
}