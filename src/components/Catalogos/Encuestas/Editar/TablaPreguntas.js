import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "./../../../../context/AuthContext";
import ModalNuevaPregunta from "./ModalNuevaPregunta";

function TablaPreguntas() {
    const { ID } = useParams();
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [ allPreguntas, setAllPreguntas ] = useState([])
    const [ allPreguntasTipo, setAllPreguntasTipo ] = useState([])
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


    const getListaPreguntasEncuensta = () => {
        axios.get(APIURL+'/catalogos/encuestas/'+ID+'/preguntas',config).then((resp)=>{
            setAllPreguntas(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }
    

    const renderBodyTablaPreguntas = () => {
        return allPreguntas.map((preguntas, index) => (
            <tr key={'tr-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.id}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.tipo_preguntas.nombre}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.parametro_de_clasificacion.nombre}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.pregunta}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.puntos_maximos}</p>
                </td>
                <td>
                    <div className="d-flex">
                        <Link className="btn btn-primary btn-sm">Editar</Link>
                        <button className="btn btn-danger btn-sm mx-1">Borrar</button>
                    </div>
                </td>
            </tr>
        ));
    };

    useEffect(()=>{
        getListaPreguntasEncuensta()
        if(!showModalNuevaPregunta){
            getListaPreguntasEncuensta()
        }
    },[showModalNuevaPregunta])

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h3>Lista de preguntas</h3>
                </div>
                <div className="">
                <button className="btn btn-primary btn-sm fw-bold" onClick={handleShowMNuevaPregunta}>Agregar Pregunta</button>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-id">ID</th>
                                    <th scope="col">Tipo Pregunta</th>
                                    <th scope="col">Parametro</th>
                                    <th scope="col">Pregunta</th>
                                    <th scope="col">Puntaje maximo</th>
                                    <th scope="col">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { renderBodyTablaPreguntas() }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <ModalNuevaPregunta show={showModalNuevaPregunta} handleClose={handleCloseMNuevaPregunta}></ModalNuevaPregunta>
        </div>

    )
}

export default TablaPreguntas;