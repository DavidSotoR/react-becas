import { useState,useEffect,useRef  } from "react";
import { Button,Form, Modal } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export default function Respuestas({idEstudio,idPregunta,idParametro,longitudRespuesta,idPreguntaTipo,updateListaTotales,totalPorParametros,colClass}) {

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [formData, setFormData] = useState([]);
    const [parametros, setParametros] = useState([]); 

    const [preguntaParametroSumatoria, setPreguntaParametroSumatoria] = useState(0);
    
    const [parametrosPromedioAcademico, setParametrosPromedioAcademico] = useState([]); 
    const [parametrosPromedioConducta, setParametrosPromedioConducta] = useState([]); 

    const [totalPorParametro,setTotalPorParametro] = useState({pregunta:idPregunta,parametro:idParametro,total:0});

    const mostrarTotalParametro = () => {
        return totalPorParametros[idParametro] ? totalPorParametros[idParametro] : 0 ;
    }
    const mostrarTotalParametroID = (id_parametro) => {
        return totalPorParametros[id_parametro] ? totalPorParametros[id_parametro] : 0 ;
    }

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

    
    const setValueOption = (key,value,index) => {
        const texto = convertirAMayusculas(value);
        setFormData((prevState) => {
            const newState = [...prevState];
            newState[index] = {
                ...newState[index],
                [key]: texto
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
    
    const sumaTotalPorCampo = (campo) => {
        return formData.reduce((acc, item) => {
            let value = 0;
            value = parseFloat(item[campo]);
            return acc + (isNaN(value) ? 0 : value); 
        }, 0);
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
    
    const  sumaTotalLista = () => {
        let total = 0;
        total += sumaTotalPorCampo('padre_monto');
        total += sumaTotalPorCampo('madre_monto');
        total += sumaTotalPorCampo('monto');
        return total;
    }
    const  sumaTotalesSecciones = (secciones) => {

        let total = 0;

        if(!Array.isArray(secciones)){
            return total;
        }
        secciones.map(seccion => {
            total += sumaTotalporCampoSeccion('padre_monto',seccion);
            total += sumaTotalporCampoSeccion('madre_monto',seccion);
            total += sumaTotalporCampoSeccion('monto',seccion);
        });
        
        return total;
    }

    const clearValue = (index,lista_key) => {
        lista_key.map( key => {
            formData[index][key] = '';
        });
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
    const antiguedadEnColegio = () => {
        
        return formData.length && (
            <div>
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-3 p-1">AÑOS</div>
            </div>
            {parametros.length && parametros.map( (item,index) => (
                <div key={'piraec-'+index} className="row text-start">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-4 p-1">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch"
                                name="valor"
                                checked={formData[0].valor == item.valor}
                                onChange={() => {setValueOption('valor',item.valor,0)}}
                                id="valor"/>
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                               {item.limiten_inferior} - {item.limite_superior ? item.limite_superior : 'O MAS' }
                            </label>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )
    }
    // 4 .-  Número de Hijos
    const annioCurso = [
        {valor:1},{valor:2},{valor:3},{valor:4},{valor:5},{valor:6}
    ]
    const opcionesCurso = () => {
        return [<option key='sapoc-default' value="">Seleccione una opción</option>,...annioCurso.map((param,index) => (
            <option key={'sapoc-'+index} value={`${param.valor}`} >
                { param.valor }
            </option>
        ))]
    }
    const opcionesParametrosPromedioAcademico = () => {
        return parametrosPromedioAcademico.length !== 0  && [<option key='sapppa-default' value="">Seleccione una opción</option>,...parametrosPromedioAcademico.map((param,index) => (
            <option key={'sapppa-'+index} value={`${param.valor}`} >
                { param.limiten_inferior }
            </option>
        ))]
    }
    const opcionesParametrosPromedioConducta = () => {
        return parametrosPromedioConducta.length !== 0  &&  [<option key='sapppc-default' value="">Seleccione una opción</option>,...parametrosPromedioConducta.map((param,index) => (
            <option key={'sapppc-'+index} value={`${param.valor}`} >
                { param.limiten_inferior }
            </option>
        ))]
    }
    const numeroDeHijos = ()=>{
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4">NOMBRE</div>
                    <div className="col-sm-2">% BECA ACTUAL</div>
                    <div className="col-sm-2">CURSAR</div>
                    <div className="col-sm-2 text-center">PROMEDIO ACADEMICO</div>
                    <div className="col-sm-2 text-center">PROMEDIO CONDUCTA</div>
                </div>
                {formData.map((item,index) => (
                <div  key={'pes-'+idPregunta+'-'+index} className="row">
                    
                    <div className="col-sm-4 p-1">
                        <input
                            className="form-control form-control-sm"
                            name="nombre" 
                            key={`nombre-${index}`}
                            ref={(el) => (tipoRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, tipoRefs)}
                            value={item.nombre ?? ''}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                    <div className="col-sm-2 p-1">
                        <input
                            className="form-control form-control-sm"
                            name="respuesta" 
                            type="number"
                            key={`respuesta-${index}`}
                            ref={(el) => (marcaModeloRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, marcaModeloRefs)}
                            value={item.respuesta ?? ''}
                            onChange={(e) => {formInputChange(e,index)}}
                        />
                    </div>
                    <div className="col-sm-2 p-1">
                        <select
                            className="form-select form-control-sm" 
                            name="monto"
                            value={item.monto}
                            onChange={(e) => {formInputChange(e,index)}}
                        >
                            {opcionesCurso()}
                        </select>
                    </div>
                    <div className="col-sm-2 p-1">
                        <select
                            className="form-select form-control-sm" 
                            name="padre_monto"
                            value={item.padre_monto}
                            onChange={(e) => {formInputChange(e,index)}}
                        >
                            {opcionesParametrosPromedioAcademico()}
                        </select>


                    </div>
                    <div className="col-sm-2 p-1">
                        <select
                            className="form-select form-control-sm" 
                            name="madre_monto"
                            value={item.madre_monto}
                            onChange={(e) => {formInputChange(e,index)}}
                        >
                            {opcionesParametrosPromedioConducta()}
                        </select>
                    </div>
                </div>
                ))}
            </div>
        )
    }
    // 5 .-  Orfandad
    const orfandad = () => {
        return formData.length && (
            <div>
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-3 p-1">AÑOS</div>
            </div>
            {parametros.length && parametros.map( (item,index) => (
                <div key={'ppiorf'+index} className="row text-start">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-4 p-1">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch"
                                name="valor"
                                checked={formData[0].valor == item.valor}
                                onChange={() => {setValueOption('valor',item.valor,0)}}
                                id="valor"/>
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                               {item.texto}
                            </label>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )
    }
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
                            <div className="col-10 text-end monto-total">
                                {formatNumber(sumaTotalporCampo('padre_monto'))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10 text-end monto-total">
                                {formatNumber(sumaTotalporCampo('madre_monto'))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-3 p-1">
                    <div className="border-bottom border-secondary">
                        <div className="row">
                            <div className="col-1">$</div>
                            <div className="col-10 text-end monto-total">
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
                            <div className="col-10 text-end monto-total">
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
    const ahorro = () => {
        return formData.length && (
            <div>
                <div className="row">

                    <div className="col-sm-1">
                        <div className="row">
                            <div className="form-check form-switch pt-1">
                                <input 
                                    className="form-check-input"  
                                    type="checkbox" 
                                    role="switch"
                                    name="activo"
                                    checked={formData[0].activo}
                                    onChange={(e) => {
                                        formInputChange(e,0);
                                        if(e.target.checked === false){
                                            clearValue(0,['respuesta','monto']);
                                        }
                                    }}
                                    id="activo"/>
                                <label className="form-check-label">{(formData[0].activo) ? 'Si' : 'No'}</label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-sm-1 text-start p-1">DESCRIBE:</div>
                    <div className="col-sm-3">
                        <input
                            className="form-control form-control-sm"
                            name="respuesta" 
                            disabled={!formData[0].activo}
                            value={formData[0].respuesta ?? ''}
                            onChange={(e) => {formInputChange(e,0)}}
                        />
                    </div>
                    <div className="col-sm-5 text-start p-1">D) MONTO DE AHORROS O INVERCIONES</div>
                    <div className="col-sm-2">
                        <div className="row">
                            <div className="col-2">$</div>
                            <div className="col-9">
                                <input
                                    className="form-control form-control-sm text-end"
                                    name="monto" 
                                    key={`monto-${0}`}
                                    ref={(el) => (montoRefs.current[0] = el)}
                                    onKeyDown={(e) => handleKeyDown(e, 0, montoRefs)}
                                    disabled={!formData[0].activo}
                                    value={formatNumber(formData[0].monto) ?? ''}
                                    onChange={(e) => {numberChange(e,0)}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // 10 .-  Inversiones
    const isInvercionesActivas = () => {
     
        const item = formData.find(item => item.seccion === 'activa');
        //return JSON.stringify(item)
        return item ? item.activo : false; // Retorna null si no se encuentra

    }
    const isInvercionesClear = () => {
        formData.map((item,index) => {
            if(item.seccion === 'inverciones'){
                clearValue(index,['respuesta','monto']);
            }
        });
    }
    const inverciones = () => {
        return formData.length && (
            <div> 
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'activa' && (
                        <div  key={'pes-'+idPregunta+'-'+index} className="row">
                            <div className="col-sm-2">
                                <div className="row">
                                    <div className="col-1"></div>
                                    <div className="col-10">
                                        <div className="form-check form-switch pt-1">
                                            <input 
                                                className="form-check-input"  
                                                type="checkbox" 
                                                role="switch"
                                                name="activo"
                                                checked={formData[index].activo}
                                                onChange={(e) => {
                                                    formInputChange(e,index);
                                                    if(e.target.checked === false){
                                                        isInvercionesClear();
                                                    }
                                                }}
                                                id="activo"/>
                                            <label className="form-check-label">{(formData[index].activo) ? 'Si' : 'No'}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col"></div>
                        </div>
                        )
                })}
                    
                <div className="row">
                    <div className="col-sm-8">DESCRIBIR</div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-2">VALOR ESTIMADO</div>
                </div>

                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'inverciones' && (
                        
                        <div key={'pesinvii-'+idPregunta+'-'+index} className="row mt-2">
                            <div className="col-sm-8 text-start">                                    
                                <input
                                    className="form-control form-control-sm"
                                    name="respuesta" 
                                    disabled={!isInvercionesActivas()}
                                    value={formData[index].respuesta ?? ''}
                                    onChange={(e) => {formInputChange(e,index)}}
                                />
                            </div>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-2 text-start">
                                <div className="row">
                                    <div className="col-2">$</div>
                                    <div className="col-9">
                                        <input
                                            className="form-control form-control-sm text-end"
                                            name="monto" 
                                            key={`monto-${index}`}
                                            ref={(el) => (montoRefs.current[index] = el)}
                                            onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                                            disabled={!isInvercionesActivas()}
                                            value={formatNumber(formData[index].monto) ?? ''}
                                            onChange={(e) => {numberChange(e,index)}}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                })}

                <div className="row col-12">
                    <div className="row text-start">
                        <div className="col-sm-3 p-1"><div><b>TOTAL</b></div></div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary">
                                <div className="row">
                                    <div className="col-1">$</div>
                                    <div className="col-10 text-end monto-total">
                                        {formatNumber(mostrarTotalParametroID(-1))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
    // 11 .-  Vehículos
    
    const veiculosPropietarioOptions = () => {
        return [
                <option key='vpo-default' value="">
                    
                </option>,
                <option key={'vpo-0'} value="PROPIO">
                    PROPIO
                </option>,
                <option key={'vpo-2'} value="PRESTADO">
                    PRESTADO
                </option>,
                <option key={'vpo-3'} value="EMPRESA">
                    EMPRESA
                </option>
               ]
    }

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
                        {/*<input
                            className="form-control form-control-sm"
                            name="propietario" 
                            key={`propietario-${index}`}
                            ref={(el) => (propietarioRefs.current[index] = el)}
                            onKeyDown={(e) => handleKeyDown(e, index, propietarioRefs)}
                            value={item.propietario ?? ''}
                            onChange={(e) => {formInputChange(e,index)}}
                        />*/}
                        
                        <select
                                    className="form-select form-control-sm" 
                                    name="propietario"
                                    key={`propietario-${index}`}
                                    value={item.propietario ?? ''}
                                    ref={(el) => (propietarioRefs.current[index] = el)}
                                    onChange={(e) => {formInputChange(e,index)}}
                                >
                                    {veiculosPropietarioOptions()}
                                </select>
                    </div>
                    <div className="col-sm-2 p-1">
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
                ))}
                
                <div className="row">
                    <div className="col-sm-3"><b>TOTAL:</b></div>
                    <div className="col-sm-3 p-1 text-start">
                        <div className="border-bottom border-secondary">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10 text-end monto-total">
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
    
    const casaHabitacionOptions = () => {
        return [
                <option key='cho-default' value="">
                    
                </option>,
                <option key={'cho-0'} value="PROPIA">
                    PROPIA
                </option>,
                <option key={'cho-2'} value="RENTADA">
                    RENTADA
                </option>,
                <option key={'cho-3'} value="HIPOTECADA">
                    HIPOTECADA
                </option>
               ]
    }

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
                                            <select
                                                className="form-select form-control-sm" 
                                                name="respuesta"
                                                value={item.respuesta ?? ''}
                                                onChange={(e) => {formInputChange(e,index)}}
                                            >
                                                {casaHabitacionOptions()}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                
                <div className="row col-12">
                {formData.map((item,index) => {
                    return item?.seccion && item.seccion === 'renta' && (
                        <div key={'pes-'+idPregunta+'-'+index} className="row col-md-6 text-start">
                            <div className="col-sm-6 p-1 text-start">{item.texto}</div>
                            <div className="col-sm-6 p-1 text-start">
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
                    )
                })}
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
                    )
                })}
                </div>
                
                <div className="row col-12">
                    <div className="row text-start">
                        <div className="col-sm-3 p-1"><div><b>TOTAL:</b></div></div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary">
                                <div className="row">
                                    <div className="col-1">$</div>
                                    <div className="col-10 text-end monto-total">
                                        {formatNumber(sumaTotalesSecciones(['valor','body_otros']))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row col-12">
                    <div className="row text-start">
                        <div className="col-sm-3 p-1"><div><b>GRAN TOTAL PATRIMONIO:</b></div></div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary">
                                <div className="row">
                                    <div className="col-1">$</div>
                                    <div className="col-10 text-end monto-total">
                                        {formatNumber(mostrarTotalParametro())}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } 
    // 13 .-  Distribución de la casa

    const [textoAdicional, setTextoAdicional] = useState("");
    const [resumen, setResumen] = useState("");

    const dataSeleccionable = () => { return formData.map((item) => 
         item?.seccion && item.seccion === 'seleccionable' && item
    )}

    const handleKeyDownPuntoYComa = (event) => {
        if (event.key === ";") {
        event.preventDefault(); // Evita que se inserte
        }
    };

    useEffect(() => {
        const data = dataSeleccionable();

        const resumenNumerico = data
        .map((item) =>  item?.monto && parseInt(item.monto) > 0 && item?.texto ? `${item.monto} ${(item.monto > 1 && item?.texto_plural && item.texto_plural.length > 1) ? item.texto_plural.toUpperCase() : item.texto.toUpperCase()}, ` : null )
        .join("");
        
        const resumenSeleccionable = data
        .map((item) =>  item?.activo && item.activo === true && item?.texto ? `${item.texto.toUpperCase()}, ` : null )
        .join("");


        const textoNumerico = (resumenNumerico.length > 3) ? `LA CASA HABITACION CUENTA CON ${resumenNumerico.slice(0, -2)}` : '';
        
        const textoSeleccionable  = resumenSeleccionable.length > 3 ? `, ADEMAS SE OBSERVAN LUJOS COMO: ${resumenSeleccionable.slice(0, -2)}` : '';
        const nuevoValor = `${textoNumerico}${textoSeleccionable}`;
        setResumen(nuevoValor); // Fijar el resumen y evitar que sea editable
    }, [formData]);

    const updateTestoAdicional = (e) => {
        const texto =  e.target.value.toUpperCase();
        //const secciones = texto.split(";");
        //const resultado = texto.replace(/^.*;+\s*/, '');
        //const resultado = secciones.map((item, index) =>  index > 1 ? item : '' ).join("");
        const pre_resultado = texto.replace(/^.*;+\s*/, '');
        const resultado = pre_resultado.replace(/;/g, '');
        setTextoAdicional(resultado);
    }
    const [isIndex,setIsIndex] = useState(null);

    useEffect(() => {
        const respuesta = `${resumen};${textoAdicional ? " " + textoAdicional.toUpperCase() : " "}`;
        // textChange(e,index);
        
        if(isIndex !== null){
            setFormData((prevState) => {
                const newState = [...prevState];
                newState[isIndex] = {
                    ...newState[isIndex],
                    respuesta: respuesta
                };
                return newState;
            });
        }
    },[resumen,textoAdicional])
    
    
    const distrubucionDeLaCasaOptions = () => {
        return [<option key='sapt-default' value="">Seleccione la clasificacion</option>,...parametros.map((param) => (
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
                                    {/*
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input"  
                                        type="checkbox" 
                                        role="switch"
                                        name="activo"
                                        checked={item.activo}
                                        onChange={(e) => {formInputChange(e,index)}}
                                        id="activo"/>
                                </div>*/}

                                {item.tipo == 'binaria' ?(<>
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input"  
                                        type="checkbox" 
                                        role="switch"
                                        name="activo"
                                        checked={item.activo}
                                        onChange={(e) => {formInputChange(e,index)}}
                                        id="activo"/>
                                </div>
                                </>):(<>
                                        <input
                                            className="form-control form-control-sm text-end"
                                            name="monto" 
                                            key={`monto-${index}`}
                                            ref={(el) => (montoRefs.current[index] = el)}
                                            onKeyDown={(e) => handleKeyDown(e, index, montoRefs)}
                                            value={formatNumber(item.monto) ?? 0 }
                                            onChange={(e) => {numberChange(e,index)}}
                                        />
                                </>)}
                                        
                                    {/*<label className="form-check-label">{(item.activo) ? 'Si' : 'No'}</label>*/}
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
                                
                                <div>
                                    {longitudTexto(item.respuesta,longitudRespuesta)}
                                </div>
                                <textarea
                                    value={item.respuesta}
                                    onKeyDown={handleKeyDownPuntoYComa}
                                    onChange={(e) => {setIsIndex(index); updateTestoAdicional(e);}} 
                                    maxLength={longitudRespuesta}
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
                    <div className="col-sm-4 p-1 text-center">MENSUALIDAD</div>
                    <div className="col-sm-4 p-1 text-center">SALDO</div>
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
                                        value={formatNumber(item.padre_monto) ?? ''}
                                        onChange={(e) => {numberChange(e,index)}}
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
                                        value={formatNumber(item.monto) ?? ''}
                                        onChange={(e) => {numberChange(e,index)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            
                <div className="row">
                    <div className="col-sm-3"><b>TOTAL:</b></div>
                    <div className="col-sm-3 p-1 text-start">
                        <div className="border-bottom border-secondary">
                            <div className="row">
                                <div className="col-1">$</div>
                                <div className="col-10 text-end monto-total">
                                    {formatNumber(sumaTotalporCampo('monto'))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                    value={formatNumber(item.padre_monto) ?? ''}
                                    onChange={(e) => {numberChange(e,index)}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                ))}
                
                
                <div className="row col-12">
                    <div className="row text-start">
                        <div className="col-sm-3 p-1"><div><b>TOTAL:</b></div></div>
                        <div className="col-sm-3 p-1">
                            <div className="border-bottom border-secondary">
                                <div className="row">
                                    <div className="col-1">$</div>
                                    <div className="col-10 text-end monto-total">
                                    {formatNumber(sumaTotalLista())}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
        if(idPreguntaTipo == 13 || idPreguntaTipo == 5){
            formData.params = {id_catalogo_pregunta:idPregunta};
        }
        axios.get(`${APIURL}/catalogos/encuestas/preguntas/${idPregunta}/parametros`,formData,config)
        .then(res => setParametros(res.data))
        .catch(err => console.log("Error al solisitar parametros de pregunta",err));
    }

    const getParametroSumatoriaB = () => {        
        axios.get(`${APIURL}/catalogos/encuestas/preguntas/${idPregunta}/parametros/sumantria/b`,formData,config)
        .then(res => { res?.data && setPreguntaParametroSumatoria(res.data)})
        .catch(err => console.log("Error al solisitar parametros de pregunta",err));
    }
    


    const getParametrosPromedioAcademico  = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/pregunta/parametro/${idPregunta}/adicional-dos/items`,config)
        .then(res => setParametrosPromedioAcademico(res.data))
        .catch(err => console.log("Error al solisitar parametros de pregunta",err));
    }
    
    const getParametrosPromedioConducta = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/pregunta/parametro/${idPregunta}/adicional-dos/items`,config)
        .then(res => setParametrosPromedioConducta(res.data))
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
            case 3:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',}
                ]);
            break;
            case 4:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]);
            break;
            case 5:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',}
                ]);
            case 6:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                ]);
            break;
            case 10:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',seccion:'activa',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',seccion:'inverciones',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',seccion:'inverciones',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',seccion:'inverciones',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
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
            case 9:
                setFormData([
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',}
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
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'MONTO DE LA RENTA O MENSUALIDAD', seccion:'renta', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
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
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PLANTA', texto_plural:'PLANTAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'SALA', texto_plural:'SALAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'COMEDOR', texto_plural:'COMEDORES', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'COCINA', texto_plural:'COCINAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'RECAMARA', texto_plural:'RECAMARAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'BAÑO', texto_plural:'BAÑOS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PANTALLA DE TV', texto_plural:'PANTALLAS DE TV', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'REFRIGERADOR', texto_plural:'REFRIGERADORES', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PARRILLA', texto_plural:'PARRILLAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'LAVADORA', texto_plural:'LAVADORAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'SECADORA', texto_plural:'SECADORAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARTO DE LAVANDERIA', texto_plural:'CUARTOS DE LAVANDERIA', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARTO DE SERVICIO', texto_plural:'CUARTOS DE SERVICIO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'RECIBIDOR', texto_plural:'RECIBIDORES', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ESTANCIA', texto_plural:'ESTANCIAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'JARDIN', texto_plural:'JARDINES', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARTO DE JUEGO', texto_plural:'CUARTOS DE JUEGO', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'MINISPLIT', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ESTUDIO', texto_plural:'ESTUDIOS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'BODEGA', texto_plural:'BODEGAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ROOF GARDEN', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'numerico', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'ALBERCA', texto_plural:'ALBERCAS', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CUARZO', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'MARMOL', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'GRANITO', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'AREA SOCIAL', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CANTERA', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'PANELES SOLARES', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CLIMA CENTRAL', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'GIMNASIO', texto_plural:'', seccion:'seleccionable', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'binaria', marca_modelo:'', anio:'', propietario:'',},
                    
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'CLASIFICACION', seccion:'clasificacion', respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', nombre:'', texto:'DESCRIBIR LO OBSERVADO', seccion:'descripcion', respuesta:';', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',},
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
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'ALIMENTACION Y DESPENSA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO GTS. MEDICOS MAYORES',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'ROPA Y CALZADO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO DE VIDA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'RENTA HIPOTECA CASA - HABITACION',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO DE CASA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'PREDIAL',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SEGURO DE AUTO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MTTO. Y SEGURIDAD FRACCIONAMIENTO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'CREDITO AUTOMOTRIZ',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:3,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SERVICIOS LUZ, AGUA, GAS, TELEFONO, INTERNET, TV. PAGA, CELULAR',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'GASOLINA Y TRANSPORTE',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MTTO. CASA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MTTO. AUTO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'SERVICIO DOMESTICO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'VACACIONES (1 AÑO ATRAS)',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:2,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MASCOTAS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'DIVERCION CINE, RESTAURANTES, PASEOS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'MEMBRESIA CLUB SOCIAL O DEPORTIVO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'AYUDA A PARIENTES',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:4,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'CONSULTAS, DOCTORES, MEDICAMENTOS, TRATAMIENTOS, ESPECIALISTAS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:1,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'CLASES / ACTIVIDADES EXTRACURRICULARES FUERA DEL COLEGIO (BALLET, FUTBOL, PINTURA, IDIOMAS, APOYO KUMOS, ETC.)',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:3,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'GASTOS DE EDUCACION INSCRIPCIONES, UNIFORMES, LIBROS, UTILES, SOCIEDAD DE PADRES, CUOTA DEPORTIVA, SEGURO, PLATAFORMAS',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:3,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'GASTOS DE EDUCACION MENSUALIDAD, CLASE ESTRACURRICULAR DENTRO DEL COLEGIO',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:3,},
                    { id_encuesta:'', id_servicio_estudio:idEstudio, id_catalogo_encuestas_pregunta:idPregunta, id_item:'', parentesco:'', texto:'TENENCIA',  respuesta:'', vive:false, activo:false, padre_monto:'', madre_monto:'', monto:'', valor:'', tipo:'', marca_modelo:'', anio:'', propietario:'',id_respuestas_clasificacions:3,},
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
        if(
            idPreguntaTipo == 13
            || idPreguntaTipo == 3
            || idPreguntaTipo == 5
        ){
            getParametros();
        }

        if(idPreguntaTipo == 4){
            getParametrosPromedioAcademico();
            getParametrosPromedioConducta();
        }
    },[])

    useEffect(() => {
        
        let newTotal = 0;

        switch(idPreguntaTipo){
            case 12:
                newTotal = sumaTotalesSecciones(['valor','body_otros']);
            break;
            /*case 9:
            case 10:
                newTotal = sumaTotalLista();
                setTotalPorParametro(prevState => ({
                    ...prevState,
                    parametro:-1,
                    total: newTotal
                }));
                
                updateListaTotales({pregunta:idPregunta,parametro:-1,total:newTotal});
            break;*/
            default:
                newTotal = sumaTotalLista();
            break;
        }
        
        setTotalPorParametro(prevState => ({
            ...prevState,
            total: newTotal
        }));
        
    },[formData]);

    useEffect(() => {
        updateListaTotales(totalPorParametro);
        if(idPreguntaTipo === 9 || idPreguntaTipo === 10){
            const newTotal = totalPorParametro.total;
            updateListaTotales({pregunta:idPregunta,parametro:-1,total:newTotal});
        }
    },[totalPorParametro])

    const preguntaPorTipoPregunta = () => {
        switch(idPreguntaTipo){
            // 1 .-  Pregunta abierta
            case 1:
                return preguntaAbierta();
            break;
            // 2 .-  Lista selección múltiple
            // 3 .-  Antigüedad en colegio
            case 3:
                return antiguedadEnColegio();
            break;
            // 4 .-  Número de Hijos
            case 4:
                return numeroDeHijos();
            break;
            // 5 .-  Orfandad
            case 5:
                return orfandad();
            break;
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
            case 9:
                return ahorro();
            break;
            // 10 .-  Inversiones
            case 10:
                return inverciones();
            break;
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