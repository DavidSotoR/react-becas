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

    const [familiaEA, setFamiliaEA] = useState([
        { integrante: 'Padre', activo: 'si', empresa: '' },
        { integrante: 'Madre', activo: 'si', empresa: '' },
    ]);

    const [ingresosPorMes, setIngresosPorMes] = useState([
        { tipoIngreso: 'INGRESO NETO'},{ tipoIngreso: 'BONOS DE DESPENSA'},{ tipoIngreso: 'VALES  GASOLINA'},
        { tipoIngreso: 'COMISIONES POR VENTAS'},{ tipoIngreso: 'AGUINALDO'},{ tipoIngreso: 'BONO DE  PRODUCTIVIDAD'},
        { tipoIngreso: 'FONDO DE AHORRO'},{ tipoIngreso: 'UTILIDADES'},{ tipoIngreso: 'PRIMA VACACIONAL'},
        { tipoIngreso: 'RENTA QUE RECIBA'},{ tipoIngreso: 'AYUDA QUE RECIBA'}
    ]);

    const addAlumno = () => {
        setAlumnos([...alumnos, { alumno: '', grado: '', beca: '' }]);
    };

    const addFamiliaEA = () => {
        setAlumnos([...familiaEA, {integrante: '', activo: '', empresa: ''}])
    }
    
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

    const handleFamiliaEA = (index, field, value) => {
        const updateFamiliaEA = [...familiaEA];
        updateFamiliaEA[index][field] = value
        setFamiliaEA(updateFamiliaEA)
    }

    const renderFilasTabla = () => {
        return ingresosPorMes.map((ingreso, index) => (
            <tr key={'tr-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{ingreso.tipoIngreso}</p>
                </td>
                <td>
                    <input type="text" className="form-control" id={`input-tipo-${index}`} placeholder="0.00" />
                </td>
                <td>
                    <input type="text" className="form-control" id={`input-tipo-${index}`} placeholder="0.00"/>
                </td>
                <td>
                    <input type="text" className="form-control" id={`input-tipo-${index}`} placeholder="0.00"/>
                </td>
            </tr>
        ));
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
                <div id="contenido-form" className="d-grid justify-content-center m-3">
                    <div id="list-alumnos" className="d-grid justify-content-center mb-3" >
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
                            <button className="btn btn-danger" onClick={ () => {deleteAlumno(index)} }>X</button>
                            </div>
                        ))}
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary btn-small" onClick={ addAlumno }>Agregar</button>
                        </div>
                    </div>
                    <div id="container-1-form" className="mb-3">
                        <label for="exampleFormControlTextarea1" className="form-label">1. Situacion por la cual solicita el apoyo de beca:</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <div id="container-2-form" className="mb-3">
                        <p className="mb-2">2. Familia economicamente activa.</p>
                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th scope="col">Integrante:</th>
                                    <th scope="col">Activo laboralmente</th>
                                    <th scope="col">Nombre de la empresa</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="text" class="form-control" id="input-padre" value="Padre" disabled/>
                                    </td>
                                    <td>
                                        <select class="form-select" aria-label="Default select example">
                                            <option value="si" selected>Si</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" id="input-empresa" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="text" class="form-control" id="input-padre" value="Madre" disabled/>
                                    </td>
                                    <td>
                                        <select class="form-select" aria-label="Default select example">
                                            <option value="si" selected>Si</option>
                                            <option value="no">No</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" id="input-empresa" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary btn-small">Agregar Familia</button>
                        </div>
                    </div>
                    <div id="container-3-form" className="mb-3">
                        <p className="mb-2">3. Ingresos por mes.</p>
                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th scope="col">Tipo Ingreso</th>
                                    <th scope="col" className="text-center">Padre</th>
                                    <th scope="col" className="text-center">Madre</th>
                                    <th scope="col" className="text-center">Otro(s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderFilasTabla()}
                                <tr>
                                    <td>
                                        <p style={{ fontWeight: "bold" }}>Sub Total</p>
                                    </td>
                                    <td className="text-center">
                                        <p style={{ fontWeight: "bold" }}>$ 0</p>
                                    </td>
                                    <td className="text-center">
                                    <p style={{ fontWeight: "bold" }}>$ 0</p>
                                    </td>
                                    <td className="text-center">
                                        <p style={{ fontWeight: "bold" }}>$ 0</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{ fontWeight: "bold" }}>Total</p>
                                    </td>
                                    <td className="text-center">
                                        <p style={{ fontWeight: "bold" }}>$ 0</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="container-4-form" className="mb-3">
                        <p className="mb-2">4. Quienes dependen economicamente del ingreso familiar</p>
                        <div className="d-flex">
                            <div className="m-1">
                                <select class="form-select" aria-label="Default select example">
                                    <option value="Modelo1" selected>Padre</option>
                                    <option value="Modelo2">Madre</option>
                                    <option value="Modelo2">Hijo</option>
                                    <option value="Modelo2">Hija</option>
                                    <option value="Otro" >Otro </option>
                                </select>
                            </div>
                            <div className="m-1">
                                <input placeholder="Nombre:" type="text" class="form-control" id="input-nombre" />
                            </div>
                        </div>
                        <div className="d-flex p-1">
                            <button className="btn btn-primary btn-small">Agregar Familiar</button>
                        </div>
                    </div>
                    <div id="container-5-form" className="mb-3">
                        <p className="mb-2">5. Vehiculos:</p>
                        <table className="table mt-2">
                            <thead>
                                <tr>
                                    <th scope="col">Tipo</th>
                                    <th scope="col" className="text-center">Marca</th>
                                    <th scope="col" className="text-center">Modelo</th>
                                    <th scope="col" className="text-center">Año</th>
                                    <th scope="col" className="text-center">Valor Aproximado</th>
                                    <th scope="col" className="text-center">Propietario</th>
                                    <th scope="col" className="text-center">Comprobado con</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select class="form-select" aria-label="Default select example">
                                            <option value="Automovil" selected>Automovil</option>
                                            <option value="Pick Up" >Pick Up</option>
                                            <option value="Minivan" >Minivan </option>
                                            <option value="Suv" >Suv </option>
                                            <option value="Motocicleta" > Motocicleta</option>
                                            <option value="Otro" >Otro </option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <select class="form-select" aria-label="Default select example">
                                            <option value="BMW" selected>BMW</option>
                                            <option value="Otro" >Otro </option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <select class="form-select" aria-label="Default select example">
                                            <option value="Modelo1" selected>Modelo 1</option>
                                            <option value="Modelo2" selected>Modelo 2</option>
                                            <option value="Otro" >Otro </option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <input type="text" class="form-control" id="input-año" value="" placeholder="Año:"/>
                                    </td>
                                    <td className="text-center">
                                        <input type="text" class="form-control" id="input-año" value="" placeholder="Valor:"/>
                                    </td>
                                    <td className="text-center">
                                        <select class="form-select" aria-label="Default select example">
                                            <option value="propio" selected>Propio</option>
                                            <option value="empresa" selected>Prestado</option>
                                            <option value="prestado" >Empresa</option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <select class="form-select" aria-label="Default select example">
                                            <option value="factura" selected>Factura</option>
                                            <option value="tarjeta" selected>Tarjeta Circulacion</option>
                                            <option value="no" >No comprobo</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="">
                                        <p style={{ fontWeight:"bold" }}>TOTAL:</p>
                                    </td>
                                    <td className="text-center">
                                        <p style={{ fontWeight:"bold" }}>$ 0</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exportar el componente FormBP2 por defecto
export default FormBP2;
