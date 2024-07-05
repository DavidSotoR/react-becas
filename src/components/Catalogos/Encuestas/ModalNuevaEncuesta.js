import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

function ModalNuevaEncuesta({ show, handleClose }) {
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [ allTipoClientes, setAllTipoClientes ] = useState([])
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_tipo_cliente: '',
        nombre:'',
        descripcion: '',
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
        if (formData.id_tipo_cliente === '') {
            messageError.push('Campo Ciclo Escolar es OBLIGATORIO')
        }
        if (formData.nombre.length <= 3 || formData.nombre === '') {
            messageError.push('Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres')
        }
        if (formData.descripcion === '') {
            messageError.push('Campo Situacion Beca es OBLIGATORIO\n')
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const sendDataEncuestaNuevo = () =>{
        axios.post(APIURL+'/catalogos/encuestas',formData,config).then((resp)=>{
            console.log(resp);
            handleClose()
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
        
    }

    const getListaClientes = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes/tipos', config);
            console.log(resp);
            setAllTipoClientes(resp.data);

        } catch (error) {
            console.error("Error fetching Ciclos Escolares:", error);
            if (error.response?.status === 401) {
                logout()
            }
        }
    }

    const renderTiposClientes= () =>{
        return [...allTipoClientes.map((tipo) => (
            <option key={tipo.id} value={`${tipo.id}`}>
                {`${tipo.nombre}`}
            </option>
        ))]
    }

    useEffect(()=>{
        validateFields()
        getListaClientes()
    }, [formData])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva Encuesta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="mb-3">
                        <label>Tipo Cliente</label>
                        <Form.Select aria-label="Default select example" name="id_tipo_cliente" onChange={(e)=> formInputChange(e)}>
                            <option>Tipo Cliente</option>
                            { renderTiposClientes() }
                        </Form.Select>
                    </div>
                    <div className="mb-3">
                        <label>Nombre</label>
                        <input type="text" className="form-control" name="nombre" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    <div className="mb-3">
                        <label>Descripcion:</label>
                        <input type="text" className="form-control" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                    </div>              
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendDataEncuestaNuevo} disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalNuevaEncuesta;