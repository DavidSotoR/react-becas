
function EstudioSeccionEstudio ({fromData}) {

    const mostrarEstado = (estado) => {
        if(!estado){
            return '';
        }
        return (<div className="d-flex"><div className="border rounded p-1" style={{ backgroundColor: estado.color }}> {estado.nombre} </div></div>)
    }

    const elementoColaborador = (colaborador) => {
        return colaborador ? (
            <div className="mb-3 row">
                <p className="col-sm-2">Colaborador: </p>
                <div className="col-sm-10">
                    <div className="d-flex">
                        <div>
                            <p className="mb-0">{colaborador.name}</p>
                            <p>{colaborador.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        ): (
            <div className="mb-3 row">
                <p className="col-sm-2">Colaborador:</p>
                <div className="col-sm-10"></div>
            </div>
        )
    }

    return(
        <div className="row">
            <div className="col-md-2"/>
            <div className="col-md-8">
                    <div>
                        <div>
                            <h4>Estudio: #{fromData.id}</h4>
                        </div>
                        <hr/>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Proyecto:</p>
                            <div className="col-sm-10">
                                <p>{fromData?.proyecto.nombre}</p>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Cliente:</p>
                            <div className="col-sm-10">
                                <p>{fromData?.cliente.nombre}</p>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Orden de servicio:</p>
                            <div className="col-sm-10">
                                <p>{fromData?.orden_servicio.descripcion}</p>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <p className="col-sm-2">Estado:</p>
                            <div className="col-sm-10">
                                {fromData.estado?.nombre ? mostrarEstado(fromData.estado) : ''}
                            </div>
                        </div>
                        
                        {elementoColaborador(fromData.colaborador)}
                        <div className="mb-3 row">
                            <p className="col-sm-2">Familia Usuario:</p>
                            <div className="col-sm-10">
                                <p>{fromData.familia?.email}</p>
                            </div>
                        </div>
                    </div>
            </div>
        </div>)
}

export default EstudioSeccionEstudio