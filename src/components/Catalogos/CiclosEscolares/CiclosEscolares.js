import axios from "axios";
import { useEffect, useState } from "react";

function CiclosEscolares() {
    const [ allCiclosEscolares, setAllCiclosEscolares ] = useState([])
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const getCiclosEscolaresList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/ciclos', config);
            setAllCiclosEscolares(resp.data);
        } catch (error) {
            console.error("Error fetching Ciclos Escolares:", error);
        }
    }

    useEffect( ()=>{
        getCiclosEscolaresList();
    }, [])

    const renderFilasTablaCiclosEscolares = () => {
        return allCiclosEscolares.map((ciclos, index) => (
            <tr key={'tr-perfil-'+index}>
                <td>
                    <p>{ciclos.id}</p>
                </td>
                <td>
                    <p>{ciclos.activo ? 'Si' : 'No' }</p>
                </td>
                <td>
                    <p class="mb-0">{ciclos.inicio} / {ciclos.fin}</p>
                </td>
            </tr>
        ));
    };

    
    
    return (
        <div className="container mt-3">
            
            <div className="row mb-3">
                <div className="col">
                    <h4>Lista de Ciclos Escolares:</h4>
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
                    { renderFilasTablaCiclosEscolares() }
                </tbody>
            </table>
        </div>
    )
}

export default CiclosEscolares;