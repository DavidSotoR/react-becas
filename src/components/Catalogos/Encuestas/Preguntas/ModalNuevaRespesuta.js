
function ModalNuevaRespesuta({ show = true, idPregunta ,idPreguntaTipo,dataPregunta}){
    
    // 1 .-  Pregunta abierta
    const preguntaAbierta = () => {
        const longitud_respuesta = dataPregunta.longitud_respuesta;
        const row = Math.round(longitud_respuesta / 100);
        return (
            <div>
                {Array.from({ length: row }, (_, index) => (
                    <hr key={index} />
                ))}
            </div>
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
                <div className="row">
                    <div className="col-sm-2">PADRE</div>
                    <div className="col-sm-2 p-1">
                        <div className=" row">
                            <div className="col-3">SI</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                            <div className="col-3">NO</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                        </div>
                    </div>
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
                    <div className="col-sm-2 p-1">
                        <div className=" row">
                            <div className="col-3">SI</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                            <div className="col-3">NO</div>
                            <div className="col-2 border-bottom border-secondary"></div>
                        </div>
                    </div>
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
    // 12 .-  Propiedades Hipotecarias
    // 13 .-  Distribución de la casa
    const distrubucionDeLaCasa = () => {
        return (
            <div>
            <div className="row">
                <div className="col-sm-4 p-1 text-start">CONCEPTO</div>
                <div className="col-sm-2 p-1">SI / NO</div>
            </div>
            <div className="row text-start">
                <div className="col-sm-4">
                    <input type="text"/>
                </div>
                <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
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
            // 12 .-  Propiedades Hipotecarias
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

export default ModalNuevaRespesuta;