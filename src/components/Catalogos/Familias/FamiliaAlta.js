import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Alert, Button } from "react-bootstrap";

function FamiliaAlta() {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL
    const { IDFAMILIA } = useParams();
    

    const [alumnos, setAlumnos] = useState([
        { alumno: ''}
    ]);

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [showAlert, setShowAlert] = useState(false);
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
            var padres = resp.data
            setDataFormPadre(padres[0])
            setDataFormMadre(padres[1])
        }).catch((error)=>{
            console.log(error);
        })
    }

    const getDatosFamilia = () =>{
        axios.get(APIURL+'/familias/'+IDFAMILIA,config).then((resp)=>{
            setDataFamilia(resp.data)
            var familia = resp.data
            getDatosAlumnosFamilia(familia.id)
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
        })
    }

    const getDatosAlumnosFamilia = (id) =>{
        axios.get(APIURL+'/familias/'+id+'/alumnos',config).then((resp)=>{
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
        console.log('Se edito alumno');
        var name = e.target.name
        var value = e.target.value

        setDataAlumno((prevState) => ({
            ...prevState,
            [name]: value
          }));

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
        setShowAlert(true)
    }

    const postGuardarPadre = () =>{
        
        var data = dataFormPadre
        data.vive = data.vive === '1' ? true : false
        data.id_familias_padres_tipo = 1
        data.id_familia =parseInt(IDFAMILIA,10) 
        data.edad = parseInt(data.edad,10)
        console.log(data);
        axios.post(APIURL+'/familias/padres',data,config).then((resp)=>{
            console.log(resp);
            setShowAlert(true)
        }).catch((error)=>{
            
            console.log(error);
        })
    }

    const postGuardarMadre = () =>{
        
        var data = dataFormMadre
        data.vive = data.vive === '1' ? true : false
        data.id_familias_padres_tipo = 2
        data.id_familia =parseInt(IDFAMILIA,10) 
        data.edad = parseInt(data.edad,10)
        console.log(data);
        axios.post(APIURL+'/familias/padres',data,config).then((resp)=>{
            console.log(resp);
            setShowAlert(true)
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
                    <label htmlFor="inputSituacionNecesidad" className="form-label">SITUACION POR LA CUAL SE VEN EN LA NECESIDAD DE PEDIR APOYO DE BECA:</label>
                    <textarea onChange={ (e)=>{handleChangeInput(e)} } name="situacion" className="form-control" id="inputSituacionNecesidad" rows="3"></textarea>
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
                        <label htmlFor="input-alumno" className="form-label">Alumno:</label>
                        <input value={dataAlumno?.nombre} id="input-alumno" name="nombre" className="form-control form-control-sm" type="text" onChange={(e) => handleChangeInputAlumno(e)}/>
                    </div>
                    <div className="col-4">
                        <label htmlFor="inputDomicilio" className="form-label">Domicilio Particular Calle, No:</label>
                        <input value={dataAlumno?.domicilio} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="domicilio" type="text" id="inputDomicilio" className="form-control" />
                    </div>
                    <div className="col-4">
                        <label htmlFor="inputColonia" className="form-label">Colonia:</label>
                        <input value={dataAlumno?.colonia} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="colonia" type="text" id="inputColonia" className="form-control" />
                    </div>
                    <div className="col-4">
                        <label htmlFor="inputMunicipio" className="form-label">Municipio:</label>
                        <input value={dataAlumno?.municipio} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="municipio" type="text" id="inputMunicipio" className="form-control" />
                    </div>
                    <div className="col-4">
                        <label htmlFor="inputCP" className="form-label">Codigo Postal:</label>
                        <input value={dataAlumno?.codigo_postal} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="codigo_postal" type="text" id="inputCP" className="form-control" />
                    </div>
                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="inputTelPadre" className="form-label">Telefono Padre:</label>
                            <input value={dataAlumno?.telefono_padre} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="telefono_padre" type="text" id="inputTelPadre" className="form-control" />
                        </div>
                        <div className="col-5">
                            <label htmlFor="inputTelMadre" className="form-label">Telefono Madre:</label>
                            <input value={dataAlumno?.telefono_madre} onChange={ (e)=>{handleChangeInputAlumno(e)} } name="telefono_madre" type="text" id="inputTelMadre" className="form-control" />
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
                            <label htmlFor="inputNombrePadre" className="form-label">Nombre del Padre:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="nombre" value={dataFormPadre?.nombre}
                            type="text" id="inputNombrePadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label htmlFor="inputEdadPadre" className="form-label">Edad:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="edad" value={dataFormPadre?.edad}
                            type="text" id="inputEdadPadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label htmlFor="inputPadreVive" className="form-label">Vive:</label>
                            <select id="inputPadreVive" className="form-select form-select-sm" 
                            onChange={ (e)=>{handleChangeInputPadre(e)} } name="vive" value={dataFormPadre?.vive}
                            aria-label="Small select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label htmlFor="inputDireccionPadre" className="form-label">Dirección:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="direccion" value={dataFormPadre?.direccion}
                            type="text" id="inputDireccionPadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label htmlFor="inputOcupacionPadre" className="form-label">Ocupacion Actual:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="ocupacion_actual" value={dataFormPadre?.ocupacion_actual}
                            type="text" id="inputOcupacionPadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label htmlFor="inputEmpresaPadre" className="form-label">Empresa en que trabaja:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="empresa_trabajo" value={dataFormPadre?.empresa_trabajo}
                            type="text" id="inputEmpresaPadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label htmlFor="inputEmailPadre" className="form-label">Email:</label>
                            <input onChange={ (e)=>{handleChangeInputPadre(e)} } name="email" value={dataFormPadre?.email}
                            type="email" id="inputEmpresaPadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label htmlFor="inputTelCasaPadre" className="form-label">Tel. Casa:</label>
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
                            <label htmlFor="inputNombreMadre" className="form-label">Nombre de la Madre:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="nombre" value={dataFormMadre?.nombre}
                            type="text" id="inputNombrePadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label htmlFor="inputEdadMadre" className="form-label">Edad:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="edad" value={dataFormMadre?.edad}
                            type="text" id="inputEdadMadre" className="form-control" />
                        </div>
                        <div className="col-2">
                            <label htmlFor="inputMadreVive" className="form-label">Vive:</label>
                            <select id="inputMadreVive" className="form-select form-select-sm" value={dataFormMadre?.vive}
                            onChange={ (e)=>{handleChangeInputMadre(e)} } name="vive"
                            aria-label="Small select example">
                                <option value="1">SI</option>
                                <option value="0">NO</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label htmlFor="inputDireccionMadre" className="form-label">Dirección:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="direccion" value={dataFormMadre?.direccion}
                            type="text" id="inputDireccionMadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label htmlFor="inputOcupacionMadre" className="form-label">Ocupacion Actual:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="ocupacion_actual" value={dataFormMadre?.ocupacion_actual}
                            type="text" id="inputOcupacionMadre" className="form-control" />
                        </div>
                        <div className="col-12">
                            <label htmlFor="inputEmpresaMadre" className="form-label">Empresa en que trabaja:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="empresa_trabajo" value={dataFormMadre?.empresa_trabajo}
                            type="text" id="inputEmpresaMadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label htmlFor="inputEmailMadre" className="form-label">Email:</label>
                            <input onChange={ (e)=>{handleChangeInputMadre(e)} } name="email" value={dataFormMadre?.email}
                            type="email" id="inputEmpresaMadre" className="form-control" />
                        </div>
                        <div className="col-6">
                            <label htmlFor="inputTelCasaMadre" className="form-label">Tel. Casa:</label>
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
            <div >
            <Alert show={showAlert} onClose={()=>{ setShowAlert(false) }} variant="success" className="alert-flotante" dismissible>
                <Alert.Heading>Success</Alert.Heading>
                <p>
                    Se ha guardado correctamente los datos.
                </p>
            </Alert>
            </div>
            
        </div>
    )
}

export default FamiliaAlta;