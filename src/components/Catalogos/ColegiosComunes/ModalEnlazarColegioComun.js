import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

import Select from "react-select"
import makeAnimated from 'react-select/animated';

function ModalEnlazarColegioComun({ showNuevoHemano, handleNuevoHemanoClose }) {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [ allClientesNoHermanos, setallClientesNoHermanos ] = useState([])
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_ciclo_escolar: '',
        nombre:'',
        situacion_beca: '',
    })

    const [ optionsEnlazar, setOptionsEnlazar ] = useState([])

    const animatedComponents = makeAnimated;
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]

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
        
        if (messageError.length === 0) {
            setFormValid(true)
        } else {
            setFormValid(true)
        }
    }

    const sendDataFamiliaNuevo = () =>{
        axios.post(APIURL+'/familias',formData,config).then((resp)=>{
            console.log(resp);
            handleNuevoHemanoClose()
        }).catch((resp)=>{
            console.log(resp);
        })
        
    }

    const getClientesNoHermanosList = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes?id_tipo_cliente=1&id_clientes_hermanos=0', config);
            console.log(resp.data);
            setallClientesNoHermanos(resp.data);
            formatOptionsEnlazar(resp.data)
        } catch (error) {
            console.error("Error fetching Ciclos Escolares:", error);
        }
    }

    const formatOptionsEnlazar = (opciones) =>{
        var arrNew = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            arrNew.push(option)
        })
        setOptionsEnlazar(arrNew)
    }

    const renderOptionsCiclos = () =>{
        return [...allClientesNoHermanos.map((ciclo) => (
            <option key={ciclo.id} value={`${ciclo.id}`}>
                {`${ciclo.inicio.slice(0, -6)} a ${ciclo.fin.slice(0,-6)}`}
            </option>
        ))]
    }

    const handlerChangeSelect = (e) =>{
        console.log(e);
    }

    useEffect(()=>{
        validateFields()
        getClientesNoHermanosList()
    }, [formData])

    useEffect(()=>{
        console.log('se inicio modal enlace');
    },[allClientesNoHermanos])

    return (
        <Modal show={showNuevoHemano} onHide={handleNuevoHemanoClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva Familia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                        <Select options={ optionsEnlazar } onChange={(e)=>handlerChangeSelect(e)}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        ></Select>
                    </div>         
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleNuevoHemanoClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendDataFamiliaNuevo} disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEnlazarColegioComun;