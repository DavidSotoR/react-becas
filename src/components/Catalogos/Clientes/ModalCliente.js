import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function ModalCliente({ show, handleClose }) {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_tipo_cliente: '',
        nombre:'',
        descripcion: '',
        notificaciones_email: ''
    })

    const formInputChange =(e) => {
        var name = e.target.name
        var value = e.target.value
        setFormData(prevState => ({  
            ...prevState,
            [name]: value
        }));

    }

    const validateFields = ()=>{
        var messageError = ''
        if (formData.id_tipo_cliente === '') {
            messageError = 'Campo Tipo CLiente es OBLIGATORIO\n'
        }
        if (formData.nombre.length <= 3 || formData.nombre === '') {
            messageError += 'Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres\n'
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const sendDataClienteNuevo = () =>{
        console.log(formData);
        axios.post('http://localhost:8000/api/auth/clientes',formData,config).then((resp)=>{
            console.log(resp);
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
                <Modal.Title>Crear Clientes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="mb-3">
                        <label>Tipo Cliente</label>
                        <Form.Select aria-label="Default select example" name="id_tipo_cliente" onChange={(e)=> formInputChange(e)}>
                            <option>Seleccione una Opción</option>
                            <option value="1">Escuela</option>
                            <option value="2">Empresa</option>
                        </Form.Select>
                    </div>
                    <div className="mb-3">
                        <label>Nombre</label>
                        <input type="text" className="form-control" name="nombre" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    <div className="mb-3">
                        <label>Descripción</label>
                        <input type="text" className="form-control" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    <div className="mb-3">
                        <label>Notificaciones Email</label>
                        <input type="email" className="form-control" name="notificaciones_email" onChange={(e)=> formInputChange(e)}/>
                    </div>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendDataClienteNuevo} disabled={formValid}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalCliente;