import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";


function ModalEliminarColegioComun({ show, handleClose,idColegio,nombreCoegio }) {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const sendDataColegioComun = () =>{
        axios.delete(APIURL+'/clientes/'+idColegio+'/hermano',config).then((resp)=>{
            console.log(resp);
            handleClose()
        }).catch((resp)=>{
            console.log(resp);
        })
        
    }


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar relacion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <div className="mb-3">
                        <label><b>Colegio: </b>{nombreCoegio}</label>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={sendDataColegioComun}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEliminarColegioComun;