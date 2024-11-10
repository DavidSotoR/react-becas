import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import RespuestasVista from "../Estudios/Preguntas/RespuestasVista";

export default function Estudio(){

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const { idEstudio } = useParams();

    const [encuesta,setEncuesta] = useState(null)

    const getEsrudioSocioeconomico = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}/encuesta`,config).then((resp)=>{
            setEncuesta(resp.data);
            console.log(resp.data);
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    useEffect(() => {
        getEsrudioSocioeconomico();
    })
    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">
                    <div className="text-center">
                        <h5>SINERGIA EN ESTUDIOS SOCIOECONÓMICOS</h5>
                        <hr/>
                        <p className="text-uppercase mt-5">ESTUDIO SOCIOECONÓMICO PARA BECA CICLO {encuesta?.proyecto?.nombre && encuesta.proyecto.nombre}</p>
                        <br/>
                        <p className="text-uppercase">{encuesta?.estudio?.cliente?.nombre && encuesta.estudio.cliente.nombre}</p>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <p>RESULTADO CONFIDENCIAL</p>
                        <br/>
                        <p>FAMILIA</p>
                        <br/>
                        <div className="row">
                            <div className="col-2"></div>
                            <div className="col-8"><div>{encuesta?.estudio?.candidato && encuesta.estudio.candidato}</div><hr/></div>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <p><i>EL COLEGIO ES RESPONSABLE DE LA INFORMACIÓN Y CONTENIDO DEL PRESENTE ESTUDIO</i></p>
                    </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">
                    <div className="text-center">
                        <div className="row">
                            <div className="col"/>
                            <div className="col-12 col-md-3 d-flex">
                                <div className="w-75 text-start">
                                    PUNTUACION<br/>TOTAL
                                </div>
                                <div className="w-25 border border-dark"></div>
                            </div>
                            <div className="col-1"/>
                            <div className="col-12 col-md-3 d-flex mt-2 mt-md-0">
                                <div className="w-75 text-start">
                                    PORCENTAJE<br/>SUGERIDO
                                </div>
                                <div className="w-25 border border-dark"></div>
                            </div>
                            <div className="col"/>
                        </div>
                        <hr/>
                        <p className="text-uppercase fw-bolder mt-5">COMENTARIO DEL ENTREVISTADOR</p>
                        <br/>
                        <div className="row">
                            <div className="col-md-2 fw-bolder text-start">CLASIFICACION</div>
                            <div className="col border-bottom border-dark">&nbsp;</div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-12 text-start">OBSERVACION</div>
                            <div className="col border border-dark" style={{minHeight:'300px'}}></div>
                        </div>
                        <br/>
                    </div>
                    <br/>
                    <br/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">
                    <p className="text-uppercase text-center fw-bolder mt-5">ESTUDIO SOCIOECONÓMICO PARA BECA</p>
                    <p className="text-uppercase text-center fw-bolder">{encuesta?.estudio?.cliente?.nombre && encuesta.estudio.cliente.nombre}</p>
                    <br/>
                    <br/>
                    {encuesta!==null && encuesta.preguntas.map((pregunta,index) => (
                        <div key={'epi-'+index} className="mt-3 mb-3">
                            <div className="pt-5">
                                <p style={{fontSize:'1rem'}} className="text-uppercase fw-bolder">{pregunta.numero_pregunta}.- {pregunta.pregunta}</p>
                            </div>
                            <RespuestasVista idPreguntaTipo={pregunta.id_catalogo_encuestas_preguntas_tipo} Respuestas={pregunta.respuestas} ></RespuestasVista>
                        </div>
                    )
                    )}
                </div>
            </div>
        </div>
    )
}