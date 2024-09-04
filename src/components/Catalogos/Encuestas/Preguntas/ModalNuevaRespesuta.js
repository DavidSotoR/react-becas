
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
                    <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">SI / NO</div></div>
                    <div className="col-sm-3 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                    <div className="col-sm-5 p-1"><div className="border-bottom border-secondary">&emsp;</div></div>
                </div>
                <div className="row">
                    <div className="col-sm-2">MADRE</div>
                    <div className="col-sm-2 p-1"><div className="border-bottom border-secondary">SI / NO</div></div>
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
    // 9 .-  Ahorro
    // 10 .-  Inversiones
    // 11 .-  Vehículos
    // 12 .-  Propiedades Hipotecarias
    // 13 .-  Distribución de la casa
    // 14 .-  Deudas
    // 15 .-  Gastos familiares
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
            // 7 .-  Económicamente activo
            case 7:
                return familiaEconomicameteActiva();
            break;
            // 8 .-  Ingreso mensual
            // 9 .-  Ahorro
            // 10 .-  Inversiones
            // 11 .-  Vehículos
            // 12 .-  Propiedades Hipotecarias
            // 13 .-  Distribución de la casa
            // 14 .-  Deudas
            // 15 .-  Gastos familiares
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
        <>
        Seccion Preguntas ID: {idPregunta} Tipo {idPreguntaTipo}
        {preguntaPorTipoPregunta()}
        </>
    )
}

export default ModalNuevaRespesuta;