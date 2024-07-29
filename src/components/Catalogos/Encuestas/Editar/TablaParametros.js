
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "./../../../../context/AuthContext";
import ModalNuevoParametro from "./ModalNuevoParametro";

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

    const data = [
        {nombre:"Liquides",tipo_parametro_clasificacion:"Mayor",descripcion:"Enim adipisicing quis sunt culpa mollit eu nostrud officia amet veniam commodo nisi. Fugiat qui enim mollit qui voluptate magna laborum aliqua in ea commodo exercitation. Duis nulla Lorem deserunt proident nostrud aute. Cupidatat nulla consectetur veniam tempor Lorem nostrud. Dolore adipisicing id id sit ad culpa dolor ipsum velit pariatur sit tempor exercitation. Excepteur excepteur enim amet aute dolore ea non nostrud. Anim fugiat excepteur consectetur dolore id elit exercitation."},
        {nombre:"Educacion",tipo_parametro_clasificacion:"Rango",descripcion:"Enim adipisicing quis sunt culpa mollit eu nostrud officia amet veniam commodo nisi. Fugiat qui enim mollit qui voluptate magna laborum aliqua in ea commodo exercitation. Duis nulla Lorem deserunt proident nostrud aute. Cupidatat nulla consectetur veniam tempor Lorem nostrud. Dolore adipisicing id id sit ad culpa dolor ipsum velit pariatur sit tempor exercitation. Excepteur excepteur enim amet aute dolore ea non nostrud. Anim fugiat excepteur consectetur dolore id elit exercitation."},
        {nombre:"Salud",tipo_parametro_clasificacion:"Seleccion",descripcion:"Enim adipisicing quis sunt culpa mollit eu nostrud officia amet veniam commodo nisi. Fugiat qui enim mollit qui voluptate magna laborum aliqua in ea commodo exercitation. Duis nulla Lorem deserunt proident nostrud aute. Cupidatat nulla consectetur veniam tempor Lorem nostrud. Dolore adipisicing id id sit ad culpa dolor ipsum velit pariatur sit tempor exercitation. Excepteur excepteur enim amet aute dolore ea non nostrud. Anim fugiat excepteur consectetur dolore id elit exercitation."}
    ];
    
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
            {JSON.stringify(allParametros)}
            <div className='tab-content'>
                {allParametrosFiltrados.map((a,i) =>(
                    <div key={'pg-'+i} className="mb-3 p-3 border rounded border-opacity-75"> 
                        <div className="d-flex justify-content-between mb-3">
                            <div className="">
                                    <h4>{a.nombre}</h4>
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
                        <hr/>
                            <p>
                                <b>Tipo de clasificacion:</b> {a?.tipo_parametro_clasificacion}, <b>Puntuacion Maxima:</b> {a.puntos_maximo}
                            </p>
                        <hr/>
                        <div>
                            {a.descripcion}
                        </div>
                    </div>
                ))}
            </div>
            <ModalNuevoParametro show={showModalNuevoParametro} handleClose={handleCloseMNuevoParametro}></ModalNuevoParametro>
        </div>
    )
}

export default TablaParametros