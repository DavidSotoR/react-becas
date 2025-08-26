// Importar las dependencias necesarias
import React, { useState } from "react";

function useForm(initialValues = {}) {
  const [valuesF1, setValuesF1] = useState(initialValues);
  const [errorsF1, setErrorsF1] = useState({});

  const handleChangeF1 = (e) => {
    const { name, value } = e.target;
    
    setValuesF1({
      ...valuesF1,
      [name]: value
    });
  };

  const resetForm1 = () => {
    setValuesF1(initialValues);
    setErrorsF1({});
  };

  return {
    valuesF1,
    errorsF1,
    handleChangeF1,
    setErrorsF1,
    resetForm1
  };
}

function FormEsecDB() {
    const [showModulo, setShowModule]= useState(1);

    const { valuesF1, handleChangeF1 } = useForm({
        nombre: '',
        sexo: 'H',
        edad: 0,
        nacionalidad: '',
        lugar_nacimiento: '',
        fecha_nacimiento: '',
        domicilio: '',
        colonia: '',
        ciudad: '',
        email: '',
        celular: '',
        telefono: '',
        curp: '',
        nss: '',
        rfc: '',
        ine: '',
        pasaporte: '',
        licencia_conductor: '',

    });

    const handleSubmitF1 = (e) => {
        e.preventDefault();
        console.log('Datos:', valuesF1);
    };

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
                    <form onSubmit={handleSubmitF1}>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input name="nombre" className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"
                                value={valuesF1.nombre}
                                onChange={handleChangeF1}
                            />
                        </div>
                        <div className="col-3">
                            <select name="sexo" className="form-select" aria-label="Default select example"
                                value={valuesF1.sexo}
                                onChange={handleChangeF1}>
                            <option value="H">Hombre</option>
                            <option value="M">Mujer</option>
                            </select>
                        </div>
                        <div className="col-3">
                            <input name="edad" className="form-control" type="number" placeholder="Edad:" aria-label="default input example"
                                value={valuesF1.edad}
                                onChange={handleChangeF1}/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input name="nacionalidad" className="form-control" type="text" placeholder="Nacionalidad:" aria-label="default input example"
                                value={valuesF1.nacionalidad}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="lugar_nacimiento" className="form-control" type="text" placeholder="Lugar Nacimiento:" aria-label="default input example"
                                value={valuesF1.lugar_nacimiento}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4 d-flex">
                            <label for="date_m1" className="form-label">Fecha Nacimiento</label>
                            <input name="fecha_nacimiento" id="date_m1" className="form-control" type="date" aria-label="default input example"
                                value={valuesF1.fecha_nacimiento}
                                onChange={handleChangeF1}/>
                        </div>

                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input name="domicilio" className="form-control" type="text" placeholder="Domicilio:" aria-label="default input example"
                                value={valuesF1.domicilio}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="colonia" className="form-control" type="text" placeholder="Colonia:" aria-label="default input example"
                                value={valuesF1.colonia}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="ciudad" className="form-control" type="text" placeholder="Municipio/Ciudad:" aria-label="default input example"
                            value={valuesF1.ciudad}
                                onChange={handleChangeF1}/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input name="email" className="form-control" type="text" placeholder="Correo:" aria-label="default input example"
                            value={valuesF1.email}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="celular" className="form-control" type="text" placeholder="Celular:" aria-label="default input example"
                            value={valuesF1.celular}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="telefono" className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"
                            value={valuesF1.telefono}
                                onChange={handleChangeF1}/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input name="curp" className="form-control" type="text" placeholder="CURP:" aria-label="default input example"
                            value={valuesF1.curp}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="rfc" className="form-control" type="text" placeholder="RFC:" aria-label="default input example"
                            value={valuesF1.rfc}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="nss" className="form-control" type="text" placeholder="NSS:" aria-label="default input example"
                            value={valuesF1.nss}
                                onChange={handleChangeF1}/>
                        </div>
                        
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <input name="ine" className="form-control" type="text" placeholder="INE:" aria-label="default input example"
                            value={valuesF1.ine}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="pasaporte" className="form-control" type="text" placeholder="Pasaporte:" aria-label="default input example"
                            value={valuesF1.pasaporte}
                                onChange={handleChangeF1}/>
                        </div>
                        <div className="col-4">
                            <input name="licencia_conductor" className="form-control" type="text" placeholder="Licencia Conductor:" aria-label="default input example"
                            value={valuesF1.licencia_conductor}
                                onChange={handleChangeF1}/>
                        </div>

                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <button type="submit" className="btn btn-primary me-1 ms-1">Guardar</button>
                        <button type="button" className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>
                    </form>
                </div>
            }

            { showModulo === 2 && //SALUD
                <div id="contenido-2" className="col-12 card pt-2">
                    <p className="fw-bold">SALUD</p>
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label"> ¿Como evaluaria su estado de Salud?</label>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Seleccione una opción</option>
                                <option value="1">Excelente</option>
                                <option value="2">Muy Buena</option>
                                <option value="3">Buena</option>
                                <option value="4">Regular</option>
                                <option value="5">Mala</option>
                            </select>
                        </div>
                        <div className="col-6">
                            <label className="form-label">¿Por que?</label>
                            <input className="form-control" type="text" placeholder="" aria-label="default input example"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label"> PADECE O HA PADECIDO ALGUNA ENFERMEDAD CRONICA?</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="0" selected>No</option>
                                <option value="1">Sí</option>
                            </select>
                        </div>
                        <div className="col-8">
                            <label className="form-label">¿Cual?</label>
                            <input className="form-control" type="text" placeholder="¿Cual?" aria-label="default input example"/>
                        </div>
                        
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label"> PADECE O HA PADECIDO ALGUNA ENFERMEDAD CRONICA?</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="0" selected>No</option>
                                <option value="1">Sí</option>
                            </select>
                        </div>
                        <div className="col-8">
                            <label className="form-label">DEFINA</label>
                            <input className="form-control" type="text" placeholder="DEFINA" aria-label="default input example"/>
                        </div>
                        
                    </div>
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label">PRACTICA ALGUN DEPORTE?</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="0" selected>No</option>
                                <option value="1">Sí</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">¿Cual?</label>
                            <input className="form-control" type="text" placeholder="Cual" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">Frecuencia</label>
                            <input className="form-control" type="text" placeholder="Frecuencia" aria-label="default input example"/>
                        </div>
                        
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>
                </div>
            }

            { showModulo === 3 && // NIVEL DE EDUCACION

                <div id="contenido-3" className="col-12 card pt-2">
                    <p className="fw-bold">NIVEL DE EDUCACION</p>
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label">ULTIMO GRADO DE ESTUDIOS</label>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Seleccione una opción</option>
                                <option value="1">Primarua</option>
                                <option value="2">Secundaria</option>
                                <option value="3">Bachillerato</option>
                                <option value="4">Tecnica</option>
                                <option value="5">Licenciatura</option>
                                <option value="6">Maestria</option>
                                <option value="7">Postgrado</option>
                                <option value="8">Doctorado</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">LUGAR</label>
                            <input className="form-control" type="text" placeholder="LUGAR" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">CUENTA CON UN DOCUMENTO</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="2">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">DOCUMENTO</label>
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Seleccione una opción</option>
                                <option value="1">Certificado</option>
                                <option value="2">Kardex</option>
                                <option value="3">Carta Pasante</option>
                                <option value="4">Cedula Profesional</option>
                                <option value="5">Constancia/Diploma</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">ACTUALMENTE ESTUDIA</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="2">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">QUE ESTUDIA?</label>
                            <input className="form-control" type="text" placeholder="ESTUDIA:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">LUGAR</label>
                            <input className="form-control" type="text" placeholder="LUGAR:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">PERIODO</label>
                            <input className="form-control" type="text" placeholder="PERIODO:" aria-label="default input example"/>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>
                </div>

            }

            { showModulo === 4 && // LABORAL
                <div id="contenido-2" className="col-12 card pt-2">
                    <p className="fw-bold">LABORAL</p>
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label">CUAL ES EL INTERES DE INGRESAR A LA EMPRESA</label>
                            <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">PARA QUE PUESTO SE POSTULA</label>
                            <input className="form-control" type="text" placeholder="Puesto:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">CUAL ES LA DISTANCIA A LA EMPRESA Y MEDIO DE TRANSPORTE</label>
                            <input className="form-control" type="text" placeholder="Distancia y tiempo:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">TIENES FAMILIARES QUE TRABAJEN O TRABAJARON EN LA EMPRESA?</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">NOMBRE DE FAMILIAR</label>
                            <input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">PARENTESCO</label>
                            <input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">PUESTO</label>
                            <input className="form-control" type="text" placeholder="puesto:" aria-label="default input example"/>
                        </div>
                        <div className="col-4 mb-3">
                            <label className="form-label">CUANTOS EMPLEOS HA TENIDO DE 6 AÑOS ATRÁS A LA FECHA</label>
                            <input className="form-control" type="number" placeholder="Cantidad:" aria-label="default input example"/>
                        </div>
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <td>EMPRESA</td>
                                        <td>PUESTO</td>
                                        <td>ANTIGUEDAD</td>
                                        <td>MOTIVO SEPARACION</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Empresa:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Puesto:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Antiguedad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Motivo:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Empresa:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Puesto:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Antiguedad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Motivo:" aria-label="default input example"/></td>                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Empresa:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Puesto:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Antiguedad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Motivo:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Empresa:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Puesto:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Antiguedad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Motivo:" aria-label="default input example"/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                            <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                        </div>
                    </div>
                </div>
            }

            { showModulo === 5 &&
                <div id="contenido-2" className="col-12 card pt-2">
                    <p className="fw-bold">CONDICIONES GENERALES DE LA VIVIENDA, ZONA Y NIVEL SOCIAL</p>
                    
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label">ZONDA DE UBICACIÓN DE LA COLONIA</label>
                            <select class="form-select" aria-label="Default select example"> 
                                <option value="1">Residencial</option>
                                <option value="2">Interes social</option>
                                <option value="3">Popular</option>
                                <option value="4">Rural</option>
                                <option value="5">Industrial</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">NIVEL SOCIAL</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">Alta</option>
                                <option value="2">Media Alta</option>
                                <option value="3">Media</option>
                                <option value="4">Media Baja</option>
                                <option value="5">Baja</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">ZONA DE RIESGO</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">Segura</option>
                                <option value="2">Insegura</option>
                                <option value="3">Medio</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">CUENTA CON TODOS LOS SERVICIOS NECESARIOS, CALLES PAVIMENTADAS Y ALUMBRADO PUBLICO</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">DEFINIR FALTANTE</label>
                            <input className="form-control" type="text" placeholder="Faltantes:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">AVENIDAS PRINICIPALES CERCA DEL DOMICILIO</label>
                            <input className="form-control" type="text" placeholder="Referencia:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">TRANSPORTE QUE PASA POR LA COLONIA</label>
                            <input className="form-control" type="text" placeholder="Rutas:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">ESTRUCTURA DE LA VIVIENDA</label>
                            <input className="form-control" type="text" placeholder="Estado vivienda:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">CONDICIONES DE LA VIVIENDA Y MOBILIARIO</label>
                            <input className="form-control" type="text" placeholder="Estado Mobiliario:" aria-label="default input example"/>
                        </div>  
                        <div className="col-4">
                            <label className="form-label">CUANTO TIEMPO TIENE VIVIENDO EN EL DOMICILIO ACTUAL?</label>
                            <input className="form-control" type="text" placeholder="Tiempo:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">EN CASO DE SER MENOR A UN AÑO, DESCRIBIR DONDE VIVIA, CUANTO TIEMPO VIVIO Y MOTIVO DEL CAMBIO?</label>
                            <input className="form-control" type="text" placeholder="Motivo:" aria-label="default input example"/>
                        </div>
                        
                    </div>
                    
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>

            }

            { showModulo === 6 && // INFORMACION FAMILIAR

                <div id="contenido-2" className="col-12 card pt-2">
                    <p className="fw-bold">INFORMACION FAMILIAR</p>
                    <div className="row mb-3">
                        <div className="col-12 mb-3">
                            <p className="fw-bold">CON QUIEN VIVE EN EL DOMICILIO?</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <td>PARENTESCO</td>
                                        <td>NOMBRE</td>
                                        <td>EDAD</td>
                                        <td>SE DEDICA A</td>
                                        <td>TELEFONO</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>                                 </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-12 mb-2">
                            <p className="fw-bold">FAMILIA DIRECTA QUE NO VIVE CON EL CANDIDATO?</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <td>PARENTESCO</td>
                                        <td>NOMBRE</td>
                                        <td>EDAD</td>
                                        <td>SE DEDICA A</td>
                                        <td>TELEFONO</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>                                 </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Nombre:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Edad:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Se dedica a :" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Telefono:" aria-label="default input example"/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-6">
                            <label className="form-label">FAMILIAR QUE TRABAJE O TRABAJO COMO POLICIA, MILITAR O PARA EL GOBIERNO</label>
                            <input className="form-control" type="text" placeholder="Familiar en Gobierno:" aria-label="default input example"/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>

            }

            { showModulo === 7 && // SITUACION ECONOMICA

                <div id="contenido-2" className="col-12 card pt-2">
                    <p className="fw-bold">SITUACION ECONOMICA</p>
                    <div className="row mb-3">
                        <div className="col-4">
                            <label className="form-label">LA CASA DONDE VIVE ES PROPIA?</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">ESPECIFIQUE</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">Propia</option>
                                <option value="2">Rentada</option>
                                <option value="3">Vive con Familiares</option>
                                <option value="4">Hipotecada</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">VALOR COMERCIAL</label>
                            <input className="form-control" type="number" placeholder="Valor:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">CUENTA CON VEHICULO PROPIO?</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">MARCA, MODELO, AÑO</label>
                            <input className="form-control" type="text" placeholder="Valor:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">ESPECIFIQUE</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">Propia</option>
                                <option value="2">Pagando Credito Automotriz</option>
                                <option value="3">Usa el de la familia</option>
                            </select>
                        </div>

                        <div className="col-12 mb-3">
                            <p className="fw-bold">TIENE DEUDAS PERSONALES</p>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <td>CONCEPTO</td>
                                        <td>ADEUDO</td>
                                        <td>PAGO MENSUAL</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Concepto:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Adeudo:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Pago Mensual:" aria-label="default input example"/></td>
                                        
                                    </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Concepto:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Adeudo:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Pago Mensual:" aria-label="default input example"/></td>
                                                               </tr>
                                    <tr>
                                        <td><input className="form-control" type="text" placeholder="Concepto:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Adeudo:" aria-label="default input example"/></td>
                                        <td><input className="form-control" type="text" placeholder="Pago Mensual:" aria-label="default input example"/></td>
                                      
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="col-4">
                            <label className="form-label">MANEJA CREDITOS COMERCIALES</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">MANEJA TARJETAS DE CREDITO</label>
                            <select class="form-select" aria-label="Default select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-4">
                            <label className="form-label">DEFINA SITUACION CREDITICIA</label>
                            <input className="form-control" type="text" placeholder="Descripcion:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">SUELDO ACTUAL</label>
                            <input className="form-control" type="number" placeholder="Sueldo:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">OTRO INGRESO / DEFINIR</label>
                            <input className="form-control" type="number" placeholder="Otro:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">PERSONAS DEPENDEN ECONOMICAMENTE DE UD.</label>
                            <input className="form-control" type="text" placeholder="Dependen:" aria-label="default input example"/>
                        </div>
                        <div className="col-4">
                            <label className="form-label">PARENTESCO</label>
                            <input className="form-control" type="text" placeholder="Parentesco:" aria-label="default input example"/>
                        </div>

                        <div className="col-12 mb-3">
                            <p className="fw-bold">GASTOS MENSUALES</p>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <label htmlFor="">ALIMENTACION Y DESPENSA:</label>
                                            <input className="form-control" type="number" placeholder="ALIMENTACION Y DESPENSA:" aria-label="default input example"/></td>
                                        <td>
                                            <label htmlFor="">COLEGIATURAS</label>
                                            <input className="form-control" type="number" placeholder="COLEGIATURAS:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="">HIPOTECA / RENTA</label>
                                            <input className="form-control" type="number" placeholder="HIPOTECA / RENTA:" aria-label="default input example"/></td>
                                        <td>
                                            <label htmlFor="">CONSULTAS / MEDICAMENTOS</label>
                                            <input className="form-control" type="number" placeholder="CONSULTAS / MEDICAMENTOS:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="">SERVICIOS</label>
                                            <input className="form-control" type="number" placeholder="SERVICIOS:" aria-label="default input example"/></td>
                                        <td>
                                            <label htmlFor="">SEGUROS</label>
                                            <input className="form-control" type="number" placeholder="SEGUROS:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="">TRANSPORTE / GASOLINA</label>
                                            <input className="form-control" type="number" placeholder="TRANSPORTE / GASOLINA:" aria-label="default input example"/></td>
                                        <td>
                                            <label htmlFor="">DEUDAS</label>
                                            <input className="form-control" type="number" placeholder="DEUDAS:" aria-label="default input example"/></td>
                                        
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="">ROPA Y CALZADO</label>
                                            <input className="form-control" type="number" placeholder="ROPA Y CALZADO:" aria-label="default input example"/>
                                        </td>
                                        <td>
                                            <label htmlFor="">AHORRO</label>
                                            <input className="form-control" type="number" placeholder="AHORRO:" aria-label="default input example"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="">DIVERSION</label>
                                            <input className="form-control" type="number" placeholder="DIVERSION:" aria-label="default input example"/></td>
                                        <td>
                                            <label htmlFor="">VACACIONES</label>
                                            <input className="form-control" type="number" placeholder="VACACIONES:" aria-label="default input example"/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label htmlFor="">TOTAL DE INGRESOS</label>
                                            <input className="form-control" type="number" placeholder="DIVERSION:" aria-label="default input example"/></td>
                                        <td>
                                            <label htmlFor="">TOTAL DE GASTOS MENSUALES</label>
                                            <input className="form-control" type="number" placeholder="VACACIONES:" aria-label="default input example"/></td>
                                        <td>
                                            <label htmlFor="">DIFERENCIA</label>
                                            <input className="form-control" type="number" placeholder="VACACIONES:" aria-label="default input example"/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        

                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => anteriorEtapa() }>Anterior</button>
                        <button className="btn btn-primary me-1 ms-1" onClick={ () => siguienteEtapa() }>Siguinte</button>
                    </div>

                </div>

            }

            { showModulo === 8 &&

                <div id="contenido-2" className="col-12 card pt-2">
                    <p className="fw-bold">REFERENCIAS VECINOS </p>
                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="row">
                                <p className="fw-bold">REFERENCIA 1</p>
                                <div className="col-4">
                                    <label className="form-label">NOMBRE</label>
                                    <input className="form-control" type="text" placeholder="NOMBRE:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">TELEFONO</label>
                                    <input className="form-control" type="text" placeholder="TELEFONO:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">CUANTO TIEMPO TIENE QUE CONOCE AL CANDIDATO</label>
                                    <input className="form-control" type="text" placeholder="Especifique:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">SABE SI EL CANDIDATO HA TENIDO PROBLEMAS CON LA JUSTICIA</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">SABE SI EL CANDIDATOS FUMA, TOMA ALCOHOL, INGIERE ALGUNA SUBSTANCIA TOXICA</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">COMO ES LA RELACION FAMILIAR O CON LAS PERSONAS QUE VIVE</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">COMO LO PUEDE DESCRIBIR COMO PERSONA, MANERA DE SER, COMO SE RELACIONA CON LOS DEMAS</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                            </div>
                            
                        </div>
                        <div className="col-12">
                            <p className="fw-bold">REFERENCIA 2</p>
                            <div className="row">
                                <div className="col-4">
                                    <label className="form-label">NOMBRE</label>
                                    <input className="form-control" type="text" placeholder="NOMBRE:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">TELEFONO</label>
                                    <input className="form-control" type="text" placeholder="TELEFONO:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">CUANTO TIEMPO TIENE QUE CONOCE AL CANDIDATO</label>
                                    <input className="form-control" type="text" placeholder="Especifique:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">SABE SI EL CANDIDATO HA TENIDO PROBLEMAS CON LA JUSTICIA</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">SABE SI EL CANDIDATOS FUMA, TOMA ALCOHOL, INGIERE ALGUNA SUBSTANCIA TOXICA</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">COMO ES LA RELACION FAMILIAR O CON LAS PERSONAS QUE VIVE</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                                <div className="col-4">
                                    <label className="form-label">COMO LO PUEDE DESCRIBIR COMO PERSONA, MANERA DE SER, COMO SE RELACIONA CON LOS DEMAS</label>
                                    <input className="form-control" type="text" placeholder="Describa:" aria-label="default input example"/>
                                </div>
                            </div>
                            
                        </div>
                        

                    </div>
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
