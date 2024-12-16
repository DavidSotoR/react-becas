import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AuthContext } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";

function ModalModificarParametroPregunta({ pregunta, handleClose }) {
    const APIURL = process.env.REACT_APP_API_URL
    const { ID } = useParams();
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    
    const [ allParametrosTipos, setAllParametrosTipos ] = useState([]);

    const getListaParametrosTipos = () => {
        axios.get(APIURL+'/catalogos/encuestas/parametros/tipos',config).then((resp)=>{
            setAllParametrosTipos(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }

    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_parametro_clasificacion_tipo:'0',
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
        if(formData.id_parametro_clasificacion_tipo === '0'){
            messageError.push('Campo Tipo de Parametro es OBLIGATORIO')
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
        data.id = pregunta.id

        axios.post(APIURL+'/catalogos/encuestas/preguntas/parametros',data,config).then((resp)=>{
            handleClose()
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
        
    }
    
    const renderOpcionesParametrosTipos = () => {
        return [<option key='sapt-0' value="0">Seleccione Tipo de Parametro</option>,...allParametrosTipos.map((param) => (
            <option key={'sapt-'+param.id} value={`${param.id}`}>
                { param.nombre }
            </option>
        ))]
    }

    useEffect(()=>{
        getListaParametrosTipos();
    }, [])
    
    useEffect(()=>{
        validateFields();
    }, [formData])

    return (
        <Modal show={pregunta?.id} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Parametro de pregunta:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p>
                    {pregunta?.pregunta && pregunta.pregunta.toUpperCase()}
                    </p>
                </div>
                <div className="mb-2">
                    <label htmlFor="parametro-clasificacion" className="form-label">Tipo de Parametro:</label>
                    <select id="parametro-clasificacion" className="form-select form-control-sm" onChange={(e)=> formInputChange(e)}
                    aria-label="Default select example" name="id_parametro_clasificacion_tipo">
                        { renderOpcionesParametrosTipos() }
                    </select>
                </div> 
                {/*<div className="mb-2">
                    <label htmlFor="puntos_maximo" className="form-label">Puntos Maximos:</label>
                    <input id="puntos_maximo" type="text" className="form-control form-control-sm" placeholder="0" name="puntos_maximo" onChange={(e)=> formInputChange(e)}/>
                </div>*/}
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

export default ModalModificarParametroPregunta;