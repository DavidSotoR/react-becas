import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import ModalNuevoParametrosItems from "./ParametrosItems/ModalNuevoParametrosItems";

function TablaParametrosItem({idParametro,idParametroTipo}) {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [ allParametrosItem, setAllParametrosItem ] = useState([]);
    const getListaParametrosItem = () => {
        axios.get(APIURL+`/catalogos/encuestas/parametros/${idParametro}/items`,config).then((resp)=>{
            setAllParametrosItem(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }

    const modalDeleteParametroItem = (itme) => {

    }

    useEffect(()=>{
        getListaParametrosItem();
    },[idParametro])


    const listaTablaParametrosItem = () => {
        return allParametrosItem.map((pregunta_item, index) => (
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
                        <Button variant="light" >
                            <ion-icon name="create-outline"></ion-icon>
                        </Button>
                        <Button variant="light" style={{ marginLeft: "5px" }} >
                            <ion-icon name="trash-outline"></ion-icon>
                        </Button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (<> 
    {idParametroTipo === 1 && (
        <div>
            <div className="seccion-table-parametros">
                <table key={'tabpm-'+idParametroTipo} className="table items-parametros">
                    <tbody>
                        {listaTablaParametrosItem()}
                        <ModalNuevoParametrosItems idParametro={idParametro}/>
                    </tbody>
                </table>
            </div>

        </div>
    )}
    </>)
}

export default TablaParametrosItem;