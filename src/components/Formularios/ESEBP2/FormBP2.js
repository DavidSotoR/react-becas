// Importar las dependencias necesarias
import React, { useState } from "react";
import Navbar from "../../NavBar/NavBar";

function FormBP2() {
    var Familia = 'Perez Garcia';
    var colegio = "Colegio Oxford";
    var campus = "San Pedro";
    const [alumnos, setAlumnos] = useState([
        { alumno: '', grado: '', beca: '' }
    ]);

    const addAlumno = () => {
        setAlumnos([...alumnos, { alumno: '', grado: '', beca: '' }]);
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
        <div className="">
            <Navbar />
            <div id="body-form">
                <div id="titulos-form" className="d-grid justify-content-center">
                    <h3 className="text-center">ESTUDIO SOCIOECONÓMICO PARA BECAS</h3>
                    <h3 className="text-center">Colegio: {colegio}</h3>
                    <h3 className="text-center">Campus: {campus}</h3>
                    <h4 className="text-center">Familia: {Familia}  </h4>
                </div>
                <div id="contenido-form" className="d-grid justify-content-center">
                    <div id="list-alumnos" className="d-grid" style={{ width:"50%" }}>
                    <div className="container text-center">
                        <div className="row align-items-start">
                            <div className="col">
                                <p>Alumno</p>
                            </div>
                            <div className="col">
                                <p>Grado a Cursar</p>
                            </div>
                            <div className="col">
                                <p>Beca Actual</p>
                            </div>
                            <div className="col">
                                <p>Eliminar</p>
                            </div>
                        </div>
                    </div>
                        {alumnos.map((alumno, index) => (
                            <div className="d-flex my-1">
                                <input className="mx-1"
                                key={index+"al"}
                                id={"input-alumno-" + index}
                                type="text"
                                value={alumno.alumno}
                                onChange={(e) => handleAlumnoChange(index, 'alumno', e.target.value)}
                                placeholder={'Alumno ' + index}
                            />
                            <input className="mx-1"
                                key={index+"gr"}
                                id={"input-grado-" + index}
                                type="text"
                                value={alumno.grado}
                                onChange={(e) => handleAlumnoChange(index, 'grado', e.target.value)}
                                placeholder={'Grado ' + index}
                            />
                            <input className="mx-1"
                                key={index+"beca"}
                                id={"input-beca-" + index}
                                type="text"
                                value={alumno.beca}
                                onChange={(e) => handleAlumnoChange(index, 'beca', e.target.value)}
                                placeholder={'Beca ' + index}
                            />
                            <button className="btn btn-danger" onClick={ () => {deleteAlumno(index)} }>Eliminar</button>
                            </div>
                        ))}
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary btn-small" onClick={ addAlumno }>Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exportar el componente FormBP2 por defecto
export default FormBP2;
