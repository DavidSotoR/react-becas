import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

function ModalNuevoParametro({ show, handleClose }) {
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
        console.log(formData);
        var messageError = []
        if (formData.nombre === '') {
            messageError.push('Campo Nombre es OBLIGATORIO')
        }
        if (formData.nombre.length < 3 || formData.nombre === '') {
            messageError.push('Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres')
        }
        if (parseInt(formData.puntos_maximo,10) < 0) {
            messageError.push('Campo Puntos Maximo debe ser igual o mayor a 0')
        }

        if (isNaN(formData.puntos_maximo)) {
            messageError.push('Campo Puntos Maximo debe ser un valor numerico')
        }
        console.log(messageError);
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const postDataNuevoParametro = () =>{
        var data = formData;
        data.id_catalogo_encuesta = ID

        axios.post(APIURL+'/catalogos/encuestas/parametros',data,config).then((resp)=>{
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
                <Modal.Title>Nuevo Parametro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-2">
                    <label htmlFor="nombre_parametro" className="form-label">Nombre Parametro:</label>
                    <input id="nombre_parametro" type="text" class="form-control form-control-sm" placeholder="" name="nombre" onChange={(e)=> formInputChange(e)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="puntos_maximo" className="form-label">Puntos Maximos:</label>
                    <input id="puntos_maximo" type="text" class="form-control form-control-sm" placeholder="0" name="puntos_maximo" onChange={(e)=> formInputChange(e)}/>
                </div>            
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={postDataNuevoParametro} disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalNuevoParametro;