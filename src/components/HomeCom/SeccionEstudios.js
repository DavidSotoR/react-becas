import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import makeAnimated from 'react-select/animated';
import { Link } from "react-router-dom";
import Select from "react-select";
import Avatar from 'react-avatar';
import ResaltarTexto from "../ResaltarTexto/ResaltarTexto";
import VisitaAgendada from "./Componentes/VisitaAgendada";


export default function SeccionEstudios(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [roleSession, setRoleSession] = useState(localStorage.getItem('role'))
    const { logout } = useContext(AuthContext);

    const [tiposClientes,setTiposClientes] = useState([])

    const [allEstudios,setAllEstudios] =useState([])

    const [tipoClienteSeleccionado] = useState('1')
    const [preyecto,setProyecto] = useState( '')
    const [cliente,setCliente] = useState('')
    const animatedComponents = makeAnimated;
    const [filaSeleccionada, setFilaSeleccionada] = useState(null);
    const seleccionarFila = (id) => {
        setFilaSeleccionada(filaSeleccionada === id ? null : id);
    };

    const [opcionesProyectos,setOpcionesProyectos] = useState([])
    const renderOpcionesProyectos  = (opciones) =>{
        var opcioneslista = []
        opcioneslista.push({ value: '', label:'Todos' })
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcioneslista.push(option)
        })
        setOpcionesProyectos(opcioneslista)
    }
    
    const [opcionesEstados,setOpcionesEstados] = useState([])
    const renderOpcionesEstados  = (opciones) =>{
        var opcioneslista = []
        opcioneslista.push({ value: '', label:'Todos' })
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcioneslista.push(option)
        })
        setOpcionesEstados(opcioneslista)
    }

    const [opcionesClientes,setOpcionesClientes] = useState([])
    const renderOpcionesClientes = (opciones) =>{
        var opcioneslista = []
        opcioneslista.push({ value: '', label:'Todos' })
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcioneslista.push(option)
        })
        setOpcionesClientes(opcioneslista)
    }

    const [opcionesOrdenesServicio,setOpcionesOrdenesServicio] = useState([])
    const renderOpcionesOrdenesServicio = (opciones) =>{
        var opcioneslista = []
        opcioneslista.push({ value: '', label:'Todos' })
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = '#'+h.id+' '+h.descripcion
            option.value = h.id
            opcioneslista.push(option)
        })
        setOpcionesOrdenesServicio(opcioneslista)
    }
    
    const [opcionesCalidad,setOpcionesCalidad] = useState([])
    const renderOpcionesCalidad  = (opciones) =>{
        var opcioneslista = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.name
            option.value = h.id
            opcioneslista.push(option)
        })
        setOpcionesCalidad(opcioneslista)
    }

    const [search,setSearch] = useState("")
    const [selectedRows, setSelectedRows] = useState([]);
    const handleRowSelect = (id) => {
        if (selectedRows.includes(id)) {
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
        } else {
        setSelectedRows([...selectedRows, id]);
        }
    };

    const isRowSelected = (id) => selectedRows.includes(id);

    const [fromData,setFormData] = useState({
        id_servicio_estado:'',
        id_proyecto: '',
        id_cliente: '',
        id_orden_servicio: '',
    })
    
    const [selectedOption, setSelectedOption] = useState(null);
    const [fromAsignarCalidad,setFromAsignarCalidad] = useState({
        id_servicios_estudio: [],
        id_calidad:'',
    }) 

    const searchText = (e) => {
        const buscar = e.target.value;
        setSearch(buscar);
    }

    const allEstudiosFiltrados = allEstudios.filter(item =>
        item.candidato.toLowerCase().includes(search.toLowerCase())
    );

    const getProyectos = () => {
        axios.get(`${APIURL}/proyectos?activo=1&id_tipo_cliente=${tipoClienteSeleccionado}`,config).then((resp)=>{
            renderOpcionesProyectos(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    
    const getFiltroEstadosEstudios= () => {
        axios.get(`${APIURL}/estudios/enproceso/estados`,config).then((resp)=>{
            renderOpcionesEstados(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const getUsuariosCalidad = () => {
        axios.get(`${APIURL}/estudio/calidad`,config).then((resp)=>{
            renderOpcionesCalidad(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const getProyectoClientes = () => {
        if(preyecto === ''){
            return true;
        }
        axios.get(`${APIURL}/proyectos/${preyecto}/clientes`,config).then((resp)=>{
            renderOpcionesClientes(resp.data)
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getOrdenesServicio = () => {
        if(preyecto === ''){
            return true;
        }
        if((!cliente) || (cliente === '')){
            return true;
        }
        axios.get(`${APIURL}/proyectos/${preyecto}/clientes/${cliente}/ordenes-servicio`,config).then((resp)=>{
            renderOpcionesOrdenesServicio(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getListaEstudiosEnProceso = () => {
        axios.get(`${APIURL}/estudios/enproceso`,{params:fromData,headers:config.headers}).then((resp)=>{
            setAllEstudios(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const postDataEnviarACalidad = () =>{
        axios.post(`${APIURL}/estudio/calidad`,fromAsignarCalidad,config).then((resp)=>{
            console.log(resp.data);
            setSelectedRows([]);
            setSelectedOption(null);
            getListaEstudiosEnProceso();
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
        
    }

    useEffect(()=> {
        getProyectos();
        getUsuariosCalidad();
        getFiltroEstadosEstudios();
        getListaEstudiosEnProceso();
    } ,[])
    
    useEffect(() => {getProyectoClientes()} ,[preyecto])

    useEffect(() => {getOrdenesServicio()} ,[fromData.id_cliente])

    useEffect(() => {
        if(fromData.id_proyecto){
            getListaEstudiosEnProceso();
        }else{
            getListaEstudiosEnProceso([]);
        }
    },[fromData.id_proyecto,fromData.id_cliente,fromData.id_orden_servicio,fromData.id_colaborador])

    useEffect(() => {
        setFromAsignarCalidad(prevState => ({
            ...prevState,
            id_servicios_estudio: selectedRows
        })); 
    },[selectedRows])
    
    const contactoPrincipalDireccion = (colaborador) => {
        if(!colaborador){
            return '';
        }
        return (<>
            <div className="d-flex">
                {colaborador?.direccion ?? colaborador.direccion}
            </div>
        </>);
    }

    const mostrarEstado = (estado) => {
        if(!estado){
            return '';
        }
        return (<div className="d-flex"><div className="border rounded p-1" style={{ backgroundColor: estado.color }}> {estado.nombre} </div></div>)
    }

    const mostrarContactoPrincipal = (contacto_principal) => {
        if(!contacto_principal){
            return '';
        }
        return (<div>
            <div>{contacto_principal.nombre}</div>
            <div><b>correo:</b> {contacto_principal.email}</div>
            <div><b>telefono:</b> {contacto_principal.telefono_casa}</div>
        </div>)
    }

    const renderFilasTablaEstudiosSocioeconomicos = () => {
        return allEstudiosFiltrados.map((estudio, index) => (
            <React.Fragment key={'tr-cliente-'+index}>
            <tr onClick={() => seleccionarFila(estudio.id)} style={{ cursor: "pointer" }}>
                <td className="align-middle">
                        <input
                            type="checkbox"
                            checked={isRowSelected(estudio.id)}
                            onChange={() => handleRowSelect(estudio.id)}
                        />
                </td>
                <td>
                    <p>#{estudio.id}</p>
                </td>
                <td>
                    <p><ResaltarTexto texto={estudio.candidato} reslatar={search}/></p>
                </td>
                <td>
                    { mostrarEstado(estudio.estado) }
                </td>
                <td>
                    {estudio.cliente.nombre}
                </td>
                <td>
                    {'#'+estudio.orden_servicio.id}<br/>
                    {estudio.orden_servicio.descripcion}
                </td>
                <td>
                    <div className="d-flex flex-row-reverse bd-highlight">
                        
                        <Link className="btn btn-primary btn-sm" to={`/estudio/${estudio.id}`}>Ver</Link>
                    </div>
                </td>
            </tr>
            {filaSeleccionada === estudio.id && (
            <tr>
                <td colSpan="9"  className={`subseccion ${filaSeleccionada === estudio.id ? 'expandida' : ''}`}>
                    <div  style={{ backgroundColor: "#47D1D6"}} className="p-3 rounded-4">
                        <div className="row m-0">
                            {/*JSON.stringify(estudio)*/}
                            <div className="col-sm-8">
                                <div className="row rounded-4 me-1" style={{ backgroundColor: "#f9f9f9"}}>
                                    <div className="col-12 pt-2" >
                                        <h5>Contacto principal </h5>
                                        <hr></hr>
                                    </div>
                                    <div className="col-sm-6 pt-1">
                                        <div>Cliente:</div>
                                        <div>{estudio.cliente.nombre}</div>
                                    </div>
                                    <div className="col-sm-6 pt-1">
                                        <div>Contacto principal:</div>
                                        <div>{estudio.contacto_principal?.nombre ? estudio.contacto_principal.nombre:"\u00A0"}</div>
                                    </div>
                                    <div className="col-sm-6 pt-1">
                                        <div>Teléfono:</div>
                                        <div>{estudio.contacto_principal?.telefono_casa ? estudio.contacto_principal.telefono_casa:"\u00A0"}</div>
                                    </div>
                                    <div className="col-sm-6 pt-1">
                                        <div>Correo:</div>
                                        <div>{estudio.contacto_principal?.email ? estudio.contacto_principal.email:"\u00A0"}</div>
                                    </div>
                                    <div className="col-sm-12 pt-1">
                                        <div>Direccion:</div>
                                        <div>
                                            { contactoPrincipalDireccion(estudio.contacto_principal) }
                                        </div>
                                        <hr/>
                                    </div>
                                    <div className="col-sm-12 mt-1 mb-2 pt-1">
                                        <div className="row ">
                                            <div className="col-sm-1 p-1">
                                            </div>
                                            {/*<div className="col-sm-2 p-1">
                                                <Link className="btn btn-primary btn-sm" to={`/estudio/${estudio.id}`}>Pre vista</Link>
                                            </div>
                                            <div className="col-sm-3 p-1">
                                                <Link className="btn btn-primary btn-sm" to={`/estudio/${estudio.id}`}>Imagenes encuesta</Link>
                                            </div>*/}
                                            <div className="col-sm-2 p-1">
                                                <Link className="btn btn-primary btn-sm" to={`/estudio-socioeconomico/${estudio.id}`}>Encuesta</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <VisitaAgendada estudio={estudio}/>
                        </div>
                    </div>
                </td>
            </tr>
            )}
        </React.Fragment>
        ));
    }

    const seccionFiltrar = () => {
        return (<>
            <hr/>
            <div className="row">
                <div className="col-md-3">
                    <label 
                        htmlFor="id_proyecto" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Proyecto:
                    </label>
                    <Select 
                        name="id_proyecto" 
                        id="id_proyecto" 
                        components={animatedComponents}
                        options={ opcionesProyectos }
                        onChange={
                            (e)=> {
                                setProyecto(e.value);
                                setFormData(prevState => ({
                                    ...prevState,
                                    id_proyecto: e.value
                                })); 
                            }
                        }>
                    </Select>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_cliente" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Cliente:
                    </label>
                    <Select 
                        name="id_cliente" 
                        id="id_cliente" 
                        components={animatedComponents}
                        options={ opcionesClientes }
                        onChange={
                            (e)=> {
                                setCliente(e.value);
                                setFormData(prevState => ({
                                    ...prevState,
                                    id_cliente: e.value
                                })); 
                            }
                        }>
                    </Select>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_orden_servicio" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Orden de servicio:
                    </label>
                    <Select 
                        name="id_orden_servicio" 
                        id="id_orden_servicio" 
                        components={animatedComponents}
                        options={ opcionesOrdenesServicio }
                        onChange={
                            (e)=> {
                                setFormData(prevState => ({
                                    ...prevState,
                                    id_orden_servicio: e.value
                                })); 
                            }
                        }>
                    </Select>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_servicio_estado" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Estados:
                    </label>
                    <Select 
                        name="id_servicio_estado" 
                        id="id_servicio_estado" 
                        components={animatedComponents}
                        options={ opcionesEstados }
                        onChange={
                            (e)=> {
                                setFormData(prevState => ({
                                    ...prevState,
                                    id_servicio_estado: e.value
                                })); 
                            }
                        }>
                    </Select>
                </div>
            </div>
            <hr/>
        </>)
    }

    const opcionesTabla = () => {
        return (<>
            <div className="row">
                <div className="col-3 row">
                    <label htmlFor="search" className="col-sm-3 col-form-label">Buscar:</label>
                    <div className="col-9">
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar..." value={search} onChange={searchText}/>
                    </div>
                </div>
                {selectedRows.length > 0 && (<>
                    <div className="col-4 row">
                        <label htmlFor="search" className="col-sm-3 col-form-label">Asignar Calidad:</label>
                        <div className="col-9">
                            <Select 
                                name="id_calidad" 
                                id="id_calidad" 
                                components={animatedComponents}
                                options={ opcionesCalidad }
                                value={selectedOption}
                                onChange={
                                    (e)=> {
                                        setSelectedOption(e);
                                        setFromAsignarCalidad(prevState => ({
                                            ...prevState,
                                            id_calidad: e.value
                                        })); 
                                    }
                                }>
                            </Select>
                        </div>
                    </div> 
                    <div className="col-2">
                        <Button className="btn btn-primary btn-sm fw-bold" onClick={(e) => {postDataEnviarACalidad()}} >Enviar a calidad</Button>
                    </div>
                </>
                )}
            </div>
        
            <br/>
        </>)
    }

    const mostrarSeccion = () => {
        if(roleSession === 'Colaboradores'){
            return true
        }else if(roleSession === 'Calidad'){
            return true
        }else if(roleSession === 'Administrador'){
            return true
        }
        return false
    }

    return (mostrarSeccion() && (<section>
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6>
                        <span style={{ fontWeight:'bold' }}>
                            Estudios Asignados:
                        </span>

                    </h6>
                </div>
            </div>

            {seccionFiltrar()}
            {opcionesTabla()}

            <div style={{overflowX:'auto'}}>
                <table className="table" style={{width:'auto',minWidth:'100%'}}>
                    <thead>
                        <tr>
                            <th scope="col" style={{width:'30px'}}></th>
                            <th scope="col" className="col-id">#</th>
                            <th scope="col">Familia</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Orden de servicio</th>
                            <th scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderFilasTablaEstudiosSocioeconomicos() }
                    </tbody>
                </table>
            </div>
       </div> 
    </section>));
}