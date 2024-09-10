import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useSearchParams } from "react-router-dom";

function FamiliaSubirArchivos() {
    const { logout } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [ successIngresos, setSuccessIngresos ] = useState(false)
    const [ successDesempleo, setSuccessDesempleo ] = useState(false)
    const [ successAuto, setSuccessAuto ] = useState(false)
    const [ successCasa, setSuccessCasa ] = useState(false)
    const [ successComprobante, setSuccessComprobante ] = useState(false)

    const [ filesDeFamilia, setFilesDeFamilia ] = useState([])

    const [file, setFile] = useState(null);
    const [fileD, setFileD] = useState(null);
    const [fileCH, setFileCH] = useState(null);
    const [fileAutos, setFileAutos] = useState(null);
    const [fileDomicilio, setFileDomicilio] = useState(null);

    const dataPOST = {
        id_familia : '5',
        id_familias_documentos_tipo: '1',
        id_ciclo_escolar: '1',
        id_servicio_estudio : null
    }

    const getFilesDeFamilia = () => {
        axios.get(APIURL+"/familias/1/documentos",config).then((resp)=>{
            setFilesDeFamilia(resp.data)
        }).catch((err)=>{
            if (err.response.status === 401) {
                debugger
                logout()
            }            
        })
    }

    const contieneArchivoTipoID = (tipo) => {
        var obj = filesDeFamilia.filter(obj => {
            for (let key in obj) {
                if (key === "id_familias_documentos_tipo" && obj[key] === tipo) {
                    return true;
                }
            }
            return false;
        });        
        if (obj.length >= 1) {
            return true
        } else {
            return false
        }
    }

    const subirArchivosIngresos = () => {
        const formData = new FormData();
        if (!file) {
            alert("Please select a file first.");
            return;
        }
        formData.append('id_familia', dataPOST.id_familia)
        formData.append('id_familias_documentos_tipo', 1)
        formData.append('id_ciclo_escolar', dataPOST.id_ciclo_escolar)
        formData.append('id_servicio_estudio', dataPOST.id_servicio_estudio ?? searchParams.get('idse'))
        formData.append('file', file)


        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessIngresos(true)
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                debugger
                logout()
            }
            
            setSuccessIngresos(false)
        })
    }

    const subirArchivosDesempleo = () => {
        const formData = new FormData();
        if (!fileD) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', dataPOST.id_familia)
        formData.append('id_familias_documentos_tipo', 2)
        formData.append('id_ciclo_escolar', dataPOST.id_ciclo_escolar)
        formData.append('id_servicio_estudio', dataPOST.id_servicio_estudio ?? searchParams.get('idse'))
        formData.append('file', fileD)


        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessDesempleo(true)
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                debugger
                logout()
            }
            
            setSuccessDesempleo(false)
        })
    }

    const subirArchivosCasaHabitacion = () => {
        const formData = new FormData();
        if (!fileCH) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', dataPOST.id_familia)
        formData.append('id_familias_documentos_tipo', 3)
        formData.append('id_ciclo_escolar', dataPOST.id_ciclo_escolar)
        formData.append('id_servicio_estudio', dataPOST.id_servicio_estudio ?? searchParams.get('idse'))
        formData.append('file', fileCH)


        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessCasa(true)
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                debugger
                logout()
            }
            
            setSuccessCasa(false)
        })
    }

    const subirArchivosAutomoviles = () => {
        const formData = new FormData();
        if (!fileAutos) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', dataPOST.id_familia)
        formData.append('id_familias_documentos_tipo', 4)
        formData.append('id_ciclo_escolar', dataPOST.id_ciclo_escolar)
        formData.append('id_servicio_estudio', dataPOST.id_servicio_estudio ?? searchParams.get('idse'))
        formData.append('file', fileAutos)


        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessAuto(true)
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                logout()
            }
            
            setSuccessAuto(false)
        })
    }

    const subirArchivosComprobantes = () => {
        const formData = new FormData();
        if (!fileDomicilio) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', dataPOST.id_familia)
        formData.append('id_familias_documentos_tipo', 5)
        formData.append('id_ciclo_escolar', dataPOST.id_ciclo_escolar)
        formData.append('id_servicio_estudio', dataPOST.id_servicio_estudio ?? searchParams.get('idse'))
        formData.append('file', fileDomicilio)


        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessComprobante(true)
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                debugger
                logout()
            }
            
            setSuccessComprobante(false)
        })
    }

    const actualizoInputFiles = (e, name) =>{
        console.log(name);
        console.log(e);
        if (name === 'ingresos') {
            setFile(e.target.files[0]);
        }
        if (name === 'desempleo') {
            setFileD(e.target.files[0]);
        }
        if (name === 'casahabitacion') {
            setFileCH(e.target.files[0]);
        }
        if (name === 'autos') {
            setFileAutos(e.target.files[0]);
        }
        if (name === 'comprobantes') {
            setFileDomicilio(e.target.files[0]);
        }
    }

    useEffect(()=>{
        getFilesDeFamilia()
        //getDataEstudioSocioeconomico()
    },[])

    useEffect(()=>{
        if (filesDeFamilia.length > 0) {
            console.log(contieneArchivoTipoID(1));
        }
        
        
    },[ filesDeFamilia ])

    return (
        <div className="container mt-3 mb-3">
            <div className="row">
            <div className="col-12">
                    <ul className="list-group list-group">
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <p  className="mb-0 me-2 pb-1 fw-bold">1. INGRESOS</p>
                                <div className="">
                                {contieneArchivoTipoID(1) ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                                </div>
                            </div>
                            <div className="ms-2 me-auto">
                                <div className="mb-3">
                                    <label htmlFor="formFileMultipleIngresos" className="form-label">Cargar archivos Ingresos:</label>
                                    <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'ingresos') } } accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx" 
                                     type="file" id="formFileMultipleIngresos" multiple />
                                    <button className="btn btn-primary mt-2" onClick={subirArchivosIngresos}> Subir Archivos </button>
                                </div>
                                <div className="mb-3">
                                    <p> Archivo:  </p>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <p  className="mb-0 me-2 pb-1 fw-bold">2. DESEMPLEO</p>
                                <div className="">
                                {contieneArchivoTipoID(2) ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                                </div>
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label htmlFor="formFileMultipleDesempleo" className="form-label">Cargar archivos Desempleo:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'desempleo') } } accept="application/pdf" type="file" id="formFileMultipleDesempleo" multiple />
                                <button className="btn btn-primary mt-2" onClick={ subirArchivosDesempleo }> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                            <p  className="mb-0 me-2 pb-1 fw-bold">3. CASA HABITACION</p>
                            <div className="">
                                {contieneArchivoTipoID(3) ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                            </div>
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label htmlFor="formFileMultipleCasaHabitacion" className="form-label">Cargar archivos Casa/Habitacion:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'casahabitacion') } } accept="application/pdf" type="file" id="formFileMultipleCasaHabitacion" multiple />
                                <button className="btn btn-primary mt-2" onClick={subirArchivosCasaHabitacion }> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                                <p  className="mb-0 me-2 pb-1 fw-bold">4. Automoviles</p>
                                <div className="">
                                    {contieneArchivoTipoID(4) ? (
                                    <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                    ) : (
                                    <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                    )}
                                </div>
                            </div>
                            <div className="ms-2 me-auto">
                            <div className="mb-3">
                                <label htmlFor="formFileMultipleAutos" className="form-label">Cargar archivos Automóviles:</label>
                                <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'autos') } } accept="application/pdf" type="file" id="formFileMultipleAutos" multiple />
                                <button className="btn btn-primary mt-2" onClick={ subirArchivosAutomoviles }> Subir Archivos </button>
                            </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="d-flex align-items-center">
                            <p className="mb-0 me-2 pb-1 fw-bold">5. COMPROBANTES DE DOMICILIO</p>
                            {contieneArchivoTipoID(5) ? (
                                <ion-icon name="checkmark-circle-outline" style={{ fontSize: "32px", color: "green" }}></ion-icon>
                                ) : (
                                <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "red" }}></ion-icon>
                                )}
                            </div>
                            <div className="ms-2 me-auto">
                                <div className="mb-3">
                                    <label htmlFor="formFileMultipleComprobantes" className="form-label">Cargar archivos Comprobantes:</label>
                                    <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'comprobantes') } } accept="application/pdf" type="file" id="formFileMultipleComprobantes" multiple />
                                    <button className="btn btn-primary mt-2" onClick={ subirArchivosComprobantes }> Subir Archivos </button>
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