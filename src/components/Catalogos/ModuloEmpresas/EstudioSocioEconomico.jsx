
import { useContext, useEffect, useMemo, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { AuthContext } from "context/AuthContext";

function EstudioSocioEconomicoEmpresa(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    };
    const { logout } = useContext(AuthContext);

    const [empresas, setEmpresas] = useState([]);
    const [sucursales, setSucursales] = useState([]);

    const getDatosEmpresas = async () => {
        let resp
        try{
            resp = await axios.get(APIURL+'/empresas/lista', config);
            setEmpresas(resp.data);
        }catch(error){
            console.log(error.response.status);
            if (error.response.status === 401) {
                logout()
            }
        }
        
        
    }

    const getDatosSucursales = async () => {
        let resp
        try{
            resp = await axios.post(APIURL+'/empresas/sucursal/lista', config);
            setSucursales(resp.data);
        }catch(error){
            console.log(error.response.status);
            if (error.response.status === 401) {
                logout()
            }
        }
        
        
    }

    const renderOptionsEmpresas = useMemo(() =>{
        console.log('render Datos');
        return [<option key={'empresa-0'} value="0">Seleccione una Opción</option>,...empresas.map((ch) => (
            <option key={'empresa-'+ch.id} value={ch.id}> {ch.nombre} </option>
        ))]
            
    }, [empresas])

    useEffect(() => {
        getDatosEmpresas()
        getDatosSucursales()
    }, [])

    return (
        <div className="row">
            <div className="col-12">
                <p className="fw-bold">Estudios SocioEconomicos Empresa</p>
            </div>
            <div className="col-12 mb-3">
                <div className="d-flex align-items-center">
                    <div className="w-25">
                        <span>Seleccione la empresa:</span>
                        <select className="form-select" aria-label="Default select example">
                            {renderOptionsEmpresas}
                        </select>
                    </div>
                    <div className="mx-3 pt-3">
                        <button className="btn btn-primary btn-sm" >Nueva Estudio</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default EstudioSocioEconomicoEmpresa;