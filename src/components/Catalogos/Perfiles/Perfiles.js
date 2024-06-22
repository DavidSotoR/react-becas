import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

function Perfiles() {
    const [ allPerfiles, setAllPerfiles ] = useState([])
    const { logout } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const getPerfilesList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/perfiles', config);
            setAllPerfiles(resp.data);
        } catch (error) {
            console.error("Error fetching perfiles:", error);
            if (error.response.status === 401) {
                logout()
            }
        }
    }

    useEffect( ()=>{
        getPerfilesList();
    }, [])

    const renderFilasTablaPerfiles = () => {
        return allPerfiles.map((perfil, index) => (
            <tr key={'tr-perfil-'+index}>
                <td>
                    <p>{perfil.id}</p>
                </td>
                <td>
                    <p>{perfil.activo ? 'Si' : 'No' }</p>
                </td>
                <td>
                    <p class="mb-0">{perfil.nombre}</p>
                    <p class="text-secondary mb-0"><i>Descripcion: {perfil.descripcion}</i></p>
                </td>
            </tr>
        ));
    };

    
    
    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Lista de Perfiles:</h6>
                </div>
            </div>
            
            <div className="mb-3 row">
                <p className="fw-bold mb-1">Filtros:</p>
                <div className="row">
                    <div className="col-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar:"/>
                    </div>
                    <div className="col-3">
                    <select class="form-select form-select-sm" aria-label="Default select example">
                        <option value="1">Activos</option>
                        <option value="0">Inactivos</option>
                    </select>
                    </div>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col">
                    <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col" className="col-id">#</th>
                            <th scope="col" className="col-activo">Activo</th>
                            <th scope="col">Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderFilasTablaPerfiles() }
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Perfiles;