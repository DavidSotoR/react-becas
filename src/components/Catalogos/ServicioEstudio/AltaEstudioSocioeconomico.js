import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import { useParams } from "react-router-dom";

function AltaEstudioSocioeconomico(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const {idProyecto, idCliente,idOrdenServicio } = useParams()

    const [tiposClientes,setTiposClientes] = useState([])

    const [proyecto,setProyecto] = useState({nombre:''})
    const [proyectoCliente,setProyectoCliente] = useState({nomre:''})
    const [ordenServicio,setOrdenServicio] = useState({descripcion:''})
    const [colaboradores,setColaboradores] = useState([])
    const [tipoClienteSeleccionado] = useState('1')
    const [clientesComunes,setClientesComunes] = useState([])
    
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
        }
    };


    const [fromData,setFormData] = useState(nuevoUsuario)

    const [fromDataError,setFormDataError] = useState({})

    const[listaEstudiosCreados,setListaEstudiosCreados] = useState([{
        candidato:'Aguilar carranza',
        situacion:'Prueba de desarrollo',
    }])

    /*
    const[fromDataPapa,setFromDataPapa] = useState({
        id_familias_padres_tipo:'1',
        nombre:'',
        edad:'',
        vive:'',
        direccion:'',
        ocupacion_actual:'',
        empresa_trabajo:'',
        email:'',
        telefono_casa:'',
        contecto_principal:false,
    })

    const[fromDataMama,setFromDataMama] = useState({
        id_familias_padres_tipo:'2',
        nombre:'',
        edad:'',
        vive:'',
        direccion:'',
        ocupacion_actual:'',
        empresa_trabajo:'',
        email:'',
        telefono_casa:'',
        contecto_principal:false,
    })
    */


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
    
    useEffect(()=>{
        getProyecto();
        getCliente();
        getOrdenServicio();
    },[])

    useEffect(() => {
        if(fromData.es_cliente_comun === true){
            getListaClientesHermanos();
        }else{
            setClientesComunes([]);
        }
    },[fromData.id_cliente,fromData.es_cliente_comun])

    const ultimasFamiliasAñadidas = () => {
        return (
            <div>
                <div>
                    <p>Familias recentemente añadidas</p>
                </div>
                <hr/>
                <div className="row flex-nowrap overflow-auto">
                {listaEstudiosCreados.map((estudio,index) => (
                    <div  key={'ufa-'+index} className="col-4 p-2">
                        <div className="border rounded-1 p-2">
                            <div>
                                <p>Familia: <span>{estudio.candidato}</span></p>
                            </div>
                            <div>
                                <p>Situacion: <span>{estudio.situacion}</span></p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        )
    }
    
    
    const formularioFamilia = (familiar = '') => {
        if(familiar === '') {
            return ''
        }
        return (
            <>
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
                    <input type="text" className="form-control" id="email" name="email" onChange={(e)=> formInputChangeFamiliar(e,familiar)}/>
                </div>
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
                    <div className="invalid-feedback">
                        Seleccione un contacto principal
                    </div>
                    {(
                    <div className="invalid-feedback" >
                        Seleccione un contacto principal
                    </div>
                    )}
                </div>
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
                            <input type="text" className="form-control" id="candidato" name="candidato" onChange={(e)=> formInputChange(e)}/>
                        </div>
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
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="email" className="col-sm-2 col-form-label">Correo:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="email" name="email" onChange={(e)=> formInputChange(e)}/>
                        </div>
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

                    <br/>

                    {formularioFamilia('padre')}

                    <br/>

                    {formularioFamilia('madre')}

                    {JSON.stringify(fromDataError)}
                    <br></br>
                    <div className="d-flex" style={{ flexDirection: 'row-reverse'}}>
                        <button className="btn btn-primary btn-sm fw-bold " onClick={sendDataEstudioSocioeconomico}>Guardar</button>
                    </div>
                    
                    <br/>
                    {JSON.stringify(fromData)}
                    
                </div>
            </div>
       </div> 
    </>)
}

export default AltaEstudioSocioeconomico