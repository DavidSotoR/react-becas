import { useState } from "react";

function CreacionEncuesta() {
    const [ allPreguntas, setAllPreguntas ] = useState([])
    const [ allPreguntasTipo, setAllPreguntasTipo ] = useState([])
    const [ postDataPregunta,setPostDataPregunta ] = useState({})

    return (
        <div className="container">
            <div>
                <p className="fw-bold">Edicion de Encuesta</p>
            </div>
            <div className="row">
                <col className="col">
                    
                </col>
            </div>
            <hr></hr>
            <div className="row">
                Se iran agregando las preguntas
            </div>
        </div>
    )
}


export default CreacionEncuesta;