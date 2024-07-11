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
    const [ allTiposPreguntas, setAllTiposPreguntas ] = useState([])
    const [ allParametros, setAllParametros ] = useState([])
    const [ allTipoClientes, setAllTipoClientes ] = useState([])

    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_catalogo_encuesta: 0,
        id_catalogo_encuestas_preguntas_tipo: 0,
        id_catalogo_encuestas_preguntas_parametro_clasificacion: 0,
        pregunta:"",
        puntos_maximos: 0
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
        if (formData.pregunta === '') {
            messageError.push('Campo Nombre es OBLIGATORIO')
        }
        if (formData.pregunta.length <= 3 || formData.pregunta === '') {
            messageError.push('Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres')
        }
        if (formData.puntos_maximos < 0 || formData.puntos_maximos === '') {
            messageError.push('Campo Puntos Maximo debe ser igual o mayor a 0')
        }

        console.log(messageError);
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const postDataNuevaPregunta = () =>{
        //console.log(formData);
        var data = formData;
        data.id_catalogo_encuesta = ID
        console.log(data);
        axios.post(APIURL+'/catalogos/encuestas/preguntas',data,config).then((resp)=>{
            console.log(resp);
            handleClose()
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
        
    }

    const renderOpcionesTipoPregunta = () => {

        return [...allTiposPreguntas.map((tp) => (
            <option key={tp.id} value={`${tp.id}`}>
                { tp.nombre }
            </option>
        ))]
    }

    const renderOpcionesParametros = () => {
        return [...allParametros.map((param) => (
            <option key={param.id} value={`${param.id}`}>
                { param.nombre }
            </option>
        ))]
    }

    const getDatosOptions = () =>{
        axios.get(APIURL+'/catalogos/encuestas/preguntas/tipos',config).then((resp)=>{
            console.log(resp.data);
            setAllTiposPreguntas(resp.data)
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
        })

        axios.get(APIURL+'/catalogos/encuestas/'+ID+'/parametros',config).then((resp)=>{
            console.log(resp.data);
            setAllParametros(resp.data)
        }).catch((resp)=>{
            console.log(resp);
            if (resp.response.status === 401) {
                logout()
            }
        })
    }

    useEffect(()=>{
         validateFields()
        /*getListaClientes() */
    }, [formData])

    useEffect(()=>{
        getDatosOptions()
    },[])

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
                        { renderOpcionesTipoPregunta() }
                    </select>
                </div>
                <div className="mb-2">
                    <label htmlFor="parametro-clasificacion" className="form-label">Parametro Clasificacion:</label>
                    <select id="parametro-clasificacion" className="form-select form-control-sm" onChange={(e)=> formInputChange(e)}
                    aria-label="Default select example" name="id_catalogo_encuestas_preguntas_parametro_clasificacion">
                        <option>Parametro</option>
                        { renderOpcionesParametros() }
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
                    Cerrar
                </Button>
                <Button variant="primary" onClick={ postDataNuevaPregunta } disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalNuevaPregunta;