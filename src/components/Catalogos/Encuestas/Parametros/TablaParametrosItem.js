import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import ModalNuevoParametrosItems from "./ParametrosItems/ModalNuevoParametrosItems";
import ModalEditarParametrosItems from "./ParametrosItems/ModalEditarParametrosItems";

function TablaParametrosItem({idParametro,idParametroTipo}) {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [numberSave, setNumberSave] = useState(0);
    const [ allParametrosItem, setAllParametrosItem ] = useState([]);
    const [error, setError] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    
    const getListaParametrosItem = () => {
        axios.get(`${APIURL}/catalogos/encuestas/parametros/${idParametro}/items`,config)
            .then((resp)=>{
                setAllParametrosItem(resp.data);
            }).catch((error)=>{
                setError(error.response);
                console.log(error.response);
            })
    }

    const deleteParametroItem = () => {
        axios.delete(`${APIURL}/catalogos/encuestas/parametros/items/${itemToDelete.id}`, config)
            .then(() => {
                getListaParametrosItem();
                setShowDeleteModal(false);
                setItemToDelete(null);
            })
            .catch((error) => {
                console.error(error.response);
                setShowDeleteModal(false);
                setItemToDelete(null);
            });
    }

    const handleEditClick = (itemId) => {
        setEditingItemId(itemId);
    };

    const handleSave = () => {
        setEditingItemId(null);
        getListaParametrosItem();
    };

    const handleShowDeleteModal = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const numeroFormato = ( number = 0, limite_nombre = '') => {

        if(!number && limite_nombre === '') {
            return 0;
        }
        if(!number && limite_nombre === 'inferior') {
            return 'O MENOS';
        }
        if(!number && limite_nombre === 'superior') {
            return 'O MAS';
        }

        return  new Intl.NumberFormat().format(number)
    }

    useEffect(()=>{
        getListaParametrosItem();
    },[idParametro,numberSave])

    const listaTablaParametrosItem = () => {
        return allParametrosItem.map((pregunta_item, index) => (
            editingItemId === pregunta_item.id ? (
                <ModalEditarParametrosItems
                    key={pregunta_item.id}
                    item={pregunta_item}
                    idParametro={idParametro}
                    onSave={handleSave}
                />
            ) : (
                <tr key={'pitr-'+index}>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{numeroFormato(pregunta_item.limiten_inferior)}</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>-</span>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>{numeroFormato(pregunta_item.limite_superior,'superior')}</span>
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
    {idParametroTipo === 1 && (
        <>
        <div>
            <div className="seccion-table-parametros">
                <table key={'tabpm-'+idParametroTipo} className="table items-parametros">
                    <thead>
                        <tr>
                            <th>Rango Inferiro</th>
                            <th></th>
                            <th>Rango superiro</th>
                            <th></th>
                            <th>Puntos</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaTablaParametrosItem()}
                        <ModalNuevoParametrosItems idParametro={idParametro} idPregunta={null} numberSave={numberSave} setNumberSave={setNumberSave}/>
                    </tbody>
                </table>
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
                <Button variant="primary" onClick={deleteParametroItem}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )}
    </>)
}

export default TablaParametrosItem;