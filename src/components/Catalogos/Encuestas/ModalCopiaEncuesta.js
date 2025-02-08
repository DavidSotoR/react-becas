import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

export default function ModalCopiaEncuesta({ show, handleClose, encuesta }) {
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        nombre:'',
        password: '',
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
        var messageError = []
        if (formData.nombre.length <= 1 || formData.nombre === '') {
            messageError.push('Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres')
        }
        if (formData.password === '') {
            messageError.push('Contraseña requerida\n')
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const sendDataEncuestaCopia = () =>{
        if(!encuesta?.id){
            return false;
        }
        axios.post(`${APIURL}/catalogos/encuestas/${encuesta?.id ? encuesta.id : ''}/copia`,formData,config).then((resp)=>{
            console.log(resp);
            handleClose()
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
        
    }

    useEffect(()=>{
        validateFields()
    }, [formData])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Copiar Encuesta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="mb-3">
                        <p><b>Encuesta Seleccionada:</b> {encuesta.nombre}</p>
                    </div>
                    <div className="mb-3">
                        <label>Nombre</label>
                        <input type="text" className="form-control" name="nombre" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    <div className="mb-3">
                        <label>Intrdusca su Contraseña:</label>
                        <input type="password" className="form-control" name="password" onChange={(e)=> formInputChange(e)}/>
                    </div>              
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={()=>sendDataEncuestaCopia()} disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
 