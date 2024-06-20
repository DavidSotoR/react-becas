import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function ModalNuevaFamilia({ show, handleClose }) {
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [ allCiclosEscolares, setAllCiclosEscolares ] = useState([])
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_ciclo_escolar: '',
        nombre:'',
        situacion_beca: '',
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
        if (formData.id_ciclo_escolar === '') {
            messageError = 'Campo Ciclo Escolar es OBLIGATORIO\n'
        }
        if (formData.nombre.length <= 3 || formData.nombre === '') {
            messageError += 'Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres\n'
        }
        if (formData.situacion_beca === '') {
            messageError += 'Campo Situacion Beca es OBLIGATORIO\n'
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    const sendDataFamiliaNuevo = () =>{
        axios.post('http://localhost:8000/api/auth/familias',formData,config).then((resp)=>{
            console.log(resp);
            handleClose()
        }).catch((resp)=>{
            console.log(resp);
        })
        
    }

    const getCiclosEscolaresList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/ciclos', config);
            setAllCiclosEscolares(resp.data);

        } catch (error) {
            console.error("Error fetching Ciclos Escolares:", error);
        }
    }

    const renderOptionsCiclos = () =>{
        return [...allCiclosEscolares.map((ciclo) => (
            <option key={ciclo.id} value={`${ciclo.id}`}>
                {`${ciclo.inicio.slice(0, -3)} a ${ciclo.fin.slice(0,-3)}`}
            </option>
        ))]
    }

    useEffect(()=>{
        validateFields()
        getCiclosEscolaresList()
    }, [formData])

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva Familia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="mb-3">
                        <label>Tipo Cliente</label>
                        <Form.Select aria-label="Default select example" name="id_ciclo_escolar" onChange={(e)=> formInputChange(e)}>
                            <option>Seleccione una Opción</option>
                            { renderOptionsCiclos() }
                        </Form.Select>
                    </div>
                    <div className="mb-3">
                        <label>Nombre</label>
                        <input type="text" className="form-control" name="nombre" onChange={(e)=> formInputChange(e)}/>
                    </div>
                    <div className="mb-3">
                        <label>Situacion Beca</label>
                        <input type="text" className="form-control" name="situacion_beca" onChange={(e)=> formInputChange(e)}/>
                    </div>              
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendDataFamiliaNuevo} disabled={formValid}>
                    Crear
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalNuevaFamilia;