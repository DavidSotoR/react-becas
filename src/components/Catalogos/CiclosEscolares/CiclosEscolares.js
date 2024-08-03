import axios from "axios";
import ModalCiclosEscolares from "./ModalCiclosEscolares"
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

function CiclosEscolares() {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
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
            const resp = await axios.get(APIURL+'/ciclos', config);
            setAllCiclosEscolares(resp.data);
        } catch (error) {
            console.error("Error fetching Ciclos Escolares:", error);
            if (error?.response.status === 401) {
                logout()
            } else {
                alert('Ocurrio un ERROR en el REQUEST')
                console.log(error);
                
            }
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
                <td >
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Ciclos Escolares</h6>
                </div>
                <div className="">
                    <Button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nuevo Ciclo Escolar</Button>
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
                                { renderFilasTablaCiclosEscolares() }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <ModalCiclosEscolares show={show} handleClose={handleClose}/>
        </div>
    )
}

export default CiclosEscolares;