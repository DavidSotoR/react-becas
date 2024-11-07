import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function ListaProyectos(){
    
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [roleSession, setRoleSession] = useState(localStorage.getItem('role'));
    const { logout } = useContext(AuthContext);

    const [listaProyectos,setListaProyectos] = useState([]);
    const [cliente,setCliente] = useState(null);

    const getListaProyectos = () => {
        axios.get(`${APIURL}/estudios/proyectos`,config).then((resp)=>{
            setListaProyectos(resp.data);
            console.log(resp.data);
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }
    
    const getCliente = () => {
        axios.get(`${APIURL}/usuario/cliente`,config).then((resp)=>{
            setCliente(resp.data);
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    useEffect(() => {
        getListaProyectos();
        getCliente();
    },[]);

    return Array.isArray(listaProyectos) && (
    <div>
        <div className="mt-1">
            <h3>
                Lista de proyectos
            </h3>
            <hr/>
            <div>
                {cliente !== null &&(
                    <p>{cliente.nombre}</p>
                )}
            </div>
        </div>
        {listaProyectos.map((item,index) => (
            <div key={'lpi-'+index}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Proyecto</th>
                            <th>No. Ordenes de servicio</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{index+1}</td>
                            <td>{item.nombre}</td>
                            <td>{item?.ordenes_de_servicio ? item.ordenes_de_servicio.length : 0 }</td>
                            <td>
                                <div className="text-end">
                                    <Link className="btn btn-primary btn-sm" to={`/encuesta/proyecto/${item.id}`}>Ver</Link>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ))}
    </div>)
}