import axios from "axios";
import ModalCiclosEscolares from "./ModalCiclosEscolares"
import { useEffect, useState } from "react";

function CiclosEscolares() {
    const [ allCiclosEscolares, setAllCiclosEscolares ] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
        if (!show) {
            getCiclosEscolaresList()
        }
    }, [show])

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
            
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h4>Lista de Ciclos Escolares:</h4>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Crear Cliente</button>
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
            <ModalCiclosEscolares show={show} handleClose={handleClose}/>
        </div>
    )
}

export default CiclosEscolares;