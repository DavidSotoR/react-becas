import { useState } from "react";

function FamiliaAlta() {
    const [alumnos, setAlumnos] = useState([
        { alumno: ''}
    ]);

    const addAlumno = () => {
        setAlumnos([...alumnos, { alumno: ''}]);
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
                    <h3>SOLICITUD PARA EL ESTUDIO SOCIOECONÓMICO 1/2</h3>
                </div>
            </div>
            <div className="row mt-3 mb-3">
                <div className="col-2 pt-2">
                    FAMILIA:
                </div>
                <div className="col-10">
                    <input type="text" id="inputFamiliaName" cla="form-control" />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-12">
                    <label for="inputSituacionNecesidad" class="form-label">SITUACION POR LA CUAL SE VEN EN LA NECESIDAD DE PEDIR APOYO DE BECA:</label>
                    <textarea class="form-control" id="inputSituacionNecesidad" rows="3"></textarea>
                </div>
            </div>
            <div className="row card">
                <h5>Datos de quíen(es) solicita(n) la Beca:</h5>
                <div className="col-12">
                        {alumnos.map((alumno, index) => (
                            <div className="row">
                                <div className="col">
                                    <p className="">{'Alumno ' + index+1}</p>
                                </div>
                                <div className="col">
                                    <input className="mx-1 form-control"
                                    key={index+"al"}
                                    id={"input-alumno-" + index}
                                    type="text"
                                    value={alumno.alumno}
                                    onChange={(e) => handleAlumnoChange(index, 'alumno', e.target.value)}
                                    />
                                </div>
                                <div className="col">
                                    <button className="btn btn-danger" onClick={ () => {deleteAlumno(index)} }>X</button>
                                </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary btn-small" onClick={ addAlumno }>Agregar</button>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default FamiliaAlta;