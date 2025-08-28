import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

function ModalProyectos({ show, handleClose,idTipoCliente,TipoCliente  }) {
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout, execShowAlert } = useContext(AuthContext);
    const [msgError, setMsgError] = useState('')
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        nombre:"",
        id_tipo_cliente: idTipoCliente,
        activo: true
    })
    const [ cicloActivo, setCicloActivo ] = useState(true)

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

    const validateFields = () => {
        let messageError = '';
        if (formData.nombre === '') {
            messageError = 'Campo nombre es Obligatorio';
        }
        if (messageError) {
            setFormValid(false);
            setMsgError(messageError);
        } else {
            setFormValid(true);
            setMsgError('');
        }
    };

    const changeFormatoFecha = (date) => {
        var newDate = date.replaceAll('-','/')
        return newDate
    }

    const success = (poss)=>{
        console.log(poss);
    }

    const sendDataProyectos = () =>{
        validateFields();
        if (formValid) {
            axios.post(APIURL+'/proyectos',formData,config).then((resp)=>{
                console.log(resp);
                execShowAlert({type: 'success', title: 'Proyecto Creado', message: 'El proyecto se creo correctamente.'})
                handleClose()
            }).catch((resp)=>{
                if (resp.status === 401) {
                    logout()
                } else {
                    console.log(resp);
                    if(resp.response.data.errors.anio_proyecto){
                        execShowAlert({ type: 'danger', title:'Error al Actualizar', message: resp.response.data.errors.anio_proyecto[0] })
                    } else if(resp.response.data.errors.nombre) {
                        execShowAlert({ type: 'danger', title:'Error al Actualizar', message: resp.response.data.errors.nombre[0] })
                    } else {
                        execShowAlert({type:'danger', title: 'Error Servidor', message: 'Ocurrio un error del lado del Servidor.'})
                    }
                    
                }
            })
        }
    }

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            id_tipo_cliente: idTipoCliente
        }));
    }, [idTipoCliente]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo proyecto: {TipoCliente}</Modal.Title>
            </Modal.Header>
            <Modal.Body>  
                <div className="mb-3">
                    <label> Nombre: </label>
                    <input className="form-control" name="nombre" type="text" onChange={(e) => {formInputChange(e)}}/>
                </div>

                <div className="mb-3">
                    <label> Año: </label>
                    {/* <input className="form-control" name="anio" type="date" onChange={(e) => {formInputChange(e)}}/> */}
                    <input className="form-control" name="anio_proyecto" type="number" min="2010" max="2099" onChange={(e) => {formInputChange(e)}}/>
                </div>
                
                <div className="form-check form-switch">
                    <input className="form-check-input" name="activo" type="checkbox" checked={formData.activo}
                    role="switch" id="flexSwitchCheckChecked" onChange={(e) => {formInputChange(e)}}/>
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Proyecto: {(formData.activo) ? 'Activo' : 'Inactivo'}</label>
                </div>
                <div className="mb-3">
                    <p style={{ color:"red" }}> { msgError } </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={()=>{sendDataProyectos()}}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalProyectos;