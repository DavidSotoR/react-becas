import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

function ModalNuevaPregunta({ show, handleClose }) {
    const APIURL = process.env.REACT_APP_API_URL
    const { ID } = useParams();
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [ allTipoClientes, setAllTipoClientes ] = useState([])
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_catalogo_encuesta:0,
        nombre:"",
        puntos_maximo:20
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
        if (formData.nombre === '') {
            messageError.push('Campo Nombre es OBLIGATORIO')
        }
        if (formData.nombre.length <= 3 || formData.nombre === '') {
            messageError.push('Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres')
        }
        if (formData.puntos_maximo > -1) {
            messageError.push('Campo Puntos Maximo debe ser igual o mayor a 0')
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const postDataNuevoParametro = () =>{
        axios.post(APIURL+'/catalogos/encuestas/parametros',formData,config).then((resp)=>{
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
        /*getListaClientes() */
    }, [formData])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva Pregunta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-2">
                    <label htmlFor="tipo-pregunta" className="form-label">Tipo Pregunta:</label>
                    <select id="tipo-pregunta" className="form-select form-control-sm" onChange={(e)=> formInputChange(e)}
                    aria-label="Default select example" name="id_catalogo_encuestas_preguntas_tipo">
                        <option>Tipo Pregunta</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label htmlFor="parametro-clasificacion" className="form-label">Parametro Clasificacion:</label>
                    <select id="parametro-clasificacion" className="form-select form-control-sm" onChange={(e)=> formInputChange(e)}
                    aria-label="Default select example" name="id_catalogo_encuestas_preguntas_parametro_clasificacion">
                        <option>Tipo Pregunta</option>
                    </select>
                </div>  
                <div className="mb-2">
                    <label htmlFor="pregunta" className="form-label">Pregunta:</label>
                    <input id="pregunta" type="text" className="form-control form-control-sm" onChange={(e)=> formInputChange(e)}
                     placeholder="¿...?" name="pregunta"/>
                </div>  
                <div className="mb-2">
                    <label htmlFor="pregunta" className="form-label">Puntuacion de la Pregunta:</label>
                    <input id="pregunta" type="text" className="form-control form-control-sm" onChange={(e)=> formInputChange(e)}
                    placeholder="0" name="puntos_maximos"/>
                </div>  

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalNuevaPregunta;