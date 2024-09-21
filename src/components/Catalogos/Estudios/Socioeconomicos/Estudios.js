import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import ResaltarTexto from "../../../ResaltarTexto/ResaltarTexto";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Avatar from 'react-avatar';

export default function Estudios(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [tiposClientes,setTiposClientes] = useState([])

    const [allEstudios,setAllEstudios] =useState([])

    const [tipoClienteSeleccionado] = useState('1')
    const [preyecto,setProyecto] = useState(location.state?.idProyecto || '')
    const [cliente,setCliente] = useState(location.state?.idCliente || '')
    const animatedComponents = makeAnimated;

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
    
    const [opcionesColaboradores,setSpcionesColaboradores] = useState([])
    const renderOpcionesColaboradores  = (opciones) =>{
        var opcioneslista = []
        opcioneslista.push({ value: '', label:'Todos' })
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.name
            option.value = h.id
            opcioneslista.push(option)
        })
        setSpcionesColaboradores(opcioneslista)
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
        id_servicio_estado:'1',
        id_proyecto: location.state?.idProyecto || '',
        id_cliente: location.state?.idCliente || '',
        id_orden_servicio: location.state?.idOrdenServicio || '',
        id_colaborador:'',
    })
    
    const [selectedOption, setSelectedOption] = useState(null);
    const [fromAsignarColaborador,setFromAsignarColaborador] = useState({
        id_servicios_estudio: [],
        id_colaborador:'',
    }) 

    const searchText = (e) => {
        const buscar = e.target.value;
        setSearch(buscar);
    }

    const allEstudiosFiltrados = allEstudios.filter(item =>
        item.candidato.toLowerCase().includes(search.toLowerCase())
    );
    const handelNavegate = (id) => {
        navigate(`/estudio/${id}`);
    }

    const getProyectos = () => {
        axios.get(`${APIURL}/proyectos?activo=1&id_tipo_cliente=${tipoClienteSeleccionado}`,config).then((resp)=>{
            renderOpcionesProyectos(resp.data);
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
    const getListaColaboradores = () =>{
        axios.get(APIURL+'/estudio/colaboradores',config).then((resp)=>{
            renderOpcionesColaboradores(resp.data)
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
        })
    }   
    const getEstudiosSocioeconomicos = () => {
        /*if(!preyecto){
            setAllEstudios([]);
            return true;
        }*/
        axios.get(`${APIURL}/estudio/socioeconomico`,{params:fromData,headers:config.headers}).then((resp)=>{
            setAllEstudios(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const postDataEditarColaborador = () =>{
        axios.post(`${APIURL}/estudio/colaboradores`,fromAsignarColaborador,config).then((resp)=>{
            console.log(resp.data);
            setSelectedRows([]);
            setSelectedOption(null);
            getEstudiosSocioeconomicos();
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
        
    }

    useEffect(()=> {
        getProyectos();
        getListaColaboradores();
    } ,[])
    
    useEffect(() => {getProyectoClientes()} ,[preyecto])

    useEffect(() => {getOrdenesServicio()} ,[fromData.id_cliente])

    useEffect(() => {
        if(fromData.id_proyecto){
            getEstudiosSocioeconomicos();
        }else{
            getEstudiosSocioeconomicos([]);
        }
    },[fromData.id_proyecto,fromData.id_cliente,fromData.id_orden_servicio,fromData.id_colaborador])

    useEffect(() => {
        setFromAsignarColaborador(prevState => ({
            ...prevState,
            id_servicios_estudio: selectedRows
        })); 
    },[selectedRows])


    const avatarColaborador = (colaborador) => {
        if(!colaborador){
            return '';
        }
        return (<>
            <div className="d-flex">
                <div className="align-self-center">
                    <Avatar name={colaborador.name} size="30" round={true} />
                </div>
                <div className="ps-1 align-self-center">
                    <span>
                    {colaborador.name}
                    </span><br/>
                    <span>
                    {colaborador.email}
                    </span>
                </div>
            </div>
        </>);
    }
    
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
            <tr key={'tr-cliente-'+index}>
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
                    { contactoPrincipalDireccion(estudio.contacto_principal) }
                </td>
                <td>
                    {estudio.proyecto.nombre}
                </td>
                <td>
                    {estudio.cliente.nombre}
                </td>
                <td>
                    {'#'+estudio.orden_servicio.id}<br/>
                    {estudio.orden_servicio.descripcion}
                </td>
                <td>
                    {estudio?.colaborador && avatarColaborador(estudio.colaborador)}
                </td>
                <td>
                    <div className="d-flex flex-row-reverse bd-highlight">
                        
                        <Link className="btn btn-primary btn-sm" to={`/estudio/${estudio.id}`}>Ver</Link>
                    </div>
                </td>
            </tr>
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
                        htmlFor="id_colaborador" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Colaborador:
                    </label>
                    <Select 
                        name="id_colaborador" 
                        id="id_colaborador" 
                        components={animatedComponents}
                        options={ opcionesColaboradores }
                        onChange={
                            (e)=> {
                                setFormData(prevState => ({
                                    ...prevState,
                                    id_colaborador: e.value
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
                        <label htmlFor="search" className="col-sm-3 col-form-label">Asignar Colaborador:</label>
                        <div className="col-9">
                            <Select 
                                name="id_colaborador" 
                                id="id_colaborador" 
                                components={animatedComponents}
                                options={ opcionesColaboradores }
                                value={selectedOption}
                                onChange={
                                    (e)=> {
                                        setSelectedOption(e);
                                        setFromAsignarColaborador(prevState => ({
                                            ...prevState,
                                            id_colaborador: e.value
                                        })); 
                                    }
                                }>
                            </Select>
                        </div>
                    </div> 
                    <div className="col-2">
                        <Button className="btn btn-primary btn-sm fw-bold" onClick={(e) => {postDataEditarColaborador()}} >Guardar</Button>
                    </div>
                </>
                )}
            </div>
        
            <br/>
        </>)
    }

    return(<>
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Lista de Estudios</h6>
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
                            <th scope="col">Direccion</th>
                            <th scope="col">Proyecto</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Orden de servicio</th>
                            <th scope="col">Colaborador</th>
                            <th scope="col">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderFilasTablaEstudiosSocioeconomicos() }
                    </tbody>
                </table>
            </div>
       </div> 
    </>)
}
