import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { Button, Form, Modal } from "react-bootstrap";
import ModalNuevaRespesuta from "./ModalNuevaRespesuta";

function TablaRespuestas({idPregunta,idPreguntaTipo,dataPregunta}){
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [ allRespuestas, setAllRespuestas ] = useState([]);
    const [editRespuestaID, setEditRespuestaID] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [error, setError] = useState(null);

    const handleEditClick = (itemId) => {
        setEditRespuestaID(itemId);
    };

    const handleSave = () => {
        setEditRespuestaID(null);
        getListaRespuestas();
    };

    const handleShowDeleteModal = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const getListaRespuestas = () => {
        axios.get(`${APIURL}/catalogos/encuestas/preguntas/${idPregunta}/items`,config)
            .then((resp)=>{
                setAllRespuestas(resp.data);
            }).catch((error)=>{
                setError(error.response);
                console.log(error.response);
            })
    }
    
    const deleteRespuestaID= () => {
        alert("Eliminar Respuesta Item")
        return true;
        axios.delete(`${APIURL}/catalogos/encuestas/parametros/items/${itemToDelete.id}`, config)
            .then(() => {
                getListaRespuestas();
                setShowDeleteModal(false);
                setItemToDelete(null);
            })
            .catch((error) => {
                console.error(error.response);
                setShowDeleteModal(false);
                setItemToDelete(null);
            });
    }

    const listaTablaRespuestas = () => {
        return allRespuestas.map((pregunta_item, index) => (
            editRespuestaID === pregunta_item.id ? (
                <p>Aqui va un modal de editar</p>
            ) : (
                <tr key={'pitr-'+index}>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{pregunta_item.limiten_inferior}</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>-</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{pregunta_item.limite_superior}</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>=</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{pregunta_item.valor}</span>
                    </td>
                    <td>
                        <div style={{ display: "flex" }}>
                            <Button variant="light" onClick={() => handleEditClick(pregunta_item.id)} >
                                <ion-icon name="create-outline"></ion-icon>
                            </Button>
                            <Button 
                                variant="light" 
                                style={{ marginLeft: "5px" }}
                                onClick={() => handleShowDeleteModal(pregunta_item)}>
                                <ion-icon name="trash-outline"></ion-icon>
                            </Button>
                        </div>
                    </td>
                </tr>
                )
        ));
    };

    if (error) {
        return <div>Error al solicitar los datos recargue nuevamente</div>;
    }

    return (<> 
        <div>
            <div className="seccion-table-parametros">
                <table key={'tabpm-'+idPreguntaTipo} className="table items-parametros">
                    <tbody>
                        {listaTablaRespuestas()}
                    </tbody>
                </table>
            </div>
            <div className="container text-center">
                <ModalNuevaRespesuta key={'tabpr-'+idPreguntaTipo} show={true} idPregunta={idPregunta} idPreguntaTipo={idPreguntaTipo} dataPregunta={dataPregunta}/>
            </div>
        </div>
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estás seguro de que deseas eliminar este ítem?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={deleteRespuestaID}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default TablaRespuestas;