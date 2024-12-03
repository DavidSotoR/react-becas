import axios from "axios";
import { AuthContext } from "context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

export default function ModalPorcentajeOtorgado({ show, handleClose,idEstudio }){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    const animatedComponents = makeAnimated;

    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({ porcentaje_otorgado: '' })
    const [rangoPordentaje,setRangoPordentaje] = useState([])
    const renderOpcionesRangoPordentaje  = (opciones) =>{
        var opcioneslista = []
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = `${h.porcentaje}%`
            option.value = h.porcentaje
            opcioneslista.push(option)
        })
        setRangoPordentaje(opcioneslista)
    }
    
    
    const getListaRangoPordentaje = () =>{
        axios.get(`${APIURL}/estudio/${idEstudio}/rangos`,config).then((resp)=>{
            renderOpcionesRangoPordentaje(resp.data)
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
        })
    }

    const postPuntosEstudio = () =>{
        axios.post(`${APIURL}/estudio/${idEstudio}/porcentaje`,formData,config).then((resp)=>{
            handleClose()
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
    }
    
    const handlerChangeSelect = (e) =>{
        if(e &&  e.value){
            const value = e.value;
            setFormData(prevState => ({
                ...prevState,
                porcentaje_otorgado: value
            }));
        }else{
                
            setFormData(prevState => ({
                ...prevState,
                porcentaje_otorgado: ''
            }));
        }
    }

    const validateFields = ()=>{

        let messageError = ''
        
        if (formData.porcentaje_otorgado !== '') {
            messageError = ('Seleccione un Porcentaje')
            setFormValid(false)
        }else{
            setFormValid(true)
        }
    }
    
    useEffect(()=>{
        getListaRangoPordentaje();
    },[])

    useEffect(()=>{
        validateFields()
   }, [formData])
   useEffect(() =>{

    setFormData(prevState => ({
        ...prevState,
        porcentaje_otorgado: ''
    }));
   },[idEstudio])
    //  defaultValue={opcionesColaboradoresDefault}
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Pordentaje otorgado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-2">
                    <label htmlFor="tipo-pregunta" className="form-label">Pordenraje de Beca: {formData.porcentaje_otorgado}%</label>
                    <Select 
                        options={ rangoPordentaje }
                        onChange={(e)=>handlerChangeSelect(e)}
                        components={animatedComponents}
                    ></Select>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={ () => postPuntosEstudio() } disabled={formValid}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}