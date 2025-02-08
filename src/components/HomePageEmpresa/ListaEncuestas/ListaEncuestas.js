import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RangosSugeridos from "../Graficas/RangosSugeridos";
import TablaEncuestas from "./TablaEncuestas";
import {getPuntosParametros, getTotalPuntosParametros, getPorcentajeSugerido} from "lib/estudios-functions"

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
    const [listaParametros,setlistaParametros] =  useState([])

    const rango_pordentaje = [
        {rango:20,nombre:'de 0 a 20%'},
        {rango:40,nombre:'de 20 a 40%'},
        {rango:60,nombre:'de 40 a 60%'},
        {rango:80,nombre:'de 60 a 80%'},
        {rango:100,nombre:'de 80 a 100%'},
    ]

    const getListaEstudios = () => {
        
        if(!idProyecto){
            return false;
        }

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
    const getParametrosProyecto = () => {
        if(!proyecto?.id_encuesta){
            return false;
        }
        axios.get(`${APIURL}/catalogos/encuestas/${proyecto.id_encuesta}/parametros`,config).then((resp)=>{
            setlistaParametros(resp.data);
        }).catch((resp)=>{
            if (resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    const buscarRango = (numero) => {
        const rangos = rango_pordentaje;
        // Ordenar por rango (por si no está ordenado)
        const rangosOrdenados = [...rangos].sort((a, b) => b.rango - a.rango);
    
        // Filtrar y encontrar el último que sea menor o igual al número dado
        const rangoEncontrado = rangosOrdenados
            .filter(item => item.rango >= numero)
            .pop(); // Obtener el último elemento
    
        return rangoEncontrado ? rangoEncontrado.nombre : ''; // Retornar null si no se encuentra
    };

    useEffect(() => {
        getProyectoID();
    },[idProyecto,])
    
    useEffect(() => {
        getListaEstudios();
    },[idProyecto,idOrdenServicio])
    
    useEffect(() => {
        if(proyecto?.id_encuesta){
            getParametrosProyecto();
        }
    },[proyecto])

    
    const rowListaEstudios = () => {
        return Array.isArray(listaEstudios) && listaEstudios.map((estudio,index) => (
        <tr key={'lepr-'+index}>
            <td>{estudio.id}</td>
            <td>{estudio.candidato}</td>
            <td>{estudio?.estado?.nombre && estudio.estado.nombre}</td>
            <td>
                #{estudio.orden_servicio.id} {estudio.orden_servicio.descripcion}
            </td>
            <td>{estudio.orden_servicio.fecha_estimada_entrega}</td>
            <td>{estudio.orden_servicio.fecha_real_entrega}</td>
            <td>
                <Link className="btn btn-primary btn-sm" to={`/estudios/${estudio.id}`}>Ver</Link>
            </td>
        </tr>
        ));
    }
   


    const resumenEstudiosSocioeconomicos = () => {
        return Array.isArray(listaEstudios) && listaEstudios.map((estudio,index) => {
            const porcentaje_sugerido =  getPorcentajeSugerido(estudio.parametros);
        return (
            <tr key={'lepp-'+index}>
                <td>{estudio.id}</td>
                <td>{estudio.candidato}</td>
                
                {Array.isArray(listaParametros) && listaParametros.length > 0 && listaParametros.map((parametro,index) => (
                    <td key={'pth'+index}>{parametro?.id && getPuntosParametros(estudio.parametros,parametro.id)}</td>
                ))}

                <td>{getTotalPuntosParametros(estudio.parametros)}</td>
                <td>{porcentaje_sugerido}%</td>
                <td>{estudio?.porcentaje_otorgado ? `${estudio.porcentaje_otorgado }%` : (<Link className="btn btn-link btn-sm text-dark" to={`/estudios/${estudio.id}`}>Añadir</Link>)}</td>
                <td>
                    <Link className="btn btn-link btn-sm text-dark" to={`/estudios/${estudio.id}`}>Ver</Link>
                </td>
            </tr>
            )
        });
    }

    return  (
        <div>
            <div className="mt-1">
                <h5>
                    Lista de estudios socioeconomicos: Proyecto { proyecto?.nombre && proyecto.nombre}
                </h5>
                <hr/>
            </div>
            <div className="row mb-3">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card m-1 shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-10">
                                <h5 className="card-title">Ordenes de servicio</h5>
                               {/*<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>*/}
                            </div>
                            <div className="col-2 text-nowrap text-center d-flex align-items-center">
                                <h3>1/1</h3>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                {/*<div className="col-sm-6">
                    <div className="card m-1 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Total de encuestados</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    </div>
                </div>*/}
            </div>

            
			<Tabs>
				<TabList>
					<Tab>Encuestas</Tab>
					<Tab>Análisis de datos</Tab>
				</TabList>
 
				<TabPanel>
                    {
                        listaParametros.length > 0 
                        && listaEstudios.length > 0 
                        && (
                            <TablaEncuestas
                            listaParametros={listaParametros}
                            listaEstudios={listaEstudios}
                            callBackPorcentajeOtorgado={getListaEstudios}
                            />)
                    }
				</TabPanel>
				<TabPanel>
                    <div> 

                        
                        <div className="row mb-3">
                            <div className="col-sm-6">
                                <div className="card m-1 shadow-sm">
                                <div className="card-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Familias</th>
                                                <th>Pordentaje</th>
                                                <th>Rango becas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>81 a 100%</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>61 a 80%</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>41 a 60%</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>21 a 40%</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td>0 a 20%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card m-1 shadow-sm">
                                <div className="card-body">
                                    <RangosSugeridos/>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
				</TabPanel>
			</Tabs>

        </div>
    );
}