
import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

export default function VisitaAgendada({estudio}){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const { logout } = useContext(AuthContext);
    
    const [editar, setEditar] = useState(false);
    const handleClose = () => setEditar(false);
    const handleShow = () => setEditar(true);
     
    const [fromData, setFormData] = useState(null);

    const formInputChange =(e) => {
        var {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        
        setFormData(prevState => ({
            ...prevState,
            [name]: updatedValue
        }));
    }

    const postVisita = () => {
        axios.post(`${APIURL}/estudio/socioeconomico/${estudio.id}/visita`, fromData, config)
            .then(() => {
                handleClose();
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    logout();
                }
                console.error(error.response);
            });
    };

    const onSave = () => {
        postVisita();
    }

    const editarAgenda = () => {
        return(
            <div className="mb-2" style={{ marginTop: "10px" }}>
                <div className="mb-3 row">
                    <div className="col-4">Fecha:</div>
                    <div className="col-8">
                        <input type="date" className="form-control" id="visita_fecha" name="visita_fecha" value={fromData?.visita_fecha && fromData.visita_fecha} onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-4">Hora:</div>
                    <div className="col-8">
                        <input type="time" className="form-control" id="visita_hora" name="visita_hora" value={fromData?.visita_hora && fromData.visita_hora} onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-12">Recordatorio:</div>
                    <div className="col-12">
                        <textarea
                            id="visita_recordatorio"
                            name="visita_recordatorio"
                            value={fromData?.visita_recordatorio && fromData.visita_recordatorio}
                            onChange={(e)=> formInputChange(e)}
                            placeholder="nota..."
                            rows="4"
                            cols="50"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            </div>
        )
    }
    const mostrarAgenda = () => {
        return(
            <div className="mb-2" style={{ marginTop: "10px" }}>
                
                <div className="mb-3 row">
                    <div className="col-6">Fecha:</div>
                    <div className="col-6">{fromData?.visita_fecha && fromData.visita_fecha}</div>
                </div>

                <div className="mb-3 row">
                    <div className="col-6">Hora:</div>
                    <div className="col-6">{fromData?.visita_hora && fromData.visita_hora}</div>
                </div>
                <div className="mb-3 row">
                    <div className="col-12">Recordatorio:</div>
                    <div className="col-12">{fromData?.visita_recordatorio && fromData.visita_recordatorio}</div>
                </div>

            </div>
        )
    }
    useEffect(() => {setFormData(estudio)},[])
    return (
    <div className="col-sm-4">
        <div className="row rounded-4" style={{ backgroundColor: "#f9f9f9"}}>
            <div className="pt-2" >
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5>Visita Agendada</h5>
                    </div>
                    <div>
                        {editar ? (<>
                            <Button variant="light" onClick={() => handleClose()}>
                                <ion-icon name="arrow-undo-circle-outline"></ion-icon>
                            </Button>
                            <Button variant="light" style={{ marginLeft: "5px" }} onClick={()=>onSave()}>
                                <ion-icon name="save-outline"></ion-icon>
                            </Button>
                        </>) : (<>
                        <Button variant="light" onClick={handleShow}>
                            <ion-icon name="create-outline"></ion-icon>
                        </Button>
                        </>) }
                    </div>
                </div>
                <hr/>
            </div>
            <div className="col-12">
            {editar ? editarAgenda() : mostrarAgenda() }
            </div>
        </div>
    </div>
    )
}