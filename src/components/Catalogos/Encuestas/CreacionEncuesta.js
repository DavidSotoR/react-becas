import { useState } from "react";
import { useParams } from "react-router-dom";
import ModalNuevoParametro from "./ModalNuevoParametro";
import ModalNuevaPregunta from "./ModalNuevaPregunta";

function CreacionEncuesta() {
    const { ID } = useParams();
    const [ showModalNuevoParametro, setShowModalNUevoParametro ] = useState(false)
    const handleCloseMNuevoParametro = () => setShowModalNUevoParametro(false);
    const handleShowMNuevoParametro = () => setShowModalNUevoParametro(true);

    const [ showModalNuevaPregunta, setShowModalNuevaPregunta ] = useState(false)
    const handleCloseMNuevaPregunta = () => setShowModalNuevaPregunta(false);
    const handleShowMNuevaPregunta = () => setShowModalNuevaPregunta(true);

    const [ allPreguntas, setAllPreguntas ] = useState([])
    const [ allPreguntasTipo, setAllPreguntasTipo ] = useState([])
    const [ postDataPregunta,setPostDataPregunta ] = useState({
        id_catalogo_encuesta: '',
        id_catalogo_encuestas_preguntas_tipo: '',
        id_catalogo_encuestas_preguntas_parametro_clasificacion: '',
        pregunta: '',
        puntos_maximos: 0
    })

    return (
        <div className="container">
            <div>
                <p className="fw-bold">Edicion de Encuesta</p>
            </div>
            <div className="row">
                <div className="col-3">
                    <button className="btn btn-primary" onClick={handleShowMNuevoParametro}>Agregar Parametros</button>
                </div>
                <div className="col-3">
                    <button className="btn btn-primary" onClick={handleShowMNuevaPregunta}>Agregar Pregunta</button>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                Se iran agregando las preguntas
            </div>
            <ModalNuevoParametro show={showModalNuevoParametro} handleClose={handleCloseMNuevoParametro}></ModalNuevoParametro>
            <ModalNuevaPregunta show={showModalNuevaPregunta} handleClose={handleCloseMNuevaPregunta}></ModalNuevaPregunta>
        </div>
    )
}


export default CreacionEncuesta;