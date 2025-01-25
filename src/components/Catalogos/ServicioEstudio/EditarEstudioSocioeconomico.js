import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { useParams,useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import ModalAsignarColaborador from "./ModalEstudioSocioeconomico/ModalAsignarColaborador";

function EditarEstudioSocioeconomico(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { idEstudio } = useParams()
    const navigate = useNavigate();
    const backPage = () => {
      navigate('/estudio-socioeconomico', { state: { idProyecto: fromData.id_proyecto,idCliente: fromData.id_cliente,idOrdenServicio: fromData.id_orden_servicio } });
    };

    const [tiposClientes,setTiposClientes] = useState([])

    const [proyectoCliente,setProyectoCliente] = useState({nomre:'',documentacion_digital:false})
    const [colaboradores,setColaboradores] = useState([])
    const [tipoClienteSeleccionado] = useState('1')
    const [clientesComunes,setClientesComunes] = useState([])
    const [clientesComunesDefault,clientesComunesDefaultSet]= useState([]);
    
    const animatedComponents = makeAnimated;

    const nuevoUsuario = {
        id_servicio_estado:'1',
        id_proyecto:'',
        id_cliente:'',
        id_orden_servicio:'',
        id_colaborador:'',
        es_cliente_comun:false,
        colegios_comunes:[],
        candidato:'',
        situacion:'',
        email:'',
        estado:{id:'',nombre:''},
        telefono_movil:'',
        telefono_contacto:'',
        generar_usuario_automaticamente: false,
        latitud:25.67507,
        longitud:-100.31847,
        colegios_comunes:[],
        padre:{
            id_familias_padres_tipo:'1',
            nombre:'',
            edad:'',
            vive:false,
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
            vive:false,
            direccion:'',
            ocupacion_actual:'',
            empresa_trabajo:'',
            email:'',
            telefono_casa:'',
            contecto_principal:false,
        },
        proyecto:{id:0,nombre:''},
        cliente:{id:0,nombre:''},
        orden_servicio:{id:0,descripcion:''},
        colaborador: {id:0,nombre:''},
        familia: {id:0,nombre:''},
    };

    const [fromData,setFormData] = useState(nuevoUsuario)

    const [fromDataError,setFormDataError] = useState({})
    const [editarFamilia,editarFamiliaSet] = useState(false)
    const [editarSeccion,setEditarSeccion] = useState('')

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

    const [listaColaboradores,setListaColaboradores] = useState([
        {nombre:"Jesus Aguilar", latitud:25.67507, longitud:-100.31847},
        {nombre:"David Soto", latitud:25.77507, longitud:-100.31847}
    ])
    //Colaboradores
    const [showColaborador,setShowColaborador] = useState(false);
    const handleCloseColaborador = () => setShowColaborador(false);
    const formInputChange =(e) => {
        var {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        
        setFormData(prevState => ({
            ...prevState,
            [name]: updatedValue
        }));
    }
    
    const formInputChangeFamiliar = (e,familiar='') => {
        if(familiar ===''){
            return false;
        }

        var {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        
        setFormData(prevState => ({
            ...prevState,
            [familiar]:{
                ...prevState[familiar],
                [name]: updatedValue
            }
        }));
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

    const getEsrudioSocioeconomico = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}`,config).then((resp)=>{
            console.log(resp.data);
            let data =  resp.data;
            data.latitud = '25.67507';
            data.longitud = '-100.31847';
            setFormData(data);
            // setProyectoCliente(resp.data);
        }).catch((resp)=>{
            setClientesComunes([]);
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

    const renderOptionClientesComunesDefaultSet = (opciones) =>{
        var opcionesColegios = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcionesColegios.push(option)
        })
        clientesComunesDefaultSet(opcionesColegios)
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
    
    const listaColegiosComunes = (colegios_comunes) => {
        return colegios_comunes.map((colegio,index) => (<div key={'lcc-'+index} className="border p-1 mb-1 me-1">{colegio.nombre}</div>))
    }
    const formularioInformacion = () => {
        return(<>
            <div className="d-flex">
                <div className="bd-highlight">
                    <h4>Familia:</h4>
                </div>
                <div className="ms-auto bd-highlight">

                    {editarSeccion === 'familia' ? (<>
                    <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('')}><ion-icon name="trash-bin-outline"></ion-icon></button>
                    <button className="btn btn-sm btn-light ml-2" onClick={() => alert('Guardar')}><ion-icon name="save-outline"></ion-icon></button>
                    </>
                    ) : (
                        <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('familia')}><ion-icon name="create-outline"></ion-icon></button>
                    )}

                </div>
            </div>
            <hr/>
            <div className="mb-3 row">
                <label htmlFor="candidato" className="col-sm-2 col-form-label">Nombre de Familia:</label>
                {editarSeccion === 'familia' ? (<>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="candidato" name="candidato" value={fromData.candidato} onChange={(e)=> formInputChange(e)}/>
                    </div>
                    {fromDataError?.candidato && (
                    <div>
                        {fromDataError.candidato.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                    </div>
                    )}
                </>) : (<>
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData.candidato}</p>
                    </div>
                </>)}
            </div>
    
            <div className="mb-3 row">
                <label htmlFor="situacion" className="col-sm-2 col-form-label">Situacion:</label>
                
                {editarSeccion === 'familia' ? (<>
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
                </>) : (<>
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData.situacion}</p>
                    </div>
                </>)}
            </div>
            
            <div className="mb-3 row">
                <p className="col-sm-2 col-form-label">Familia con colegios comunes</p>
                {editarSeccion === 'familia' ? (<>
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
                            
                    {fromData.es_cliente_comun && (
                        <div className="mb-3 row">
                            <label htmlFor="colegios_comunes" className="col-sm-2 col-form-label">Familia colegios relacionados:</label>
                            <div className="col-sm-10">
                                <Select 
                                options={ clientesComunes }
                                defaultValue={clientesComunesDefault}
                                onChange={(e)=>handlerChangeSelectClientes(e)}
                                components={animatedComponents}
                                closeMenuOnSelect={false}
                                isMulti
                                ></Select>
                            </div>
                        </div>
                    )}
                </>) : (<>
                    <div className="col-sm-10">
                        <div className="d-flex flex-nowrap rounded">
                            {(fromData.es_cliente_comun) ? (listaColegiosComunes(fromData.colegios_comunes)) : (<><p className="m-0">No</p></>)}
                        </div>
                    </div>
                </>)}
            </div>
    
            
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
        </>)
    }

    const formularioFamilia = (familiar = '') => {
        if(familiar === '') {
            return '';
        }
        if(!fromData.hasOwnProperty(familiar)) {
            return '';
        }
        if(!fromData[familiar]?.nombre) {
            return '';
        }

        return (
            <>
            <br/>            
            <div className="d-flex">
                <div className="bd-highlight">
                    <h4>{familiar.charAt(0).toUpperCase() + familiar.slice(1)}</h4>
                </div>
                <div className="ms-auto bd-highlight">

                    {editarSeccion === familiar ? (<>
                    <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('')}><ion-icon name="trash-bin-outline"></ion-icon></button>
                    <button className="btn btn-sm btn-light ml-2" onClick={() => alert('Guardar')}><ion-icon name="save-outline"></ion-icon></button>
                    </>
                    ) : (
                        <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion(familiar)}><ion-icon name="create-outline"></ion-icon></button>
                    )}

                </div>
            </div>
            <hr/>
            
            <div className="mb-3 row">
                <label htmlFor="nombre" className="col-sm-2 col-form-label">
                    Nombre
                </label>
                {editarSeccion === familiar ? (
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
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].nombre}</p>
                    </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="edad" className="col-sm-2 col-form-label">
                    Edad
                </label>
                
                {editarSeccion === familiar ? (
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
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].edad}</p>
                    </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <p className="col-sm-2 col-form-label">
                    Vivie
                </p>
                
                {editarSeccion === familiar ? (
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
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].vive}</p>
                    </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="direccion" className="col-sm-2 col-form-label">
                    Direccion:
                </label>

                {editarSeccion === familiar ? (
                    <div className="col-sm-10">
                        <textarea
                            id="direccion"
                            name="direccion"
                            value={(fromData[familiar].direccion === null) ? '' : fromData[familiar].direccion }
                            onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            placeholder="Dirección..."
                            rows="4"
                            cols="10"
                            style={{ width: '100%' }}
                        />
                    </div>
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].direccion}</p>
                    </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="ocupacion_actual" className="col-sm-2 col-form-label">
                    Ocupacion actual:
                </label>

                {editarSeccion === familiar ? (
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="ocupacion_actual" 
                            name="ocupacion_actual"
                            value={(fromData[familiar].ocupacion_actual === null) ? '' : fromData[familiar].ocupacion_actual }
                            onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                        />
                    </div>
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].ocupacion_actual}</p>
                    </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="empresa_trabajo" className="col-sm-2 col-form-label">
                    Empresa de trabajo:
                </label>

                {editarSeccion === familiar ? (
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="empresa_trabajo" 
                            name="empresa_trabajo"
                            value={(fromData[familiar].empresa_trabajo === null) ? '' : fromData[familiar].empresa_trabajo }
                            onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                        />
                    </div>
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].empresa_trabajo}</p>
                    </div>
                )}
            </div>

            <div className="mb-3 row">
                <label htmlFor="email" className="col-sm-2 col-form-label">Correo:</label>

                {editarSeccion === familiar ? (
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={fromData[familiar].email} id="email" name="email" onChange={(e)=> formInputChangeFamiliar(e,familiar)}/>
                    </div>
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].email}</p>
                    </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <label htmlFor="telefono_casa" className="col-sm-2 col-form-label">
                    Telefono de casa:
                </label>

                {editarSeccion === familiar ? (
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
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].telefono_casa}</p>
                    </div>
                )}
            </div>
            
            <div className="mb-3 row">
                <p className="col-sm-2 col-form-label">
                    Contacto Principal:
                </p>

                {editarSeccion === familiar ? (
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
                ) : (
                    <div className="col-sm-10 align-self-center">
                        <p className="m-0">{fromData[familiar].contecto_principal ? 'Si' : 'No' }</p>
                    </div>
                )}
            </div>
            <br/>
            </>
        )
    }

    const elementoColaborador = (colaborador) => {
            return colaborador ? (
                <div className="mb-3 row">
                    <p className="col-sm-2">Colaborador: </p>
                    <div className="col-sm-10">
                        <div className="d-flex">
                            <div>
                            <p>{colaborador.name}</p>
                            <p>{colaborador.email}</p>
                            </div>
                            <div>
                            <button className="btn btn-sm btn-light ml-2" onClick={() => setShowColaborador(true)}><ion-icon name="create-outline"></ion-icon></button>
                            </div>
                        </div>
                    </div>
                </div>
            ): (
                <div className="mb-3 row">
                    <p className="col-sm-2">Colaborador:</p>
                    <div className="col-sm-10">
                        <button className="btn btn-sm btn-light ml-2" onClick={() => setShowColaborador(true)}><ion-icon name="create-outline"></ion-icon></button>
                    </div>
                </div>
            )
        
        
    }

    const formularioUbicacion = ()=>{
        return (<>         
            <div className="d-flex mt-|">
                <div className="bd-highlight">
                    <h4>Ubicacion:</h4>
                </div>
                <div className="ms-auto bd-highlight">

                    {editarSeccion === 'ubicacion' ? (<>
                    <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('')}><ion-icon name="trash-bin-outline"></ion-icon></button>
                    <button className="btn btn-sm btn-light ml-2" onClick={() => alert('Guardar')}><ion-icon name="save-outline"></ion-icon></button>
                    </>
                    ) : (<>
                    <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('ubicacion')}><ion-icon name="create-outline"></ion-icon></button>
                    </>)}

                </div>
            </div>
            <hr/>


            {editarSeccion === 'ubicacion' ? (<>
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
            </>) : (<>
            <div className="mb-3 row">
                <label htmlFor="latitud" className="col-sm-2 col-form-label">Direccion:</label>
                <div className="col-sm-10 align-self-center">
                    <p className="m-0">{fromData?.direccion ? fromData.direccion : '' }</p>
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="latitud" className="col-sm-2 col-form-label">Ubicacion:</label>
                <div className="col-sm-10 align-self-center">
                    <p className="m-0">{fromData.latitud},{fromData.longitud}</p>
                </div>
            </div>
            </>
                )}

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
            <Circle center={[fromData.latitud, fromData.longitud]} radius="200" pathOptions={{ color: 'blue' }}>
                <Popup>
                Jesus Aguilar
                </Popup>
            </Circle>
            <Circle center={[25.67807, -100.31847]} radius="200" pathOptions={{ color: 'blue' }}>
                <Popup>
                David Soto
                </Popup>
            </Circle>
            </MapContainer>
            <br/>

            <div className="d-flex" style={{ flexDirection: 'row-reverse'}}>
                <button className="btn btn-primary btn-sm fw-bold " onClick={sendDataEstudioSocioeconomico}>Guardar</button>
            </div>
        </>)
    }

    useEffect(()=>{
        getEsrudioSocioeconomico();
    },[])

    useEffect(() => {
        if(fromData.es_cliente_comun === true){
            getListaClientesHermanos();
            renderOptionClientesComunesDefaultSet(fromData.colegios_comunes);
        }else{
            setClientesComunes([]);
        }
    },[fromData.id_cliente,fromData.es_cliente_comun])

    useEffect(()=>{
        if(showColaborador === false){
            getEsrudioSocioeconomico();
        }
    },[showColaborador])


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
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">


                    <div>
                        <div>
                            <h4>Estudio: #{fromData.id}</h4>
                        </div>
                        <hr/>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Proyecto:</p>
                            <div className="col-sm-10">
                                <p>{fromData?.proyecto.nombre}</p>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Cliente:</p>
                            <div className="col-sm-10">
                                <p>{fromData?.cliente.nombre}</p>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Orden de servicio:</p>
                            <div className="col-sm-10">
                                <p>{fromData?.orden_servicio.descripcion}</p>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Estado:</p>
                            <div className="col-sm-10">
                                <p>{fromData.estado?.nombre ? fromData.estado.nombre : ''}</p>
                            </div>
                        </div>
                        
                        {elementoColaborador(fromData.colaborador)}
                        <div className="mb-3 row">
                            <p className="col-sm-2">Familia Usuario:</p>
                            <div className="col-sm-10">
                                <p>{fromData.familia?.email}</p>
                            </div>
                        </div>
                    </div>

                    {formularioInformacion()}

                    {formularioFamilia('padre')}

                    {formularioFamilia('madre')}

                    {formularioUbicacion()}
                    
                    <br/>
                </div>
            </div>
       </div> 
       <ModalAsignarColaborador show={showColaborador} handleClose={handleCloseColaborador} idEstudio={idEstudio} colaborador={fromData.colaborador}></ModalAsignarColaborador>
    </>)
}

export default EditarEstudioSocioeconomico