import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';
import ResaltarTexto from "../../ResaltarTexto/ResaltarTexto";
import { useNavigate } from 'react-router-dom';

function EstudioLaboral(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const navigate = useNavigate();

    const [clientes,setClientes] = useState([])
    const [ordenesServicio,setOrdenesServicio] = useState([])
    const [colaboradores,setColaboradores] = useState([])
    const [allEstudios,setAllEstudios] =useState([])

    const [tipoClienteSeleccionado] = useState('1')
    const [preyecto,setProyecto] = useState('')
    const [cliente,setCliente] = useState('')
    const [search,setSearch] = useState("")
    const animatedComponents = makeAnimated;


    const [fromData,setFormData] = useState({
        id_servicio_estado:'1',
        id_cliente:'',
        id_orden_servicio:'',
        id_colaborador:'',
    })

    const searchText = (e) => {
        const buscar = e.target.value;
        setSearch(buscar);
    }

    const handelNavegate = () => {
        navigate(`/estudio-laboral/nuevo/${fromData.id_cliente}/${fromData.id_orden_servicio}`);
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
    const getClientes = () => {
        axios.get(`${APIURL}/clientes?id_tipo_cliente=2`,config).then((resp)=>{
            setClientes(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getOrdenesServicio = () => {
        if((!cliente) || (cliente === '')){
            return true;
        }
        axios.get(`${APIURL}/clientes/${cliente}/ordenes-servicio`,config).then((resp)=>{
            setOrdenesServicio(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }        
    const getEstudios = () => {
        if(!preyecto){
            setAllEstudios([]);
            return true;
        }
        axios.get(`${APIURL}/estudio/laboral`,{params:fromData,headers:config.headers}).then((resp)=>{
            setAllEstudios(resp.data);
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

    const renderOptionClientes = () => {
        return [<option key={'select-p-0'} value=''> Seleccione una Cliente</option>,...clientes.map((option) => (
            <option key={'select-pc-'+option.id} value={option.id}> {option.nombre} </option>
        ))]
    }
    const renderOptionOrdenesServicios = () => {
        return [<option key={'select-p-0'} value=''> Seleccione una orden de servicio </option>,...ordenesServicio.map((option) => (
            <option key={'select-pc-'+option.id} value={option.id}> #{option.id} {option.descripcion} </option>
        ))]
    }
    
    useEffect(() => {
        getClientes();
    },[])

    useEffect(() => {
        getOrdenesServicio();
    },[fromData.id_cliente])

    useEffect(() => {
        if(fromData.id_proyecto){
            getEstudios();
        }else{
            getEstudios([]);
        }
    },[fromData.id_cliente,fromData.id_orden_servicio])

    

    const allEstudiosFiltrados = allEstudios.filter(item =>
        item.candidato.toLowerCase().includes(search.toLowerCase())
    );

    const renderFilasTablaEstudios = () => {
        return allEstudiosFiltrados.map((estudio, index) => (
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
                    <p></p>
                </td>
                <td>
                    <p></p>
                </td>
            </tr>
        ));
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
                        {renderOptionClientes()}
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
                
                { fromData.id_cliente && (
                <div className="col-md-3 d-flex align-self-end">
                    <Button className="btn btn-primary btn-sm fw-bold" onClick={(e) => {handelNavegate()}} >Nuevo</Button>
                </div>
                )}
            </div>
            <hr/>
            
            <div className="col-4 row">
                <label htmlFor="search" className="col-sm-2 col-form-label">Buscar:</label>
                <div className="col-10">
                    <input type="text" className="form-control form-control-sm" placeholder="Buscar..." value={search} onChange={searchText}/>
                </div>
            </div>
            <br/>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col" className="col-id">#</th>
                        <th scope="col">Candidato</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Email</th>
                        <th scope="col">Colaborador</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    { renderFilasTablaEstudios() }
                </tbody>
                </table>
       </div> 
    </>)
}

export default EstudioLaboral