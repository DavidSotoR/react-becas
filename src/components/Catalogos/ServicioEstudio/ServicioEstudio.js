import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

function ServicioEstudio(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [tiposClientes,setTiposClientes] = useState([])
    const [formValid,setFormValid] = useState(false)

    const [proyectos,setProyectos] = useState([])
    const [proyectoClientes,setProyectoClientes] = useState([])
    const [ordenesServicio,setOrdenesServicio] = useState([])
    const [colaboradores,setColaboradores] = useState([])
    const [familias,setFamilias] = useState([])

    const [nombreEstudio,SetNombreEstudio] = useState('Socioeconómico')
    const [tipoClienteSeleccionado,setTipoClienteSeleccionado] = useState('1')
    const [preyecto,setProyecto] = useState('0')
    const [cliente,setCliente] = useState('')
    const [clientesComunes,setClientesComunes] = useState([])
    
    const animatedComponents = makeAnimated;


    const [fromData,setFormData] = useState({
        id_servicio_estado:'1',
        id_cliente:'',
        id_orden_servicio:'',
        id_familia:'',
        id_colaborador:'',
        es_familia_comun:false,
        colegios_comunes:[],
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
    
    const getListaTiposClientes= () => {
        axios.get(`${APIURL}/clientes/tipos`,config).then((resp)=>{
            setTiposClientes(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getProyectos = () => {
        axios.get(`${APIURL}/proyectos?activo=1&id_tipo_cliente=${tipoClienteSeleccionado}`,config).then((resp)=>{
            setProyectos(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getProyectoClientes = () => {
        axios.get(`${APIURL}/proyectos/${preyecto}/clientes`,config).then((resp)=>{
            setProyectoClientes(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getOrdenesServicio = () => {
        axios.get(`${APIURL}/proyectos/${preyecto}/clientes/${cliente}/ordenes-servicio`,config).then((resp)=>{
            setOrdenesServicio(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getFamilias= () => {
        axios.get(`${APIURL}/familias`,config).then((resp)=>{
            renderOptionFamilias(resp.data);
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

    const cambioTipoCliente = () => {
        if(tipoClienteSeleccionado === '1'){
            SetNombreEstudio('Socioeconomico')
        }else{
            SetNombreEstudio('Laboral')
        }
    }
    const handlerChangeSelect = (e) =>{
        const value = e.value;
            setFormData(prevState => ({
                ...prevState,
                id_familia: value
            }));

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
            <option key={'select-pc-'+option.id} value={option.id}> {option.descripcion} </option>
        ))]
    }
    
    const renderOptionFamilias  = (opciones) =>{
        var opcionesFamilias = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcionesFamilias.push(option)
        })
        setFamilias(opcionesFamilias)
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

    const validateFields = ()=>{
        var messageError = ''
        if (fromData.nombre.length <= 3 || fromData.nombre === '') {
            messageError += 'Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres\n'
        }
        if (fromData.situacion_beca === '') {
            messageError += 'Campo Situacion Beca es OBLIGATORIO\n'
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    useEffect(()=>{
        getListaTiposClientes();
        getProyectos();
    },[])
    
    useEffect(() => {
        cambioTipoCliente();
        getProyectos();
    },[tipoClienteSeleccionado])
    
    useEffect(() => {
        getProyectoClientes();
    },[preyecto])

    useEffect(() => {
        getOrdenesServicio();
    },[fromData.id_cliente])

    useEffect(() => {
        getFamilias();
    },[fromData.id_cliente,fromData.id_orden_servicio])

    useEffect(() => {
        if(fromData.es_familia_comun === true){
            getListaClientesHermanos();
        }else{
            setClientesComunes([]);
        }
    },[fromData.id_cliente,fromData.es_familia_comun])
    
    
    


    return(<>
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Nuevo Estudio {nombreEstudio}</h6>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">
                    <div className="mb-3 row">
                        <label htmlFor="id_tipo_cliente" className="col-sm-2 col-form-label">Tipo de cliente</label>
                        <div className="col-sm-10">
                            <Form.Select 
                                className="form-select form-select-sm" 
                                name="id_tipo_cliente" 
                                id="id_tipo_cliente" 
                                value={tipoClienteSeleccionado}
                                onChange={(e)=> setTipoClienteSeleccionado(e.target.value)}>
                                {renderOptionTiposClientes()}
                            </Form.Select>
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="id_proyecto" className="col-sm-2 col-form-label">Proyecto</label>
                        <div className="col-sm-10">
                            <Form.Select 
                                className="form-select form-select-sm" 
                                name="id_proyecto" 
                                id="id_proyecto" 
                                value={preyecto}
                                onChange={(e)=> setProyecto(e.target.value)}>
                                {renderOptionProyectos()}
                            </Form.Select>
                        </div>
                    </div>
                    
                    <div className="mb-3 row">
                        <label htmlFor="id_cliente" className="col-sm-2 col-form-label">Cliente</label>
                        <div className="col-sm-10">
                            <Form.Select 
                                className="form-select form-select-sm" 
                                name="id_cliente" 
                                id="id_cliente" 
                                value={fromData.id_cliente}
                                onChange={(e)=> {formInputChange(e); setCliente(e.target.value)}}>
                                {renderOptionProyectoClientes()}
                            </Form.Select>
                        </div>
                    </div>
                    {
                    //JSON.stringify(ordenesServicio)
                    }
                    <div className="mb-3 row">
                        <label htmlFor="id_orden_servicio" className="col-sm-2 col-form-label">Orden de servicio</label>
                        <div className="col-sm-10">
                            <Form.Select 
                                className="form-select form-select-sm" 
                                name="id_orden_servicio" 
                                id="id_orden_servicio" 
                                value={fromData.id_orden_servicio}
                                onChange={(e)=> formInputChange(e)}>
                                {renderOptionOrdenesServicios()}
                            </Form.Select>
                        </div>
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="id_familia" className="col-sm-2 col-form-label">Familia</label>
                        <div className="col-sm-10">
                            {/*}
                            <Form.Select 
                                className="form-select form-select-sm" 
                                name="id_familia" 
                                id="id_familia" 
                                value={fromData.id_familia}
                                onChange={(e)=> formInputChange(e)}>
                                {renderOptionOrdenesServicios()}
                            </Form.Select>
                            */}
                            
                            <Select options={ familias } onChange={(e)=>handlerChangeSelect(e)}
                            components={animatedComponents}
                            ></Select>
                        </div>
                    </div>
                    
                    <div className="mb-3 row">
                        <p className="col-sm-2 col-form-label">Familia consegios comunes</p>
                        <div className="col-sm-10 pt-1">
                            <div className="form-switch">
                                <input 
                                    className="form-check-input" 
                                    name="es_familia_comun" 
                                    type="checkbox" 
                                    checked={fromData.es_familia_comun}
                                    role="switch" id="es_familia_comun" 
                                    onChange={(e) => {formInputChange(e)}}
                                    />
                                <label className="form-check-label">{(fromData.es_familia_comun) ? 'Si' : 'No'}</label>
                            </div>
                        </div>
                    </div>

                    {fromData.es_familia_comun && (
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
                    <div className="d-flex" style={{ flexDirection: 'row-reverse'}} >
                        <button className="btn btn-primary btn-sm fw-bold " onClick={sendDataEstudioSocioeconomico}>Guardar</button>
                    </div>
                    <br/>
                    {JSON.stringify(fromData)}
                    
                </div>
            </div>
       </div> 
    </>)
}

export default ServicioEstudio