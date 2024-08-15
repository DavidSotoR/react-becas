import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function ModalNuevaOrdenDeTrabajo({ show, handleClose ,idProyecto}) {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_proyecto: idProyecto,
        descripcion: '',
        notas:'',
        fecha_estimada_entrega: '',
        fecha_estimada_finalizacion: '',
        activo: true
    })

  const handleCheckChange = (e) => {
    setFormData(prevState => ({
        ...prevState,
        activo: e.target.checked
    }));
  };
    const formInputChange =(e) => {
        const { name, value } = e.target; 
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    
    const validateFields = ()=>{
        var messageError = ''
        if ( formData.descripcion === '' ) {
            messageError += 'Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres\n'
        }
        
        if (formData.fecha_estimada_entrega.length === 0 || formData.fecha_estimada_entrega === '') {
            messageError += 'Campo cliente es OBLIGATORIO\n'
        }

        if (formData.fecha_estimada_finalizacion.length === 0 || formData.fecha_estimada_finalizacion === '') {
            messageError += 'Campo cliente es OBLIGATORIO\n'
        }

        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const sendData = () => {        
        axios.post(`${APIURL}/proyectos/ordenes-servicio`,formData,config).then((resp)=>{
            handleClose()
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    useEffect(()=>{
        validateFields()
    }, [formData])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva órden de servicio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="mb-3">
                        <label>Descripcion</label>
                        <input type="text" className="form-control" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    <div className="mb-3">
                        <label>Estado: </label>
                        <Form.Check type="switch">
                                <Form.Check.Input 
                                    name="activo" 
                                    onChange={(e)=> {handleCheckChange(e)}} style={{ width:"2rem" }} 
                                    checked={formData.activo } 
                                    type="checkbox" />
                                <Form.Check.Label> <span className="pl-3" >{formData.activo ? 'Activo' : 'Inactivo' }</span> </Form.Check.Label>
                            </Form.Check>
                    </div>
                    
                    <div className="mb-3">
                        <label>Notas:</label>
                        <input type="text" className="form-control" name="notas" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    
                    <div className="mb-3">
                        <label>Fecha estimada de entrega de expedientes:</label>
                        <input type="date" className="form-control" name="fecha_estimada_entrega" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    
                    <div className="mb-3">
                        <label>Fecha estimada de entrega de finalizacion de servicio:</label>
                        <input type="date" className="form-control" name="fecha_estimada_finalizacion" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendData} disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>);
}

export default ModalNuevaOrdenDeTrabajo;