import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";

function TablaParametrosItem({idParametro}) {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [ allTipoClientes, setAllTipoClientes ] = useState([])

    
    const [ allParametrosItem, setAllParametrosItem ] = useState([
    ]);

    const data = [
        {limite_inferior:0, limite_superior:40000, puntos:40}
        ,{limite_inferior:40001, limite_superior:45000, puntos:35}
        ,{limite_inferior:45001, limite_superior:50000, puntos:30}
        ,{limite_inferior:55001, limite_superior:60000, puntos:25}
    ];

    const getListaParametrosItem = () => {
        axios.get(APIURL+`/catalogos/encuestas/parametros/${idParametro}/item`,config).then((resp)=>{
            setAllParametrosItem(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }

    useEffect(()=>{
        //getListaParametrosItem();
    })


    const listaTablaParametrosItem = () => {
        return data.map((pregunta_item, index) => (
            <tr key={'pitr-'+index}>
                <td>
                    <span style={{ fontWeight: "bold" }}>{pregunta_item.limite_inferior}</span>
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
                    <span style={{ fontWeight: "bold" }}>{pregunta_item.puntos}</span>
                </td>
            </tr>
        ));
    };

    return (<> 
    {idParametro === 1 && (
        <div className="seccion-table-parametros">
            <table className="table items-parametros">
                {listaTablaParametrosItem()}
            </table>
        </div>
    )}
    </>)
}

export default TablaParametrosItem;

//id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos