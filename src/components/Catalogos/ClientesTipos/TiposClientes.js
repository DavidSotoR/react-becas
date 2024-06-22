import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

function TiposClientes() {
    const [ allTiposClientes, setAllTiposClientes ] = useState([])
    const { logout } = useContext(AuthContext);
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const getTiposClientesList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/clientes/tipos', config);
            if (Array.isArray(resp.data)) {
                setAllTiposClientes(resp.data);
            } else {
                throw new Error('La respuesta no es un array');
            }
            
        } catch (error) {
            if (error.response?.status === 401) {
                logout()
            }
        }
    }

    useEffect( ()=>{
        getTiposClientesList();
    }, [])

    const renderFilasTablaTiposClientes = () => {
        return allTiposClientes.map((tc, index) => (
            <tr key={'tr-tc-'+index}>
                <td>
                    <p>{tc.id}</p>
                </td>
                <td>
                    <p>{tc.nombre}</p>
                </td>
            </tr>
        ));
    };

    
    
    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Lista de Tipos Perfiles:</h6>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    { renderFilasTablaTiposClientes() }
                </tbody>
            </table>
        </div>
    )
}

export default TiposClientes;