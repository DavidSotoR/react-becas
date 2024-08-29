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


    const [fromData,setFormData] = useState({
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
    })

    const formInputChange =(e) => {
        var {name, value, type, checked } = e.target
        if(type === 'checkbox'){
            setFormData(prevState => ({
                ...prevState,
                [name]: checked
            }));
        }else{
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }
    
    const sendDataEstudioSocioeconomico = () =>{
        axios.post(`${APIURL}/estudio/socioeconomico`,fromData,config).then((resp)=>{
            console.log(resp);
        }).catch((resp)=>{
            console.log(resp);
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


    const renderOptionTiposClientes = () => {
        return [...tiposClientes.map((option) => (
            <option key={'select-tc-'+option.id} value={option.id}> {option.nombre} </option>
        ))]
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
    
/*
    useEffect(()=>{
        getProyectos();
    },[])
    
    useEffect(() => {
        getProyectoClientes();
    },[preyecto])

    useEffect(() => {
        getOrdenesServicio();
    },[fromData.id_cliente])
*/
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
                    {
                    //JSON.stringify(ordenesServicio)
                    }

                    <div className="mb-3 row">
                        <label htmlFor="candidato" className="col-sm-2 col-form-label">Familia</label>
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
                            <label htmlFor="colegios_comunes" className="col-sm-2 col-form-label">Colegios Comunes</label>
                            <div className="col-sm-10">
                                <Select options={ clientesComunes } onChange={(e)=>handlerChangeSelectClientes(e)}
                                components={animatedComponents}
                                closeMenuOnSelect={false}
                                isMulti
                                ></Select>
                            </div>
                        </div>
                    )}
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