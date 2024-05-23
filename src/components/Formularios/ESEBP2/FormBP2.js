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

    const [deudasMensuales, setDeudasMensuales] = useState([
        { concepto: 'Tarjeta de Credito', deudaTotal: '0', mensualidad: '0' },
        { concepto: 'Tarjeta Departamentales', deudaTotal: '0', mensualidad: '0' },
        { concepto: 'Prestamos Bancarios/Nomina/Familiares', deudaTotal: '0', mensualidad: '0' },
        { concepto: 'Credito Hipotecario', deudaTotal: '0', mensualidad: '0' },
        { concepto: 'Credito Automotriz', deudaTotal: '0', mensualidad: '0' },
    ]);

    const [ingresosPorMes, setIngresosPorMes] = useState([
        { tipoIngreso: 'INGRESO NETO'},{ tipoIngreso: 'BONOS DE DESPENSA'},{ tipoIngreso: 'VALES  GASOLINA'},
        { tipoIngreso: 'COMISIONES POR VENTAS'},{ tipoIngreso: 'AGUINALDO'},{ tipoIngreso: 'BONO DE  PRODUCTIVIDAD'},
        { tipoIngreso: 'FONDO DE AHORRO'},{ tipoIngreso: 'UTILIDADES'},{ tipoIngreso: 'PRIMA VACACIONAL'},
        { tipoIngreso: 'RENTA QUE RECIBA'},{ tipoIngreso: 'AYUDA QUE RECIBA'}
    ]);

    const [egresosPorMes, setEgresosPorMes] = useState([
        { tipoEgreso: 'DESPENSA'},{ tipoEgreso: 'HIPOTECA  CASA, TERRENO'},{ tipoEgreso: 'RENTA'},
        { tipoEgreso: 'SERVICIOS , LUZ, AGUA, GAS, TELEFONO, INTERNET, TV PAGA, CELULARES'},{ tipoEgreso: 'MTTO. Y SEGURIDAD FRACCIONAMIENTO'},{ tipoEgreso: 'CREDITO AUTOMOTRIZ'},
        { tipoEgreso: 'GASOLINA Y TRANSPORTE'},{ tipoEgreso: 'SERVICIO DOMESTICO'},{ tipoEgreso: 'MASCOTAS'},
        { tipoEgreso: 'ROPA Y CALZADO'},{ tipoEgreso: 'MEMBRESIA DEPORTIVO O CLUB'},{ tipoEgreso: 'COLEGIATURA, ESTANCIA, EXTRACURRICULARES EN EL COLEGIO'},
        { tipoEgreso: 'ESPARCIMIENTO (RESTAURANTES, PASEOS, CINE, CONVIVIOS'},{ tipoEgreso: 'AYUDA A PARIENTES'},{ tipoEgreso: 'AHORRO PARA EL RETIRO'},
        
    ]);

    const [egresosAnual, setEgresosAnual] = useState([
        { tipoEgreso: 'SEGURO DE VIDA'},{ tipoEgreso: 'SEGUBECA'},{ tipoEgreso: 'SEGURO GMM'},
        { tipoEgreso: 'SEGURO DE AUTO'},{ tipoEgreso: 'TENENCIA'},{ tipoEgreso: 'MTTO. AUTO'},
        { tipoEgreso: 'SEGURO DE CASA'},{ tipoEgreso: 'PREDIAL'},{ tipoEgreso: 'MTTO. CASA'},
        { tipoEgreso: 'VACACIONES (1 AÑO ATRÁS)'},{ tipoEgreso: 'CONSULTAS, TRATAMIENTOS, ESPECIALISTAS'},{ tipoEgreso: 'GASTOS ANUALES EDUCACION (INSCRIPCIONES, LIBROS, ULTILES, UNIFORMES, CALZADO, SOCIEDAD DE PADRES, FIDEICOMISOS, PLATAFORMAS)'},
        { tipoEgreso: 'PRESTAMO FAMILIAR, BANCARIO, NOMINA'},{ tipoEgreso: 'OTROS VARIOS'}
        
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

    const renderFilasTablaDeudasMensuales = () => {
        return deudasMensuales.map((deuda, index) => (
            <tr key={'tr-deuda-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{deuda.concepto}</p>
                </td>
                <td>
                    <input type="text" className="form-control" id={`input-deuda-${index}`} placeholder="$0.00" />
                </td>
                <td>
                    <input type="text" className="form-control" id={`input-deuda-${index}`} placeholder="$0.00"/>
                </td>
            </tr>
        ));
    };

    const renderFilasTablaEgresosMensuales = () => {
        return egresosPorMes.map((egreso, index) => (
            <tr key={'tr-deuda-'+index}>
                <td>
                    <p>{egreso.tipoEgreso}</p>
                </td>
                <td>
                    <input type="text" className="form-control" id={`input-egreso-${index}`} placeholder="$0.00" />
                </td>
            </tr>
        ));
    };

    const renderFilasTablaEgresoAnual = () => {
        return egresosAnual.map((egreso, index) => (
            <tr key={'tr-deuda-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{egreso.tipoEgreso}</p>
                </td>
                <td>
                    <input type="text" className="form-control" id={`input-egresoan-${index}`} placeholder="$0.00" />
                </td>
            </tr>
        ));
    };

    return (
        <div className="">
            <div id="body-form">
                <div id="titulos-form" className="d-grid justify-content-center">
                    <h3 className="text-center">ESTUDIO SOCIOECONÓMICO PARA BECAS</h3>
                    <h3 className="text-center">Colegio: {colegio}</h3>
                    <h3 className="text-center">Campus: {campus}</h3>
                    <h4 className="text-center">Familia: {Familia}  </h4>
                </div>
                <div id="contenido-form" className="d-grid justify-content-center m-3">
                    <div id="list-alumnos" className="d-grid justify-content-center mb-5" >
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
                    <div id="container-1-form" className="mb-5">
                        <label for="exampleFormControlTextarea1" className="form-label" style={{ fontWeight:"bold", fontSize:"1rem" }}>1. Situacion por la cual solicita el apoyo de beca:</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <div id="container-2-form" className="mb-5">
                        <h5 className="mb-2">2. Familia economicamente activa.</h5>
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
                    <div id="container-3-form" className="mb-5">
                        <h5 className="mb-2">3. Ingresos por mes.</h5>
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
                    <div id="container-4-form" className="mb-5">
                        <h5 className="mb-2">4. Quienes dependen economicamente del ingreso familiar</h5>
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
                    <div id="container-5-form" className="mb-5">
                        <h5 className="mb-2">5. Vehiculos:</h5>
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
                    <div id="container-6-form" className="mb-5">
                        <h5>6. Casa Habitacion</h5>
                        <div className="row">
                            <div className="col mb-2">
                                <label for="casa-comprobo" className="mb-2">Comprobo con:</label>
                                <select id="casa-comprobo" class="form-select" aria-label="Default select example">
                                    <option value="1" selected>Contrato de renta</option>
                                    <option value="2" >Pago de Renta</option>
                                    <option value="3" >Credito/Pago Hipotecario</option>
                                    <option value="4" >Pago Hipoteca </option>
                                    <option value="5" > Recibo de Servicios</option>
                                    <option value="No" >No comprobo </option>
                                </select>
                            </div>
                            <div className="col mb-3">
                                <label htmlFor="cantidad-casa" class="form-label">Pago Hipoteca o Renta</label>
                                <input type="text" class="form-control" id="cantidad-casa" placeholder="$0.00"/>
                            </div>
                            <div className="col mb-3">
                                <label htmlFor="valor-casa" class="form-label">Valor comercial aproximado</label>
                                <input type="text" class="form-control" id="valor-casa" placeholder="$0.00"/>
                            </div>
                        </div>
                        <p>Cuenta con otra casa, Terreno, Departamento, Locales, etc.</p>
                        <div className="row">
                            <div className="col-4">
                                <select class="form-select" aria-label="Default select example">
                                    <option value="1" selected>Propia/Liquidada</option>
                                    <option value="2" >Rentada</option>
                                    <option value="2" >Hipoteca </option>
                                    <option value="3" >Prestado/Familiar </option>
                                    <option value="4" > Prestada/Amistades</option>
                                    <option value="5" >Vive con parientes </option>
                                </select>   
                            </div>
                            <div className="col mt-0">
                                <div className="row">
                                    <label for="staticEmail" class="col-4 col-form-label" style={{ width: "140px" }}>Valor Comercial</label>
                                    <div class="col-6">
                                        <input type="text" class="form-control" id="staticEmail" placeholder="$0.00"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex p-1">
                            <button className="btn btn-primary btn-small">Agregar Familiar</button>
                        </div>
                        <div className="d-grid p-1">
                            <h5>Subtotal: $ 0</h5>
                            <h5>Total: $ 0</h5>
                        </div>
                    </div>
                    <div id="container-7-form" className="mb-5">
                        <h5>7. Deudas Mensuales</h5>
                        <div className="">
                            <p className="mb-0">¿Cuenta con Deudas mensuales?</p>
                            <select class="form-select" aria-label="Default select example" style={{ width:"100px" }}>
                                <option value="1">Si</option>
                                <option value="0" selected>No</option>
                            </select>   
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Concepto</th>
                                    <th scope="col">Total a deber</th>
                                    <th scope="col">Mensualidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                { renderFilasTablaDeudasMensuales() }
                            </tbody>
                        </table>
                        
                    </div>
                    <div id="container-8-form" className="mb-5">
                        <h5>8. Gastos Familiares Mensuales</h5>
                        <div className="container">
                            <div className="row mb-4">
                                <div className="col">
                                    <table>
                                        <tbody> { renderFilasTablaEgresosMensuales() } </tbody>
                                    </table>
                                </div>
                                <div className="col">
                                    <table>
                                        <tbody> { renderFilasTablaEgresoAnual() } </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center">
                                <h5>Total: $0</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exportar el componente FormBP2 por defecto
export default FormBP2;
