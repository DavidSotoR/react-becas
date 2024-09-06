
function ModalNuevaRespesuta({ show = true, idPregunta ,idPreguntaTipo}){

    
    // 1 .-  Pregunta abierta
    const preguntaAbierta = () => {
        return (
            <div>
                <hr/>
                <hr/>
                <hr/>
                <hr/>
                <hr/>
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
                    <div className="col-sm-4">ACTIVO LABORALEMNTE</div>
                    <div className="col-sm-2">EMPRESA</div>
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
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
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
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-5 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-2">OTRO</div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
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
            <div className="row text-start">
                <div className="col-sm-3">
                    <input type="text"/>
                </div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
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
                <div className="col-sm-4 p-1">TOTAL A DEBER</div>
                <div className="col-sm-4 p-1">MENSUALIDAD</div>
            </div>
            <div className="row text-start">
                <div className="col-sm-4">
                    <input type="text"/>
                </div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
                <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
            </div>
            </div>
        )
    }
    // 15 .-  Gastos familiares
    const gastosFamiliares = () => {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4 p-1">CONCEPTO</div>
                    <div className="col-sm-4 p-1">MENSUALIDAD</div>
                </div>
                <div className="row text-start">
                    <div className="col-sm-4">
                        <input type="text"/>
                    </div>
                    <div className="col-sm-4 p-1"><div className="border-bottom border-secondary">$</div></div>
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
                return gastosFamiliares();
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
                {preguntaPorTipoPregunta()}
            </div>
        </div>
    )
}

export default ModalNuevaRespesuta;