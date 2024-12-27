import { useState,useEffect,useRef  } from "react";
import { Button,Form, Modal } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export default function RespuestasVista({idEstudio,idPregunta,longitudRespuesta,idPreguntaTipo,colClass, Respuestas}) {

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [formData, setFormData] = useState(Respuestas);
 
    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }


    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  
    const sumaTotalporCampo = (campo) => {
        return formData.reduce((acc, item) => {
          const value = parseFloat(item[campo]);
          return acc + (isNaN(value) ? 0 : value); // Solo suma si es un número válido
        }, 0);
    }
    
    const  sumaTotales = () => {
        let total = 0
        total += sumaTotalporCampo('padre_monto');
        total += sumaTotalporCampo('madre_monto');
        total += sumaTotalporCampo('monto');
        return total;
    }

    const sumaTotalporCampoSeccion = (campo,seccion) => {
        return formData.reduce((acc, item) => {
            let value = 0;

            if(item['seccion'] === seccion){
                value = parseFloat(item[campo]);
            }

            return acc + (isNaN(value) ? 0 : value); 

        }, 0);
    }
    
    const  sumaTotalesSeccion = (seccion) => {
        let total = 0
        total += sumaTotalporCampoSeccion('padre_monto',seccion);
        total += sumaTotalporCampoSeccion('madre_monto',seccion);
        total += sumaTotalporCampoSeccion('monto',seccion);
        return total;
    }
    //ref
    const padreRefs = useRef([]);
    const madreRefs = useRef([]);
    const montoRefs = useRef([]);
    
    const tipoRefs          = useRef([]);
    const marcaModeloRefs   = useRef([]);
    const anioRefs          = useRef([]);
    const propietarioRefs   = useRef([]);

    // 1 .-  Pregunta abierta
    const preguntaAbierta = () => {

        if (!Array.isArray(formData) || !formData[0] || formData[0].respuesta === undefined) {
            return '';
        }

        return formData.map((item, index) => {
            return (
                <div key={'pes-' + idPregunta + '-' + index}>
                    <div>
                    </div>
                    <div
                        style={{
                            width: '100%',
                            height: '200px',
                            padding: '5px',
                            lineHeight: '1.55', // Espacio entre líneas
                            backgroundImage: `linear-gradient(to bottom, transparent 95%, lightgray 5%)`, // Fondo con líneas
                            backgroundSize: '100% 20px', // Tamaño del patrón de líneas
                            borderBottom: '1px solid lightgray', // Línea subrayada
                            whiteSpace: 'pre-wrap', // Para mantener saltos de línea
                            overflowWrap: 'break-word', // Para evitar desbordamiento de texto
                        }}
                    >
                        {item.respuesta ?? ''}
                    </div>
                </div>
            );
        });
    };
    // 2 .-  Lista selección múltiple
    // 3 .-  Antigüedad en colegio
    // 4 .-  Número de Hijos
    // 5 .-  Orfandad
    // 6 .-  Dependientes Económicos
    const dependientesEconomicamente = () => {
        return (
            <div>
                <div className="row">
                    <div className="col"/>
                    <div className="col-sm-3 p-1">PARENTESCO</div>
                    <div className="col-sm-3 p-1">NOMBRE</div>
                    <div className="col"/>
                </div>
                {formData.map((item, index) => (
                    <div key={'pes-' + idPregunta + '-' + index} className="row text-start">
                        <div className="col"/>
                        <div className="col-sm-3 p-1">
                            <div
                                style={{
                                    padding: '5px',
                                    borderBottom: '1px solid lightgray', // Línea subrayada
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {item.parentesco ?? ''}
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div
                                style={{
                                    padding: '5px',
                                    borderBottom: '1px solid lightgray', // Línea subrayada
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {item.nombre ?? ''}
                            </div>
                        </div>
                        <div className="col"/>
                    </div>
                ))}
            </div>
        );
    };
    // 7 .-  Económicamente activo
    const familiaEconomicameteActiva = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-2">VIVE</div>
                    <div className="col-sm-3">ACTIVO LABORALMENTE</div>
                    <div className="col-sm-5">EMPRESA</div>
                </div>
                
                {formData.map((item, index) => (
                    <div key={'pes-' + idPregunta + '-' + index} className="row">
                        <div className="col-sm-2">{item.texto}</div>
                        <div className="col-sm-2 p-1">
                            <span>{item.vive ? 'Sí' : 'No'}</span>
                        </div>
                        <div className="col-sm-3 p-1">
                            <span>{item.activo ? 'Sí' : 'No'}</span>
                        </div>
                        <div className="col-sm-5 p-1">
                            <div style={{
                                padding: '5px',
                                borderBottom: '1px solid lightgray',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {item.respuesta ?? '&nbsp;'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
        // 8 .-  Ingreso mensual
    const ingresoNetoMensual = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-3 p-1"></div>
                    <div className="col-sm-3 p-1">PADRE</div>
                    <div className="col-sm-3 p-1">MADRE</div>
                    <div className="col-sm-3 p-1">OTROS</div>
                </div>
                <br/>
                
                {formData.map((item, index) => (
                    <div key={'pes-' + idPregunta + '-' + index} className="row text-start">
                        <div className="col-sm-3 p-1"><div>{item.texto}</div></div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary text-end">
                                ${formatNumber(item.padre_monto) ?? ''}
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary text-end">
                                ${formatNumber(item.madre_monto) ?? ''}
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary text-end">
                                ${formatNumber(item.monto) ?? ''}
                            </div>
                        </div>
                    </div>
                ))}
                
                <div className="row text-start">
                    <div className="col-sm-3 p-1"><div><b>SUB TOTAL</b></div></div>
                    <div className="col-sm-3 p-1">
                        <div className="border-bottom border-secondary text-end">
                            ${formatNumber(sumaTotalporCampo('padre_monto'))}
                        </div>
                    </div>
                    <div className="col-sm-3 p-1">
                        <div className="border-bottom border-secondary text-end">
                            ${formatNumber(sumaTotalporCampo('madre_monto'))}
                        </div>
                    </div>
                    <div className="col-sm-3 p-1">
                        <div className="border-bottom border-secondary text-end">
                            ${formatNumber(sumaTotalporCampo('monto'))}
                        </div>
                    </div>
                </div>
                
                <div className="row text-start">
                    <div className="col-sm-3 p-1"><div><b>TOTAL</b></div></div>
                    <div className="col-sm-3 p-1">
                        <div className="border-bottom border-secondary text-end">
                            ${formatNumber(sumaTotales())}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    // 9 .-  Ahorro
    // 10 .-  Inversiones
    // 11 .-  Vehículos
    const preguntaVeiculos = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-3">TIPO</div>
                    <div className="col-sm-3">MARCA / MODELO</div>
                    <div className="col-sm-1">AÑO</div>
                    <div className="col-sm-3">PROPIETARIO</div>
                    <div className="col-sm-2">VALOR APROXIMADO</div>
                </div>
                {formData.map((item, index) => (
                    <div key={'pes-' + idPregunta + '-' + index} className="row">
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary">
                                {item.tipo || <>&nbsp;</>}
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary">
                                {item.marca_modelo || <>&nbsp;</>}
                            </div>
                        </div>
                        <div className="col-sm-1 p-1">
                            <div className="border-bottom border-secondary">
                                {item.anio || <>&nbsp;</>}
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary">
                                {item.propietario || <>&nbsp;</>}
                            </div>
                        </div>
                        <div className="col-sm-2 p-1 text-end">
                            <div className="border-bottom border-secondary">
                                {item.monto ? <>${formatNumber(item.monto)}</> : <>&nbsp;</>}
                            </div>
                        </div>
                    </div>
                ))}
                
                <div className="row">
                    <div className="col-sm-3"><b>TOTAL:</b></div>
                    <div className="col-sm-3 p-1 text-start">
                        <div className="border-bottom border-secondary">
                            <div className="row">
                                <div className="col-10 text-end">
                                    ${formatNumber(sumaTotalporCampo('monto'))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    const distrubucionDeLaCasa = () => {
        return (
            <div className="row">
                
                {formData.map((item, index) => {
                    return item?.seccion && item.seccion === 'seleccionable' && (
                        <div key={'pes-' + idPregunta + '-' + index} className="row col-sm-3">
                            <div className="col-8 p-1 text-start">
                                {item.texto}
                            </div>
                            <div className="col-4 p-1">
                                <div className="form-check form-switch">
                                    <span>{item.activo ? "Sí" : "No"}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                <div className="sol-12">
                    <br />
                </div>
                
                {formData.map((item, index) => {
                    return item?.seccion && item.seccion === 'clasificacion' && (
                        <div key={'pes-' + idPregunta + '-' + index} className="row col-12">
                            <div className="col-4 p-1 text-start">
                                {item.texto}
                            </div>
                            <div className="col-8 p-1">
                                <div className="border-bottom border-secondary">
                                    {item.respuesta || <>&nbsp;</>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {formData.map((item, index) => {
                    return item?.seccion && item.seccion === 'descripcion' && (
                        <div key={'pes-' + idPregunta + '-' + index} className="row col-12">
                            <div className="col-sm-3 p-1 text-start">
                                {item.texto}
                            </div>
                            <div className="col-sm-9 p-1">
                                <div className="border-bottom border-secondary" style={{ whiteSpace: 'pre-wrap', minHeight: '200px' }}>
                                    {item.respuesta || <>&nbsp;</>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    
    
    // 12 .- Propiedades Hipotecarias / casa Habitación
    const casaHabitacion = () => {
        return (
            <div className="row">
                {formData.map((item, index) => (
                    item?.seccion && item.seccion === 'vivienda' && (
                        <div key={'pes-'+idPregunta+'-'+index} className="row col-12">
                            <div className="row col-md-6 text-start">
                                <div className="col-sm-6 p-1 text-start">{item.texto}</div>
                                <div className="col-sm-6 p-1 border-bottom">{item.respuesta || <>&nbsp;</>}</div>
                            </div>
                        </div>
                    )
                ))}
    
                <div className="row col-12">
                    {formData.map((item, index) => (
                        item?.seccion && item.seccion === 'valor' && (
                            <div key={'pes-'+idPregunta+'-'+index} className="row col-md-6 text-start">
                                <div className="col-sm-6 p-1 text-start">{item.texto}</div>
                                <div className="col-sm-6 p-1 text-start">
                                    <div className="row">
                                        <div className="col-1">$</div>
                                        <div className="col-10 border-bottom text-end">{formatNumber(item.monto) || <>&nbsp;</>}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
    
                <div className="row col-12 mt-4">
                    {formData.map((item, index) => (
                        item?.seccion && item.seccion === 'header_otros' && (
                            <div key={'pes-'+idPregunta+'-'+index} className="col-12 p-1 text-start">
                                {item.texto}
                            </div>
                        )
                    ))}
                </div>
    
                <div className="row col-12">
                    {formData.map((item, index) => (
                        item?.seccion && item.seccion === 'body_otros' && (
                            <div key={'pes-'+idPregunta+'-'+index} className="row col-md-12 text-start">
                                <div className="col-sm-9 p-1 border-bottom">{item.respuesta || <>&nbsp;</>}</div>
                                <div className="col-sm-3 p-1 text-start">
                                    <div className="row">
                                        <div className="col-1">$</div>
                                        <div className="col-10 border-bottom text-end">{formatNumber(item.monto) || <>&nbsp;</>}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
    
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start"><b>B) TOTAL:</b></div>
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">${formatNumber(sumaTotalesSeccion('valor'))}</div></div>
                    </div>
                </div>
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start"><b>A + B TOTAL:</b></div>
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">${formatNumber((sumaTotalesSeccion('valor') + sumaTotalesSeccion('body_otros')))}</div></div>
                    </div>
                </div>
            </div>
        );
    };
    // 13 .- Distribución de la casa
    const distribucionDeLaCasa = () => {
        return (
            <div className="row">
                {formData.map((item, index) => {
                    return item?.seccion && item.seccion === 'seleccionable' && (
                        <div key={'pes-'+idPregunta+'-'+index} className="row col-sm-3">
                            <div className="col-8 p-1 text-start">{item.texto}</div>
                            <div className="col-4 p-1">
                                <div className="form-check form-switch">
                                    <span>{item.activo ? "Sí" : "No"}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="sol-12">
                    <br />
                </div>
                {formData.map((item, index) => {
                    return item?.seccion && item.seccion === 'clasificacion' && (
                        <div key={'pes-'+idPregunta+'-'+index} className="row col-12">
                            <div className="col-4 p-1 text-start">{item.texto}</div>
                            <div className="col-8 p-1">
                                <div className="border-bottom border-secondary">{item.respuesta || <>&nbsp;</>}</div>
                            </div>
                        </div>
                    );
                })}
                {formData.map((item, index) => {
                    return item?.seccion && item.seccion === 'descripcion' && (
                        <div key={'pes-'+idPregunta+'-'+index} className="row col-12">
                            <div className="col-sm-3 p-1 text-start">{item.texto}</div>
                            <div className="col-sm-9 p-1">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        padding: '5px',
                                        border: 'none',
                                        borderBottom: '1px solid #ced4da',
                                        overflowY: 'auto',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {item.respuesta || <>&nbsp;</>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };    
    // 14 .-  Deudas
    const deudasMensuales = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4 p-1">CONCEPTO</div>
                    <div className="col-sm-4 p-1">MENSUALIDAD</div>
                    <div className="col-sm-4 p-1">SALDO</div>
                </div>
                {formData.map((item, index) => (
                    <div key={'pes-'+idPregunta+'-'+index} className="row text-start">
                        <div className="col-sm-4 p-1">{item.texto}</div>
                        <div className="col-sm-4 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10 text-end border-bottom border-secondary">
                                    {formatNumber(item.padre_monto) ?? ''}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10 text-end border-bottom border-secondary">
                                    {formatNumber(item.monto) ?? ''}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    // 15 .-  Gastos familiares
    const gastosFamiliaresMensuales = () => {
        return (
            <div className="row text-start">
                {formData.map((item, index) => (
                    <div key={'pes-'+idPregunta+'-'+index} className="row col-sm-6">
                        <div className="col-6 p-1">{item.texto}</div>
                        <div className="col-6 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10 text-end border-bottom border-secondary">
                                    {formatNumber(item.padre_monto) ?? ''}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-12">
                    <div className="row text-start mt-2">
                        <div className="col-sm-3 p-1 text-start"><b>TOTAL:</b></div>
                        <div className="col-sm-3 p-1 text-start"><div className="border-bottom border-secondary  text-end">${formatNumber(sumaTotales())}</div></div>
                    </div>
                </div>
            </div>
        );
    };
    // 16 .-  Situación Especial
    // 17 .-  Cursos cicles escolares
    // 18 .-  Salto de Hoja
    // 19 .-  Espacio en blanco
    // 20 .- Actualemte con empleo
    const actualmenteConEmpleo = () => { 
        return (
            <div>
                <div className="row">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-3">ACTIVO LABORALMENTE</div>
                    <div className="col-sm-5">EMPRESA</div>
                </div>
                
                {formData.map((item, index) => (
                    <div key={'pes-' + idPregunta + '-' + index} className="row">
                        <div className="col-sm-3">{item.texto}</div>                
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="form-check form-switch">
                                    <span>{item.activo ? "Sí" : "No"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5 p-1">
                            <div className="border-bottom border-secondary">
                                {item.respuesta ?? '\u00A0' }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }


    const defaultValue = () => {
        switch(idPreguntaTipo){
            // 1 .-  Pregunta abierta
            case 1:

                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',}
                ]);
            break;
            case 6:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]);
            break;
            case 20:
            case 7:
                setFormData([
                    {id_encuesta:'',id_servicio_estudio:idEstudio,id_catalogo_encuestas_pregunta:idPregunta,id_item:'',parentesco:'',texto:'PADRE', respuesta:'', vive:false,activo:false,respuesta:'',padre_monto:'',madre_monto:'',monto:'',valor:'',tipo:'',marca_modelo:'',anio:'',propietario:'',},
                    {id_encuesta:'',id_servicio_estudio:idEstudio,id_catalogo_encuestas_pregunta:idPregunta,id_item:'',parentesco:'',texto:'MADRE', respuesta:'', vive:false,activo:false,respuesta:'',padre_monto:'',madre_monto:'',monto:'',valor:'',tipo:'',marca_modelo:'',anio:'',propietario:'',},
                    {id_encuesta:'',id_servicio_estudio:idEstudio,id_catalogo_encuestas_pregunta:idPregunta,id_item:'',parentesco:'',texto:'OTRO',respuesta:'', respuesta:'', vive:false,activo:false,padre_monto:'',madre_monto:'',monto:'',valor:'',tipo:'',marca_modelo:'',anio:'',propietario:'',}
                ]);
            break;
            case 8:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'INGRESO NETO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'BONOS DE DESPENSA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'VALES DE GASOLINA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'COMISIONES POR VENTAS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'AGUINALDO ',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'BONO DE PRODUCTIVIDAD',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'FONDO DE AHORRO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'UTILIDADES PRIMA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'VACACIONAL',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'RENTA QUE RECIBA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'AYUDA QUE RECIBA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]);
            break;
            case 11:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]);
            break;
            case 12:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'SITUACION DE LA VIVIENDA', seccion:'vivienda', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'MONTO DE LA RENTA O MENSUALIDAD', seccion:'valor', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'VALOR APROXIMADO', seccion:'valor', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'METROS DE CONTRUCCION', seccion:'construccion', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'METRO DE TERRENO', seccion:'construccion', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ESPESIFICAR SI CUENTA CON TROA CASA HABITACION, TERRENO, DEPARTAMENTO, LOCALES, ETC.', seccion:'header_otros', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'', seccion:'body_otros', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'', seccion:'body_otros', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'', seccion:'body_otros', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]);
            break;
            case 13:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PATIO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'SALA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'COMEDOR', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'COCINA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'RECAMARAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'BAÑOS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PANTALLA DE TV', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'REFRIGERADOR', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PARRILLA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'LAVADORA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'SECADORA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARTO DE LAVANDERIA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARTO DE SERVICIO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'RECIBIDOR', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ESTANCIA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'JARDIN', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'JUEGOS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'MINISPLIT', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ESTUDIO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'BODEGA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ROOF GARDEN', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ALBERCA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARZO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'MARMOL', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'GRANITO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'AREA SOCIAL', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CANTERA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PANELES SOLARES', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CLIMA CENTRAL', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'GIMNASIO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARZO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CLASIFICACION', seccion:'clasificacion', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'DESCRIBIR LO OBSERVADO', seccion:'descripcion', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]); 
            break;
            case 14:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CREDITO HIPOTECARIO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CREDITO AUTOMOTRIZ',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'TARJETAS DE CREDITO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'TARJETAS DEPARTAMENTALES',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PRESTAMOS PERSONALES/ NOMINA/ FAMILIARES',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]);
            break;
            case 15:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'ALIMENTACION Y DESPENSA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO GTS. MEDICOS MAYORES',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'ROPA Y CALZADO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO DE VIDA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'RENTA HIPOTECA CASA - HABITACION',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO DE CASA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'PREDIAL',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO DE AUTO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MTTO. Y SEGURIDAD FRACCIONAMIENTO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'CREDITO AUTOMOTRIZ',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SERVICIOS LUZ, AGUA, GAS, TELEFONO, INTERNET, TV. PAGA, CELULAR',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'GASOLINA Y TRANSPORTE',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MTTO. CASA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MTTO. AUTO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SERVICIO DOMESTICO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'VACACIONES (1 AÑO ATRAS)',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MASCOTAS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'DIVERCION CINE, RESTAURANTES, PASEOS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MEMBRESIA CLUB SOCIAL O DEPORTIVO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'AYUDA A PARIENTES',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'CONSULTAS, DOCTORES, MEDICAMENTOS, TRATAMIENTOS, ESPECIALISTAS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'CLASES / ACTIVIDADES EXTRACURRICULARES FUERA DEL COLEGIO (BALLET, FUTBOL, PINTURA, IDIOMAS, APOYO KUMOS, ETC.)',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'GASTOS DE EDUCACION INSCRIPCIONES, UNIFORMES, LIBROS, UTILES, SOCIEDAD DE PADRES, CUOTA DEPORTIVA, SEGURO, PLATAFORMAS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'GASTOS DE EDUCACION MENSUALIDAD, CLASE ESTRACURRICULAR DENTRO DEL COLEGIO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'TENENCIA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'OTRO (ESPECIFICAR)',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                
                ]);
            break;
            default:
                setFormData([]);
            break;
        }
    }

    const preguntaPorTipoPregunta = () => {
        switch(idPreguntaTipo){
            // 1 .-  Pregunta abierta
            case 1:
                return preguntaAbierta();
            break;
            // 2 .-  Lista selección múltiple
            // 3 .-  Antigüedad en colegio
            // 4 .-  Número de Hijos
            // 5 .-  Orfandad
            // 6 .-  Dependientes Económicos
            case 6:
                return dependientesEconomicamente();
            break;
            // 7 .-  Económicamente activo
            case 7:
                return familiaEconomicameteActiva();
            break;
            // 8 .-  Ingreso mensual
            case 8:
                return ingresoNetoMensual();
            break;
            // 9 .-  Ahorro
            // 10 .-  Inversiones
            // 11 .-  Vehículos
            case 11:
                return preguntaVeiculos();
            break;
            // 12 .-  Propiedades Hipotecarias  / casa Habitacion
            case 12:
                return casaHabitacion();
            break;
            // 13 .-  Distribución de la casa
            case 13:
                return distrubucionDeLaCasa();
            // 14 .-  Deudas
            case 14:
                return deudasMensuales();
            break;
            // 15 .-  Gastos familiares
            case 15:
                return gastosFamiliaresMensuales();
            break;
            // 16 .-  Situación Especial
            // 17 .-  Cursos cicles escolares
            // 18 .-  Salto de Hoja
            // 19 .-  Espacio en blanco
            // 20 .- Actualemte con empleo
            case 20:
                return actualmenteConEmpleo();
            break;
            
            
            default:
                return preguntaAbierta();
            break;
        }
    }
    return (
        <div className="row justify-content-md-center">
          
            <div className={colClass}>
                { formData && preguntaPorTipoPregunta()}
            </div>
            
        </div>
    )
}