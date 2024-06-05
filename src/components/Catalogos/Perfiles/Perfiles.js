import axios from "axios";
import { useEffect, useState } from "react";

function Perfiles() {
    const [ allPerfiles, setAllPerfiles ] = useState([])
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
            
            <div className="row mb-3">
                <div className="col">
                    <h4>Lista de Perfiles:</h4>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Activo</th>
                    <th scope="col">Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    { renderFilasTablaPerfiles() }
                </tbody>
            </table>
        </div>
    )
}

export default Perfiles;