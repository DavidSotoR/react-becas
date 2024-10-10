import Respuestas from "./Respuestas"

export default function Preguntas({idEstudio,preguntas}) {

    return preguntas && preguntas.map((pregunta,index) => (<>
        <div  key={'ps-'+index} className="mt-1" >
            <div className="row">
                <div className="col-sm-8">
                    <h5>{pregunta?.numero_pregunta && pregunta.numero_pregunta+' - '} {pregunta.pregunta}</h5>
                </div>
            </div>
            
            <Respuestas 
                idEstudio={idEstudio}
                idPregunta={pregunta.id}
                idPreguntaTipo={pregunta.id_catalogo_encuestas_preguntas_tipo} 
                longitudRespuesta={pregunta.longitud_respuesta} 
                />

        </div>
    </>))
}