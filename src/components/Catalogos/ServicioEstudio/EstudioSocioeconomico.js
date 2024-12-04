import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import ResaltarTexto from "../../ResaltarTexto/ResaltarTexto";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Avatar from 'react-avatar';

function ServicioEstudio(){
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const navigate = useNavigate();
    const location = useLocation();

    const [tiposClientes,setTiposClientes] = useState([])

    const [proyectos,setProyectos] = useState([])
    const [proyectoClientes,setProyectoClientes] = useState([])
    const [ordenesServicio,setOrdenesServicio] = useState([])
    const [colaboradores,setColaboradores] = useState([])
    const [allEstudiosSocioeconomicos,setAllEstudiosSocioeconomicos] =useState([])

    const [tipoClienteSeleccionado] = useState('1')
    const [preyecto,setProyecto] = useState(location.state?.idProyecto || '')
    const [cliente,setCliente] = useState(location.state?.idCliente || '')
    const [search,setSearch] = useState("")
    const [file, setFile] = useState(null);


    const [ openModalCargarArchivo, setOpenModalCargarArchivo ] = useState(false)
    const changeOpenModalArchivo = () => {         
        setOpenModalCargarArchivo(!openModalCargarArchivo) 
    }
    const animatedComponents = makeAnimated;


    const [fromData,setFormData] = useState({
        id_servicio_estado:'1',
        id_proyecto: location.state?.idProyecto || '',
        id_cliente: location.state?.idCliente || '',
        id_orden_servicio: location.state?.idOrdenServicio || '',
        id_colaborador:'',
    })

    const searchText = (e) => {
        const buscar = e.target.value;
        setSearch(buscar);
    }

    const handelNavegate = () => {
        navigate(`/estudio-socioeconomico/nuevo/${fromData.id_proyecto}/${fromData.id_cliente}/${fromData.id_orden_servicio}`);
    }

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
    
    const getProyectos = () => {
        axios.get(`${APIURL}/proyectos?activo=1&id_tipo_cliente=${tipoClienteSeleccionado}`,config).then((resp)=>{
            setProyectos(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getProyectoClientes = () => {
        if(preyecto === ''){
            return true;
        }
        axios.get(`${APIURL}/proyectos/${preyecto}/clientes`,config).then((resp)=>{
            setProyectoClientes(resp.data);
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
            setOrdenesServicio(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }        
    const getEstudiosSocioeconomicos = () => {
        if(!preyecto){
            setAllEstudiosSocioeconomicos([]);
            return true;
        }
        axios.get(`${APIURL}/estudio/socioeconomico`,{params:fromData,headers:config.headers}).then((resp)=>{
            setAllEstudiosSocioeconomicos(resp.data);
        }).catch((resp)=>{
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

    const renderOptionProyectos = () => {
        return [<option key={'select-p-0'} value=''> Seleccione un proyecto </option>,...proyectos.map((option) => (
            <option key={'select-tcp-'+option.id} value={option.id}> {option.nombre} </option>
        ))]
    }
    const renderOptionProyectoClientes = () => {
        return [<option key={'select-p-0'} value=''> Seleccione una Cliente</option>,...proyectoClientes.map((option) => (
            <option key={'select-pc-'+option.id} value={option.id}> {option.nombre} </option>
        ))]
    }
    const renderOptionOrdenesServicios = () => {
        return [<option key={'select-p-0'} value=''> Seleccione una orden de servicio </option>,...ordenesServicio.map((option) => (
            <option key={'select-pc-'+option.id} value={option.id}> #{option.id} {option.descripcion} </option>
        ))]
    }

    const actualizoInputFiles = (e, name) =>{
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]); // Obtener el primer archivo
        }

    }
    
    
    useEffect(()=>{
        getProyectos();
    },[])
    
    useEffect(() => {
        getProyectoClientes();
    },[preyecto])

    useEffect(() => {
        getOrdenesServicio();
    },[fromData.id_cliente])

    useEffect(()=>{
        if (openModalCargarArchivo) {
            console.log(openModalCargarArchivo);
            
        }
    }, openModalCargarArchivo)

    useEffect(() => {
        if(fromData.id_proyecto){
            getEstudiosSocioeconomicos();
        }else{
            getEstudiosSocioeconomicos([]);
        }
    },[fromData.id_proyecto,fromData.id_cliente,fromData.id_orden_servicio])

    

    const allEstudiosSocioeconomicosFiltrados = allEstudiosSocioeconomicos.filter(item =>
        item.candidato.toLowerCase().includes(search.toLowerCase())
    );

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

    const sendCorreo = (data) =>{
        var idFamilia = data.id_familia

        axios.post(APIURL+"/familias/"+idFamilia+"/estudio/socioeconomico/correo",data, config).then(resp=>{
            console.log(resp);
        }).catch(err=>{
            console.log(err);
            
        })
        console.log(data);
        
    }

    const renderFilasTablaEstudiosSocioeconomicos = () => {
        return allEstudiosSocioeconomicosFiltrados.map((estudio, index) => (
            <tr key={'tr-cliente-'+index}>
                <td>
                    <p>#{estudio.id}</p>
                </td>
                <td>
                    <p><ResaltarTexto texto={estudio.candidato} reslatar={search}/></p>
                </td>
                <td>
                    <p>{ estudio.situacion }</p>
                </td>
                <td>
                    <p>{ estudio.email }</p>
                </td>
                <td>
                    {estudio?.colaborador && avatarColaborador(estudio.colaborador)}
                </td>
                <td>
                    <div className="d-flex flex-row-reverse bd-highlight">
                        <button onClick={()=>sendCorreo(estudio)} className="btn btn-primary btn-sm mx-1 d-flex justify-content-center align-items-center">
                            <ion-icon name="mail-outline"></ion-icon>
                        </button>
                        <Link className="btn btn-primary btn-sm" to={`/estudio-socioeconomico/${estudio.id}`}>Ver</Link>
                    </div>
                </td>
            </tr>
        ));
    }
    

    const subirArchivoFamiliaSE = () => {
        const formData = new FormData();
        if (!file) {
            alert("Seleccione un archivo antes de subir.");
            return;
        }

        formData.append('id_cliente', cliente);
        formData.append('id_proyecto', preyecto);
        formData.append('id_orden_servicio', fromData.id_orden_servicio);
        formData.append('file', file); // Importante: 'files[]' para múltiples archivos


        axios.post(APIURL+"/estudio/socioeconomico/carga/familias",formData,config).then((resp) => {
            console.log(resp);
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                logout()
            }
        })
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
                    <label 
                        htmlFor="id_proyecto" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Proyecto:
                    </label>
                    <Form.Select 
                        className="form-select form-select-sm" 
                        name="id_proyecto" 
                        id="id_proyecto" 
                        value={preyecto}
                        onChange={
                            (e)=> {
                                setProyecto(e.target.value);
                                setFormData(prevState => ({
                                    ...prevState,
                                    id_proyecto: e.target.value
                                })); 
                            }
                        }>
                        {renderOptionProyectos()}
                    </Form.Select>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_cliente" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Cliente:
                    </label>
                    <Form.Select 
                        className="form-select form-select-sm" 
                        name="id_cliente" 
                        id="id_cliente" 
                        value={fromData.id_cliente}
                        onChange={(e)=> {formInputChange(e); setCliente(e.target.value)}}>
                        {renderOptionProyectoClientes()}
                    </Form.Select>
                </div>
                <div className="col-md-3">
                    <label 
                        htmlFor="id_orden_servicio" 
                        className="form-label"
                        style={{marginBottom: "1px",color: "darkolivegreen"}}
                    >Orden de servicio: #{fromData.id_orden_servicio}
                    </label>
                    <Form.Select 
                        className="form-select form-select-sm" 
                        name="id_orden_servicio" 
                        id="id_orden_servicio" 
                        value={fromData.id_orden_servicio}
                        onChange={(e)=> formInputChange(e)}>
                        {renderOptionOrdenesServicios()}
                    </Form.Select>
                </div>
                
                { fromData.id_orden_servicio && (
                <div className="col-md-4 d-flex align-self-end">
                    <Button className="btn btn-primary btn-sm fw-bold me-1" onClick={(e) => {handelNavegate()}} >Nueva Familia</Button>
                    <Button className="btn btn-primary btn-sm" onClick={ () => changeOpenModalArchivo() }>Cargar Familias</Button>
                </div>
                )}
            </div>
            <hr/>
            <div className="row">
                <div className="col-4 row">
                    <label htmlFor="search" className="col-sm-2 col-form-label">Buscar:</label>
                    <div className="col-10">
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar..." value={search} onChange={searchText}/>
                    </div>
                </div>
                
            </div>
            
            <br/>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col" className="col-id">#</th>
                        <th scope="col">Familia</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Email</th>
                        <th scope="col">Colaborador</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    { renderFilasTablaEstudiosSocioeconomicos() }
                </tbody>
            </table>
       </div> 
       <Modal show={openModalCargarArchivo} onHide={changeOpenModalArchivo}>
            <Modal.Header closeButton>
            <Modal.Title>Alta de Familias por Archivo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Proyecto: { preyecto }</p>
                <p>Cliente: { cliente }</p>
                <p>Orden Servicio: { fromData.id_orden_servicio }</p>
                
                
                
                <div className="mb-3 form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" name="enableCrearUsuarios" id="enableCrearUsuarios"/>
                            <label class="form-check-label" for="enableCrearUsuarios">Crear usuarios para alta de Familias</label>
                        </div>
                <div className="row">
                    <div className="col-3">
                        <p className="m-0 p-0">Formato a Subir:</p>
                        <a className="mb-3" href="">Formato excel</a>
                    </div>
                    <div className="col-9">
                        <Form>
                            <input hidden name="proyecto" value={preyecto}></input>
                            <input hidden name="cliente" value={cliente}></input>
                            <input hidden name="proyecto" value={fromData.id_orden_servicio}></input>
                            <input className="form-control" onChange={ (e) => { actualizoInputFiles(e) } } accept=".csv, .xls, .xlsx" type="file" id="formFileFamiliasES"/>
                        </Form>
                    </div>

                </div>
                
                

            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={changeOpenModalArchivo}>
                Cancelar
            </Button>
            <Button className="btn btn-primary mt-2" variant="primary" onClick={ subirArchivoFamiliaSE }>
                Subir Archivo
            </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default ServicioEstudio