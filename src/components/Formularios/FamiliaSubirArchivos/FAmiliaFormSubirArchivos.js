
function FamiliaSubirArchivos() {

    return (
        <div className="container mt-3 mb-3">
            <div className="row">
            <div className="col-12">
                    <ol className="list-group list-group-numbered">
                        <li className="list-group-item">
                            <span className="fw-bold">INGRESOS</span>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleIngresos" class="form-label">Cargar archivos Ingresos:</label>
                                <input className="form-control" accept="application/pdf" type="file" id="formFileMultipleIngresos" multiple />
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <span className="fw-bold">DESEMPLEO</span> 
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleDesempleo" class="form-label">Cargar archivos Desempleo:</label>
                                <input className="form-control" accept="application/pdf" type="file" id="formFileMultipleDesempleo" multiple />
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                        <span className="fw-bold">CASA HABITACION</span> 
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleCasaHabitacion" class="form-label">Cargar archivos Casa/Habitacion:</label>
                                <input className="form-control" accept="application/pdf" type="file" id="formFileMultipleCasaHabitacion" multiple />
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <span className="fw-bold">AUTOMÓVILES</span> (propios, de la empresa o prestados) comprobar con:
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleAutos" class="form-label">Cargar archivos Automóviles:</label>
                                <input className="form-control" accept="application/pdf" type="file" id="formFileMultipleAutos" multiple />
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <span className="fw-bold">COMPROBANTES DE DOMICILIO</span>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleComprobantes" class="form-label">Cargar archivos Comprobantes:</label>
                                <input className="form-control" accept="application/pdf" type="file" id="formFileMultipleComprobantes" multiple />
                            </div>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    )
    
}


export default FamiliaSubirArchivos;