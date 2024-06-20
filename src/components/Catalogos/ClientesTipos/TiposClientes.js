import axios from "axios";
import { useEffect, useState } from "react";

function TiposClientes() {
    const [ allTiposClientes, setAllTiposClientes ] = useState([])
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
            console.error("Error fetching Tipos Perfiles:", error);
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
            
            <div className="row mb-3">
                <div className="col">
                    <h4>Lista de Tipos Perfiles:</h4>
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