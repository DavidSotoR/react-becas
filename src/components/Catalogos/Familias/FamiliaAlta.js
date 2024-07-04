import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

function FamiliaAlta() {
    const { logout } = useContext(AuthContext);
    const { IDFAMILIA } = useParams();
    const APIURL = process.env.REACT_APP_API_URL

    const [alumnos, setAlumnos] = useState([
        { alumno: ''}
    ]);

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [ tieneAlumnos, setTieneAlumnos ] = useState(false)
    const [ nuevoID, setNuevoID ] = useState(null)

    const [ dataFamilia, setDataFamilia ] = useState({})

    const [ dataAlumnosFamilia, setDataAlumnosFamilia ] = useState([])

    const [ dataAlumno, setDataAlumno ] = useState({
        id_familias: "",
        id_ciclo_escolar: "",
        nombre: "",
        domicilio: "",
        colonia: "",
        municipio: "",
        codigo_postal: "",
        telefono_madre : "",
        telefono_padre: ""
    })

    const [dataPadresFamilia, setDataPadresFamilia] = useState([])

    const [ dataFormAlumno, setDataFormAlumno ] = useState({})

    const [ dataFormPadre, setDataFormPadre ] = useState({
        id_familia: 0,
        id_familias_padres_tipo: 1,
        nombre: "",
        edad: 0,
        vive: "1",
        direccion: "",
        ocupacion_actual:"",
        empresa_trabajo:"",
        email: "",
        telefono_casa: ""
    })
    
    const [ dataFormMadre, setDataFormMadre ] = useState({
        id_familia: 0,
        id_familias_padres_tipo: 2,
        nombre: "",
        edad: 0,
        vive: "1",
        direccion: "",
        ocupacion_actual:"",
        empresa_trabajo:"",
        email: "",
        telefono_casa: ""
    })

    const getDatosPadresFamilia = () => {
        axios.get(APIURL+`/familias/${IDFAMILIA}/padres`,config).then((resp)=>{
            setDataPadresFamilia(resp.data)
            console.log(dataPadresFamilia);
            setDataFormPadre(dataPadresFamilia[0])
            setDataFormMadre(dataPadresFamilia[1])
        }).catch((error)=>{
            console.log(error);
        })
    }

    const getDatosFamilia = () =>{
        axios.get('http://localhost:8000/api/auth/familias/'+IDFAMILIA,config).then((resp)=>{
            console.log(resp);
            setDataFamilia(resp.data)
            var familia = resp.data
            getDatosAlumnosFamilia(familia.id)
        }).catch((resp)=>{
            console.log(resp);
            if (resp.response.status === 401) {
                logout()
            }
        })
    }

    const getDatosAlumnosFamilia = (id) =>{
        axios.get('http://localhost:8000/api/auth/familias/'+id+'/alumnos',config).then((resp)=>{
            console.log(resp);
            setDataAlumnosFamilia(resp.data)
            var alumnos = resp.data
            if (alumnos.length > 0) {
                setTieneAlumnos(true)
                console.log(alumnos[0]);
                setDataAlumno(alumnos[0])
            }
        }).catch((resp)=>{
            console.log(resp);
            if (resp.response.status === 401) {
                logout()
            }
        })
    }

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


    const handleChangeInputAlumno = (e) => {
        var name = e.target.name
        var value = e.target.value
        if (name === 'alumnos_nombre') {
            dataAlumno.nombre = value
        }
        if (name === 'alumnos_domicilio') {
            dataAlumno.domicilio = value
        }
        if (name === 'alumnos_colonia') {
            dataAlumno.colonia = value
        }
        if (name === 'alumnos_municipio') {
            dataAlumno.municipio = value
        }
        if (name === 'alumnos_cp') {
            dataAlumno.codigo_postal = value
        }
        if (name === 'alumnos_padre_tel') {
            dataAlumno.telefono_padre = value
        }
        if (name === 'alumnos_madre_tel') {
            dataAlumno.telefono_madre = value
        }

    }

    const handleChangeInputPadre = (e) => {
        var name = e.target.name
        var value = e.target.value
        setDataFormPadre((prevState) => ({
            ...prevState,
            [name]: value
          }));
        
    }

    const handleChangeInputMadre = (e) => {
        var name = e.target.name
        var value = e.target.value
        setDataFormMadre((prevState) => ({
            ...prevState,
            [name]: value
          }));
    }

    const postCrearAlumno = async () => {
        dataAlumno.id_familias = parseInt(IDFAMILIA,10)
        dataAlumno.id_ciclo_escolar = dataFamilia.id_ciclo_escolar
        var resp = await axios.post(APIURL+'/familias/alumnos',dataAlumno,config)
        var nuevaFamilia = resp.data.data
        setNuevoID(nuevaFamilia.id)
        setTieneAlumnos(true)
    }

    const postGuardarPadre = () =>{
        
        var data = dataFormPadre
        data.vive = data.vive == '1' ? true : false
        data.id_familia =parseInt(IDFAMILIA,10) 
        data.edad = parseInt(data.edad,10)
        console.log(data);
        axios.post(APIURL+'/familias/padres',data,config).then((resp)=>{
            console.log(resp);
        }).catch((error)=>{
            console.log(error);
        })
    }

    const postGuardarMadre = () =>{
        
        var data = dataFormMadre
        data.vive = data.vive == '1' ? true : false
        data.id_familia =parseInt(IDFAMILIA,10) 
        data.edad = parseInt(data.edad,10)
        console.log(data);
        axios.post(APIURL+'/familias/padres',data,config).then((resp)=>{
            console.log(resp);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(()=>{
        getDatosFamilia()
        getDatosPadresFamilia()
    },[IDFAMILIA])

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col">
                    <h5>ALTA DE DATOS FAMILIA</h5>
                </div>
            </div>
            <div className="row mt-3 mb-3">
                <div className="col-1 pt-2">
                    <p className="fw-bold">FAMILIA:</p>
                </div>
                <div className="col">
                    <input disabled={true} value={dataFamilia.nombre} name="familia_nombre" type="text" id="inputFamiliaName" className="form-control form-control-sm" />
                </div>
            </div>
            {/* <div className="row mb-3">
                <div className="col-12">
                    <label for="inputSituacionNecesidad" class="form-label">SITUACION POR LA CUAL SE VEN EN LA NECESIDAD DE PEDIR APOYO DE BECA:</label>
                    <textarea onChange={ (e)=>{handleChangeInput(e)} } name="situacion" class="form-control" id="inputSituacionNecesidad" rows="3"></textarea>
                </div>
            </div> */}
            <div className="container">
                <div className="row p-3 card mb-3" style={{ flexDirection: "row" }}>
                    <h6 style={{ fontWeight: 'bold' }}>1. Datos de quíen(es) solicita(n) la Beca:</h6>
                    <div className="col-12 mb-3">
                        {/* {alumnos.map((alumno, index) => (
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
                        </div> */}
                        <input hidden={true} disabled={true} value={dataFamilia.id}/>
                        <input hidden={true} disabled={true} value={dataFamilia.id_ciclo_escolar}/>
                        <label htmlFor="input-alumno" class="form-label">Alumno:</label>
                        <input value={dataAlumno.nombre} id="input-alumno" name="alumnos_nombre" className="form-control form-control-sm" type="text" onChange={(e) => handleChangeInputAlumno(e)}/>
                    </div>
                    <div className="col-4">
                        <label for="inputDomicilio" class="form-label">Domicilio Particular Calle, No:</label>
                        <input value={dataAlumno.domicilio} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="alumnos_domicilio" type="text" id="inputDomicilio" className="form-control" />
                    </div>
                    <div className="col-4">
                        <label for="inputColonia" class="form-label">Colonia:</label>
                        <input value={dataAlumno.colonia} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="alumnos_colonia" type="text" id="inputColonia" className="form-control" />
                    </div>
                    <div className="col-4">
                        <label for="inputMunicipio" class="form-label">Municipio:</label>
                        <input value={dataAlumno.municipio} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="alumnos_municipio" type="text" id="inputMunicipio" className="form-control" />
                    </div>
                    <div className="col-4">
                        <label for="inputCP" class="form-label">Codigo Postal:</label>
                        <input value={dataAlumno.codigo_postal} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="alumnos_cp" type="text" id="inputCP" className="form-control" />
                    </div>
                    <div className="row">
                        <div className="col-5">
                            <label for="inputTelPadre" class="form-label">Telefono Padre:</label>
                            <input value={dataAlumno.telefono_padre} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="alumnos_padre_tel" type="text" id="inputTelPadre" className="form-control" />
                        </div>
                        <div className="col-5">
                            <label for="inputTelMadre" class="form-label">Telefono Madre:</label>
                            <input value={dataAlumno.telefono_madre} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="alumnos_madre_tel" type="text" id="inputTelMadre" className="form-control" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center m-3">
                        <button onClick={ postCrearAlumno } className="btn btn-primary">Guardar Datos</button>
                    </div>
                </div>
                { tieneAlumnos &&
                    <>
                    <div className="row p-3 card mb-3">
                    <h6 style={{ fontWeight:'bold' }}> 2. Datos del Padre </h6>
                    <div className="row">
                        <div className="col-6">
                            <label for="inputNombrePadre" class="form-label">Nombre del Padre:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="nombre" value={dataFormPadre?.nombre}
                            type="text" id="inputNombrePadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label for="inputEdadPadre" class="form-label">Edad:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="edad" value={dataFormPadre?.edad}
                            type="text" id="inputEdadPadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label for="inputPadreVive" class="form-label">Vive:</label>
                            <select id="inputPadreVive" class="form-select form-select-sm" 
                            onChange={ (e)=>{handleChangeInputPadre(e)} } name="vive" value={dataFormPadre?.vive}
                            aria-label="Small select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label for="inputDireccionPadre" class="form-label">Dirección:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="direccion" value={dataFormPadre?.direccion}
                            type="text" id="inputDireccionPadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label for="inputOcupacionPadre" class="form-label">Ocupacion Actual:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="ocupacion_actual" value={dataFormPadre?.ocupacion_actual}
                            type="text" id="inputOcupacionPadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label for="inputEmpresaPadre" class="form-label">Empresa en que trabaja:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="empresa_trabajo" value={dataFormPadre?.empresa_trabajo}
                            type="text" id="inputEmpresaPadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label for="inputEmailPadre" class="form-label">Email:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="email" value={dataFormPadre?.email}
                            type="email" id="inputEmpresaPadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label for="inputTelCasaPadre" class="form-label">Tel. Casa:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="telefono_casa" value={dataFormPadre?.telefono_casa}
                            type="text" id="inputEmpresaPadre" className="form-control" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center m-3">
                        <button onClick={ postGuardarPadre } className="btn btn-primary">Guardar Datos</button>
                    </div>
                </div>

                <div className="row p-3 card mb-3">
                    <h6 style={{ fontWeight: 'bold' }}> 3. Datos de la Madre </h6>
                    <div className="row">
                        <div className="col-6">
                            <label for="inputNombreMadre" class="form-label">Nombre de la Madre:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="nombre" value={dataFormMadre?.nombre}
                            type="text" id="inputNombrePadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label for="inputEdadMadre" class="form-label">Edad:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="edad" value={dataFormMadre?.edad}
                            type="text" id="inputEdadMadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label for="inputMadreVive" class="form-label">Vive:</label>
                            <select id="inputMadreVive" class="form-select form-select-sm" value={dataFormMadre?.vive}
                            onChange={ (e)=>{handleChangeInputMadre(e)} } name="vive"
                            aria-label="Small select example">
                                <option value="si">SI</option>
                                <option value="no">NO</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label for="inputDireccionMadre" class="form-label">Dirección:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="direccion" value={dataFormMadre?.direccion}
                            type="text" id="inputDireccionMadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label for="inputOcupacionMadre" class="form-label">Ocupacion Actual:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="ocupacion_actual" value={dataFormMadre?.ocupacion_actual}
                            type="text" id="inputOcupacionMadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label for="inputEmpresaMadre" class="form-label">Empresa en que trabaja:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="empresa_trabajo" value={dataFormMadre?.empresa_trabajo}
                            type="text" id="inputEmpresaMadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label for="inputEmailMadre" class="form-label">Email:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="email" value={dataFormMadre?.email}
                            type="email" id="inputEmpresaMadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label for="inputTelCasaMadre" class="form-label">Tel. Casa:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="telefono_casa" value={dataFormMadre?.telefono_casa}
                            type="text" id="inputEmpresaMadre" className="form-control" />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center m-3">
                        <button onClick={ postGuardarMadre } className="btn btn-primary">Guardar Datos</button>
                    </div>
                </div>
                    </>
                }
                
            </div>
            
        </div>
    )
}

export default FamiliaAlta;