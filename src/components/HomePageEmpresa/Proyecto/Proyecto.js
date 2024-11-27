import axios from "axios"
import { useParams } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Proyecto(){

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    const { idProyecto } = useParams()
    
    const [listaOrdenesDeservicio,setListaOrdenesDeservicio] = useState([]);
    const [proyecto,setProyecto] = useState(null);

    const getListaOrdenesDeServicio = () => {
        axios.get(`${APIURL}/estudios/proyectos/${idProyecto}/ordenesdeservicio`,config).then((resp)=>{
            setListaOrdenesDeservicio(resp.data);
            console.log(resp.data);
        }).catch((resp)=>{
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    const getProyectoID= () => {
        axios.get(`${APIURL}/estudios/proyectos/${idProyecto}`,config).then((resp)=>{
            setProyecto(resp.data);
        }).catch((resp)=>{
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    useEffect(() => {
        getListaOrdenesDeServicio();
        getProyectoID();
    },[])

    const listaODS = () => {
        return listaOrdenesDeservicio.map((item,index) => (
            <tr key={'lpi-'+index}>
                <td>{index+1}</td>
                <td>{item.descripcion}</td>
                <td>{item.fecha_estimada_entrega || ''}</td>
                <td>{item.fecha_real_entrega || ''}</td>
                <td>{item.fecha_estimada_finalizacion || ''}</td>
                <td>{item.fecha_real_finalizacion || ''}</td>
                <td>{item?.no_estudios ? item.no_estudios : 0 }</td>
                <td>
                    <div className="text-end">
                        <Link className="btn btn-primary btn-sm" to={`/encuesta/proyecto/${item.id}`}>Ver</Link>
                    </div>
                </td>
            </tr>
        ))
    }

    return (
        <div>
            <div className="mt-1">
                <h3>
                    Lista de Ordenes de servicio: Proyecto {proyecto !== null && proyecto.nombre}
                </h3>
                <hr/>
            </div>
            <div> 
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Descripcion</th>
                            <th>Fecha estimada de entrega</th>
                            <th>Fecha de entrega</th>
                            <th>Fecha estimada de finalizacion</th>
                            <th>Fecha de finalizacion</th>
                            <th>No. de estudios</th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {listaODS()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}