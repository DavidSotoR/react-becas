import { useState } from "react";

function FamiliaAlta() {

    const [alumnos, setAlumnos] = useState([
        { alumno: ''}
    ]);

    const addAlumno = () => {
        if (alumnos.length >= 5) {
            alert('No se pueden agregar mas de 5 alumnos.')
        } else {
            setAlumnos([...alumnos, { alumno: ''}]);
        }
        
    };

    const deleteAlumno = (index) => {
        if (alumnos.length === 1) {
            alert("Debe al menos haber un alumno para registrar.")
            return 0
        }
        var newAlumnos = alumnos.filter((_, i) => i !== index);
        setAlumnos(newAlumnos)
    }

    const handleAlumnoChange = (index, field, value) => {
        const updatedAlumnos = [...alumnos];
        updatedAlumnos[index][field] = value;
        setAlumnos(updatedAlumnos);
    };

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col">
                    <h5>ALTA DE DATOS FAMILIA</h5>
                </div>
            </div>
            <div className="row mt-3 mb-3">
                <div className="col-2 pt-2">
                    FAMILIA:
                </div>
                <div className="col">
                    <input type="text" id="inputFamiliaName" className="form-control form-control-sm" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-12">
                    <label for="inputSituacionNecesidad" class="form-label">SITUACION POR LA CUAL SE VEN EN LA NECESIDAD DE PEDIR APOYO DE BECA:</label>
                    <textarea class="form-control" id="inputSituacionNecesidad" rows="3"></textarea>
                </div>
            </div>
            <div className="container">
            <div className="row p-3 card mb-3" style={{ flexDirection: "row" }}>
                <h6 style={{ fontWeight: 'bold' }}>1. Datos de quíen(es) solicita(n) la Beca:</h6>
                <div className="col-12 mb-3">
                    {alumnos.map((alumno, index) => (
                        <div className="row my-2">
                            <div className="col-2 d-flex justify-content-center align-items-center">
                                <p className="m-0 p-0">{'Alumno ' + (index+1)}</p>
                            </div>
                            <div className="col">
                                <input className="mx-1 form-control form-control-sm"
                                key={index+"al"}
                                id={"input-alumno-" + index}
                                type="text"
                                value={alumno.alumno}
                                onChange={(e) => handleAlumnoChange(index, 'alumno', e.target.value)}
                                />
                            </div>
                            <div className="col-1">
                                <button className="btn btn-danger btn-sm" onClick={ () => {deleteAlumno(index)} }>X</button>
                            </div>
                        </div>
                    ))}
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary btn-sm" onClick={ addAlumno }>Agregar</button>
                    </div>
                </div>
                <div className="col-4">
                    <label for="inputDomicilio" class="form-label">Domicilio Particular Calle, No:</label>
                    <input type="text" id="inputDomicilio" className="form-control" />
                </div>
                <div className="col-4">
                    <label for="inputColonia" class="form-label">Colonia:</label>
                    <input type="text" id="inputColonia" className="form-control" />
                </div>
                <div className="col-4">
                    <label for="inputMunicipio" class="form-label">Municipio:</label>
                    <input type="text" id="inputMunicipio" className="form-control" />
                </div>
                <div className="col-4">
                    <label for="inputCP" class="form-label">Codigo Postal:</label>
                    <input type="text" id="inputCP" className="form-control" />
                </div>
                <div className="row">
                    <div className="col-5">
                        <label for="inputTelPadre" class="form-label">Telefono Padre:</label>
                        <input type="text" id="inputTelPadre" className="form-control" />
                    </div>
                    <div className="col-5">
                        <label for="inputTelMadre" class="form-label">Telefono Madre:</label>
                        <input type="text" id="inputTelMadre" className="form-control" />
                    </div>
                </div>
            </div>
            <div className="row p-3 card mb-3">
                <h6 style={{ fontWeight:'bold' }}> 2. Datos del Padre </h6>
                <div className="row">
                    <div className="col-6">
                        <label for="inputNombrePadre" class="form-label">Nombre del Padre:</label>
                        <input type="text" id="inputNombrePadre" className="form-control" />
                    </div>
                    <div className="col-2">
                        <label for="inputEdadPadre" class="form-label">Edad:</label>
                        <input type="text" id="inputEdadPadre" className="form-control" />
                    </div>
                    <div className="col-2">
                        <label for="inputPadreVive" class="form-label">Vive:</label>
                        <select id="inputPadreVive" class="form-select form-select-sm" aria-label="Small select example">
                            <option value="si">SI</option>
                            <option value="no">NO</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <label for="inputDireccionPadre" class="form-label">Edad:</label>
                        <input type="text" id="inputDireccionPadre" className="form-control" />
                    </div>
                    <div className="col-12">
                        <label for="inputOcupacionPadre" class="form-label">Ocupacion Actual:</label>
                        <input type="text" id="inputOcupacionPadre" className="form-control" />
                    </div>
                    <div className="col-12">
                        <label for="inputEmpresaPadre" class="form-label">Empresa en que trabaja:</label>
                        <input type="text" id="inputEmpresaPadre" className="form-control" />
                    </div>
                    <div className="col-6">
                        <label for="inputEmailPadre" class="form-label">Empresa en que trabaja:</label>
                        <input type="email" id="inputEmpresaPadre" className="form-control" />
                    </div>
                    <div className="col-6">
                        <label for="inputTelCasaPadre" class="form-label">Empresa en que trabaja:</label>
                        <input type="email" id="inputEmpresaPadre" className="form-control" />
                    </div>
                </div>
            </div>
            <div className="row p-3 card mb-3">
                <h6 style={{ fontWeight: 'bold' }}> 3. Datos de la Madre </h6>
                <div className="row">
                    <div className="col-6">
                        <label for="inputNombreMadre" class="form-label">Nombre de la Madre:</label>
                        <input type="text" id="inputNombrePadre" className="form-control" />
                    </div>
                    <div className="col-2">
                        <label for="inputEdadMadre" class="form-label">Edad:</label>
                        <input type="text" id="inputEdadMadre" className="form-control" />
                    </div>
                    <div className="col-2">
                        <label for="inputMadreVive" class="form-label">Vive:</label>
                        <select id="inputMadreVive" class="form-select form-select-sm" aria-label="Small select example">
                            <option value="si">SI</option>
                            <option value="no">NO</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <label for="inputDireccionMadre" class="form-label">Edad:</label>
                        <input type="text" id="inputDireccionMadre" className="form-control" />
                    </div>
                    <div className="col-12">
                        <label for="inputOcupacionMadre" class="form-label">Ocupacion Actual:</label>
                        <input type="text" id="inputOcupacionMadre" className="form-control" />
                    </div>
                    <div className="col-12">
                        <label for="inputEmpresaMadre" class="form-label">Empresa en que trabaja:</label>
                        <input type="text" id="inputEmpresaMadre" className="form-control" />
                    </div>
                    <div className="col-6">
                        <label for="inputEmailMadre" class="form-label">Empresa en que trabaja:</label>
                        <input type="email" id="inputEmpresaMadre" className="form-control" />
                    </div>
                    <div className="col-6">
                        <label for="inputTelCasaMadre" class="form-label">Empresa en que trabaja:</label>
                        <input type="email" id="inputEmpresaMadre" className="form-control" />
                    </div>
                </div>
            </div>
            </div>
            
        </div>
    )
}

export default FamiliaAlta;