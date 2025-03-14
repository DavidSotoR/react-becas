import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import RangosSugeridos from "../Graficas/RangosSugeridos";
import SeccionRangos from "../Graficas/SeccionRangos";
import TablaEncuestas from "./TablaEncuestas";
import { Modal, Button } from 'react-bootstrap'
import {getPuntosParametros, getTotalPuntosParametros, getPorcentajeSugerido} from "lib/estudios-functions";

import DistribucionDelGastoGrafica from "../Graficas/DistribucionDelGastoGrafica";
import TablaEnvioEmail from "./TablaEnvioEmail";

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

    const [ estudioSelectedData, setEstudioSelectedData ] = useState(null);
    const [showSendEmailPorcentaje, setShowSendEmailPorcentaje] = useState(false);
    const handleCloseSendEmailPorcentaje = () => setShowSendEmailPorcentaje(false);
    const handleShowSendEmailPorcentaje = () => setShowSendEmailPorcentaje(true);

    const rango_pordentaje = [
        {rango:20,nombre:'de 0 a 20%'},
        {rango:40,nombre:'de 20 a 40%'},
        {rango:60,nombre:'de 40 a 60%'},
        {rango:80,nombre:'de 60 a 80%'},
        {rango:100,nombre:'de 80 a 100%'},
    ]

    const [estudioSelectedGraficar,setEstudioSelectedGraficar] = useState({});
    const getItemByKey = (array,campo, val) => {
        return array.find(item => convertirAMayusculas(item[campo]) === convertirAMayusculas(val));
    };
    
    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }
    const sumatoriaKey = (respuestas,campo) => {

        return respuestas.reduce((acc, item) => {
            const value = parseFloat(item[campo]);
            return acc + (isNaN(value) ? 0 : value); // Solo suma si es un número válido
          }, 0);
    }

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const getListaEstudios = () => {
        
        if(!idProyecto){
            return false;
        }

        let conf = config;
        if(idOrdenServicio){
            conf.params = {
                id_orden_servicio: idOrdenServicio,
                distribucion_del_gasto:1
            };
        }else{
            conf.params = {
                distribucion_del_gasto:1
            };
        }

        axios.get(`${APIURL}/estudios/concluidos/proyecto/${idProyecto}`,config).then((resp)=>{
            setListaEstudios(resp.data);
            //console.log(resp.data);
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

    const addIDEstudioToSend = (e) => {
        let {value, name} = e.target;
        console.log(value, name);
        
    }

    const rowsEmailsSendedPorcentajes = () => {
        console.log(listaEstudios);
        
        return Array.isArray(listaEstudios) && listaEstudios.map((estudio,index) => (
        <tr key={'remailsend-'+index}>
            <td className="text-center">
                <input class="form-check-input" value={estudio.id} type="checkbox" name="input_check" id="input_check" onChange={(e)=> {addIDEstudioToSend(e)}}/>
            </td>
            <td>{estudio.id}</td>
            <td>Envido</td>
            <td>{ estudio.clave_familia_colegio }</td>
            <td>{estudio.candidato}</td>
            <td>{estudio.hijo ? estudio.hijo.nombre : 'NO APLICA'}</td>
            <td>
                <button className="btn btn-primary btn-sm" onClick={() => getValuesToSendData(estudio)}>Enviar Email</button>
            </td>
        </tr>
        ));
    }

    const getValuesToSendData = (data = null) => {
        if (data) {
            setEstudioSelectedData(data)
        }
        handleShowSendEmailPorcentaje();
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
            {/*<div className="mt-1">
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
                            </div>
                            <div className="col-2 text-nowrap text-center d-flex align-items-center">
                                <h3>1/1</h3>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="card m-1 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Total de encuestados</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    </div>
                </div>
            </div>*/}

            
			<Tabs>
				<TabList>
					<Tab>Encuestas</Tab>
					<Tab>Análisis de datos</Tab>
					<Tab>Distribución del gasto</Tab>
                    <Tab>Notificación %</Tab>
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
                            {/*<div className="col-sm-6">
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
                            </div>*/}

                            <SeccionRangos idProyecto={idProyecto} idOrdenServicio={idOrdenServicio}/>
                            {/*<div className="col-sm-6">
                                <div className="card m-1 shadow-sm">
                                <div className="card-body">
                                    
                                    <DistribucionDelGastoGrafica datos={[
                                            {
                                                categoria: "Necesidades esenciales",
                                                total: 36000
                                            },
                                            {
                                                categoria: "Viajes",
                                                total: 50000
                                            },
                                            {
                                                categoria: "Educación",
                                                total: 12880
                                            },
                                            {
                                                categoria: "Lujos",
                                                total: 28000
                                            }
                                        ]} />
                                </div>
                                </div>
                            </div>*/}

                        </div>

                    </div>
				</TabPanel>
				<TabPanel>
                        
                        <div className="row mb-3">
                                    <div className={estudioSelectedGraficar?.distribucion_del_gasto ? "col-sm-8": "col-12"}>
                                        <div className="card m-1 shadow-sm">
                                        <div className="card-body">
                                            <div><i>Los campos en color rojo están considerados como gastos que superan más del 20% del gasto</i></div>
                                            <br/>
                                            <div style={{ overflowY: 'auto', height: '450px'}}>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Estudio</th>
                                                            <th>Familia</th>
                                                            <th>Necesidades esenciales</th>
                                                            <th>Viajes</th>
                                                            <th>Educación</th>
                                                            <th>Lujos</th>
                                                            <th>Otros</th>
                                                            <th>Gasto mensual total</th>
                                                            <th>Ingreso Familia</th>
                                                            <th colSpan={2}>Saldo Disponible</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listaEstudios.map((estudio, index) => {
                                                            const data          = estudio?.distribucion_del_gasto ?  estudio.distribucion_del_gasto : [] ;
                                                            const total_gasto   = sumatoriaKey(estudio.distribucion_del_gasto,'total');
                                                            const nececidades_esenciales = getItemByKey(estudio.distribucion_del_gasto,'categoria','Necesidades esenciales').total;
                                                            const viajes            = getItemByKey(estudio.distribucion_del_gasto,'categoria','Viajes').total
                                                            const educacion         =getItemByKey(estudio.distribucion_del_gasto,'categoria','Educación').total;
                                                            const lujos             = getItemByKey(estudio.distribucion_del_gasto,'categoria','Lujos').total;
                                                            const otros             = getItemByKey(estudio.distribucion_del_gasto,'categoria','Otros').total;;
                                                            const nivel_liquides    = getItemByKey(estudio.parametros,'nombre','Nivel de liquidez');
                                                            const ingreso_familia   = nivel_liquides?.puntos ? nivel_liquides.puntos.sumatoria : 0;
                                                            const gasto_prociento   = ingreso_familia/5;
                                                            const calcular_porcentaje = parseInt(((ingreso_familia-total_gasto)/ingreso_familia)*100,10);
                                                            const porcentaje_estudio = !isNaN(calcular_porcentaje) ? calcular_porcentaje : 0;
                                                            return data.length > 0 && (
                                                            <tr 
                                                                key={"lgi+"+index} 
                                                                onClick={() =>{setEstudioSelectedGraficar(estudio)}}
                                                                style={{backgroundColor: ((estudioSelectedGraficar.id ?? '') === estudio.id ) ? 'aliceblue' : 'var(--bs-table-bg)'}}
                                                            >
                                                                <td className="bg-transparent" >#{estudio.id}</td>
                                                                <td className="bg-transparent" >{estudio.candidato}</td>
                                                                <td style={{ color: nececidades_esenciales>gasto_prociento ? 'red' : 'black' }} className="bg-transparent text-end border-start">
                                                                    ${formatNumber(nececidades_esenciales)}
                                                                </td>
                                                                <td style={{ color: viajes>gasto_prociento ? 'red' : 'black' }} className="bg-transparent text-end">
                                                                    ${formatNumber(viajes)}
                                                                </td>
                                                                <td style={{ color: educacion>gasto_prociento ? 'red' : 'black' }} className="bg-transparent text-end">
                                                                    ${formatNumber(educacion)}
                                                                </td>
                                                                <td style={{ color: lujos>gasto_prociento ? 'red' : 'black' }} className="bg-transparent text-end">
                                                                    ${formatNumber(lujos)}
                                                                </td>
                                                                <td style={{ color: otros>gasto_prociento ? 'red' : 'black' }} className="bg-transparent text-end">
                                                                    ${formatNumber(otros)}
                                                                </td>
                                                                <td className="bg-transparent text-end border-start">
                                                                    ${formatNumber(total_gasto)}
                                                                </td>
                                                                <td className="bg-transparent text-end border-start">
                                                                    ${formatNumber(ingreso_familia)}
                                                                </td>
                                                                
                                                                <td className="bg-transparent text-end border-start">
                                                                    ${formatNumber(ingreso_familia-total_gasto)}
                                                                </td>
                                                                <td className="bg-transparent text-end">
                                                                    { porcentaje_estudio }%
                                                                </td>

                                                            </tr>)
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    {estudioSelectedGraficar?.distribucion_del_gasto && (
                                        <div className="col-sm-4">
                                            <div className="card m-1 shadow-sm">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-5"><b>Estudio</b></div>
                                                    <div className="col-7">#{estudioSelectedGraficar.id}</div>
                                                    <div className="col-5"><b>Familia</b></div>
                                                    <div className="col-7">{estudioSelectedGraficar.candidato}</div>
                                                </div>
                                                <DistribucionDelGastoGrafica datos={estudioSelectedGraficar.distribucion_del_gasto} />
                                            </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
				</TabPanel>
                <TabPanel>
                    {
                        listaEstudios.length > 0 
                        && (
                            <TablaEnvioEmail
                            listaParametros={listaParametros}
                            listaEstudios={listaEstudios}
                            callBackPorcentajeOtorgado={getListaEstudios}
                            />)
                    }

                </TabPanel>
			</Tabs>

        </div>
    );
}