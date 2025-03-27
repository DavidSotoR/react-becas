import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Alert, Form } from "react-bootstrap";


export default function ConfiguracionPage() {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [roleSession, setRoleSession] = useState(localStorage.getItem('role') || '')
    const { logout } = useContext(AuthContext);

    const formInputChange =(e) => {
        console.log(e.target.checked);
        
    }

    return (
        <div className="container">
            <p className="fw-bold fs-6 mt-3" >Configuraciones de Cuenta</p>
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
                            <Form.Check.Input name="habilitar_alta_link"  style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Altas Familias por Link </span></Form.Check.Label>
                        </Form.Check>
                                                        
                    </div>
                    
                </div>
            </div>
        </div>
    )
}