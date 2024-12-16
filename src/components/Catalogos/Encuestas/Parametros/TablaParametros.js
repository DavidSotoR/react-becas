
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./../../../../context/AuthContext";
import ModalNuevoParametro from "./ModalNuevoParametro";
import TablaParametrosItem from "./TablaParametrosItem";
import TablaPreguntasParametros from "./TablaPreguntasParametros";
import ModalModificarParametroPregunta from "./ModalModificarParametroPregunta";

function TablaParametros({ ID }) {
    //const { ID } = useParams();
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [allParametros, setAllParametros ] = useState([]);
    const [editarParametro, setEditarParametro] = useState(null);
    const [editData, setEditData] = useState({});
    const [search,setSearch] = useState("");
    const [preguntaParametro,setPreguntaParametro] = useState({});
    const handleClosePreguntaParametro = () => setPreguntaParametro({});
    const getListaParametrosEncuensta = () => {
        axios.get(APIURL+'/catalogos/encuestas/'+ID+'/parametros',config).then((resp)=>{
            setAllParametros(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }
    
    
    const [ allParametrosTipos, setAllParametrosTipos ] = useState([]);

    const getListaParametrosTipos = () => {
        axios.get(APIURL+'/catalogos/encuestas/parametros/tipos',config).then((resp)=>{
            setAllParametrosTipos(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }
    
    const [ showModalNuevoParametro, setShowModalNUevoParametro ] = useState(false)
    const handleCloseMNuevoParametro = () => setShowModalNUevoParametro(false);
    const handleShowMNuevoParametro = () => setShowModalNUevoParametro(true);


    const allParametrosFiltrados = allParametros.filter(item =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
    );
    
    const renderOpcionesParametrosTipos = () => {
        return [<option key='sapt-0' value="0">Seleccione Tipo de Parametro</option>,...allParametrosTipos.map((param) => (
            <option key={'sapt-'+param.id} value={`${param.id}`}>
                { param.nombre }
            </option>
        ))]
    }

    const handleEditClick = (parametro) => {
        setEditarParametro(parametro.id);
        setEditData({
            color: parametro.color,
            formato_decimales: parametro.formato_decimales,
            id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos: parametro.id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos,
            nombre: parametro.nombre,
            puntos_maximos: parametro.puntos_maximos,
            puntos_maximo: parametro.puntos_maximo
        });
    };
    
    const handleSaveClick = (id) => {
        axios.put(`${APIURL}/catalogos/encuestas/${ID}/parametros/${id}`, editData, config).then((resp) => {
            getListaParametrosEncuensta();
            setEditarParametro(null);
        }).catch((error) => {
            console.log(error.response);
        });
    };

    useEffect(()=>{
        getListaParametrosTipos();
    },[])

    useEffect(()=>{
        if(!showModalNuevoParametro){
            getListaParametrosEncuensta();
        }
    },[showModalNuevoParametro])

    return(
        <div>
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                <h3>Lista de parametros</h3>
                </div>
                <div className="">
                <button className="btn btn-primary btn-sm fw-bold" onClick={handleShowMNuevoParametro}>Agregar Parametros</button>
                </div>
            </div>
            <div className='tab-content'>
                {allParametrosFiltrados.map((a,i) =>(
                    <div key={'pg-' + a.id} 
                        className={`mb-3 p-3 rounded border-opacity-75 border-static`}>
                            {editarParametro === a.id ? (<>
                                <div className="d-flex justify-content-between mb-3">
                                    <input 
                                        type="color" 
                                        className="form-control form-control-color ml-2" 
                                        name="color" 
                                        value={editData.color}
                                        onChange={(e) => setEditData({ ...editData, color: e.target.value })}/>
                                    
                                    <input 
                                        id="nombre_parametro" 
                                        type="text" 
                                        className="form-control form-control ml-2" 
                                        placeholder="" 
                                        name="nombre" 
                                        value={editData.nombre}
                                        onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}/>
                                    
                                    <button className="btn btn-sm btn-light ml-2" onClick={() => handleSaveClick(a.id)}><ion-icon name="save-outline"></ion-icon></button>
                                    <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarParametro(null)}><ion-icon name="arrow-undo-circle-outline"></ion-icon></button>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 row mt-2">
                                        <div className="col-6 " style={{ display: "flex", alignItems: "center" }}>
                                            <b>Tipo de clasificacion:</b>
                                        </div>
                                        <div className="col-6">
                                            <select 
                                                value={editData.id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos}
                                                id="parametro-clasificacion" 
                                                className="form-select form-control-sm" 
                                                onChange={(e) => setEditData({ ...editData, id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos: e.target.value })}
                                                aria-label="Default select example" 
                                                name="id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos">
                                                { renderOpcionesParametrosTipos() }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4 row mt-2">

                                        <div className="col-12" style={{ display: "flex", alignItems: "center" }}>
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    id="formato_decimales"
                                                    checked={editData.formato_decimales}
                                                    onChange={(e) => setEditData({ ...editData, formato_decimales: !editData.formato_decimales })}/>
                                                <label className="form-check-label" for="formato_decimales"><b>Formato decimales:</b> {(editData.formato_decimales) ? 'Si':'No'}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>):(
                                <>
                                <div className="d-flex justify-content-between mb-3">
                                    <div className="">
                                            <h5>
                                                <div className="tag-color" style={{ backgroundColor: a.color }}></div>
                                                {a.nombre.toUpperCase()}: &nbsp;&nbsp; &nbsp;&nbsp; <i>{a.puntos_maximo} PUNTOS</i>  &nbsp;&nbsp; PREGUNTA(S):
                                            </h5>
                                    </div>
                                    <div className="">
                                        <div className="dropdown">
                                            <button className="btn btn-sm fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Acciones
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><button className="dropdown-item" type="button" onClick={() => handleEditClick(a)}>Editar</button></li>
                                                <li><button className="dropdown-item" type="button">Eliminar</button></li>
                                                <li><button className="dropdown-item" type="button">Desactivar</button></li>
                                            </ul>
                                            </div>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-4 row mt-2">
                                        <p>
                                            <b>Tipo de clasificacion:</b> {a?.tipo_parametro?.nombre}
                                        </p>
                                    </div>
                                    <div className="col-md-4 row mt-2">
                                        <p>
                                            <b>Formato decimales:</b> {(a.formato_decimales) ? 'Si':'No'}
                                        </p>
                                    </div>
                                </div>
                                </>
                            )}

                        <div>
                            {a.descripcion}
                            <TablaParametrosItem key={'mtpi'+a.id} idParametro={a.id} idParametroTipo={a.id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos}/>
                            <TablaPreguntasParametros 
                                key={'mtpp'+a.id} 
                                idParametro={a.id} 
                                idParametroTipo={a.id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos}
                                returnPregunta={setPreguntaParametro}
                                />
                        </div>
                    </div>
                ))}
            </div>
            <ModalNuevoParametro key={'mnp-'+ID} show={showModalNuevoParametro} handleClose={handleCloseMNuevoParametro}></ModalNuevoParametro>
            <ModalModificarParametroPregunta pregunta={preguntaParametro} handleClose={handleClosePreguntaParametro}/>
        </div>
    )
}

export default TablaParametros