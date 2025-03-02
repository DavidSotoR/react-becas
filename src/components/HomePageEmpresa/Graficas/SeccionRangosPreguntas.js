


export default function SeccionRangosPreguntas({pregunta}){

    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    const getItemByKey = (array,campo, val) => {
        return array.find(item => item[campo] === val);
    };
    const preguntaSi = (respuestas,seccion,campo) => {
        return getItemByKey(respuestas,seccion,campo)
    }

    const sumatoriaKey = (respuestas,campo) => {

        return respuestas.reduce((acc, item) => {
            const value = parseFloat(item[campo]);
            return acc + (isNaN(value) ? 0 : value); // Solo suma si es un número válido
          }, 0);
    }
    
    const sumatoriaAllMontos = (respuestas) => {
        return respuestas.reduce((acc, item) => {
            const padre_monto = parseFloat(item.padre_monto);
            const madre_monto = parseFloat(item.madre_monto);
            const monto = parseFloat(item.monto);
            return acc + (isNaN(padre_monto) ? 0 : padre_monto) +(isNaN(madre_monto) ? 0 : madre_monto) +(isNaN(monto) ? 0 : monto); // Solo suma si es un número válido
          }, 0);
    }
    
    const sumatoriaSeccionKey = (respuestas,seccion,filtro,campo) => {

        return respuestas.reduce((acc, item) => {
            let value = item[seccion] === filtro && parseFloat(item[campo]);
            return acc + (isNaN(value) ? 0 : value); // Solo suma si es un número válido
          }, 0);
    }
    const preguntaTipo = (pregunta) => {
        switch(pregunta.id_catalogo_encuestas_preguntas_tipo){
            case 3:
                return (
                    <div className="col-12 pt-3">
                        <div className="row">
                            <div className="col-10">
                                <div>
                                    <b>{convertirAMayusculas(pregunta.pregunta)}</b>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="text-end align-text-bottom border-bottom">
                                    {pregunta.respuestas[0].valor}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            break;
            case 8:
                return (
                    <div className="col-12 pt-3">
                        <div className="row">
                            <div className="col-10">
                                <div>
                                    <b>{convertirAMayusculas(pregunta.pregunta)}</b>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="text-end align-text-bottom border-bottom">
                                    ${sumatoriaAllMontos(pregunta.respuestas)}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            break;
            case 9:
                return (
                    <div className="col-12 pt-3">
                        <div className="row">
                            <div className="col-10">
                                <div>
                                    <b>{convertirAMayusculas(pregunta.pregunta)}</b>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="text-end align-text-bottom border-bottom">
                                    ${pregunta.respuestas[0].activo ? formatNumber(pregunta.respuestas[0].monto):(<>0</>)}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            break;
            case 10:
                return (
                    <div className="col-12 pt-3">
                        <div className="row">
                            <div className="col-10">
                                <div>
                                    <b>{convertirAMayusculas(pregunta.pregunta)}</b>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="text-end align-text-bottom border-bottom">
                                ${getItemByKey(pregunta.respuestas,'seccion','activa').activo ? formatNumber(sumatoriaKey(pregunta.respuestas,'monto')):formatNumber(sumatoriaKey(pregunta.respuestas,'monto'))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            break;
            case 11:
                return (
                    <div className="col-12 pt-3">
                        <div className="row">
                            <div className="col-9">
                                <div>
                                    <b>{convertirAMayusculas(pregunta.pregunta)}</b>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="text-end align-text-bottom border-bottom">
                                    ${formatNumber(sumatoriaKey(pregunta.respuestas,'monto'))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            break;
            case 12:
                return (
                    <div className="col-12 pt-3">
                        <div className="row">
                            <div className="col-9">
                                <div>
                                    <b>{convertirAMayusculas(pregunta.pregunta)}</b>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="text-end align-text-bottom border-bottom">
                                    ${formatNumber(getItemByKey(pregunta.respuestas,'seccion','valor').monto+sumatoriaSeccionKey(pregunta.respuestas,'seccion','body_otros','monto'))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            break;
            default:
                return (<div className="col-md-12">
                    <div className="mt-3">
                        <b>{convertirAMayusculas(pregunta.pregunta)}</b>
                    </div>
                    <div>
                        Tipo pregunta: {pregunta.id_catalogo_encuestas_preguntas_tipo}
                    </div>
                </div>)
            break;

        }
    }

    return pregunta !== null && preguntaTipo(pregunta)
}