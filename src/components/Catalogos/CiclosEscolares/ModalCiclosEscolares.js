import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

function ModalCiclosEscolares({ show, handleClose }) {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [msgError, setMsgError] = useState('')
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        inicio: '',
        fin:'',
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
        if (formData.inicio === '') {
            messageError = 'Campo Fecha Inicio es Obligatorio'
        }
        if (formData.fin === '') {
            messageError = 'Campo Fecha Final es Obligatorio'
        }
        if (formData.fin === formData.inicio) {
            messageError = 'Campo Fecha Inicio y Fin no pueden ser iguales'
        }

        if (new Date(formData.inicio) > new Date(formData.fin)) {
            messageError = 'Campo Fecha Inicio no puede ser mayor a Fin'
        }

        if (new Date(formData.fin) < new Date(formData.inicio)) {
            messageError = 'Campo Fecha Fin no puede ser manor a Inicio'
        }

        if (messageError.length === 0) {
            setFormValid(false)
            setMsgError(messageError)
        } else {
            setFormValid(true)
            setMsgError(messageError)
        }
        console.log(formData);
    }

    const changeFormatoFecha = (date) => {
        var newDate = date.replaceAll('-','/')
        return newDate
    }

    const sendDataCicloEscolar = () =>{
        var fechaIni = changeFormatoFecha(formData.inicio)
        var fechaFin = changeFormatoFecha(formData.fin)
        var newData = {
            inicio: fechaIni,
            fin: fechaFin
        }

        axios.post('http://localhost:8000/api/auth/ciclos',newData,config).then((resp)=>{
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
                <Modal.Title>Crear Clientes</Modal.Title>
            </Modal.Header>
            <Modal.Body>  
                <div className="mb-3">
                    <label> Fecha Inicio: </label>
                    <input className="form-control" name="inicio" type="date" onChange={(e) => {formInputChange(e)}}/>
                </div>
                <div className="mb-3">
                    <label> Fecha Fin: </label>
                    <input className="form-control" name="fin" type="date" onChange={(e) => {formInputChange(e)}}/>
                </div>
                <div className="mb-3">
                    <p style={{ color:"red" }}> { msgError } </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={sendDataCicloEscolar} disabled={formValid}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalCiclosEscolares;