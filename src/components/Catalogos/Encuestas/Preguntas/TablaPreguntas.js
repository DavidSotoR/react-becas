import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import ModalNuevaPregunta from "./ModalNuevaPregunta";
import TablaRespuestas from "./TablaRespuestas";

function TablaPreguntas({ ID }) {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [ allPreguntas, setAllPreguntas ] = useState([]);
    const [editingPregunta, setEditingPregunta] = useState(null);
    const [editData, setEditData] = useState({});


    const [allPreguntasTipo, setAllPreguntasTipo] = useState([]);
    const [allParametros, setAllParametros] = useState([]);
    const [ postDataPregunta,setPostDataPregunta ] = useState({
        id_catalogo_encuesta: '',
        id_catalogo_encuestas_preguntas_tipo: '',
        id_catalogo_encuestas_preguntas_parametro_clasificacion: '',
        pregunta: '',
        puntos_maximos: 0
    })


    const [ showModalNuevaPregunta, setShowModalNuevaPregunta ] = useState(false)
    const handleCloseMNuevaPregunta = () => setShowModalNuevaPregunta(false);
    const handleShowMNuevaPregunta = () => setShowModalNuevaPregunta(true);


    const getParametros = () => {
        axios.get(`${APIURL}/catalogos/encuestas/${ID}/parametros`, config).then((resp) => {

            console.log(resp.data);
            setAllParametros(resp.data);
        }).catch((error) => {
            console.log(error.response);
        });
    }

    const getPreguntasTipo = () => {
        axios.get(`${APIURL}/catalogos/encuestas/preguntas/tipos`, config).then((resp) => {
            setAllPreguntasTipo(resp.data);
        }).catch((error) => {
            console.log(error.response);
        });
    }
    const getListaPreguntasEncuensta = () => {
        axios.get(`${APIURL}/catalogos/encuestas/${ID}/preguntas`,config).then((resp)=>{
            setAllPreguntas(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }
    


    useEffect(()=>{
        getListaPreguntasEncuensta();
        getPreguntasTipo();
        getParametros();
    },[])

    useEffect(()=>{
        if(!showModalNuevaPregunta){
            getListaPreguntasEncuensta()
        }
    },[showModalNuevaPregunta])

    const handleEditClick = (pregunta) => {
        setEditingPregunta(pregunta.id);
        setEditData({
            id_catalogo_encuesta: pregunta.id_catalogo_encuesta,
            id_catalogo_encuestas_preguntas_tipo: pregunta.id_catalogo_encuestas_preguntas_tipo,
            id_catalogo_encuestas_preguntas_parametro_clasificacion: pregunta?.id_catalogo_encuestas_preguntas_parametro_clasificacion,
            pregunta: pregunta.pregunta,
            puntos_maximos: pregunta.puntos_maximos,
            longitud_respuesta: pregunta.longitud_respuesta,
            numero_pregunta: pregunta.numero_pregunta
        });
    };
    
    const handleSaveClick = (id) => {
        axios.put(`${APIURL}/catalogos/encuestas/${ID}/preguntas/${id}`, editData, config).then((resp) => {
            getListaPreguntasEncuensta();
            setEditingPregunta(null);
        }).catch((error) => {
            console.log(error.response);
        });
    };

    const renderBodyListaPreguntas = () => {
        return allPreguntas.map((pregunta,i) =>(
            <div key={'pg-' + pregunta.id} 
                className={`mb-3 p-3 rounded border-opacity-75 border-static`}>
                
                {editingPregunta === pregunta.id ? (<>
                        <div className="d-flex justify-content-between mb-3">
                            <input
                                style={{width: "50px"}}
                                type="text"
                                placeholder="#"
                                value={editData.numero_pregunta}
                                onChange={(e) => setEditData({ ...editData, numero_pregunta: e.target.value })}
                                className="form-control mr-2"/>
                            <input
                                type="text"
                                value={editData.pregunta}
                                onChange={(e) => setEditData({ ...editData, pregunta: e.target.value })}
                                className="form-control"/>

                            <button className="btn btn-sm btn-light ml-2" onClick={() => handleSaveClick(pregunta.id)}><ion-icon name="save-outline"></ion-icon></button>
                            <button className="btn btn-sm btn-light ml-2" onClick={() => setEditingPregunta(null)}><ion-icon name="arrow-undo-circle-outline"></ion-icon></button>
                        </div>
                        <hr/>
                        <div className="row">

                            <div className="col-md-4 row mt-2">
                                <div className="col-6" style={{ display: "flex", alignItems: "center" }}>
                                    <b>PUNTOS MAXIMOS: </b>
                                </div>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        value={editData.puntos_maximos}
                                        onChange={(e) => setEditData({ ...editData, puntos_maximos: e.target.value })}
                                        className="form-control"/>
                                </div>
                            </div>
                            
                            <div className="col-md-4 row mt-2">
                                <div className="col-6" style={{ display: "flex", alignItems: "center" }}>
                                    <b>PARAMETROS: </b>
                                </div>
                                <div className="col-6">
                                    <select
                                        value={(editData?.id_catalogo_encuestas_preguntas_parametro_clasificacion) ? editData.id_catalogo_encuestas_preguntas_parametro_clasificacion :''}
                                        onChange={(e) => setEditData({ ...editData, id_catalogo_encuestas_preguntas_parametro_clasificacion: e.target.value })}
                                        className="form-control">
                                        <option value="">Selecciona un parámetro</option>
                                        {allParametros.map(parametro => (
                                            <option key={parametro.id} value={parametro.id}>{parametro.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4 row mt-2">
                                <div className="col-6" style={{ display: "flex", alignItems: "center" }}>
                                    <b>TIPO DE PREGUNTA: </b>
                                </div>
                                <div className="col-6">
                                    <select
                                        value={editData.id_catalogo_encuestas_preguntas_tipo}
                                        onChange={(e) => setEditData({ ...editData, id_catalogo_encuestas_preguntas_tipo: e.target.value })}
                                        className="form-control">
                                        <option value="">Selecciona un tipo</option>
                                        {allPreguntasTipo.map(tipo => (
                                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-4 row mt-2">
                                <div className="col-6" style={{ display: "flex", alignItems: "center" }}>
                                    <b>LONGITUD RESPUESTA: </b>
                                </div>
                                <div className="col-6">
                                    <input
                                        type="number"
                                        value={editData.longitud_respuesta}
                                        onChange={(e) => setEditData({ ...editData, longitud_respuesta: e.target.value })}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                        </div>
                </>):(<>
                <div className="d-flex justify-content-between mb-3">
                    <div className="">
                            <h5>{pregunta.numero_pregunta ? pregunta.numero_pregunta+' - ' : ''}{pregunta.pregunta.toUpperCase()}</h5>
                    </div>
                    <div className="">
                        <div className="dropdown">
                            <button className="btn btn-sm fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Acciones
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" type="button" onClick={() => handleEditClick(pregunta)}>Editar</button></li>
                                <li><button className="dropdown-item" type="button">Eliminar</button></li>
                                <li><button className="dropdown-item" type="button">Desactivar</button></li>
                            </ul>
                            </div>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-4">
                        <p><b>PUNTOS MAXIMOS: </b>{pregunta.puntos_maximos} </p>
                    </div>
                    <div className="col-md-4">
                        <p>
                            <b>PARAMETROS: </b>
                            {pregunta?.clasificacion_parametro && (
                                <>
                                    <div className="tag-color" style={{ backgroundColor: pregunta.clasificacion_parametro.color }}></div>
                                    {pregunta.clasificacion_parametro.nombre}
                                </>
                            )}
                        </p>
                    </div>
                    <div className="col-md-4">
                        <p><b>TIPO DE PREGUNTA: </b>{pregunta.tipo_preguntas.nombre} - {pregunta.tipo_preguntas.id}</p>
                    </div>
                    <div className="col-md-4">
                        <p><b>LONGITUD RESPUESTA: </b>{pregunta.longitud_respuesta}</p>
                    </div>
                </div>
                </>)}
                <hr/>
                <TablaRespuestas idPregunta={pregunta.id} idPreguntaTipo={pregunta.id_catalogo_encuestas_preguntas_tipo} dataPregunta={pregunta}/>
            </div>
        ));
    };
    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h3>Lista de preguntas:</h3>
                    <span>Elementos añadidos: {allPreguntas.length}</span>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm fw-bold" onClick={handleShowMNuevaPregunta}>Agregar Pregunta</button>
                </div>
            </div>
            
            <div className='tab-content'>
                {renderBodyListaPreguntas()}
            </div>
            <ModalNuevaPregunta key={'mnp-'+ID} show={showModalNuevaPregunta} handleClose={handleCloseMNuevaPregunta}></ModalNuevaPregunta>
        </div>
    )

}

export default TablaPreguntas;