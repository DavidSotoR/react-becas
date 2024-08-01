
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "./../../../../context/AuthContext";
import ModalNuevoParametro from "./ModalNuevoParametro";
import TablaParametrosItem from "./TablaParametrosItem";

function TablaParametros() {
    const { ID } = useParams();
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [ allParametros, setAllParametros ] = useState([]);
    const [search,setSearch] = useState("");

    const getListaParametrosEncuensta = () => {
        axios.get(APIURL+'/catalogos/encuestas/'+ID+'/parametros',config).then((resp)=>{
            setAllParametros(resp.data)
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
    useEffect(()=>{
        getListaParametrosEncuensta()
        if(!showModalNuevoParametro){
            getListaParametrosEncuensta()
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
                    <div key={'pg-'+i} className="mb-3 p-3 border rounded border-opacity-75"> 
                        <div className="d-flex justify-content-between mb-3">
                            <div className="">
                                    {a.id} - <h5>{a.nombre.toUpperCase()}: &nbsp;&nbsp; &nbsp;&nbsp; <i>{a.puntos_maximo} PUNTOS</i>  &nbsp;&nbsp; PREGUNTA(S):</h5>
                            </div>
                            <div className="">
                                <div className="dropdown">
                                    <button className="btn btn-sm fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Acciones
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button className="dropdown-item" type="button">Editar</button></li>
                                        <li><button className="dropdown-item" type="button">Eliminar</button></li>
                                        <li><button className="dropdown-item" type="button">Desactivar</button></li>
                                    </ul>
                                    </div>
                            </div>
                        </div>
                        <p>
                            <b>Tipo de clasificacion:</b> {a?.tipo_parametro?.nombre}
                        </p>
                        <div>
                            {a.descripcion}
                            <TablaParametrosItem idParametro={a.id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos}/>
                        </div>
                    </div>
                ))}
            </div>
            <ModalNuevoParametro show={showModalNuevoParametro} handleClose={handleCloseMNuevoParametro}></ModalNuevoParametro>
        </div>
    )
}

export default TablaParametros