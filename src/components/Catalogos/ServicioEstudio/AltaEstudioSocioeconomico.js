import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { useParams,useNavigate  } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

function AltaEstudioSocioeconomico(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const {idProyecto, idCliente,idOrdenServicio } = useParams()
    const navigate = useNavigate();
    const backPage = () => {
      navigate('/estudio-socioeconomico', { state: { idProyecto: idProyecto,idCliente: idCliente,idOrdenServicio: idOrdenServicio } });
    };

    const [tiposClientes,setTiposClientes] = useState([])

    const [proyecto,setProyecto] = useState({nombre:''})
    const [proyectoCliente,setProyectoCliente] = useState({nomre:'',documentacion_digital:false})
    const [ordenServicio,setOrdenServicio] = useState({descripcion:''})
    const [colaboradores,setColaboradores] = useState([])
    const [tipoClienteSeleccionado] = useState('1')
    const [clientesComunes,setClientesComunes] = useState([])
    const [direcciones,direccionesSet] = useState([])
    const [placeId,placeIdSet] = useState('')
    const [colaboradorPreAsignado,colaboradorPreAsignadoSet] = useState({id:'',name:''})
    
    const animatedComponents = makeAnimated;

    const nuevoUsuario = {
        id_servicio_estado:'1',
        id_proyecto:idProyecto,
        id_cliente:idCliente,
        id_orden_servicio:idOrdenServicio,
        id_colaborador:'',
        es_cliente_comun:false,
        colegios_comunes:[],
        candidato:'',
        situacion:'',
        email:'',
        telefono_movil:'',
        telefono_contacto:'',
        generar_usuario_automaticamente: true,
        calle:'',
        numero_exterior:'',
        colonia:'',
        municipio:'',
        estado:'',
        codigo_postal:'',
        pais:'',
        direccion:'',
        latitud:25.67507,
        longitud:-100.31847,
        padre:{
            id_familias_padres_tipo:'1',
            nombre:'',
            edad:'',
            vive:true,
            direccion:'',
            ocupacion_actual:'',
            empresa_trabajo:'',
            email:'',
            telefono_casa:'',
            contecto_principal:false,
        },
        madre:{
            id_familias_padres_tipo:'2',
            nombre:'',
            edad:'',
            vive:true,
            direccion:'',
            ocupacion_actual:'',
            empresa_trabajo:'',
            email:'',
            telefono_casa:'',
            contecto_principal:false,
        }
    };

    const [fromData,setFormData] = useState(nuevoUsuario)

    const [fromDataError,setFormDataError] = useState({})

    const[listaEstudiosCreados,setListaEstudiosCreados] = useState([])
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

    const formInputChange =(e) => {
        var {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : convertirAMayusculas(value);
        
        setFormData(prevState => ({
            ...prevState,
            [name]: updatedValue
        }));
    }
    
    const formInputChangeFamiliar = (e,familiar='') => {
        if(familiar ===''){
            return false;
        }
        
        casosEspeciales(e,familiar);

        var {name, value, type, checked } = e.target;
        let updatedValue = type === 'checkbox' ? checked : name === 'email' ? value :  convertirAMayusculas(value);
        
        setFormData(prevState => ({
            ...prevState,
            [familiar]:{
                ...prevState[familiar],
                [name]: updatedValue
            }
        }));

    }

    const casosEspeciales = (e,familiar='') => {
        
        var {name, value, type, checked } = e.target;
        let updatedValue = type === 'checkbox' ? checked : name === 'email' ? value :  convertirAMayusculas(value);

        if(name==='contecto_principal'){
            if(familiar==='padre'){
                if(updatedValue===true){
                    setFormData(prevState => ({
                        ...prevState,
                        ['madre']:{
                            ...prevState['madre'],
                            ['contecto_principal']: false
                        }
                    }));
                }
            }
            if(familiar==='madre'){
                if(updatedValue===true){
                    setFormData(prevState => ({
                        ...prevState,
                        ['padre']:{
                            ...prevState['padre'],
                            ['contecto_principal']: false
                        }
                    }));
                }
            }
        }

        
        console.log(updatedValue+' '+familiar);
    }
    
    const sendDataEstudioSocioeconomico = () =>{
        axios.post(`${APIURL}/estudio/socioeconomico`,fromData,config).then((resp)=>{
            const {message,data} = resp.data
            console.log(resp);
            
            setListaEstudiosCreados((prevLista) => [data, ...prevLista]);
            setFormData(nuevoUsuario);

        }).catch((err)=>{
            if(err.code === "ERR_BAD_REQUEST"){
                const data =err.response.data;
                if(data?.errors){
                    setFormDataError(data.errors);
                }
            }
            console.log(err);
        })
    }
    
    const getProyecto = () => {
        axios.get(`${APIURL}/proyectos/${idProyecto}`,config).then((resp)=>{
            setProyecto(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getCliente = () => {
        axios.get(`${APIURL}/clientes/${idCliente}`,config).then((resp)=>{
            setProyectoCliente(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getOrdenServicio = () => {
        axios.get(`${APIURL}/proyectos/clientes/ordenes-servicio/${idOrdenServicio}`,config).then((resp)=>{
            setOrdenServicio(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getListaClientesHermanos= () => {
        axios.get(`${APIURL}/clientes/${fromData.id_cliente}/hermanos`,config).then((resp)=>{
            renderOptionClientesComunes(resp.data);
        }).catch((resp)=>{
            setClientesComunes([]);
            console.log(resp);
        })
    }
    const getDireccionGSP = () => {
        if(fromData.direccion.length<5){
            direccionesSet()
        }
        axios.get(`https://nominatim.openstreetmap.org/search?q=${fromData.direccion}&format=json&addressdetails=1`,config).then((resp)=>{
            direccionesSet(resp.data);
        }).catch((resp)=>{
            setClientesComunes([]);
            console.log(resp);
        })
    }
    
    const handlerChangeSelectClientes = (e) =>{
        if(e && e.length){
            const allValues = e.map(e => e.value);
            setFormData(prevState => ({
                ...prevState,
                colegios_comunes: allValues
            }));
        }else{
                
            setFormData(prevState => ({
                ...prevState,
                colegios_comunes: []
            }));
        }
    }

    const renderOptionClientesComunes  = (opciones) =>{
        var opcionesColegios = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcionesColegios.push(option)
        })
        setClientesComunes (opcionesColegios)
    }
    
    const getListaColaboradores = () =>{
        axios.get(APIURL+'/estudio/colaboradores',config).then((resp)=>{
            setColaboradores(resp.data)
        }).catch((resp)=>{
            //(resp.response.status === 401) ?? logout();
            console.log(resp);
        })
    }

    const getNumeroContactoPrincipal = (estudio) => {
        if(estudio?.email){
            if(estudio.email.length > 0)
                return estudio.email;
        }
        if(estudio?.padre){
            if(estudio.padre.contecto_principal)
                return estudio.padre.email;
        }
        if(estudio?.madre){
            if(estudio.madre.contecto_principal)
                return estudio.madre.email;
        }
        return '';
    }

    const seleccionarUbicacion = (direccion) => {
        placeIdSet(direccion.place_id);
        
        setFormData(prevState => ({
            ...prevState,
            latitud: direccion.lat,
            longitud: direccion.lon
        }));
    }
    
    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }
    const obtenerUbicacionMasCercana = (lat, lon, ubicaciones) => {
        const radianes = (grados) => (grados * Math.PI) / 180;
      
        // Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
        const calcularDistancia = (lat1, lon1, lat2, lon2) => {
          const R = 6371; // Radio de la Tierra en km
          const dLat = radianes(lat2 - lat1);
          const dLon = radianes(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(radianes(lat1)) * Math.cos(radianes(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c; // Distancia en km
        };
      
        let ubicacionMasCercana = null;
        let distanciaMinima = Infinity;
      
        // Iterar sobre las ubicaciones para encontrar la más cercana
        ubicaciones.forEach((ubicacion) => {
          const distancia = calcularDistancia(lat, lon, ubicacion.latitud, ubicacion.longitud);
          if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            ubicacionMasCercana = ubicacion;
          }
        });
      
        return ubicacionMasCercana;
      }
      
    const cambiarCaloborador= () => {
        const colaboradoresFiltro = colaboradores.filter(colaborador => colaborador.latitud);
        if(colaboradoresFiltro.length){
            const colaborador = obtenerUbicacionMasCercana(fromData.latitud, fromData.longitud, colaboradoresFiltro);
            console.log(colaborador);
            setFormData(prevState => ({
                ...prevState,
                id_colaborador: colaborador.id
            }));
            colaboradorPreAsignadoSet(colaborador);
        }
    }

    useEffect(()=>{
        getProyecto();
        getCliente();
        getOrdenServicio();
        getListaColaboradores();
    },[])

    useEffect(() => {
        if(fromData.es_cliente_comun === true){
            getListaClientesHermanos();
        }else{
            setClientesComunes([]);
        }
    },[fromData.id_cliente,fromData.es_cliente_comun])

    useEffect(()=>{
        getDireccionGSP();
    },[fromData.direccion])

    
    useEffect(()=>{
        cambiarCaloborador();
    },[fromData.latitud])

    useEffect(()=>{ 
        setFormData(prevState => ({
            ...prevState,
            direccion: `${fromData.calle} ${fromData.numero_exterior}, ${fromData.colonia}, ${fromData.municipio}, ${fromData.estado}, ${fromData.codigo_postal}, ${fromData.pais}` 
        }));
    },[
        fromData.calle,
        fromData.numero_exterior,
        fromData.colonia,
        fromData.municipio,
        fromData.estado,
        fromData.codigo_postal,
        fromData.pais,
    ])
    

    
    const ultimasFamiliasAñadidas = () => {
        return (
            <div>
                <div>
                    <p><b>Familias recentemente añadidas: {listaEstudiosCreados.length}</b></p>
                </div>
                <hr/>
                <div className="row flex-nowrap overflow-auto">
                {listaEstudiosCreados.map((estudio,index) => (
                    <div  key={'ufa-'+index} className="col-4 p-2">
                        <div className="border rounded-1 p-2">
                            <div>
                                <p><b>Estudio:</b> <span>{(estudio.id) ? '#'+estudio.id : ''}</span></p>
                            </div>
                            <div>
                                <p><b>Familia:</b> <span>{estudio.candidato}</span></p>
                            </div>
                            <div>
                                <p><b>Situacion:</b> <span>{getNumeroContactoPrincipal(estudio)}</span></p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        )
    }
    
    const cricleColaboradores = () => {
        console.log(colaboradores);
        const colaboradoresFiltro = colaboradores.filter(colaborador => colaborador.latitud);
        console.log(colaboradoresFiltro);
        return <>{colaboradoresFiltro.map((colaborador,index) => 
            (<Circle key={'cum-'+index} center={[colaborador.latitud, colaborador.longitud]} radius="200" pathOptions={{ color: 'blue' }}>
                <Popup>
                {colaborador.name}
                </Popup>
            </Circle>)
            )} </>
    }
    
    
    const seccionUbicaciones = () => {

        if (!Array.isArray(direcciones) || direcciones.length === 0) {
            // Si `direcciones` no es un array válido o está vacío, mostramos un mensaje
            return (<div>
                        <div 
                        className="row rounded border mt-1 p-1" 
                        style={{cursor:'pointer' }}
                        >
                            <div className="col-1">
                                <img src="/img/ping-map.png" style={{width:'80%'}}/>
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
            {direcciones.slice(0, 5).map((direccion, index) => (
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
    
    const formularioFamilia = (familiar = '') => {
        if(familiar === '') {
            return ''
        }
        return (
            <>
            <br/>
            <h4>{familiar.charAt(0).toUpperCase() + familiar.slice(1)}</h4>
            <hr/>
            
            <div className="mb-3 row">
                <label htmlFor="nombre" className="col-sm-2 col-form-label">
                    Nombre
                </label>
                <div className="col-sm-10">
                    <input 
                        type="text" 
                        className="form-control" 
                        id="nombre" 
                        name="nombre"
                        value={fromData[familiar].nombre}
                        onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                    />
                </div>
                
                {fromDataError[familiar+'.nombre'] && Array.isArray(fromDataError[familiar + '.nombre'])  && (
                <div>
                    {fromDataError[familiar+'.nombre'].map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="edad" className="col-sm-2 col-form-label">
                    Edad
                </label>
                <div className="col-sm-10">
                    <input 
                        type="number" 
                        className="form-control" 
                        id="edad" 
                        name="edad"
                        value={fromData[familiar].edad}
                        onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                    />
                </div>
                {fromDataError[familiar+'.edad'] && Array.isArray(fromDataError[familiar + '.edad'])  && (
                <div>
                    {fromDataError[familiar+'.edad'].map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <p className="col-sm-2 col-form-label">
                    Vivie
                </p>
                <div className="col-sm-10 pt-1">
                    <div className="form-switch">
                        <input 
                            className="form-check-input" 
                            id="vive" 
                            name="vive" 
                            type="checkbox" 
                            checked={fromData[familiar].vive}
                            role="switch" 
                            onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            />
                        <label className="form-check-label">{(fromData[familiar].vive) ? 'Si' : 'No'}</label>
                    </div>
                </div>
                {fromDataError[familiar+'.vive'] && Array.isArray(fromDataError[familiar + '.vive'])  && (
                <div>
                    {fromDataError[familiar+'.vive'].map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="direccion" className="col-sm-2 col-form-label">
                    Direccion:
                </label>
                <div className="col-sm-10">
                    <textarea
                        id="direccion"
                        name="direccion"
                        value={fromData[familiar].direccion}
                        onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                        placeholder="Dirección..."
                        rows="4"
                        cols="10"
                        style={{ width: '100%' }}
                    />
                </div>
                {fromDataError[familiar+'.direccion'] && Array.isArray(fromDataError[familiar + '.direccion'])  && (
                <div>
                    {fromDataError[familiar+'.direccion'].map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="ocupacion_actual" className="col-sm-2 col-form-label">
                    Ocupacion actual:
                </label>
                <div className="col-sm-10">
                    <input 
                        type="text" 
                        className="form-control" 
                        id="ocupacion_actual" 
                        name="ocupacion_actual"
                        value={fromData[familiar].ocupacion_actual}
                        onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                    />
                </div>
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="empresa_trabajo" className="col-sm-2 col-form-label">
                    Empresa de trabajo:
                </label>
                <div className="col-sm-10">
                    <input 
                        type="text" 
                        className="form-control" 
                        id="empresa_trabajo" 
                        name="empresa_trabajo"
                        value={fromData[familiar].empresa_trabajo}
                        onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                    />
                </div>
            </div>

            <div className="mb-3 row">
                <label htmlFor="email" className="col-sm-2 col-form-label">Correo:</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control" value={fromData[familiar].email} id="email" name="email" onChange={(e)=> formInputChangeFamiliar(e,familiar)}/>
                </div>
                {fromDataError[familiar+'.email'] && Array.isArray(fromDataError[familiar + '.email'])  && (
                <div>
                    {fromDataError[familiar+'.email'].map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="telefono_casa" className="col-sm-2 col-form-label">
                    Telefono de casa:
                </label>
                <div className="col-sm-10">
                    <input 
                        type="text" 
                        className="form-control" 
                        id="telefono_casa" 
                        name="telefono_casa"
                        value={fromData[familiar].telefono_casa}
                        onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                    />
                </div>
                {fromDataError[familiar+'.telefono_casa'] && Array.isArray(fromDataError[familiar + '.telefono_casa'])  && (
                <div>
                    {fromDataError[familiar+'.telefono_casa'].map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <p className="col-sm-2 col-form-label">
                    Contacto Principal:
                </p>
                <div className="col-sm-10 pt-1 needs-validation">
                    <div className="form-switch">
                        <input 
                            className="form-check-input" 
                            id="contecto_principal" 
                            name="contecto_principal" 
                            type="checkbox" 
                            checked={fromData[familiar].contecto_principal}
                            role="switch" 
                            onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            />
                        <label className="form-check-label">{(fromData[familiar].contecto_principal) ? 'Si' : 'No'}</label>
                    </div>
                </div>
                
                {fromDataError[familiar+'.contecto_principal'] && Array.isArray(fromDataError[familiar + '.contecto_principal'])  && (
                <div>
                    {fromDataError[familiar+'.contecto_principal'].map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                </div>
                )}
            </div>
            <br/>
            </>
        )
    }


    return(<>
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Nuevo Estudio Socioeconómico</h6>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-2">
                    <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center" onClick={() => backPage()}>
                        <ion-icon name="chevron-back-outline"></ion-icon>
                        Regresar
                    </Button>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_proyecto" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Proyecto: {proyecto.nombre}
                    </label>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_cliente" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Cliente: {proyectoCliente.nombre}
                    </label>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_orden_servicio" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Orden de servicio: {ordenServicio.descripcion}
                    </label>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">

                {ultimasFamiliasAñadidas()}

                    <h4>Familia:</h4>
                    <hr/>
                    <div className="mb-3 row">
                        <label htmlFor="candidato" className="col-sm-2 col-form-label">Nombre de Familia:</label>
                        <div className="col-sm-10">
                            <input key={"AES-candidato"} type="text" className="form-control" id="candidato" name="candidato" value={fromData.candidato} onChange={(e)=> formInputChange(e)}/>
                        </div>
                        {fromDataError?.candidato && (
                        <div>
                            {fromDataError.candidato.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                        </div>
                        )}
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="situacion" className="col-sm-2 col-form-label">Situacion:</label>
                        <div className="col-sm-10">
                            <textarea
                                id="situacion"
                                name="situacion"
                                value={fromData.situacion}
                                onChange={(e)=> formInputChange(e)}
                                placeholder="situacion..."
                                rows="4"
                                cols="50"
                                style={{ width: '100%' }}
                            />
                        </div>
                        {fromDataError?.situacion && (
                        <div>
                            {fromDataError.situacion.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                        </div>
                        )}
                    </div>
                    
                    <div className="mb-3 row">
                        <p className="col-sm-2 col-form-label">Familia consegios comunes</p>
                        <div className="col-sm-10 pt-1">
                            <div className="form-switch">
                                <input 
                                    className="form-check-input" 
                                    name="es_cliente_comun" 
                                    type="checkbox" 
                                    checked={fromData.es_cliente_comun}
                                    role="switch" id="es_cliente_comun" 
                                    onChange={(e) => {formInputChange(e)}}
                                    />
                                <label className="form-check-label">{(fromData.es_cliente_comun) ? 'Si' : 'No'}</label>
                            </div>
                        </div>
                    </div>
                    {fromData.es_cliente_comun && (
                        <div className="mb-3 row">
                            <label htmlFor="colegios_comunes" className="col-sm-2 col-form-label">Familia colegios relacionados:</label>
                            <div className="col-sm-10">
                                <Select options={ clientesComunes } onChange={(e)=>handlerChangeSelectClientes(e)}
                                components={animatedComponents}
                                closeMenuOnSelect={false}
                                isMulti
                                ></Select>
                            </div>
                        </div>
                    )}
                    
                    {proyectoCliente.documentacion_digital && (
                    <div className="mb-3 row">
                        <p className="col-sm-2 col-form-label">Generar usuario para estudio:</p>
                        <div className="col-sm-10 pt-1">
                            <div className="form-switch">
                                <input 
                                    className="form-check-input" 
                                    name="generar_usuario_automaticamente" 
                                    type="checkbox" 
                                    checked={fromData.generar_usuario_automaticamente}
                                    role="switch" id="generar_usuario_automaticamente" 
                                    onChange={(e) => {formInputChange(e)}}
                                    />
                                <label className="form-check-label">{(fromData.generar_usuario_automaticamente) ? 'Si' : 'No'}</label>
                            </div>
                        </div>
                    </div>
                    )}

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="mb-3 row">
                                <label htmlFor="calle" className="col-sm-2 col-form-label">Calle:</label>
                                <div className="col-sm-10">
                                    <input key={"AES-calle"} type="text" className="form-control" id="calle" name="calle" value={fromData.calle} onChange={(e)=> formInputChange(e)}/>
                                </div>
                                {fromDataError?.calle && (
                                <div>
                                    {fromDataError.calle.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                                </div>
                                )}
                            </div>
                        </div>

                        <div className="col-sm-6">
                            <div className="mb-3 row">
                                <label htmlFor="numero_exterior" className="col-sm-4 col-form-label">No Exterior:</label>
                                <div className="col-sm-8">
                                    <input key={"AES-numero_exterior"} type="text" className="form-control" id="numero_exterior" name="numero_exterior" value={fromData.numero_exterior} onChange={(e)=> formInputChange(e)}/>
                                </div>
                                {fromDataError?.numero_exterior && (
                                <div>
                                    {fromDataError.numero_exterior.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3 row">
                                <label htmlFor="colonia" className="col-sm-4 col-form-label">Colonia:</label>
                                <div className="col-sm-8">
                                    <input key={"AES-colonia"} type="text" className="form-control" id="colonia" name="colonia" value={fromData.colonia} onChange={(e)=> formInputChange(e)}/>
                                </div>
                                {fromDataError?.colonia && (
                                <div>
                                    {fromDataError.colonia.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3 row">
                                <label htmlFor="municipio" className="col-sm-4 col-form-label">Municipio:</label>
                                <div className="col-sm-8">
                                    <input key={"AES-municipio"} type="text" className="form-control" id="municipio" name="municipio" value={fromData.municipio} onChange={(e)=> formInputChange(e)}/>
                                </div>
                                {fromDataError?.municipio && (
                                <div>
                                    {fromDataError.municipio.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3 row">
                                <label htmlFor="estado" className="col-sm-4 col-form-label">Estado:</label>
                                <div className="col-sm-8">
                                    <input key={"AES-estado"} type="text" className="form-control" id="estado" name="estado" value={fromData.estado} onChange={(e)=> formInputChange(e)}/>
                                </div>
                                {fromDataError?.estado && (
                                <div>
                                    {fromDataError.estado.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3 row">
                                <label htmlFor="codigo_postal" className="col-sm-4 col-form-label">Código Postal:</label>
                                <div className="col-sm-8">
                                    <input key={"AES-codigo_postal"} type="text" className="form-control" id="codigo_postal" name="codigo_postal" value={fromData.codigo_postal} onChange={(e)=> formInputChange(e)}/>
                                </div>
                                {fromDataError?.codigo_postal && (
                                <div>
                                    {fromDataError.codigo_postal.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3 row">
                                <label htmlFor="pais" className="col-sm-4 col-form-label">País:</label>
                                <div className="col-sm-8">
                                    <input key={"AES-pais"} type="text" className="form-control" id="pais" name="pais" value={fromData.pais} onChange={(e)=> formInputChange(e)}/>
                                </div>
                                {fromDataError?.pais && (
                                <div>
                                    {fromDataError.pais.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    
                    
                    

                    {formularioFamilia('padre')}

                    {formularioFamilia('madre')}

                    <br/>
                    <h4>Ubicacion:</h4>
                    <hr/>

                    <div className="mb-3 row">
                        <label htmlFor="direccion" className="col-sm-2 col-form-label">
                            Direccion:
                        </label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="direccion" name="direccion" value={fromData.direccion} onChange={(e)=> formInputChange(e)} placeholder="Dirección..."/>
                        </div>
                        {fromDataError?.direccion && (
                        <div>
                            {fromDataError.direccion.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                        </div>
                        )}
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="latitud" className="col-sm-2 col-form-label">Latitud:</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" id="latitud" name="latitud" value={fromData.latitud} onChange={(e)=> formInputChange(e)}/>
                        </div>
                        {fromDataError?.latitud && (
                        <div>
                            {fromDataError.latitud.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                        </div>
                        )}
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="longitud" className="col-sm-2 col-form-label">Longitud:</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" id="longitud" name="longitud" value={fromData.longitud} onChange={(e)=> formInputChange(e)}/>
                        </div>
                        {fromDataError?.longitud && (
                        <div>
                            {fromDataError.longitud.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                        </div>
                        )}
                    </div>
                    {colaboradorPreAsignado.name &&(
                        
                    <div className="mb-3 row">
                        <label htmlFor="longitud" className="col-sm-2 col-form-label">Preasignacion Colaborador:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="longitud" name="longitud" disabled value={colaboradorPreAsignado.name}/>
                        </div>
                    </div>
                    )}

                    <div className="mb-3 row">
                        {seccionUbicaciones()}
                    </div>

                    <MapContainer center={[fromData.latitud, fromData.longitud]} zoom={13} style={{ height: "50vh", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        icon={customIcon}
                    />
                    <Marker position={[fromData.latitud, fromData.longitud]}>
                        <Popup>
                        ¡Hola! Este es un cuadro de texto en un popup.
                        </Popup>
                    </Marker>
                    {cricleColaboradores()}
                    </MapContainer>
                    <br/>

                    <div className="d-flex">
                        <div className="p-2 bd-highlight">
                            <button className="btn btn-primary btn-sm fw-bold " onClick={() =>setFormData(nuevoUsuario)}>Cancelar</button>
                        </div>
                        <div className="ms-auto p-2 bd-highlight">
                            <button className="btn btn-primary btn-sm fw-bold " onClick={sendDataEstudioSocioeconomico}>Guardar</button>
                        </div>
                    </div>
                    
                    <br/>
                </div>
            </div>
       </div> 
    </>)
}

export default AltaEstudioSocioeconomico