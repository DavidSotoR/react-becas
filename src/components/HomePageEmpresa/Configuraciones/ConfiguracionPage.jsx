import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Alert, Form } from "react-bootstrap";


export default function ConfiguracionPage() {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        }
    }
    const [roleSession, setRoleSession] = useState(localStorage.getItem('role') || '')
    const { logout, execShowAlert } = useContext(AuthContext);
    const [fileLogo, setFileLogo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dataConfig, setDataConfig] = useState({
        requiere_facturar: false,
        documentacion_digital: false,
        habilitar_resumen: false,
        habilitar_altas_familias: false,
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
        const formData = new FormData();

        Object.keys(dataConfig).forEach(key => {
            formData.append(key, dataConfig[key]);
        });
        if (fileLogo) {
            formData.append("logo", fileLogo);
        }

        axios.post(APIURL+'/clientes/configuraciones', formData ,config).then((resp)=>{
            console.log(resp);
            execShowAlert({ type: 'success', title: 'Cliente Actualizado', message: 'Datos del cliente actualizados.'})
       
        }).catch((resp)=>{
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

    return (
        <div className="container">
            <p className="fw-bold fs-5 mt-3" >Configuración de Cuenta</p>
            <div className="row">
                <div className="col-8 col-md-5 pt-4">
                    <Form.Check className="mx-2 pt-2" type="switch">
                        <Form.Check.Input name="requiere_facturar" onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                        <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Requiere Facturar </span></Form.Check.Label>
                    </Form.Check>
                </div>
                <div className="col-8 col-md-5 mt-4">
                    <div className="d-flex">
                        <Form.Check type="switch" className="mx-2 pt-2">
                            <Form.Check.Input name="documentacion_digital" onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Documentos Digital </span></Form.Check.Label>
                        </Form.Check>                                
                    </div>
                    
                </div>
                <div className="col-8 col-md-5 mt-4">
                    <div className="d-flex">
                        <Form.Check className="mx-2 pt-2" type="switch">
                            <Form.Check.Input name="habilitar_resumen" onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Resumen </span></Form.Check.Label>
                        </Form.Check>
                                                        
                    </div>
                    
                </div>
                <div className="col-8 col-md-5 mt-4">
                    <div className="d-flex">
                        <Form.Check className="mx-2 pt-2" type="switch">
                            <Form.Check.Input name="habilitar_altas_familias" onChange={(e)=> {formInputChange(e)}}  style={{ width:"2rem" }} className="pt-3" type="checkbox" />
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
                                <Form.Check.Input name="habilitar_logo" onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Imagen Logo en Reportes</span></Form.Check.Label>
                            </Form.Check>
                                                            
                        </div>
                        <div className="col-5" style={{ display: dataConfig.habilitar_logo ? 'block' : 'none' }}>
                            <input className="form-control" type="file" id="formFileLogo" accept="image/*" onChange={handleFileChange}/>
                        </div>
                        {preview && <img src={preview} title="Vista previa" style={{ maxWidth: "250px", maxHeight: "250px" }} />}

                    </div>
                </div>
                <div className="d-flex justify-content-start mt-3 ms-1">
                    <button className="btn btn-primary" onClick={() => { updateDataConfiguracionCuenta() }}>Guardar</button>
                </div>
            </div>
        </div>
    )
}