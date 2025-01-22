import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
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
    const [searchParams] = useSearchParams();
    const idHijo = searchParams.get("id_hijo");

    const [encuesta,setEncuesta] = useState(null);
    
    const [listaTotales,setListaTotales] = useState([]);
    
    const updateListaTotales = (totalPorParametro) => {
        setListaTotales(prevState => {
            const existingIndex = prevState.findIndex(item => item.pregunta === totalPorParametro.pregunta);
            console.log(existingIndex);

            if (existingIndex !== -1) {
                // Si existe, actualiza el objeto con la misma `pregunta`
                const nuevaListaTotales = [...prevState];
                nuevaListaTotales[existingIndex] = totalPorParametro;
                return nuevaListaTotales;
            } else {
                // Si no existe, agrega un nuevo objeto
                return [...prevState, totalPorParametro];
            }
        });
    }

    const totalPorParametros = listaTotales.reduce((acc, item) => {
        // Si el parámetro es null, usar un valor especial como 'null' o '0' para agruparlos
        const key = item.parametro === null ? 'null' : item.parametro;
      
        // Si ya existe el parámetro, sumar el total
        if (acc[key]) {
          acc[key] += item.total;
        } else {
          // Si no existe, inicializar el parámetro con el total
          acc[key] = item.total;
        }
      
        return acc;
      }, {});

    const getEsrudioSocioeconomico = () => {
        
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}/encuesta${idHijo && '?id_hijo='+idHijo}`,config).then((resp)=>{
            setEncuesta(resp.data);
            console.log(resp.data);
        }).catch((resp)=>{
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }
    
    const getEsrudioSocioeconomicoPDF = () => {
        const config_pdf = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            responseType: 'blob'
        }
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}/pdf${idHijo && '?id_hijo='+idHijo}`,config_pdf).then((resp)=>{

            const pdfBlob = new Blob([resp.data], { type: 'application/pdf' });

            // Crea una URL temporal
            const url = URL.createObjectURL(pdfBlob);

            // Crea un enlace de descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = `estudio_${idEstudio}.pdf` || 'estudio.pdf';
            document.body.appendChild(link);
            link.click();

            // Limpia el DOM
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }).catch((resp)=>{
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    const totalPuntosParametros = () => {
        return encuesta?.parametros 
        ? encuesta.parametros.reduce((total, parametro) => {
            const valor = parseInt(parametro.puntos.valor, 10);
            return total + (Number.isFinite(valor) ? valor : 0);
        }, 0)
        : 0;
    }
    const grandTotalPuntosParametros = () => {
        return encuesta?.parametros 
        ? encuesta.parametros.reduce((total, parametro) => {
            const valor = parseInt(parametro.puntos_maximo, 10);
            return total + (Number.isFinite(valor) ? valor : 0);
        }, 0)
        : 0;
    }

    const porcentajeSugerido = () => {
        const puntos = totalPuntosParametros();
        const total_puntos = grandTotalPuntosParametros();

        const porcentaje = total_puntos > 0 ? (puntos*100) / total_puntos : 0 ;


        const bloquesDe20 = Math.floor(porcentaje / 20);
    
        // Calculamos el descuento: cada bloque de 20% equivale a un 5% de descuento
        const descuento = bloquesDe20 * 5;
    
        // Aseguramos que el descuento máximo sea 25%
        return Math.min(descuento, 25)+'%';
    }

    useEffect(() => {
        getEsrudioSocioeconomico();
    },[])

    const estudioPortada = () => {
        return(
            <div className="row mb-4">
                <div className="col-md-2"/>
                <div className="col-md-8 m-2 border border-secondary">
                    <div className="text-center">
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <h5>SINERGIA EN ESTUDIOS SOCIOECONÓMICOS</h5>
                        <br/>
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
            </div>)
    }

    const estudioResultado = () => {
        return (
            <div className="row mb-4">
                <div className="col-md-2"/>
                <div className="col-md-8 m-2 border border-secondary">
                    <br/>
                    <br/>
                    <br/>
                    <div className="text-center">
                        <p className="text-uppercase fw-bolder mt-5">COMENTARIO DEL ENTREVISTADOR</p>
                        <br/>
                        <div className="row">
                            <div className="col-1"/>
                            <div className="col-2 fw-bolder text-start">CLASIFICACION</div>
                            <div className="col border-bottom border-dark">&nbsp;</div>
                            <div className="col-1"/>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-1"/>
                            <div className="col-10 text-start">OBSERVACION</div>
                            <div className="col-1"/>
                            <div className="col-1"/>
                            <div className="col-10 border border-dark" style={{minHeight:'300px'}}></div>
                            <div className="col-1"/>
                        </div>
                        <br/>
                        
                        <div className="row">
                            <div className="col-3"/>
                            <div className="col-6 pb-2 pt-2 mb-4">
                                <div className="text-center text-uppercase">{encuesta?.estudio?.cliente?.nombre && encuesta.estudio.cliente.nombre}</div>
                                {encuesta?.hijo?.nombre && (<div className="text-center text-uppercase">{encuesta.hijo.nombre}</div>)}
                                {puntosPorParametros()}
                                
                                <div className="row mt-3">
                                    <div className="col-1"></div>
                                    <div className="col-6 text-start text-uppercase">
                                        PUNTUACION TOTAL
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-2 text-center text-uppercase border-bottom border-secondary">
                                        {totalPuntosParametros()}
                                    </div>
                                    <div className="col-1"></div>
                                </div>
                            </div>
                        </div>



                        <div className="row">
                            <div className="col"/>
                            <div className="col-3 d-flex">
                                <div className="w-75 text-start">
                                PORCENTAJE<br/>SUGERIDO
                                </div>
                                <div className="w-25 border border-dark d-flex align-items-center justify-content-center ">
                                {porcentajeSugerido()}
                                </div>
                            </div>
                            <div className="col-1"/>
                            <div className="col-3 d-flex mt-2 mt-md-0">
                                <div className="w-75 text-start">
                                PORCENTAJE<br/>OTORGADO
                                </div>
                                <div className="w-25 border border-dark d-flex align-items-center justify-content-center ">
                                    {encuesta?.estudio?.porcentaje_otorgado && encuesta.estudio.porcentaje_otorgado+'%'}
                                </div>
                            </div>
                            <div className="col"/>
                        </div>
                        <br/>
                    </div>
                    <br/>
                    <br/>
                </div>
            </div>
            )
    }

    const puntosPorParametros = () => {
        return(
            <div> 
                {encuesta?.parametros && encuesta.parametros.map((parametro, index) => (
                    <div key={'epil-'+index} className="row mt-3">
                        <div className="col-1"></div>
                        <div className="col-6 text-start text-uppercase">
                            {parametro.nombre}
                        </div>
                        <div className="col-1"></div>
                        <div className="col-2 text-center text-uppercase border-bottom border-secondary">
                            {parametro.puntos.valor}
                        </div>
                        <div className="col-1"></div>
                    </div>
                )) }
            </div>
        )
    }
    return (
        <div className="container mt-3" style={{overflowX:'auto'}}>
        <div className="row">
            <div className="col-sm-6">
                <Link className="btn btn-light btn-sm" to={`/`}> 
                    <div className="d-flex align-items-center">
                        <ion-icon name="arrow-back-outline"></ion-icon> Regresar
                    </div>
                </Link>
            </div>
            <div className="col-sm-6 ">
                <div className="d-flex flex-row-reverse bd-highlight">
                
                <Button className="btn btn-light btn-sm" onClick={ () => getEsrudioSocioeconomicoPDF() }> 
                    <div className="d-flex align-items-center">
                        PDF
                    </div>
                </Button>
                </div>
            </div>
        </div>
        <hr/>
            <div style={{minWidth:'800px'}}>
            {estudioPortada()}
            {estudioResultado()}
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
                            <RespuestasVista 
                                idPregunta={pregunta.id}
                                idPreguntaTipo={pregunta.id_catalogo_encuestas_preguntas_tipo} 
                                Respuestas={pregunta.respuestas} 
                                updateListaTotales={updateListaTotales}
                                totalPorParametros={totalPorParametros}
                                idParametro={pregunta.id_catalogo_encuestas_preguntas_parametro_clasificacion}
                            />
                        </div>
                    )
                    )}
                </div>
            </div>
            </div>
        </div>
    )
}