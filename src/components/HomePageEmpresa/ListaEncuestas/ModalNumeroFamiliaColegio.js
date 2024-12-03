import axios from "axios";
import { AuthContext } from "context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function ModalNumeroFamiliaColegio({show,handleClose,idEstudio,claveFamiliaColegio}){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({ clave_familia_colegio:  '' })
  
    
    const postClaveFamiliaEstudio = () =>{
        axios.post(`${APIURL}/estudio/${idEstudio}/no-familia-colegio`,formData,config).then((resp)=>{
            handleClose()
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
    }
    
    const handlerChangeInput = (e) =>{
        var { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            clave_familia_colegio: value
        }));
    }

    const validateFields = ()=>{

        let messageError = ''
        
        if (formData.clave_familia_colegio !== '') {
            messageError = ('Instroduca un valor')
            setFormValid(false)
        }else{
            setFormValid(true)
        }
    }
    
    useEffect(()=>{
        validateFields()
    }, [formData])

    useEffect(() =>{
        setFormData(prevState => ({
            ...prevState,
            clave_familia_colegio: claveFamiliaColegio || ''
        }));
    },[idEstudio])
    //  defaultValue={opcionesColaboradoresDefault}
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Añadir referencia de colegio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-2">
                    <label htmlFor="tipo-pregunta" className="form-label">Número de familia: </label>
                    <input 
                        value={formData?.clave_familia_colegio && formData.clave_familia_colegio} 
                        id="input-colave-familia" 
                        name="nombre" 
                        className="form-control form-control-sm" 
                        type="text" 
                        onChange={(e) => handlerChangeInput(e)}
                    />
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={ () => postClaveFamiliaEstudio() } disabled={formValid}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}