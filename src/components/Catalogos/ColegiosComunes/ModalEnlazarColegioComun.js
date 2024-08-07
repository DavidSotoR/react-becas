import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

import Select from "react-select"
import makeAnimated from 'react-select/animated';

function ModalEnlazarColegioComun({ showNuevoHemano, handleNuevoHemanoClose , idColegioComun, tituloColegioComun }) {
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
        lista_clientes: [],
    })

    const [ optionsEnlazar, setOptionsEnlazar ] = useState([])

    const animatedComponents = makeAnimated;

    const validateFields = ()=>{
        var messageError = ''
        //formData
        const lista_clientes = formData.lista_clientes ? formData.lista_clientes : [] ;
        messageError = (lista_clientes.length > 0) ? '' : 'Seleccione un colegio';
        console.log(lista_clientes.length+' '+messageError.length);
        if (!messageError.length) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const sendDataFamiliaNuevo = () =>{
        axios.post(APIURL+'/clientes/hermanos/'+idColegioComun,formData,config).then((resp)=>{
            console.log(resp);
            handleNuevoHemanoClose();
        }).catch((resp)=>{
            console.log(resp);
        })
        
    }

    const getClientesNoHermanosList = async () => {
        try {
            setallClientesNoHermanos([]);
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
        if(e.length){
            const allValues = e.map(e => e.value);
            setFormData({ 
                lista_clientes: allValues
            });
            console.log(allValues);
        }else{
            setFormData({ 
                lista_clientes: []
            });
        }

    }

    useEffect(()=>{
        validateFields()
    }, [formData])
    
    useEffect(()=>{
        if(showNuevoHemano){
            getClientesNoHermanosList()
        }
    }, [showNuevoHemano])

    

    useEffect(()=>{
        console.log('se inicio modal enlace');
    },[allClientesNoHermanos])

    return (
        <Modal show={showNuevoHemano} onHide={handleNuevoHemanoClose}>
            <Modal.Header closeButton>
                <Modal.Title><div className="h5"><b>Añadir Colegio a:</b> {tituloColegioComun}</div> </Modal.Title>
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