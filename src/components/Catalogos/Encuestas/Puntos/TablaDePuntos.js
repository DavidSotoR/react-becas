import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./../../../../context/AuthContext";
import { Button, Form, Modal } from "react-bootstrap";
import ModalNuevoPuntoItems from "./ModalNuevoPuntoItems"

export default function TablaDePuntos({ID}){

    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [numberSave, setNumberSave] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    
    const [allPuntos, setAllPuntos ] = useState([
        {id:1,limite_inferior:0,limite_superior:20,porcentaje_sujerido:20},
        {id:2,limite_inferior:21,limite_superior:40,porcentaje_sujerido:40},
    ]);

    const handleEditClick = (id) => {
        alert(id)
    }

    const getListaParametrosItem = () => {
        axios.get(`${APIURL}/catalogos/encuestas/${ID}/rangos`,config)
            .then((resp)=>{
                setAllPuntos(resp.data);
            }).catch((error)=>{
                ///setError(error.response);
                console.log(error.response);
            })
    }

    useEffect(() => {
        getListaParametrosItem();
    },[numberSave]);

    const handleShowDeleteModal = (id) => {
        axios.delete(`${APIURL}/catalogos/encuestas/rangos/${id}`, config)
            .then(() => {
                getListaParametrosItem();
                setShowDeleteModal(false);
                setItemToDelete(null);
                setNumberSave(prev => prev + 1);
            })
            .catch((error) => {
                console.error(error.response);
                setShowDeleteModal(false);
                setItemToDelete(null);
            });
    }

    const listaTablaPuntosItem = () => allPuntos.map((puntos_item,index) => {
        return (
                <tr key={'tabpari-'+index}>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{puntos_item.limite_inferior}</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>-</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{puntos_item.limite_superior}</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>=</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{puntos_item.porcentaje_sujerido}%</span>
                    </td>
                    <td>
                        <div style={{ display: "flex" }}>
                            <Button variant="light" onClick={() => handleEditClick(puntos_item.id)} >
                                <ion-icon name="create-outline"></ion-icon>
                            </Button>
                            <Button 
                                variant="light" 
                                style={{ marginLeft: "5px" }}
                                onClick={() => handleShowDeleteModal(puntos_item.id)}>
                                <ion-icon name="trash-outline"></ion-icon>
                            </Button>
                        </div>
                    </td>
                </tr>
                )
    })
    return (<>
    
    <div>
            <div className="seccion-table-parametros">
                <table key={'tabpar-0'} className="table items-parametros">
                    <thead>
                        <tr>
                            <th>Rango Inferiro</th>
                            <th></th>
                            <th>Rango superiro</th>
                            <th></th>
                            <th>Porcentaje sujerido</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaTablaPuntosItem()}
                        <ModalNuevoPuntoItems idEncuesta={ID} numberSave={numberSave} setNumberSave={setNumberSave}/>
                    </tbody>
                </table>
            </div>
        </div>
    </>)
}