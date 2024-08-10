import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import ModalNuevoParametrosItems from "./ParametrosItems/ModalNuevoParametrosItems";
import ModalEditarParametrosItems from "./ParametrosItems/ModalEditarParametrosItems";
import TablaPreguntasParametrosItem from "./TablaPreguntasParametrosItem";

function TablaPreguntasParametros({idParametro,idParametroTipo}) {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [ allPreguntaParametros, setAllPreguntaParametros ] = useState([]);
    const [error, setError] = useState(null);
    
    const getListaPreguntaParametros = () => {
        axios.get(`${APIURL}/catalogos/encuestas/parametros/${idParametro}`,config)
            .then((resp)=>{
                setAllPreguntaParametros(resp.data);
            }).catch((error)=>{
                setError(error.response);
                console.log(error.response);
            })
    }

    useEffect(()=>{
        getListaPreguntaParametros();
    },[idParametro])

    const listaTablaPreguntaParametros = () => {
        return <div className="mt-4 m-2">{allPreguntaParametros.por_pregunta.map((pregunta, index) => (
            <div key={'pptr-'+index}>
                <div className="d-flex justify-content-between mb-3">
                    <div className="">
                            <h5>{pregunta.numero_pregunta} - {pregunta.pregunta.toUpperCase()}: &nbsp;&nbsp; &nbsp;&nbsp; <i>{pregunta.puntos_maximos} PUNTOS</i></h5>
                    </div>
                </div>
                        <p>
                            <b>Tipo de clasificacion:</b> { pregunta?.tipo_preguntas ? pregunta.tipo_preguntas.nombre : '' }
                        </p>
                        <div>
                            <TablaPreguntasParametrosItem key={'mtppi'+pregunta.id} idParametro={idParametro} idParametroTipo={idParametroTipo} idPregunta={pregunta.id} IdPreguntaTipo={pregunta.id_catalogo_encuestas_preguntas_tipo}/>
                        </div>
            </div>
        ))}</div>;
    };

    if (error) {
        return <div>Error al solicitar los datos recargue nuevamente</div>;
    }

    return (<> 
    {idParametroTipo === 2 && allPreguntaParametros?.por_pregunta && (listaTablaPreguntaParametros()) }
    </>)
}

export default TablaPreguntasParametros;