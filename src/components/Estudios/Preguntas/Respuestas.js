import { useState,useEffect,useRef  } from "react";
import { Button,Form, Modal } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export default function Respuestas({idEstudio,idPregunta,longitudRespuesta,idPreguntaTipo}) {

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [formData, setFormData] = useState([]);


    const longitudTexto = (text = '',longitud = 0) => {
        const dif = longitud - text.length;
        const porcentaje = longitud ? ((dif / longitud) * 100) : 0;
        let color = '#212529';
        if(porcentaje < 10 ){
            color = '#ffb427';
        }
        if(porcentaje < 5 ){
            color = '#d50000';
        }
        return <span style={{color:color}}>{text.length + '/' + longitud + 'letras'}</span>;
    }

    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }

    const textChange = (e,index) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        const texto = convertirAMayusculas(e.target.value);
        /*setFormData(prevState => ({
            ...prevState,
            texto: texto
        }));*/
        
        console.log(formData);
        setFormData((prevState) => {
            const newState = [...prevState];
            newState[index] = {
                ...newState[index],
                respuesta: texto
            };
            return newState;
        });
        console.log(formData);

        setTimeout(() => {
            e.target.setSelectionRange(start, end);
        }, 0);
    };
    

    const formInputChange = (e,index) => {

        var {name, value, type, checked } = e.target;
        let updatedValue = type === 'checkbox' ? checked : name === 'email' ? value :  convertirAMayusculas(value);
    
        setFormData((prevState) => {
            const newState = [...prevState];
            newState[index] = {
                ...newState[index],
                [name]: updatedValue
            };
            return newState;
        });
    };
    const save = () => {
        const fromData = {id_catalogo_encuestas_preguntas_tipo:idPreguntaTipo,respuestas:formData};
        axios.post(`${APIURL}/estudio/respuestas`,fromData,config).then((resp)=>{
            getListaRespuestas();
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    // 7 sumatoria totoal
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
    //ref
    const padreRefs = useRef([]);
    const madreRefs = useRef([]);
    const montoRefs = useRef([]);
    
    const tipoRefs          = useRef([]);
    const marcaModeloRefs   = useRef([]);
    const anioRefs          = useRef([]);
    const propietarioRefs   = useRef([]);

    const handleKeyDown = (e, index, refArray) => {
        if (e.key === 'Enter') {
        e.preventDefault();
        // Si no es el último elemento, enfoca el siguiente input de la misma columna
        if (index < refArray.current.length - 1) {
            refArray.current[index + 1].focus();
        }
        }
    };
    // 1 .-  Pregunta abierta
    const preguntaAbierta = () => {

        if ( !Array.isArray(formData) || !formData[0] || formData[0].respuesta === undefined) {
            return '';
        }

        return formData.map((item,index) => {
            return (
            <div key={'pes-'+idPregunta+'-'+index}>
                <div>
                    {longitudTexto(item.respuesta,longitudRespuesta)}
                </div>
                <div>
                    <textarea
                        value={item.respuesta}
                        onChange={(e) => {textChange(e,index)}}
                        maxLength={longitudRespuesta}
                        style={{
                            width: '100%',
                            height: '200px',
                            padding: '5px',
                            lineHeight: '1.55', // Espacio entre líneas
                            backgroundImage: `linear-gradient(to bottom, transparent 95%, lightgray 5%)`, // Fondo con líneas
                            backgroundSize: '100% 20px', // Tamaño del patrón de líneas
                            resize: 'none', // Evita cambiar el tamaño del textarea
                            border: '1px solid lightgray',
                            borderRadius: '4px',
                        }}
                    />
                </div>
            </div>
        )}
        )
    }
    // 2 .-  Lista selección múltiple
    // 3 .-  Antigüedad en colegio
    // 4 .-  Número de Hijos
    // 5 .-  Orfandad
    // 6 .-  Dependientes Económicos
    const dependientesEconomicamente = () => {
        return (
            <div>
            <div className="row">
                <div className="col-sm-2"></div>
                <div className="col-sm-3 p-1">PARENTESCO</div>
                <div className="col-sm-3 p-1">NOMBRE</div>
            </div>
            {formData.map((item,index) => (
            <div  key={'pes-'+idPregunta+'-'+index}  className="row text-start">
                <div className="col-sm-2"></div>
                <div className="col-sm-3 p-1">
                    <input
                        className="form-control form-control-sm"
                        name="parentesco" 
                        key={`parentesco-${index}`}
                        ref={(el) => (padreRefs.current[index] = el)}
                        onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                        value={item.parentesco}
                        onChange={(e) => {formInputChange(e,index)}}
                    />
                </div>
                <div className="col-sm-3 p-1">
                    <input
                        className="form-control form-control-sm"
                        name="nombre" 
                        key={`nombre-${index}`}
                        ref={(el) => (madreRefs.current[index] = el)}
                        onKeyDown={(e) => handleKeyDown(e, index, madreRefs)}
                        value={item.nombre}
                        onChange={(e) => {formInputChange(e,index)}}
                    />
                </div>
            </div>
            ))}
            </div>
        )
    }
    // 7 .-  Económicamente activo
    const familiaEconomicameteActiva = ()=>{

        return (
            <div>
                
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-2">VIVE</div>
                    <div className="col-sm-3">ACTIVO LABORALEMNTE</div>
                    <div className="col-sm-5">EMPRESA</div>
                </div>
                
                {formData.map((item,index) => (
                    <div key={'pes-'+idPregunta+'-'+index} className="row">
                        <div className="col-sm-2">{item.texto}</div>
                        { item.texto=== 'OTRO' ? (<div className="col-sm-2 p-1"></div>):(
                        <div className="col-sm-2 p-1">
                            <div className="row">
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        role="switch"
                                        name="vive"
                                        checked={item.vive}
                                        onChange={(e) => {formInputChange(e,index)}}
                                        id="vive"/>
                                    <label className="form-check-label">{(item.vive) ? 'Si' : 'No'}</label>
                                </div>
                            </div>
                        </div>
                        )}
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input"  
                                        type="checkbox" 
                                        role="switch"
                                        name="activo"
                                        checked={item.activo}
                                        disabled={item.texto=== 'OTRO' ? false : !item.vive}
                                        onChange={(e) => {formInputChange(e,index)}}
                                        id="activo"/>
                                    <label className="form-check-label">{(item.activo) ? 'Si' : 'No'}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5 p-1">
                            <input
                                className="form-control"
                                name="respuesta" 
                                disabled={!item.activo}
                                value={item.respuesta}
                                onChange={(e) => {formInputChange(e,index)}}
                            ></input>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
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
            
            {formData.map((item,index) => (
                    <div key={'pes-'+idPregunta+'-'+index} className="row text-start">
                        <div className="col-sm-3 p-1"><div>{item.texto}</div></div>
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10">
                                    <input
                                        className="form-control form-control-sm"
                                        name="padre_monto" 
                                        key={`padre_monto-${index}`}
                                        ref={(el) => (padreRefs.current[index] = el)}
                                        onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                                        value={item.padre_monto}
                                        onChange={(e) => {formInputChange(e,index)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10">
                                    <input
                                        className="form-control form-control-sm"
                                        name="madre_monto" 
                                        key={`madre_monto-${index}`}
                                        ref={(el) => (madreRefs.current[index] = el)}
                                        onKeyDown={(e) => handleKeyDown(e, index, madreRefs)}
                                        value={item.madre_monto}
                                        onChange={(e) => {formInputChange(e,index)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10">
                                    <input
                                        className="form-control form-control-sm"
                                        name="monto" 
                                        key={`monto-${index}`}
                                        ref={(el) => (montoRefs.current[index] = el)}
                                        onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                                        value={item.monto}
                                        onChange={(e) => {formInputChange(e,index)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
            ))}
            <div className="row text-start">
                <div className="col-sm-3 p-1"><div><b>SUB TOTAL</b></div></div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10 text-right">
                                {sumaTotalporCampo('padre_monto')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10 text-right">
                                {sumaTotalporCampo('madre_monto')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10 text-right">
                                {sumaTotalporCampo('monto')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3 p-1"><div><b>TOTAL</b></div></div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10">
                                {sumaTotales()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*<div className="row text-start">
                <div className="col-sm-3">
                    <input type="text"/>
                </div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>*/}
            </div>
        )
    }
    // 9 .-  Ahorro
    // 10 .-  Inversiones
    // 11 .-  Vehículos
    const preguntaVeiculos = ()=>{
        return (
            <div>
                <div className="row">
                    <div className="col-sm-3">TIPO</div>
                    <div className="col-sm-3">MARCA / MODELO</div>
                    <div className="col-sm-1">AÑO</div>
                    <div className="col-sm-3">PROPIETARIO</div>
                    <div className="col-sm-2">VALOR APROXIMADO</div>
                </div>
                {formData.map((item,index) => (
                <div  key={'pes-'+idPregunta+'-'+index} className="row">
                    
                    <div className="col-sm-3 p-1">
                        <input
                            className="form-control form-control-sm"
                            name="tipo" 
                            key={`tipo-${index}`}
                            ref={(el) => (tipoRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, tipoRefs)}
                            value={item.tipo}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                    <div className="col-sm-3 p-1">
                        <input
                            className="form-control form-control-sm"
                            name="marca_modelo" 
                            key={`marca_modelo-${index}`}
                            ref={(el) => (marcaModeloRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, marcaModeloRefs)}
                            value={item.marca_modelo}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                    <div className="col-sm-1 p-1">
                        <input
                            className="form-control form-control-sm"
                            name="anio" 
                            key={`anio-${index}`}
                            ref={(el) => (anioRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, anioRefs)}
                            value={item.anio}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                    <div className="col-sm-3 p-1">
                        <input
                            className="form-control form-control-sm"
                            name="propietario" 
                            key={`propietario-${index}`}
                            ref={(el) => (propietarioRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, propietarioRefs)}
                            value={item.propietario}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                    <div className="col-sm-2 p-1">
                        <input
                            className="form-control form-control-sm"
                            name="monto" 
                            key={`monto-${index}`}
                            ref={(el) => (montoRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                            value={item.monto}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                </div>
                ))}
                
                <div className="row">
                    <div className="col-sm-3"><b>TOTAL:</b></div>
                    <div className="col-sm-3 p-1 text-start">
                        <div className="border-bottom border-secondary">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10 text-right">
                                    {sumaTotalporCampo('monto')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // 12 .-  Propiedades Hipotecarias / casa Habitacion
    const casaHabitacion = () => {
        return (
            <div className="row">
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'vivienda' && (                    
                        <div  key={'pes-'+idPregunta+'-'+index} className="row col-12">
                            <div className="row col-md-6 text-start">
                                <div className="col-sm-6 p-1 text-start">{item.texto}</div>
                                <div className="col-sm-6 p-1">
                                    <div className="row">
                                        <div className="col-1"></div>
                                        <div className="col-10">
                                            <input
                                                className="form-control form-control-sm"
                                                name="respuesta" 
                                                value={item.respuesta}
                                                onChange={(e) => {formInputChange(e,index)}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                })}
                
                <div className="row col-12">
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'valor' && (
                        <div key={'pes-'+idPregunta+'-'+index} className="row col-md-6 text-start">
                            <div className="col-sm-6 p-1 text-start">{item.texto}</div>
                            <div className="col-sm-6 p-1 text-start">
                                <div className="row">
                                    <div className="col-1">$</div>
                                    <div className="col-10">
                                        <input
                                            className="form-control form-control-sm"
                                            name="monto" 
                                            value={item.monto}
                                            onChange={(e) => {formInputChange(e,index)}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                })}
                </div>

                <div className="row col-12 mt-4">
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'header_otros' && (
                    <div key={'pes-'+idPregunta+'-'+index}  className="col-12 p-1 text-start">
                        {item.texto}
                    </div>
                    )
                })}
                </div>
                
                <div className="row col-12">
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'body_otros' && (
                        <div key={'pes-'+idPregunta+'-'+index} className="row col-md-12 text-start">                            
                            <div className="col-sm-9 p-1">
                                <input
                                    className="form-control"
                                    name="respuesta" 
                                    value={item.respuesta}
                                    onChange={(e) => {formInputChange(e,index)}}
                                />
                            </div>
                            <div className="col-sm-3 p-1 text-start">
                                <div className="row">
                                    <div className="col-1">$</div>
                                    <div className="col-10">
                                        <input
                                            className="form-control form-control-sm"
                                            name="monto" 
                                            value={item.monto}
                                            onChange={(e) => {formInputChange(e,index)}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                })}
                </div>
                
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start"><b>B) TOTAL:</b></div>
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                    </div>
                </div>
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start"><b>A +B TOTAL:</b></div>
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                    </div>
                </div>
            </div>
        )
    }
    // 13 .-  Distribución de la casa
    const distrubucionDeLaCasa = () => {
        return (
            <div className="row">
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        COCHERA AUTOS
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        PATIO
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        SALA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        COMEDOR
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        COCINA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        RECAMARAS
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        BAÑOS
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        PANTALLA DE TV
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        REFRIGERADOR
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        PARRILLA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        LAVADORA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        SECADORA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        CUARTO DE LAVANDERIA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        CUARTO DE SERVICIO
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        RECIBIDOR
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        ESTANCIA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        JARDIN
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        JUEGOS
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        MINISPLIT
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        ESTUDIO
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        BODEGA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        ROOF GARDEN
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        ALBERCA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        CUARZO
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        MARMOL
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        GRANITO
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        AREA SOCIAL
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        CANTERA
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        PANELES SOLARES
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        CLIMA CENTRAL
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        GIMNASIO
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-sm-3">
                    <div className="col-8 p-1 text-start">
                        CUARZO
                    </div>
                    <div className="col-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-12">
                    <div className="col-sm-3 p-1 text-start">
                        CLASIFICACION
                    </div>
                    <div className="col-sm-9 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-12">
                    <div className="col-sm-3 p-1 text-start">
                        DESCRIBIR LO OBSERVADO
                    </div>
                    <div className="col-sm-9 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-12">
                    <div className="col-sm-12 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row col-12">
                    <div className="col-sm-12 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
            </div>
        )
    }
    // 14 .-  Deudas
    const deudasMensuales = () => {
        return (
            <div>
            <div className="row">
                <div className="col-sm-4 p-1">CONCEPTO</div>
                <div className="col-sm-4 p-1">MENSUALIDAD</div>
                <div className="col-sm-4 p-1">SALDO</div>
            </div>
            
            {formData.map((item,index) => (
                <div key={'pes-'+idPregunta+'-'+index} className="row  text-start">
                    <div className="col-sm-4 p-1">
                        {item.texto}
                    </div>
                    <div className="col-sm-4 p-1">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10">
                                <input
                                    className="form-control form-control-sm"
                                    name="padre_monto" 
                                    key={`padre_monto-${index}`}
                                    ref={(el) => (padreRefs.current[index] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                                    value={item.padre_monto}
                                    onChange={(e) => {formInputChange(e,index)}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4 p-1">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10">
                                <input
                                    className="form-control form-control-sm"
                                    name="monto" 
                                    key={`monto-${index}`}
                                    ref={(el) => (montoRefs.current[index] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                                    value={item.monto}
                                    onChange={(e) => {formInputChange(e,index)}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )
    }
    // 15 .-  Gastos familiares
    const gastosFamiliaresMensuales = () => {
        return (
            <div className="row  text-start">
                 {formData.map((item,index) => (
                    
                <div key={'pes-'+idPregunta+'-'+index} className="row col-sm-6">
                    <div className="col-6 p-1">
                        {item.texto}
                    </div>
                    <div className="col-6 p-1">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10">
                                <input
                                    className="form-control form-control-sm"
                                    name="padre_monto" 
                                    key={`padre_monto-${index}`}
                                    ref={(el) => (padreRefs.current[index] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                                    value={item.padre_monto}
                                    onChange={(e) => {formInputChange(e,index)}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        )
    }
    // 16 .-  Situación Especial
    // 17 .-  Cursos cicles escolares
    // 18 .-  Salto de Hoja
    // 19 .-  Espacio en blanco
    // 20 .- Actualemte con empleo
    const actualmenteConEmpleo = ()=>{
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-3">ACTIVO LABORALEMNTE</div>
                    <div className="col-sm-5">EMPRESA</div>
                </div>
                <div className="row">
                    <div className="col-sm-2">PADRE</div>
                    <div className="col-sm-3 p-1">
                        <div className=" row">
                            <div className="col-3">SI</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                            <div className="col-3">NO</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                        </div>
                    </div>
                    <div className="col-sm-5 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-2">MADRE</div>
                    <div className="col-sm-3 p-1">
                        <div className=" row">
                            <div className="col-3">SI</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                            <div className="col-3">NO</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                        </div>
                    </div>
                    <div className="col-sm-5 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-2">OTRO</div>
                    <div className="col-sm-3 p-1">
                        <div className=" row">
                            <div className="col-3">SI</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                            <div className="col-3">NO</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                        </div>
                    </div>
                    <div className="col-sm-5 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
            </div>
        )
    }
    const getListaRespuestas = () => {
        
        axios.get(`${APIURL}/estudio/${idEstudio}/pregunta/${idPregunta}/respuestas`,config)
        .then((resp)=>{
            const data = resp.data;

            if(data.length){
                setFormData(data);
            }else{
                defaultValue()
            }

        }).catch((resp)=>{
            console.log(resp);
        })
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
    useEffect(() => {
        //idPregunta,longitudRespuesta,idPreguntaTipo
        getListaRespuestas();
    },[])
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
            <div className="col-md-8">
                Seccion Preguntas ID: {idPregunta} Tipo {idPreguntaTipo}
                <br/><br/>
            </div>
            <div className="col-md-8">
                {preguntaPorTipoPregunta()}
            </div>
            
            <div className="col-md-8">
                
                <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center" onClick={() => save()}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}