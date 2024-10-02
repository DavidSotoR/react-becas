import { useState,useEffect } from "react";

export default function Respuestas({idPregunta,longitudRespuesta,idPreguntaTipo}) {

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
                texto: texto
            };
            return newState;
        });
        console.log(formData);

        setTimeout(() => {
            e.target.setSelectionRange(start, end);
        }, 0);
    };
    
    // 1 .-  Pregunta abierta
    const preguntaAbierta = () => {

        if ( !Array.isArray(formData) || !formData[0] || formData[0].texto === undefined) {
            return '';
        }

        return formData.map((item,index) => {
            return (
            <div key={'pes-'+idPregunta+'-'+index}>
                <div>
                    {longitudTexto(item.texto,longitudRespuesta)}
                </div>
                <div>
                    <textarea
                        value={item.texto}
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
            <div className="row text-start">
                <div className="col-sm-2"></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-2"></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-2"></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-2"></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-2"></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
            </div>
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
                {[{texto:'PADRE'},{texto:'MADRE'},{texto:'OTRO'}].map((item,index) => {(
                    <div key={'pes-'+idPregunta+'-'+index} className="row">
                        <div className="col-sm-2">{item.texto}</div>
                        <div className="col-sm-2 p-1">
                            <div className="row">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                                    <label className="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3 p-1">
                            <div className="row">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                                    <label className="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    </div>
                )})}
                <div className="row">
                    <div className="col-sm-2">OTRO</div>
                    <div className="col-sm-2"></div>
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
    // 8 .-  Ingreso mensual
    const ingresoNetoMensual = () => {
        return (
            <div>
            <div className="row">
                <div className="col-sm-3 p-1">INGRESO NETO</div>
                <div className="col-sm-3 p-1">PADRE</div>
                <div className="col-sm-3 p-1">MADRE</div>
                <div className="col-sm-3 p-1">OTROS</div>
            </div>
            <br/>
            <div className="row text-start">
                <div className="col-sm-3"><div>INGRESO NETO</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>BONOS DE DESPENSA</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>VALES DE GASOLINA</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>COMISIONES POR VENTAS</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>AGUINALDO </div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>BONO DE PRODUCTIVIDAD</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>FONDO DE AHORRO</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>UTILIDADES PRIMA</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>VACACIONAL</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>RENTA QUE RECIBA</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div>AYUDA QUE RECIBA</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div><b>SUB TOTAL</b></div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-3"><div><b>TOTAL</b></div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
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
                <div className="row">
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-1 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-1 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-1 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-1 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-1 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                
                <div className="row">
                    <div className="col-sm-3"><b>TOTAL:</b></div>
                    <div className="col-sm-3 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                </div>
            </div>
        )
    }
    // 12 .-  Propiedades Hipotecarias / casa Habitacion
    const casaHabitacion = () => {
        return (
            <div className="row">
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start">SITUACION DE LA VIVIENDA</div>
                        <div className="col-sm-6 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    </div>
                </div>
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start">MONTO DE LA RENTA O MENSUALIDAD</div>
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                    </div>
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start">VALOR APROXIMADO</div>
                        <div className="col-sm-6 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                    </div>
                </div>
                <div className="row col-12">
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start">METROS DE CONTRUCCION</div>
                        <div className="col-sm-6 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    </div>
                    <div className="row col-md-6 text-start">
                        <div className="col-sm-6 p-1 text-start">METRO DE TERRENO</div>
                        <div className="col-sm-6 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    </div>
                </div>
                <div className="row col-12 mt-4">
                    <div className="col-12 p-1 text-start">
                        ESPESIFICAR SI CUENTA CON TROA CASA HABITACION, TERRENO, DEPARTAMENTO, LOCALES, ETC.
                    </div>
                </div>
                <div className="row col-12">
                    <div className="row col-md-12 text-start">
                    <div className="col-sm-9 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                    </div>
                    <div className="row col-md-12 text-start">
                    <div className="col-sm-9 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                    </div>
                    <div className="row col-md-12 text-start">
                    <div className="col-sm-9 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-3 p-1 text-start"><div className="border-bottom border-secondary">$</div></div>
                    </div>
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
            <div className="row text-start">
                <div className="col-sm-4">
                    CREDITO HIPOTECARIO
                </div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-4">
                    CREDITO AUTOMOTRIZ
                </div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-4">
                    TARJETAS DE CREDITO
                </div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-4">
                    TARJETAS DEPARTAMENTALES
                </div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            <div className="row text-start">
                <div className="col-sm-4">
                    PRESTAMOS PERSONALES/ NOOMINA/ FAMILIARES 
                </div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            </div>
        )
    }
    // 15 .-  Gastos familiares
    const gastosFamiliaresMensuales = () => {
        return (
            <div className="row  text-start">
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        ALIMENTACION Y DESPENSA
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        SEGURO GTS. MEDICOS MAYORES
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        ROPA Y CALZADO
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        SEGURO DE VIDA
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        RENTA HIPOTECA CASA - HABITACION
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        SEGURO DE CASA
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        PREDIAL
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        SEGURO DE AUTO
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        MTTO. Y SEGURIDAD FRACCIONAMIENTO
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        CREDITO AUTOMOTRIZ
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        SERVICIOS LUZ, AGUA, GAS, TELEFONO, INTERNET, TV. PAGA, CELULAR
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        GASOLINA Y TRANSPORTE
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        MTTO. CASA
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        MTTO. AUTO
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        SERVICIO DOMESTICO
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        VACACIONES (1 AÑO ATRAS)
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        MASCOTAS
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        DIVERCION CINE, RESTAURANTES, PASEOS
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        MEMBRESIA CLUB SOCIAL O DEPORTIVO
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        AYUDA A PARIENTES
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        CONSULTAS, DOCTORES, MEDICAMENTOS, TRATAMIENTOS, ESPECIALISTAS
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        CLASES / ACTIVIDADES EXTRACURRICULARES FUERA DEL COLEGIO (BALLET, FUTBOL, PINTURA, IDIOMAS, APOYO KUMOS, ETC.)
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        GASTOS DE EDUCACION INSCRIPCIONES, UNIFORMES, LIBROS, UTILES, SOCIEDAD DE PADRES, CUOTA DEPORTIVA, SEGURO, PLATAFORMAS
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        GASTOS DE EDUCACION MENSUALIDAD, CLASE ESTRACURRICULAR DENTRO DEL COLEGIO
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        TENENCIA
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                </div>
                <div className="row col-sm-6">
                    <div className="col-7 p-1">
                        OTRO (ESPECIFICAR)
                    </div>
                    <div className="col-4 p-1"><div className="border-bottom border-secondary">$</div></div>
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

    useEffect(() => {
        
        switch(idPreguntaTipo){
            // 1 .-  Pregunta abierta
            case 1:
                setFormData([
                    {
                        id_encuesta:'',
                        id_estudio:'',
                        id_pregunta:'',
                        id_item:'',
                        parentesco:'',
                        texto:'',
                        padre_monto:'',
                        madre_monto:'',
                        monto:'',
                        valor:'',
                        tipo:'',
                        marca_modelo:'',
                        anio:'',
                        propietario:'',
                    }
                ]);
            break;
            case 7:
                setFormData([
                    {
                        id_encuesta:'',
                        id_estudio:'',
                        id_pregunta:'',
                        id_item:'',
                        parentesco:'',
                        texto:'',
                        vive:false,
                        activo:false,
                        padre_monto:'',
                        madre_monto:'',
                        monto:'',
                        valor:'',
                        tipo:'',
                        marca_modelo:'',
                        anio:'',
                        propietario:'',
                    },{
                        id_encuesta:'',
                        id_estudio:'',
                        id_pregunta:'',
                        id_item:'',
                        parentesco:'',
                        texto:'',
                        vive:false,
                        activo:false,
                        padre_monto:'',
                        madre_monto:'',
                        monto:'',
                        valor:'',
                        tipo:'',
                        marca_modelo:'',
                        anio:'',
                        propietario:'',
                    },{
                        id_encuesta:'',
                        id_estudio:'',
                        id_pregunta:'',
                        id_item:'',
                        parentesco:'',
                        texto:'',
                        vive:false,
                        activo:false,
                        padre_monto:'',
                        madre_monto:'',
                        monto:'',
                        valor:'',
                        tipo:'',
                        marca_modelo:'',
                        anio:'',
                        propietario:'',
                    }]);
            break;
            default:
                setFormData([]);
            break;
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
            <div className="col-md-8">
                Seccion Preguntas ID: {idPregunta} Tipo {idPreguntaTipo}
                <br/><br/>
            </div>
            <div className="col-md-8">
                {preguntaPorTipoPregunta()}
            </div>
        </div>
    )
}