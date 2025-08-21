// Importar las dependencias necesarias
import React, { useState } from "react";
import Navbar from "../../NavBar/NavBar";

function FormEsecDB() {
    const [showModulo, setShowModule]= useState(1);

    const siguienteEtapa = () => {
        console.log('siguiente');
        
        var m = showModulo
        setShowModule(m + 1)
    }

    const anteriorEtapa = () => {
        console.log('anterior');
        var m = showModulo
        setShowModule(m - 1)
    }
    

    return (
        <div className="row p-2">
            <div className="col-12">
                <p className="fw-bold">ENCUESTA: ESECDB</p>
            </div>
            { showModulo === 1 && 
                <div id="contenido-1" className="col-12 card pt-2">
                    <p className="fw-bold">INFORMACION GENERAL</p>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/>
                        </div>
                        <div className="col-3">
                            <select className="form-select" aria-label="Default select example">
                            <option value="H">Hombre</option>
                            <option value="M">Mujer</option>
                            </select>
                        </div>
                        <div className="col-3">
                            <input className="form-control" type="number" placeholder="Edad:" aria-label="default input example"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Nacionalidad:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Lugar Nacimiento:" aria-label="default input example"/>
                        </div>
                        <div className="col-4 d-flex">
                            <label for="date_m1" className="">Fecha Nacimiento</label>
                            <input id="date_m1" className="form-control" type="date" aria-label="default input example"/>
                        </div>

                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Domicilio:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Colonia:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Municipio/Ciudad:" aria-label="default input example"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Correo:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Celular:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="CURP:" aria-label="default input example"/>
                        </div>
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="RFC:" aria-label="default input example"/>
                        </div>
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="NSS:" aria-label="default input example"/>
                        </div>
                        
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="INE:" aria-label="default input example"/>
                        </div>
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="Pasaporte:" aria-label="default input example"/>
                        </div>
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="Licencia Conductor:" aria-label="default input example"/>
                        </div>

                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>
                </div>
            }

            { showModulo === 2 &&
                <div id="contenido-2" className="col-12 card">
                    <p className="fw-bold">SALUD</p>
                    <div className="row mb-3">
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="¿Como evaluaria su estado de Salud?" aria-label="default input example"/>
                        </div>
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="¿Por que?" aria-label="default input example"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="PADECE O HA PADECIDO ALGUNA ENFERMEDAD CRONICA?" aria-label="default input example"/>
                        </div>
                        <div className="col-6">
                            <input className="form-control" type="text" placeholder="¿Cual?" aria-label="default input example"/>
                        </div>
                        
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>
                </div>
            }

            { showModulo === 3 &&

                <div id="contenido-3" className="col-12 card">
                    <p className="fw-bold">NIVEL DE EDUCACION</p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>
                </div>

            }

            { showModulo === 4 &&
                <div id="contenido-2" className="col-12 card">
                    <p className="fw-bold">LABORAL</p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>
            }

            { showModulo === 5 &&
                <div id="contenido-2" className="col-12 card">
                    <p className="fw-bold">CONDICIONES GENERALES DE LA VIVIENDA, ZONA Y NIVEL SOCIAL</p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>

            }

            { showModulo === 6 &&

                <div id="contenido-2" className="col-12 card">
                    <p className="fw-bold">INFORMACION FAMILIAR</p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>

            }

            { showModulo === 7 &&

                <div id="contenido-2" className="col-12 card">
                    <p className="fw-bold">SITUACION ECONOMICA</p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>

            }

            { showModulo === 8 &&

                <div id="contenido-2" className="col-12 card">
                    <p className="fw-bold">GASTOS MENSUALES</p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>

            }

            { showModulo === 9 &&

                <div id="contenido-2" className="col-12 card">
                    <p className="fw-bold">REFERENCIAS VECINOS </p>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary">Finalizar</button>
                    </div>

                </div>

            }
            
           
        </div>
    );
}

// Exportar el componente FormBP2 por defecto
export default FormEsecDB;
