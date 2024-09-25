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
    const [ files1DeFamilia, setFiles1DeFamilia ] = useState([])
    const [ files2DeFamilia, setFiles2DeFamilia ] = useState([])
    const [ files3DeFamilia, setFiles3DeFamilia ] = useState([])
    const [ files4DeFamilia, setFiles4DeFamilia ] = useState([])
    const [ files5DeFamilia, setFiles5DeFamilia ] = useState([])
    const [ files6DeFamilia, setFiles6DeFamilia ] = useState([])

    const [file, setFile] = useState(null);
    const [fileD, setFileD] = useState(null);
    const [fileCH, setFileCH] = useState(null);
    const [fileAutos, setFileAutos] = useState(null);
    const [fileDomicilio, setFileDomicilio] = useState(null);

    const dataPOST = {
        id_familia : '',
        id_familias_documentos_tipo: '',
    }

    const getFilesDeFamilia = () => {
        var id = localStorage.getItem('id')
        axios.get(APIURL+"/familias/"+ id +"/documentos",config).then((resp)=>{
            setFilesDeFamilia(resp.data)
            console.log(resp.data);
            
        }).catch((err)=>{
            if (err.response.status === 401) {
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
        var id = localStorage.getItem('id')
        const formData = new FormData();
        if (!file) {
            alert("Please select a file first.");
            return;
        }
        formData.append('id_familia', id)
        formData.append('id_familias_documentos_tipo', 1)
        formData.append('id_servicio_estudio', searchParams.get('idse'))
        for (let i = 0; i < file.length; i++) {
            formData.append('files[]', file[i]); // Importante: 'files[]' para múltiples archivos
        }

        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessIngresos(true)
            getFilesDeFamilia()
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                logout()
            }
            
            setSuccessIngresos(false)
        })
    }

    const subirArchivosDesempleo = () => {
        var id = localStorage.getItem('id')
        const formData = new FormData();
        if (!fileD) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', id)
        formData.append('id_familias_documentos_tipo', 2)
        formData.append('id_servicio_estudio', searchParams.get('idse'))
        for (let i = 0; i < fileD.length; i++) {
            formData.append('files[]', fileD[i]); // Importante: 'files[]' para múltiples archivos
        }

        console.log(formData);
        
        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessDesempleo(true)
            getFilesDeFamilia()
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                logout()
            }
            
            setSuccessDesempleo(false)
        })
    }

    const subirArchivosCasaHabitacion = () => {
        var id = localStorage.getItem('id')
        const formData = new FormData();
        if (!fileCH) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', id)
        formData.append('id_familias_documentos_tipo', 3)
        formData.append('id_servicio_estudio', searchParams.get('idse'))
        for (let i = 0; i < fileCH.length; i++) {
            formData.append('files[]', fileCH[i]); // Importante: 'files[]' para múltiples archivos
        }


        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessCasa(true)
            getFilesDeFamilia()
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                logout()
            }
            
            setSuccessCasa(false)
        })
    }

    const subirArchivosAutomoviles = () => {
        var id = localStorage.getItem('id')
        const formData = new FormData();
        if (!fileAutos) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', id)
        formData.append('id_familias_documentos_tipo', 4)
        formData.append('id_servicio_estudio', searchParams.get('idse'))
        for (let i = 0; i < fileAutos.length; i++) {
            formData.append('files[]', fileAutos[i]); // Importante: 'files[]' para múltiples archivos
        }

        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessAuto(true)
            getFilesDeFamilia()
        }).catch((err)=>{
            if (err.response.status === 401) {
                logout()
            }
            
            setSuccessAuto(false)
        })
    }

    const subirArchivosComprobantes = () => {
        var id = localStorage.getItem('id')
        const formData = new FormData();
        if (!fileDomicilio) {
            alert("Please select a file first.");
            return;
        }

        formData.append('id_familia', id)
        formData.append('id_familias_documentos_tipo', 5)
        formData.append('id_servicio_estudio', searchParams.get('idse'))
        for (let i = 0; i < fileDomicilio.length; i++) {
            formData.append('files[]', fileDomicilio[i]); // Importante: 'files[]' para múltiples archivos
        }


        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccessComprobante(true)
            getFilesDeFamilia()
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                logout()
            }
            
            setSuccessComprobante(false)
        })
    }

    const actualizoInputFiles = (e, name) =>{
        console.log(name);
        console.log(e);
        if (name === 'ingresos') {
            setFile(e.target.files);
        }
        if (name === 'desempleo') {
            console.log(e.target.files);
            
            setFileD(e.target.files);
        }
        if (name === 'casahabitacion') {
            setFileCH(e.target.files);
        }
        if (name === 'autos') {
            setFileAutos(e.target.files);
        }
        if (name === 'comprobantes') {
            setFileDomicilio(e.target.files);
        }
    }

    const addFiles = (id_tipo) => {
        var filtro = []
        filesDeFamilia.forEach((item) =>{
            if (item.id_familias_documentos_tipo === id_tipo) {
                filtro.push(item)
            }
        })

        if (id_tipo === 1) {
            setFiles1DeFamilia(filtro);
        }

        if (id_tipo === 2) {
            setFiles2DeFamilia(filtro);
        }

        if (id_tipo === 3) {
            setFiles3DeFamilia(filtro);
        }

        if (id_tipo === 4) {
            setFiles4DeFamilia(filtro);
        }

        if (id_tipo === 5) {
            setFiles5DeFamilia(filtro);
        }

        if (id_tipo === 6) {
            setFiles6DeFamilia(filtro);
        }
        

        /* return [...filtro1.map((file) => (
            <li> {file.nombre} </li>
        ))] */
    }

    const renderFilesDeFamilia = (tipo) => {
        
        switch (tipo) {
            case 1:
                return [...files1DeFamilia.map((ch) => (
                    <li > {ch.nombre} </li>
                ))]
                break;
            case 2:
                return [...files2DeFamilia.map((ch) => (
                    <li > {ch.nombre} </li>
                ))]
                break;
            
            case 3:
                return [...files3DeFamilia.map((ch) => (
                    <li > {ch.nombre} </li>
                ))]
                break;

            case 4:
                return [...files4DeFamilia.map((ch) => (
                    <li > {ch.nombre} </li>
                ))]
                break;

            case 5:
                return [...files5DeFamilia.map((ch) => (
                    <li > {ch.nombre} </li>
                ))]
                break;

            case 6:
                return [...files6DeFamilia.map((ch) => (
                    <li > {ch.nombre} </li>
                ))]
                break;
            default:
                break;
        }

        
    }

    const renderImagesIngresos = () => {
        console.log(files1DeFamilia);
        
        var arrIMG = files1DeFamilia
        return [...arrIMG.map((ch)=>{
                <div className="carousel-item">
                    <img src={ ch.directorio } className="d-block w-100" alt="..."/>
                </div>
        })]
    }

    useEffect(()=>{
        getFilesDeFamilia()
        //getDataEstudioSocioeconomico()
    },[])

    useEffect(()=>{
        if (filesDeFamilia.length > 0) {
            console.log(contieneArchivoTipoID(1));
        }
        addFiles(1)
        addFiles(2)
        addFiles(3)
        addFiles(4)
        addFiles(5)
        addFiles(6)

        
        
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
                                    <ul>
                                        { renderFilesDeFamilia(1) }
                                    </ul>
                                </div>
                                <div id="carouselExampleFade" className="carousel slide carousel-fade">
                                    <div class="carousel-inner">
                                        { renderImagesIngresos() }
                                    </div>
                                    
                                    
                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
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
                                    <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'desempleo') } } accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx" type="file" id="formFileMultipleDesempleo" multiple />
                                    <button className="btn btn-primary mt-2" onClick={ subirArchivosDesempleo }> Subir Archivos </button>
                                </div>

                                <div className="mb-3">
                                    <p> Archivo:  </p>
                                    <ul>
                                        { renderFilesDeFamilia(2) }
                                    </ul>
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
                                    <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'casahabitacion') } } accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx" type="file" id="formFileMultipleCasaHabitacion" multiple />
                                    <button className="btn btn-primary mt-2" onClick={subirArchivosCasaHabitacion }> Subir Archivos </button>
                                </div>
                                <div className="mb-3">
                                    <p> Archivo:  </p>
                                    <ul>
                                        { renderFilesDeFamilia(3) }
                                    </ul>
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
                                    <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'autos') } } accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx" type="file" id="formFileMultipleAutos" multiple />
                                    <button className="btn btn-primary mt-2" onClick={ subirArchivosAutomoviles }> Subir Archivos </button>
                                </div>
                                <div className="mb-3">
                                    <p> Archivo:  </p>
                                    <ul>
                                        { renderFilesDeFamilia(4) }
                                    </ul>
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
                                    <input className="form-control" onChange={ (e) => { actualizoInputFiles(e, 'comprobantes') } } accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx" type="file" id="formFileMultipleComprobantes" multiple />
                                    <button className="btn btn-primary mt-2" onClick={ subirArchivosComprobantes }> Subir Archivos </button>
                                </div>
                                <div className="mb-3">
                                    <p> Archivo:  </p>
                                    <ul>
                                        { renderFilesDeFamilia(5) }
                                    </ul>
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