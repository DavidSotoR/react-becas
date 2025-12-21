import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function PageUpdateUsuario() {
    const { id } = useParams();
    const { logout } = useContext(AuthContext);
    const [esExterno, setEsExterno] = useState(false);
    const [ disableForm, setDisableForm ] = useState(false);
    const navigate = useNavigate()

    const [direcciones,direccionesSet] = useState([])
    const [ direccionSelected, setDireccionSelected ] = useState(false);
    const [placeId,placeIdSet] = useState('')
    const [direccionUser, setDireccionUser] = useState(null)

    const [latUser, setLatUser] = useState('')
    const [lonUser, setLonUser] = useState('')

    const [ resetPassword, setResetPassword ] = useState(false)
    const [ spinReset, setSpinReset ] = useState(false);


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
    const [ cuentaConUbicacion, setCuentaConUbicacion ] = useState(true)
    const [colaboradores,setColaboradores] = useState([])

    const [ dataResetContrasena, setDataResetContrasena ] = useState({
        id: localStorage.getItem('id'),
        password_nueva: '',
        password_confirmar: ','
    })

    const [ dataUpdateUsuario, setDataUpdateUsuario ] = useState({
        id: 0,
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "0",
        id_cliente: "0",
        externo: false,
        latitud:25.67507,
        longitud:-100.31847,
        direccion: '',
        calle:'',
        numero_exterior:'',
        colonia:'',
        municipio:'',
        estado:'',
        codigo_postal:'',
        pais:'',
    })


    const [ formValid, setFormValid ] = useState(true)
    //const [ dataUpdateUsuario ,setDataUpdateUsuario ] = useState(undefined)
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

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

    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }

    const handleInputChange = (e) => {
        var { name, value } = e.target;
        console.log(name, value);
        if (name === 'id_cliente' || name === 'id_perfil') {
            value = parseInt(value,10)
        }

        if ((name === "calle") || (name === "numero_exterior") ||  (name === "colonia") || 
        (name === "municipio") || (name === "estado") ||  (name === "codigo_postal") || 
        (name === "pais")) {
            var mayus = convertirAMayusculas(value);
            setDataUpdateUsuario(prevState => ({  
                ...prevState,
                [name]: mayus
            }));
        } else {
            setDataUpdateUsuario(prevState => ({  
                ...prevState,
                [name]: value
            }));
        }

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
        setCuentaConUbicacion(true)
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
        const tieneLongitudMinima = value.length >= 6;
        const sinEspacios = !/\s/.test(value);

        if (sinEspacios && tieneMayuscula && tieneNumero && tieneLongitudMinima) {
            return true;
        } else {
            return false;
        }
    }

    const changeDireccion = (e)=>{
        var dir = convertirAMayusculas(e.target.value)
        //setDireccionUser(dir)
        setDataUpdateUsuario(prevState => ({
            ...prevState,
            direccion: dir,
        }));
    }
    
    const seccionUbicaciones = () => {
        console.log(direcciones);
        
        if (direcciones && (!Array.isArray(direcciones) || direcciones.length === 0)) {
            // Si `direcciones` no es un array válido o está vacío, mostramos un mensaje
            return (<div>
                        <div 
                        className="row rounded border mt-1 p-1 mb-3" 
                        style={{cursor:'pointer' }}
                        >
                            <div className="col-1">
                                <img src="/img/ping-map.png" style={{width:'50%'}}/>
                            </div>
                            <div className="col-10">
                                <div>No se encontraron ubicaciones.</div>
                                <div style={{fontSize:'.8em'}}>Introduzca otra dirección</div>
                            </div>
                        </div>
                    </div>);
        }

        return (
          <div>
              <div 
                key={'asu-' + 1} 
                className="row rounded border mt-1 p-1" 
                style={{ backgroundColor: '#47E58A' , cursor:'pointer' }}
              >
                <div className="col-1">
                    <img src="/img/ping-map.png" style={{width:'50%'}}/>
                </div>
                <div className="col-10">
                  <div>{direccionUser.display_name}</div>
                  <div style={{fontSize:'.8em'}}>{direccionUser.lat}, {direccionUser.lon}</div>
                </div>
              </div>
          </div>
        );
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
            //console.log(data.direccion);
            setResetPassword(data.password_temporal ?? false)

            setEsExterno(data.externo === 1)
            setDireccionUser(data.direccion !== null ? data.direccion : '')
            setLatUser(data.latitud !== null ? data.latitud : '')
            setLonUser(data.longitud !== null ? data.longitud :     '')
            //setCuentaConUbicacion( data.latitud !== '' || data.longitud !== '' )
            getDireccionGSP(data)
            if (errorsArray.length === 0 && validateDataFormBtn(resp.data)) {
                setBtnDisable(false)
                
            }
        }).catch((err)=>{
            console.log(err);
            
        })
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

    function crearDireccion(data) {
        const {
            numero_exterior,
            calle,
            colonia,
            municipio,
            estado,
            codigo_postal,
            pais
        } = data;
    
        return `${numero_exterior ? numero_exterior + ', ' : ''}` +
               `${calle ? calle + ', ' : ''}` +
               `${colonia ? colonia + ', ' : ''}` +
               `${municipio ? municipio + ', ' : ''}` +
               `${estado ? estado + ', ' : ''}` +
               `${codigo_postal ? codigo_postal + ', ' : ''}` +
               `${pais ? pais : ''}`;
    }

    const getDireccionGSP = (data) => {        
        direccionesSet([])
        console.log(data);
        
        var dir = '';
        if (data.direccion === null || data.direccion === '' || (data.latitud === null && data.longitud === null)) {
            return 'Sin datos GSP'
        }
        dir = data.direccion        
        axios.get(`https://nominatim.openstreetmap.org/search?q=${dir}&format=json&addressdetails=1`).then((resp)=>{
            
            var allDirecciones = resp.data
            //console.log(allDirecciones);
            allDirecciones.forEach((dir)=>{
                if (dir.lon == data.longitud && dir.lat == data.latitud) {
                    console.log(dir);
                    setDireccionUser(dir)
                }
            })
            direccionesSet(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const changePassword = (e) =>{
        var valor = e.target.value;
        setDataResetContrasena(prev => ({
            ...prev,
            password_nueva: valor
        }));
    }

    const changePasswordConfirmacion = (e) =>{
        var valor = e.target.value;
        setDataResetContrasena(prev => ({
            ...prev,
            password_confirmar: valor
        }));
    }

    const actualizarContraseña = async () => {
        setSpinReset(true)
        try {
            var resp = await axios.post(APIURL + '/reset/password', dataResetContrasena, config)
            console.log(resp);
            setSpinReset(false)
            setResetPassword(false)
        } catch (error) {
            console.log(error);
            setSpinReset(false)
        }
        
        
    }

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
    },[])

    useEffect(()=>{ 
        if (!direccionSelected) {
            setDataUpdateUsuario(prevState => ({
                ...prevState,
                direccion: crearDireccion(dataUpdateUsuario) //`${fromData.numero_exterior}, ${fromData.calle}, ${fromData.colonia}, ${fromData.municipio}, ${fromData.estado}, ${fromData.codigo_postal}, ${fromData.pais}` 
            }));
        }

    },[
        dataUpdateUsuario.calle,
        dataUpdateUsuario.numero_exterior,
        dataUpdateUsuario.colonia,
        dataUpdateUsuario.municipio,
        dataUpdateUsuario.estado,
        dataUpdateUsuario.codigo_postal,
        dataUpdateUsuario.pais,
    ])

    return(
        <div className="container">
            <div className="">
                <div className="mb-2">
                <Link className="btn btn-primary fw-bold py-1" to={PathConstants.USUARIOS} variant="secondary" >
                    <i className="bi bi-arrow-left-square me-2"></i> Regresar
                </Link>
            </div>
                {/* <h6 style={{ fontWeight: 'bold' }}>Actualizar Usuario</h6> */}
            </div>
            <div className="row mb-3">
                    <div className="col-5 mb-3">
                        <label htmlFor="inputPerfil" className="form-label">Perfil</label>
                        <select disabled={{ disableForm }} id="inputPerfil" 
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
                        <select disabled={{ disableForm }} id="inputCliente" 
                                name="id_cliente"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataUpdateUsuario.id_cliente}
                                onChange={handleInputChange}>
                            { renderFiltroClientes() }
                        </select>
                        {contieneError(2) && <div className="text-danger fw-medium">{ getErrorMsg(2) }</div>}
                    </div>
                    <div className="col-12 col-sm-8 col-md-5 mb-3">
                        <label htmlFor="inputName" className="form-label">Nombre:</label>
                        <input disabled={{ disableForm }} type="text" className="form-control mb-2" id="inputName" name="name"
                                placeholder="Nombre:"
                                value={dataUpdateUsuario.name}
                                onChange={handleInputChange}/>
                        {contieneError(3) && <div className="text-danger fw-medium">{ getErrorMsg(3) }</div>}
                    </div>

                    <div className="col-12 col-sm-8 col-md-5 mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input disabled={{ disableForm }} type="text" className="form-control" id="email" name="email"
                                placeholder="name@example.com"
                                value={dataUpdateUsuario.email}
                                onChange={handleInputChange}/>
                        {contieneError(4) && <div className="text-danger fw-medium">{ getErrorMsg(4) }</div>}
                    </div>

                    { dataUpdateUsuario.id_perfil === 6 &&
                        <div className="col-12 col-sm-8 col-md-5 mb-3">
                            <label htmlFor="password_temporal" className="form-label">PASSWORD TEMPORAL</label>
                            <input disabled={{ disableForm }} type="text" className="form-control" id="password_temporal" name="password_temporal"
                                    value={dataUpdateUsuario.password_temporal}
                                    onChange={handleInputChange}/>
                        </div>
                    }

                    { dataUpdateUsuario.force_password_reset === 1 &&

                    <div className="col-12 row mb-5">
                        <div className="col-12 col-md-6">
                            <h6 className="fw-bold">Cambiar Contraseña:</h6>
                            <input type="text" className="form-control mb-2" id="inputNuevaContraseña" name="inputNuevaContraseña"
                                    placeholder="Nueva Contraseña:" 
                            onChange={(e) => {
                                changePassword(e);
                            }}/>
                            <input type="text" className="form-control mb-2" id="inputNuevaContraseña2" name="inputNuevaContraseña2"
                                    placeholder="Rescribir Contraseña:"
                            onChange={(e) => {
                                changePasswordConfirmacion(e);
                            }}/>
                            { !spinReset ? (
                                <button type="button" className="btn btn-primary" onClick={()=>{ actualizarContraseña() }}>Cambiar Contraseña</button>
                            ):(
                                <div className="spinner-border text-info" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            )

                            }
                            
                        </div>
                        
                    </div>

                    }
                    

                    <div className="col-12">
                        <h6 style={{ fontWeight: 'bold' }}>Dirección del Usuario</h6>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="mb-3 row">
                                    <label htmlFor="calle" className="col-sm-2 col-form-label">Calle:</label>
                                    <div className="col-sm-10">
                                        <input disabled={{ disableForm }} key={"AES-calle"} type="text" className="form-control" id="calle" name="calle" value={dataUpdateUsuario.calle} onChange={(e)=> handleInputChange(e)}/>
                                    </div>
                                    
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="mb-3 row">
                                    <label htmlFor="numero_exterior" className="col-sm-4 col-form-label">No Exterior:</label>
                                    <div className="col-sm-8">
                                        <input disabled={{ disableForm }} key={"AES-numero_exterior"} type="text" className="form-control" id="numero_exterior" name="numero_exterior" value={dataUpdateUsuario.numero_exterior} onChange={(e)=> handleInputChange(e)}/>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mb-3 row">
                                    <label htmlFor="colonia" className="col-sm-4 col-form-label">Colonia:</label>
                                    <div className="col-sm-8">
                                        <input disabled={{ disableForm }} key={"AES-colonia"} type="text" className="form-control" id="colonia" name="colonia" value={dataUpdateUsuario.colonia} onChange={(e)=> handleInputChange(e)}/>
                                    </div>
                                
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mb-3 row">
                                    <label htmlFor="municipio" className="col-sm-4 col-form-label">Municipio:</label>
                                    <div className="col-sm-8">
                                        <input disabled={{ disableForm }} key={"AES-municipio"} type="text" className="form-control" id="municipio" name="municipio" value={dataUpdateUsuario.municipio} onChange={(e)=> handleInputChange(e)}/>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mb-3 row">
                                    <label htmlFor="estado" className="col-sm-4 col-form-label">Estado:</label>
                                    <div className="col-sm-8">
                                        <input disabled={{ disableForm }} key={"AES-estado"} type="text" className="form-control" id="estado" name="estado" value={dataUpdateUsuario.estado} onChange={(e)=> handleInputChange(e)}/>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mb-3 row">
                                    <label htmlFor="codigo_postal" className="col-sm-4 col-form-label">Código Postal:</label>
                                    <div className="col-sm-8">
                                        <input disabled={{ disableForm }} key={"AES-codigo_postal"} type="text" className="form-control" id="codigo_postal" name="codigo_postal" value={dataUpdateUsuario.codigo_postal} onChange={(e)=> handleInputChange(e)}/>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mb-3 row">
                                    <label htmlFor="pais" className="col-sm-4 col-form-label">País:</label>
                                    <div className="col-sm-8">
                                        <input disabled={{ disableForm }} key={"AES-pais"} type="text" className="form-control" id="pais" name="pais" value={dataUpdateUsuario.pais} onChange={(e)=> handleInputChange(e)}/>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <h6 className="fw-bold"> Ubicacion del Usuario </h6>
                        <div className="mb-3">
                            <Form.Check type="switch" className="mx-2">
                                <Form.Check.Input disabled={{ disableForm }} checked={cuentaConUbicacion} name="ubicacion" onChange={()=> { changeCuentaUbicacion() }} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Usuario cuenta con ubicación </span></Form.Check.Label>
                            </Form.Check>
                            
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <label htmlFor="direccion" className="form-label">
                                    Direccion:
                                </label>
                                <input disabled={{ disableForm }} type="text" className="form-control" id="direccion" name="direccion" value={dataUpdateUsuario.direccion} placeholder="Dirección..."/>
                            </div>
                            
                        </div>
                            
                        <div className="row">
                            <div className="col-5">
                                <label htmlFor="inputLong" className="form-label">Longitud:</label>
                                <input disabled={{ disableForm }} type="text" className="form-control mb-2" id="inputLong" name="longitud"
                                        placeholder="Longitud:" value={dataUpdateUsuario.longitud}
                                        onChange={handleInputChange}/>
                            </div>
                            <div className="col-5">
                                <label htmlFor="inputLat" className="form-label">Latitud:</label>
                                <input disabled={{ disableForm }} type="text" className="form-control mb-2" id="inputLat" name="latitud"
                                        placeholder="Latitud:" value={dataUpdateUsuario.latitud}
                                        onChange={handleInputChange}/>
                            </div>
                            <div className="col-12">
                                <div className="mb-3">
                                    {seccionUbicaciones()}
                                </div>
                                { latUser !== null && lonUser !== null && latUser.length > 0 && lonUser.length > 0 && 
                                (
                                    <MapContainer center={[latUser, lonUser]} zoom={13} style={{ height: "50vh", width: "100%" }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            icon={customIcon}
                                        />
                                        <Marker position={[latUser, lonUser]}>
                                        </Marker>
                                        {cricleColaboradores()}
                                    </MapContainer>    
                                )
                                }
                                                            
                            

                            </div>
                        </div>                        
                    </div>
                </div>
            {/* <div className="d-flex mb-3">
                <Link className="btn btn-secondary mx-2" to={PathConstants.USUARIOS} variant="secondary" >
                    REGRESAR
                </Link>
            </div> */}
        </div>
            
    )
}