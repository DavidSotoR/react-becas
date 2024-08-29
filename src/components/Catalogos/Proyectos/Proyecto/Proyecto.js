import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button,Form } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { AuthContext } from "../../../../context/AuthContext";
import ResaltarTexto from "../../../ResaltarTexto/ResaltarTexto";
import { Link,useParams } from "react-router-dom";
import TablaClientesProyecto from "./TablaClientesProyecto";
import TablaOrdenesDeTrabajo from "./TablaOrdenesDeTrabajo";

function Proyecto() {
    const { ID } = useParams();
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [ proyecto, setProyecto ] = useState({})
    const [ show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
   
    const getProyecto = () =>{
        axios.get(`${APIURL}/proyectos/${ID}`,config).then((resp)=>{
            setProyecto(resp.data);
        }).catch((error)=>{
            if (error?.response.status === 401) {
                logout()
            } else {
                console.log(error);
                alert('Error al solicitar información');
            }
        })
        
    }

    useEffect( ()=>{
        getProyecto();
    },[])

    useEffect( ()=>{
        if (!show) {
            getProyecto()
        }
    }, [show])

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="">
                    <h6><b>Proyecto:</b> {proyecto.nombre}</h6>
                    <p><b>Tipo: </b> {(proyecto?.tipo_cliente) ? proyecto.tipo_cliente.nombre: ''} </p>
                </div>
            </div>
            
            <Tabs>
                <TabList>
                    <Tab>Clientes</Tab>
                    <Tab>Cronograma ordenes de servicio</Tab>
                </TabList>

                <TabPanel>
                    <TablaClientesProyecto ID={ID} idTipoCliente={proyecto.id_tipo_cliente}></TablaClientesProyecto>
                </TabPanel>
                <TabPanel>
                    Plan Ordenes de servicio
                </TabPanel>
            </Tabs>
        </div>
    )
}

export default Proyecto;