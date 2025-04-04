import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Alert, Form } from "react-bootstrap";


export default function ConfiguracionPage() {
    const APIURL = process.env.REACT_APP_API_URL;
    const urlIMG = "http://127.0.0.1:8000/storage/";
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        }
    }
    const [showSpinner, setShowSpinner] = useState(false);
    const [roleSession, setRoleSession] = useState(localStorage.getItem('role') || '')
    const { logout, execShowAlert } = useContext(AuthContext);
    const [fileLogo, setFileLogo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dataCliente, setDataCliente] = useState(null)
    const [dataConfig, setDataConfig] = useState({
        requiere_facturar: false,
        documentacion_digital: false,
        habilitar_resumen: false,
        habilitar_alta_familias: false,
        habilitar_logo: false,
    })

    const formInputChange =(e) => {
        var name = e.target.name;
        console.log(name);
        console.log(e.target.checked);

        setDataConfig(prevState => ({
            ...prevState,
            [name]: e.target.checked,
        }));
        
    }

    const updateDataConfiguracionCuenta = () => {
        console.log(dataConfig);
        setShowSpinner(true);
        const formData = new FormData();

        Object.keys(dataConfig).forEach(key => {
            formData.append(key, dataConfig[key]);
        });
        if (fileLogo) {
            formData.append("logo", fileLogo);
        }

        formData.append('id_user', localStorage.getItem('id'))

        axios.post(APIURL+'/cuenta/configuraciones', formData ,config).then((resp)=>{
            console.log(resp);
            setShowSpinner(false);
            execShowAlert({ type: 'success', title: 'Cliente Actualizado', message: 'Datos del cliente actualizados.'})
       
        }).catch((resp)=>{
            setShowSpinner(false);
            if(resp.code === "ERR_BAD_REQUEST" && resp.response.hasOwnProperty('data')){
                console.log(resp.response.data);
                execShowAlert({ type: 'danger', title: 'Error al actualizar', message: 'Revisar los datos ingresados.'})
            }

            if (resp.response.status === 401) {
                logout()
            }
            console.log(resp);                                                                 
        })
        
    }

    const getDataConfiguracionesCuenta = () => {
        axios.get(APIURL+'/cuenta/configuraciones',config).then((resp)=>{
            console.log(resp);
            setDataCliente(resp.data);
            setDataConfig(prev => ({
                ...prev,
                requiere_facturar: resp.data.requiere_facturar === 1 ? true : false,
                documentacion_digital: resp.data.documentacion_digital === 1 ? true : false,
                habilitar_resumen: resp.data.habilitar_resumen === 1 ? true : false,
                habilitar_alta_familias: resp.data.habilitar_alta_familias === 1 ? true : false,
                habilitar_logo: resp.data.habilitar_logo === 1 ? true : false,
            }));
       
        }).catch((resp)=>{
            if(resp.code === "ERR_BAD_REQUEST" && resp.response.hasOwnProperty('data')){
                console.log(resp.response.data);
                execShowAlert({ type: 'danger', title: 'Error al Obtener Datos', message: 'Cuenta no esta asignada a un cliente.'})
            }

            if (resp.response.status === 401) {
                logout()
            }
            console.log(resp);                                                                 
        })
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileLogo(file)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(()=>{
        console.log('carga la pagina');
        getDataConfiguracionesCuenta()
    }, [])

    useEffect(()=>{
        console.log(dataConfig);
    }, [dataConfig])

    return (
        <div className="container">
            <p className="fw-bold fs-5 mt-3" >Configuración de Cuenta</p>
            <div className="row">
                <div className="col-8 col-md-5 pt-4">
                    <Form.Check className="mx-2 pt-2" type="switch">
                        <Form.Check.Input name="requiere_facturar" checked={ dataConfig.requiere_facturar } onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                        <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Requiere Facturar </span></Form.Check.Label>
                    </Form.Check>
                </div>
                <div className="col-8 col-md-5 mt-4">
                    <div className="d-flex">
                        <Form.Check type="switch" className="mx-2 pt-2">
                            <Form.Check.Input name="documentacion_digital" checked={dataConfig.documentacion_digital} onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Documentos Digital </span></Form.Check.Label>
                        </Form.Check>                                
                    </div>
                    
                </div>
                <div className="col-8 col-md-5 mt-4">
                    <div className="d-flex">
                        <Form.Check className="mx-2 pt-2" type="switch">
                            <Form.Check.Input name="habilitar_resumen" checked={dataConfig.habilitar_resumen} onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Resumen </span></Form.Check.Label>
                        </Form.Check>
                                                        
                    </div>
                    
                </div>
                <div className="col-8 col-md-5 mt-4">
                    <div className="d-flex">
                        <Form.Check className="mx-2 pt-2" type="switch">
                            <Form.Check.Input name="habilitar_alta_familias" checked={dataConfig.habilitar_alta_familias} onChange={(e)=> {formInputChange(e)}}  style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Altas Familias por Link </span></Form.Check.Label>
                        </Form.Check>
                                                        
                    </div>
                    
                </div>
                <div className="col-12 mt-5">
                    
                <div className="row">
                        <div className="12">
                            <p className="fw-bold fs-6 mb-1">Imagen para Logo de Cliente</p>
                        </div>
                        <div className="col-12 d-flex mb-3">
                            <Form.Check className="mx-2 pt-2" type="switch">
                                <Form.Check.Input name="habilitar_logo" checked={dataConfig.habilitar_logo} onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Imagen Logo en Reportes</span></Form.Check.Label>
                            </Form.Check>
                                                            
                        </div>
                        <div className="col-12 col-md-5" style={{ display: dataConfig.habilitar_logo ? 'block' : 'none' }}>
                            <input className="form-control" type="file" id="formFileLogo" accept="image/*" onChange={handleFileChange}/>
                        </div>

                        {preview || dataCliente?.ubicacion_logo !== '' ? (
                            preview ? (
                                <div className="col-12 col-md-5">
                                    <img
                                        src={ preview}
                                        className="d-block w-100 h-50 rounded" style={{ maxWidth: "250px", maxHeight: "250px" }}
                                        alt={'img-logo'}
                                    />
                                </div>
                            ) : (
                                <div className="col-12 col-md-5">
                                    <img
                                        src={ urlIMG + dataCliente?.ubicacion_logo}
                                        className="d-block w-100 h-50 rounded" style={{ maxWidth: "250px", maxHeight: "250px" }}
                                        alt={'img-logo'}
                                    />
                                </div>
                            )
                            
                        ) : (
                            <div className="d-flex justify-content-center align-items-center rounded" style={{background: 'black', color: 'white', width: '150px', height: '150px'}}>
                                <p className="m-0">SIN IMAGEN</p>
                            </div>
                            
                        )}
                       {/*  {preview && <img src={preview} title="Vista previa" style={{ maxWidth: "250px", maxHeight: "250px" }} />} */}

                    </div>
                </div>
                <div className="d-flex justify-content-start mt-3 ms-1">
                    { showSpinner ? (
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <button className="btn btn-primary fw-bold" onClick={() => { updateDataConfiguracionCuenta() }}>Guardar</button>
                    )}
                    
                </div>
            </div>
        </div>
    )
}