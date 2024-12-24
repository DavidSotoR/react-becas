import { useEffect, useState } from "react";
import Respuestas from "./Respuestas"
import Puntos from "./Puntos";

export default function Preguntas({idEstudio,preguntas,parametros,columnRow,verPuntos,updateListaTotales,totalPorParametros}) {

    const [colClass,setColClass] = useState('col-8');

    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }
    const vista = () => {
        switch(columnRow){
            //Vista Larga
            case 'length':
                setColClass('col-md-12');
            break;
            //Vista Corta
            //short
            default:
                setColClass('col-md-8');
            break;
        }
    }
    
    useEffect(() => {
        vista();
    },[columnRow]);

    return preguntas && preguntas.map((pregunta,index) => (
        <div  key={'ps-i-'+index} className="mt-1" >
            <div className="row">
                <div className="col"/>
                <div className={colClass}>
                    <h5>{pregunta?.numero_pregunta && pregunta.numero_pregunta+' - '} {convertirAMayusculas(pregunta.pregunta)}</h5>
                </div>
                <div className="col"/>
            </div>

            {verPuntos === true && (
                <Puntos
                    parametros={parametros}
                    calsificacion={pregunta.id_catalogo_encuestas_preguntas_parametro_clasificacion}
                    longitudRespuesta={pregunta.longitud_respuesta}
                    colClass={colClass}
                />
            )}
            
            <Respuestas 
                idEstudio={idEstudio}
                idPregunta={pregunta.id}
                idPreguntaTipo={pregunta.id_catalogo_encuestas_preguntas_tipo} 
                idParametro={pregunta.id_catalogo_encuestas_preguntas_parametro_clasificacion}
                longitudRespuesta={pregunta.longitud_respuesta}
                updateListaTotales={updateListaTotales}
                totalPorParametros={totalPorParametros}
                colClass={colClass}
                />

        </div>
    ))
}