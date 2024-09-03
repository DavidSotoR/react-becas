import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

function AltaEstudioLaboral(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [formValid,setFormValid] = useState(false)

    const [clientes,setClientes] = useState([])
    const [ordenesServicio,setOrdenesServicio] = useState([])
    const [colaboradores,setColaboradores] = useState([])

    const [nombreEstudio,SetNombreEstudio] = useState('Socioeconómico')
    const [tipoClienteSeleccionado,setTipoClienteSeleccionado] = useState('2')
    const [cliente,setCliente] = useState('')
    
    const animatedComponents = makeAnimated;

    const estudio_laboral = {
        id_servicio_estado:'2',
        id_cliente:'',
        id_orden_servicio:'',
        id_familia:'',
        id_colaborador:'',
    }
    const [fromData,setFormData] = useState(estudio_laboral)

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
        axios.post(`${APIURL}/estudio/laboral`,fromData,config).then((resp)=>{
            console.log(resp);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    
    const getClientes = () => {
        axios.get(`${APIURL}/clientes?id_tipo_cliente=2`,config).then((resp)=>{
            setClientes(resp.data);
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

    const renderOptionClientes = () => {
        return [<option key={'select-p-0'} value=''> Seleccione una Cliente</option>,...clientes.map((option) => (
            <option key={'select-pc-'+option.id} value={option.id}> {option.nombre} </option>
        ))]
    }
    const renderOptionOrdenesServicios = () => {
        return [<option key={'select-p-0'} value=''> Seleccione una orden de servicio </option>,...ordenesServicio.map((option) => (
            <option key={'select-pc-'+option.id} value={option.id}> {option.descripcion} </option>
        ))]
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

    useEffect(() => {
        getClientes();
    },[])

    useEffect(() => {
        cambioTipoCliente();
    },[tipoClienteSeleccionado])

    useEffect(() => {
        getOrdenesServicio();
    },[fromData.id_cliente])

    


    return(<>
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Nuevo Estudio Laboral</h6>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">
                    <div className="mb-3 row">
                        <label htmlFor="id_cliente" className="col-sm-2 col-form-label">Cliente</label>
                        <div className="col-sm-10">
                            <Form.Select 
                                className="form-select form-select-sm" 
                                name="id_cliente" 
                                id="id_cliente" 
                                value={fromData.id_cliente}
                                onChange={(e)=> {formInputChange(e); setCliente(e.target.value)}}>
                                {renderOptionClientes()}
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

export default AltaEstudioLaboral