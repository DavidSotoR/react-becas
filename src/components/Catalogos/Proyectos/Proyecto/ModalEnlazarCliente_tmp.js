import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../../context/AuthContext";

import Select from "react-select"
import makeAnimated from 'react-select/animated';

function ModalEnlazarCliente({ show, handleClose ,idProyecto, idTipoCliente}) {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [clientesNoEnlazados,setClientesNoEnlazados] = useState([]);
    const [ optionsClientes, setOptionsClientes ] = useState([])
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        lista_clientes:[]
    })
    const animatedComponents = makeAnimated;

    
    const formatOptionsClientes = (opciones) =>{
        const lista_opciones = opciones.map(h => ({ value: h.id, label: h.nombre }));
        setOptionsClientes(lista_opciones);
    }

    const handlerChangeSelectClientes = (e) =>{
        if(e && e.length){
            const allValues = e.map(e => e.value);
            setFormData(prevState => ({
                ...prevState,
                lista_clientes: allValues
            }));
        }else{
                
            setFormData(prevState => ({
                ...prevState,
                lista_clientes: []
            }));
        }
    }

    const handlerChangeSelectODP = (e) => {
        console.log(e);
        if(e && e.length){
            const value = e.map(e => e.value);
            setFormData(prevState => ({
                ...prevState,
                id_orden_trabajo: value
            }));
        }else{
                
            setFormData(prevState => ({
                ...prevState,
                id_orden_trabajo: ''
            }));
        }
    }

    const validateFields = ()=>{
        var messageError = ''
        if ( formData.id_orden_trabajo === '' && idTipoCliente === 1) {
            messageError += 'Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres\n'
        }
        
        if (formData.lista_clientes.length === 0 || formData.nombre === '') {
            messageError += 'Campo cliente es OBLIGATORIO\n'
        }

        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const sendData = () =>{
        axios.post(`${APIURL}/proyectos/${idProyecto}/clientes`,formData,config).then((resp)=>{
            console.log(resp);
            handleClose()
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    
    const getClientesNotInProyectoID = () =>{
        axios.get(`${APIURL}/proyectos/${idProyecto}/clientes?no_enlazados=true&id_tipo_cliente=${idTipoCliente}`,config).then((resp)=>{
            setClientesNoEnlazados(resp.data);
            formatOptionsClientes(resp.data);
        }).catch((error)=>{
            if (error?.response.status === 401) {
                logout()
            } else {
                console.log(error);
                alert('Error al solicitar información');
            }
        })
        
    }
    
    useEffect(()=>{
        getClientesNotInProyectoID()
    },[])


    useEffect(()=>{
        validateFields()
    }, [formData])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Añadir colegios a proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="mb-3">
                        <p>
                            <i>
                                *Solo apareces colegios con un formato seleccionado en el catálogo de clientes
                            </i>
                        </p>
                    </div>
                    <div className="mb-3">
                        <label>Lista de clientes no enlazados a proyecto</label>
                        <Select options={ optionsClientes } onChange={(e)=>handlerChangeSelectClientes(e)}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti>
                        </Select>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendData} disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEnlazarCliente;