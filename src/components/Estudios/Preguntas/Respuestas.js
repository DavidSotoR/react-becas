import { useState,useEffect,useRef  } from "react";
import { Button,Form, Modal } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export default function Respuestas({idEstudio,idPregunta,longitudRespuesta,idPreguntaTipo,colClass}) {

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [formData, setFormData] = useState([]);
    const [parametros, setParametros] = useState([]); 

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

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
      
    const numberChange = (e,index) => {

        var {name, value, selectionStart} = e.target;
        
        const regex = /^[0-9,]*$/;

        if(!regex.test(value)){
            return ''
        }

        let updatedValue = value.replace(/,/g, '');

        if (isNaN(updatedValue) && updatedValue === '') {
            return '';
        }
    
        setFormData((prevState) => {
            const newState = [...prevState];
            newState[index] = {
                ...newState[index],
                [name]: updatedValue
            };
            return newState;
        });
        const formattedValue = formatNumber(updatedValue); 
        e.target.value = formattedValue;
        // Calcular la nueva posición del cursor tomando en cuenta los separadores de miles
        const commasBeforeCursor = formattedValue.slice(0, selectionStart).split(',').length - 1;
        const newCursorPosition = selectionStart + commasBeforeCursor;
        e.target.setSelectionRange(newCursorPosition, newCursorPosition); 
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
                        value={item.respuesta ?? ''}
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
                <div className="col"/>
                <div className="col-sm-3 p-1">PARENTESCO</div>
                <div className="col-sm-3 p-1">NOMBRE</div>
                <div className="col"/>
            </div>
            {formData.map((item,index) => (
            <div  key={'pes-'+idPregunta+'-'+index}  className="row text-start">
                <div className="col"/>
                <div className="col-sm-3 p-1">
                    <input
                        className="form-control form-control-sm"
                        name="parentesco" 
                        key={`parentesco-${index}`}
                        ref={(el) => (padreRefs.current[index] = el)}
                        onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                        value={item.parentesco ?? ''}
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
                        value={item.nombre ?? ''}
                        onChange={(e) => {formInputChange(e,index)}}
                    />
                </div>
                <div className="col"/>
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
                                value={item.respuesta ?? ''}
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
                                        className="form-control form-control-sm text-end"
                                        name="padre_monto" 
                                        key={`padre_monto-${index}`}
                                        ref={(el) => (padreRefs.current[index] = el)}
                                        onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                                        value={formatNumber(item.padre_monto) ?? ''}
                                        onChange={(e) => {numberChange(e,index)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10">
                                    <input
                                        className="form-control form-control-sm text-end"
                                        name="madre_monto" 
                                        key={`madre_monto-${index}`}
                                        ref={(el) => (madreRefs.current[index] = el)}
                                        onKeyDown={(e) => handleKeyDown(e, index, madreRefs)}
                                        value={formatNumber(item.madre_monto) ?? ''}
                                        onChange={(e) => {numberChange(e,index)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10">
                                    <input
                                        className="form-control form-control-sm text-end"
                                        name="monto" 
                                        key={`monto-${index}`}
                                        ref={(el) => (montoRefs.current[index] = el)}
                                        onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                                        value={formatNumber(item.monto) ?? ''}
                                        onChange={(e) => {numberChange(e,index)}}
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
                            <div className="col-10 text-end">
                                {formatNumber(sumaTotalporCampo('padre_monto'))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10 text-end">
                                {formatNumber(sumaTotalporCampo('madre_monto'))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10 text-end">
                                {formatNumber(sumaTotalporCampo('monto'))}
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
                            <div className="col-10 text-end">
                                {formatNumber(sumaTotales())}
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
                            value={item.tipo ?? ''}
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
                            value={item.marca_modelo ?? ''}
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
                            value={item.anio ?? ''}
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
                            value={item.propietario ?? ''}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                    <div className="col-sm-2 p-1">
                        <input
                            className="form-control form-control-sm text-end"
                            name="monto" 
                            key={`monto-${index}`}
                            ref={(el) => (montoRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                            value={item.monto ?? ''}
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
                                <div className="col-10 text-end">
                                    {formatNumber(sumaTotalporCampo('monto'))}
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
                                                value={item.respuesta ?? ''}
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
                                            className="form-control form-control-sm text-end"
                                            name="monto" 
                                            value={item.monto ?? ''}
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
                                    value={item.respuesta ?? ''}
                                    onChange={(e) => {formInputChange(e,index)}}
                                />
                            </div>
                            <div className="col-sm-3 p-1 text-start">
                                <div className="row">
                                    <div className="col-1">$</div>
                                    <div className="col-10">
                                        <input
                                            className="form-control form-control-sm text-end"
                                            name="monto" 
                                            value={formatNumber(item.monto) ?? ''}
                                            onChange={(e) => {numberChange(e,index)}}
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
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">${formatNumber(sumaTotalesSeccion('valor'))}</div></div>
                    </div>
                </div>
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start"><b>A +B TOTAL:</b></div>
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">${formatNumber((sumaTotalesSeccion('valor')+sumaTotalesSeccion('body_otros')))}</div></div>
                    </div>
                </div>
            </div>
        )
    } 
    // 13 .-  Distribución de la casa
    
    const distrubucionDeLaCasaOptions = () => {
        return [<option key='sapt-0' value="">Seleccione la clasificacion</option>,...parametros.map((param) => (
            <option key={'sapt-'+param.id} value={`${param.valor}`} >
                { param.texto }
            </option>
        ))]
    }
    const distrubucionDeLaCasa = () => {
        return (
            <div className="row">
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'seleccionable' && (                 
                        <div  key={'pes-'+idPregunta+'-'+index} className="row col-sm-3">
                            <div className="col-8 p-1 text-start">
                                {item.texto}
                            </div>
                            <div className="col-4 p-1"> 
                            <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input"  
                                        type="checkbox" 
                                        role="switch"
                                        name="activo"
                                        checked={item.activo}
                                        onChange={(e) => {formInputChange(e,index)}}
                                        id="activo"/> 
                                    {/*<label className="form-check-label">{(item.activo) ? 'Si' : 'No'}</label>*/}
                                </div>
                            </div>
                        </div>
                        )
                })}
                <div className="sol-12">
                    <br/>
                </div>
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'clasificacion'  && (                 
                        <div  key={'pes-'+idPregunta+'-'+index} className="row col-12">
                            <div className="col-4 p-1 text-start">
                                {item.texto}
                            </div>
                            <div className="col-8 p-1"> 
                                {/*<input
                                    className="form-control"
                                    name="respuesta" 
                                    value={item.respuesta ?? ''}
                                    onChange={(e) => {formInputChange(e,index)}}
                                ></input>*/}

                                <select
                                    className="form-select form-control-sm" 
                                    name="respuesta"
                                    value={item.respuesta}
                                    onChange={(e) => {formInputChange(e,index)}}
                                >
                                    {distrubucionDeLaCasaOptions()}
                                </select>
                            </div>
                        </div>
                        )
                })}
                
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'descripcion' && (                 
                        <div  key={'pes-'+idPregunta+'-'+index} className="row col-12">
                                    
                        <div className="row col-12">
                            <div className="col-sm-3 p-1 text-start">
                            {item.texto}
                            </div>
                            <div className="col-sm-9 p-1">
                                
                            </div>
                        </div>
                            <div className="col-12 p-1 text-start">
                                
                            </div>
                            <div className="col-12 p-1"> 
                                
                                <textarea
                                    value={item.respuesta ?? ''}
                                    onChange={(e) => {textChange(e,index)}}
                                    maxLength={300}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        padding: '5px'
                                    }}
                                />
                            </div>
                        </div>
                        )
                })}
                
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
                                    className="form-control form-control-sm text-end"
                                    name="padre_monto" 
                                    key={`padre_monto-${index}`}
                                    ref={(el) => (padreRefs.current[index] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                                    value={item.padre_monto ?? ''}
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
                                    className="form-control form-control-sm text-end"
                                    name="monto" 
                                    key={`monto-${index}`}
                                    ref={(el) => (montoRefs.current[index] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                                    value={item.monto ?? ''}
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
                                    className="form-control form-control-sm text-end"
                                    name="padre_monto" 
                                    key={`padre_monto-${index}`}
                                    ref={(el) => (padreRefs.current[index] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, index, padreRefs)}
                                    value={item.padre_monto ?? ''}
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
                    <div className="col-sm-3"></div>
                    <div className="col-sm-3">ACTIVO LABORALEMNTE</div>
                    <div className="col-sm-5">EMPRESA</div>
                </div>
                
                {formData.map((item,index) => (
                    <div key={'pes-'+idPregunta+'-'+index} className="row">
                        <div className="col-sm-3">{item.texto}</div>                
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input"  
                                        type="checkbox" 
                                        role="switch"
                                        name="activo"
                                        checked={item.activo}
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
                                value={item.respuesta ?? ''}
                                onChange={(e) => {formInputChange(e,index)}}
                            ></input>
                        </div>
                    </div>
                ))}
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
    
    const getParametros = () => {
        let formData = config;
        formData.params = {id_catalogo_pregunta:idPregunta};
        axios.get(`${APIURL}/catalogos/encuestas/preguntas/${idPregunta}/parametros`,formData,config)
        .then(res => setParametros(res.data))
        .catch(err => console.log("Error al solisitar parametros de pregunta",err));
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
    useEffect(() => {
        //idPregunta,longitudRespuesta,idPreguntaTipo
        getListaRespuestas();
        if(idPreguntaTipo == 13){
            getParametros();
        }
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
            <div className={colClass}>
                Seccion Preguntas ID: {idPregunta} Tipo {idPreguntaTipo}
                <br/><br/>
            </div>
            <div className={colClass}>
                {preguntaPorTipoPregunta()}
            </div>
            
            <div className={"m-1 "+colClass}>
                
                <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center" onClick={() => save()}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}