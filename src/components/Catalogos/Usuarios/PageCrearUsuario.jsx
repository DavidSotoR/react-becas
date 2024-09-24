import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ControllerUsuarios from "./ControllersUsuarios";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import axios from "axios";
import PathConstants from "../../../routes/pathsConstants";

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';

import { Link, useNavigate } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';


export default function PageCrearUsuario () {
    const navigate = useNavigate()
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [esExterno, setEsExterno] = useState(false);
    const [direcciones,direccionesSet] = useState([])
    const [placeId,placeIdSet] = useState('')
    const [direccionUser, setDireccionUser] = useState('')

    const [latUser, setLatUser] = useState('')
    const [lonUser, setLonUser] = useState('')

    const [colaboradores,setColaboradores] = useState([])

    const [listExterno, setListExterno] = useState([]);
    const [listInterno, setListInterno] = useState([]);
    const [ inputChanged, setInputChanged ] = useState('')
    const [errorsArray, setErrorsArray] = useState([]);
    const { GenerarPassword } = ControllerUsuarios();
    const [ btnDisable, setBtnDisable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ allClientes, setAllClientes ] = useState([])
    const [ showPassword, setShowPassword ] = useState(false)
    const [ cuentaConUbicacion, setCuentaConUbicacion ] = useState(false)
    const [ dataPostUsuario, setDataPostUsuario ] = useState({
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "0",
        id_cliente: "0",
        direccion: "",
        latitud: '',
        longitud: ''
    })

    //Map Icon
    const customIcon = L.icon({
        iconUrl: '/public/img/ping-map.png',
        iconSize: [38, 95], // size of the icon
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
      });
    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });
    
    L.Marker.prototype.options.icon = DefaultIcon;
    

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

    const getDireccionGSP = () => {
        if(dataPostUsuario.direccion.length<5){
            direccionesSet()
        }
        axios.get(`https://nominatim.openstreetmap.org/search?q=${direccionUser}&format=json&addressdetails=1`,config).then((resp)=>{
            direccionesSet(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const getAllClientes = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes', config)
            setAllClientes(resp.data)
        } catch (error) {
            console.log(error);
            
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
        console.log(obj);
        
        for (let key in obj) {
            // Ignora la validación de 'id_cliente' si 'isExterno' es false
            if ((key === "longitud" && !esExterno) || (key === "latitud" && !esExterno) ||
                (key === "longitud" && esExterno) || (key === "latitud" && esExterno) || 
                (key === "id_cliente" && !esExterno) || key === 'direccion' /* || (obj[key] !== "" && obj[key] !== "0") */) {
                continue; // Continúa con la siguiente iteración del bucle
            }
            
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


    const changeIsExterno = ()=> {
        setEsExterno(!esExterno)
    }

    const changeDireccion = (e)=>{
        var dir = e.target.value
        setDireccionUser(dir)
    }

    const changeCuentaUbicacion = ()=> {
        setCuentaConUbicacion(!cuentaConUbicacion)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setInputChanged(name)
        setDataPostUsuario(prevState => ({  
            ...prevState,
            [name]: value
        }));
    
    };

    const seccionUbicaciones = () => {
        {JSON.stringify(direcciones)}
        return (
          <div>
            {Array.isArray(direcciones) && direcciones.slice(0, 5).map((direccion, index) => (
              <div 
                key={'asu-' + index} 
                className="row rounded border mt-1 p-1" 
                style={{ backgroundColor: (direccion.place_id === placeId) ? '#47E58A' : '' , cursor:'pointer' }}
                onClick={() => seleccionarUbicacion(direccion)}
              >
                <div className="col-1">
                    <img src="/img/ping-map.png" style={{width:'80%'}}/>
                </div>
                <div className="col-10">
                  <div>{direccion.display_name}</div>
                  <div style={{fontSize:'.8em'}}>{direccion.lat}, {direccion.lon}</div>
                </div>
              </div>
            ))}
          </div>
        );
    }

    const seleccionarUbicacion = (direccion) => {
        placeIdSet(direccion.place_id);
        setLatUser(direccion.lat)
        setLonUser(direccion.lon)
        setDataPostUsuario(prevState => ({
            ...prevState,
            latitud: direccion.lat,
            longitud: direccion.lon
        }));
    }

    const cricleColaboradores = () => {
        //console.log(colaboradores);
        const colaboradoresFiltro = colaboradores.filter(colaborador => colaborador.latitud);
        //console.log(colaboradoresFiltro);
        return <>{colaboradoresFiltro.map((colaborador,index) => 
            (<Circle key={'cum-'+index} center={[colaborador.latitud, colaborador.longitud]} radius="200" pathOptions={{ color: 'blue' }}>
                <Popup>
                {colaborador.name}
                </Popup>
            </Circle>)
            )} </>
    }

    
    const postCrearUsuario = async () => {
        var data = {
            name: dataPostUsuario.name,
            email: dataPostUsuario.email,
            password: dataPostUsuario.password,
            password_confirmation: dataPostUsuario.password_confirmation,
            id_cliente: esExterno ? dataPostUsuario.id_cliente : null,
            id_perfil: parseInt(dataPostUsuario.id_perfil,10),
            externo: esExterno ? 1 : 0,
            latitud: latUser,
            longitud: lonUser,
            direccion: direccionUser
        }

        try {
            const resp = await axios.post(APIURL+'/register', data, config)
            console.log(resp);
            navigate(PathConstants.USUARIOS);
        } catch (error) {
            console.log(error);

            if (error.response.status === 401) {
                logout()
            }
        }   
    }

    useEffect(()=>{
        if (direccionUser.length >= 3) {
            getDireccionGSP();
            /* setLatUser(direccionUser.lat)
            setLonUser(direccionUser.lon) */
        }
        
    },[direccionUser])

    useEffect(() => {
            getPerfilesList();
            getAllClientes();   
    }, []);
    
    useEffect(()=>{
        console.log(validateDataFormBtn(dataPostUsuario));
        if (errorsArray.length === 0 && validateDataFormBtn(dataPostUsuario) ) {
            setBtnDisable(false)
        } else {
            setBtnDisable(true)
        }
    }, [errorsArray])

    useEffect(() =>{
        validateForm( dataPostUsuario )
    },[dataPostUsuario])

    return (
            <div className="container">
                <div className="">
                    <h6 style={{ fontWeight: 'bold' }}>Crear Usuarios</h6>
                </div>
                <div className="row mb-3">

                    <div className="col-12 mb-3">
                        <Form.Check type="switch" className="mx-2">
                            <Form.Check.Input name="externo" onChange={()=> { changeIsExterno() }} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Es externo </span></Form.Check.Label>
                        </Form.Check>
                        
                    </div>

                    <div className="col-5 mb-3">
                        <label htmlFor="inputPerfil" className="form-label">Perfil</label>
                        <select id="inputPerfil" 
                                name="id_perfil"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataPostUsuario.id_perfil}
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
                                value={dataPostUsuario.id_cliente}
                                onChange={handleInputChange}>
                            { renderFiltroClientes() }
                        </select>
                        {contieneError(2) && <div className="text-danger fw-medium">{ getErrorMsg(2) }</div>}
                    </div>
                    <div className="col-5 mb-3">
                        <label htmlFor="inputName" className="form-label">Nombre:</label>
                        <input type="text" className="form-control mb-2" id="inputName" name="name"
                                placeholder="Nombre:"
                                value={dataPostUsuario.name}
                                onChange={handleInputChange}/>
                        {contieneError(3) && <div className="text-danger fw-medium">{ getErrorMsg(3) }</div>}
                    </div>

                    <div className="col-5 mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email"
                                placeholder="name@example.com"
                                value={dataPostUsuario.email}
                                onChange={handleInputChange}/>
                        {contieneError(4) && <div className="text-danger fw-medium">{ getErrorMsg(4) }</div>}
                    </div>

                    <div className="col-12 row">
                        <div className="col-12 col-md-5 col-sm-7 mb-3">
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
                        <div className="col-12 col-md-5 col-sm-7 mb-3">
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
                    <div className="col-12" style={{ display: !esExterno ? 'block' : 'none' }}>
                        <h6 className="fw-bold"> Ubicacion del Usuario </h6>
                        <div className="mb-3">
                            <Form.Check type="switch" className="mx-2">
                                <Form.Check.Input name="ubicacion" onChange={()=> { changeCuentaUbicacion() }} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Usuario cuenta con ubicación </span></Form.Check.Label>
                            </Form.Check>
                            
                        </div>
                        
                        { cuentaConUbicacion &&
                                <div className="row">
                                    
                                <div className="col-sm-10 col-md-5">
                                    <label htmlFor="direccion" className="form-label">
                                        Direccion:
                                    </label>
                                    <input type="text" value={direccionUser} className="form-control" id="direccion" name="direccion" onChange={(e)=> {changeDireccion(e)}} placeholder="Dirección..."/>
                                </div>
                                <div className="col-5">
                                    <label htmlFor="inputLong" className="form-label">Longitud:</label>
                                    <input type="text" className="form-control mb-2" id="inputLong" name="longitud"
                                            placeholder="Longitud:" value={lonUser}
                                            onChange={handleInputChange}/>
                                </div>
                                <div className="col-5">
                                    <label htmlFor="inputLat" className="form-label">Latitud:</label>
                                    <input type="text" className="form-control mb-2" id="inputLat" name="latitud"
                                            placeholder="Latitud:" value={latUser}
                                            onChange={handleInputChange}/>
                                </div>
                                <div className="col-12">
                                    {seccionUbicaciones()}
                                        <MapContainer center={[dataPostUsuario.latitud, dataPostUsuario.longitud]} zoom={13} style={{ height: "50vh", width: "100%" }}>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                icon={customIcon}
                                            />
                                            <Marker position={[dataPostUsuario.latitud, dataPostUsuario.longitud]}>
                                                <Popup>
                                                ¡Hola! Este es un cuadro de texto en un popup.
                                                </Popup>
                                            </Marker>
                                            {cricleColaboradores()}
                                        </MapContainer>                                
                                

                                </div>
                            </div>
                        
                        }
                        
                    </div>
                </div>
                

                <div className="d-flex mb-3">
                    {/* <Button variant="secondary">
                        Cancelar
                    </Button> */}
                    <Link className="btn btn-secondary mx-2" to={PathConstants.USUARIOS}>Cancelar</Link>
                    <Button className="mx-2" variant="primary" disabled={btnDisable} onClick={ postCrearUsuario}>
                        Crear Usuario
                    </Button>
                </div>
                
            </div>
    )

}