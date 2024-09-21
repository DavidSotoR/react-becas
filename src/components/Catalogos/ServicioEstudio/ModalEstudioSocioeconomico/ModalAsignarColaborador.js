import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

function ModalAsignarColaborador({ show, handleClose,idEstudio,colaborador }){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    const animatedComponents = makeAnimated;

    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_colaborador: 0,
    })

    const [opcionesColaboradores,setSpcionesColaboradores] = useState([])
    const renderOpcionesColaboradores  = (opciones) =>{
        var opcioneslista = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.name
            option.value = h.id
            opcioneslista.push(option)
        })
        setSpcionesColaboradores(opcioneslista)
    }

    const [opcionesColaboradoresDefault,setSpcionesColaboradoresDefault]= useState([]);
    const renderOptionColaboradoresDefault = (opcion) =>{
        let opcionDefault = { value: '', label:'' }
        const {id , name } = opcion;
        opcionDefault.value = id;
        opcionDefault.label = name;
        setSpcionesColaboradoresDefault(opcionDefault)
    }


    
    const postDataEditarColaborador = () =>{
        axios.post(`${APIURL}/estudio/${idEstudio}/colaboradores`,formData,config).then((resp)=>{
            handleClose()
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
        
    }
    
    const getListaColaboradores = () =>{
        axios.get(APIURL+'/estudio/colaboradores',config).then((resp)=>{
            renderOpcionesColaboradores(resp.data)
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
        })
    }

    
    const handlerChangeSelect = (e) =>{
        if(e &&  e.value){
            const value = e.value;
            setFormData(prevState => ({
                ...prevState,
                id_colaborador: value
            }));
        }else{
                
            setFormData(prevState => ({
                ...prevState,
                id_colaborador: ''
            }));
        }
    }
    const validateFields = ()=>{

        var messageError = []
        
        if (formData.id_colaborador === 0) {
            messageError.push('Seleccione un colaborador')
        }

        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }
    
    useEffect(()=>{
        getListaColaboradores();
    },[])

    useEffect(()=>{
        validateFields()
   }, [formData])

   useEffect(()=>{
    if(colaborador){
        renderOptionColaboradoresDefault(colaborador);
        setFormData(prevState => ({
            ...prevState,
            id_colaborador: colaborador.id
        }));
    }
  }, [colaborador])

    
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Asignar Colaborador {JSON.stringify(opcionesColaboradoresDefault)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-2">
                    <label htmlFor="tipo-pregunta" className="form-label">Colaborador:{formData.id_colaborador}</label>
                                <Select 
                                options={ opcionesColaboradores }
                                defaultValue={opcionesColaboradoresDefault}
                                onChange={(e)=>handlerChangeSelect(e)}
                                components={animatedComponents}
                                ></Select>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={ postDataEditarColaborador } disabled={formValid}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAsignarColaborador