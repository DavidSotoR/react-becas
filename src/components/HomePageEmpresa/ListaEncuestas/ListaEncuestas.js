import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";


export default function ListaEncuestas({idProyecto, idOrdenServicio}){
    
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    const [listaEstudios,setListaEstudios] = useState([]);
    const [proyecto,setProyecto] = useState(null);

    const getListaEstudios = () => {
        
        let conf = config;
        if(idOrdenServicio){
            conf.params = {
                id_orden_servicio: idOrdenServicio
            };
        }

        axios.get(`${APIURL}/estudios/concluidos/proyecto/${idProyecto}`,config).then((resp)=>{
            setListaEstudios(resp.data);
            console.log(resp.data);
        }).catch((resp)=>{
            if (resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    const getProyectoID = () => {
        axios.get(`${APIURL}/estudios/proyectos/${idProyecto}`,config).then((resp)=>{
            setProyecto(resp.data);
        }).catch((resp)=>{
            if (resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    useEffect(() => {
        getProyectoID();
    },[idProyecto,])
    
    useEffect(() => {
        getListaEstudios();
    },[idProyecto,idOrdenServicio])

    
    const rowListaEstudios = () => {
        return Array.isArray(listaEstudios) && listaEstudios.map((estudio,index) => (
        <tr key={'lepr-'+index}>
            <td>{index+1}</td>
            <td>{estudio.candidato}</td>
            <td>{estudio.estado.nombre}</td>
            <td>
                #{estudio.orden_servicio.id}
                <br/>
                {estudio.orden_servicio.descripcion}
            </td>
            <td>{estudio.orden_servicio.fecha_estimada_entrega}</td>
            <td>{estudio.orden_servicio.fecha_real_entrega}</td>
            <td>
                <Link className="btn btn-primary btn-sm" to={`/estudios/${estudio.id}`}>Ver</Link>
            </td>
        </tr>
        ));
    }

    return  (
        <div>
            <div className="mt-1">
                <h5>
                    Lista de estudios socioeconomicos: Proyecto {proyecto !== null && proyecto.nombre}
                </h5>
                <hr/>
            </div>
            <div> 
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Familia</th>
                            <th>Estado</th>
                            <th>Orden de servicio</th>
                            <th>Fecha estimada de entrega</th>
                            <th>Fecha real de entrega</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowListaEstudios()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}