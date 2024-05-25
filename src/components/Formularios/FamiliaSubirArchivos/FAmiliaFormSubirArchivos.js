import { useState } from "react";

function FamiliaSubirArchivos() {
    const [ successIngresos, setSuccessIngresos ] = useState(false)
    const [ successDesempleo, setSuccessDesempleo ] = useState(false)
    const [ successAuto, setSuccessAuto ] = useState(false)
    const [ successCasa, setSuccessCasa ] = useState(false)
    const [ successComprobante, setSuccessComprobante ] = useState(false)

    const subirArchivosIngresos = () => {
        console.log('Se subio archivo ingresos');
    }

    const subirArchivosDesempleo = () => {
        console.log('Se subio archivo desempleo');
    }

    const subirArchivosCasaHabitacion = () => {
        console.log('Se subio archivo casa/habitacion');
    }

    const subirArchivosAutomoviles = () => {
        console.log('Se subio archivo Automoviles');
    }

    const subirArchivosComprobantes = () => {
        console.log('Se subio archivo Comprobantes');
    }

    const actualizoInputFiles = (e, name) =>{
        console.log(name);
        console.log(e);
    }

    return (
        <div className="container mt-3 mb-3">
            <div className="row">
            <div className="col-12">
                    <ul className="list-group list-group">
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <p  className="mb-0 me-2 pb-1 fw-bold">1. INGRESOS</p>
                                <div className="">
                                {successIngresos ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                                </div>
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleIngresos" class="form-label">Cargar archivos Ingresos:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'ingresos') } } accept="application/pdf" type="file" id="formFileMultipleIngresos" multiple />
                                <button className="btn btn-primary mt-2" onClick={()=>{ setSuccessIngresos(!successIngresos) }}> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div className="d-flex align-items-center">
                                <p  className="mb-0 me-2 pb-1 fw-bold">2. DESEMPLEO</p>
                                <div className="">
                                {successDesempleo ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                                </div>
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleDesempleo" class="form-label">Cargar archivos Desempleo:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'desempleado') } } accept="application/pdf" type="file" id="formFileMultipleDesempleo" multiple />
                                <button className="btn btn-primary mt-2" onClick={()=>{ setSuccessDesempleo(!successDesempleo) }}> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div className="d-flex align-items-center">
                            <p  className="mb-0 me-2 pb-1 fw-bold">3. CASA HABITACION</p>
                            <div className="">
                                {successCasa ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                            </div>
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleCasaHabitacion" class="form-label">Cargar archivos Casa/Habitacion:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'casa') } } accept="application/pdf" type="file" id="formFileMultipleCasaHabitacion" multiple />
                                <button className="btn btn-primary mt-2" onClick={()=>{ setSuccessCasa(!successCasa) }}> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div className="d-flex align-items-center">
                                <p  className="mb-0 me-2 pb-1 fw-bold">4. Automoviles</p>
                                <div className="">
                                    {successAuto ? (
                                    <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                    ) : (
                                    <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                    )}
                                </div>
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleAutos" class="form-label">Cargar archivos Automóviles:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'autos') } } accept="application/pdf" type="file" id="formFileMultipleAutos" multiple />
                                <button className="btn btn-primary mt-2" onClick={()=>{ setSuccessAuto(!successAuto) }}> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div className="d-flex align-items-center">
                            <p className="mb-0 me-2 pb-1 fw-bold">5. COMPROBANTES DE DOMICILIO</p>
                            {successComprobante ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label for="formFileMultipleComprobantes" class="form-label">Cargar archivos Comprobantes:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'comprobantes') } } accept="application/pdf" type="file" id="formFileMultipleComprobantes" multiple />
                                <button className="btn btn-primary mt-2" onClick={()=>{ setSuccessComprobante(!successComprobante) }}> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
    
}


export default FamiliaSubirArchivos;