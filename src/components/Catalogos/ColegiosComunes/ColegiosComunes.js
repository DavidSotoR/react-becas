import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import ModalNuevoColegioComun from "./ModalNuevoColegioComun";

function CatalogoFamilias() {
    const { logout } = useContext(AuthContext);
    const [ allClientes, setAllClientes ] = useState([])
    const [ allClientesHermanos, setAllClientesHermanos ] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const APIURL = process.env.REACT_APP_API_URL

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getDatosClientesHermanos = () =>{
        axios.get(APIURL+'/clientes/hermanos',config).then((resp)=>{
            console.log(resp);
            setAllClientesHermanos(resp.data)
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const getClientesList = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes', config);
            setAllClientes(resp.data);

        } catch (error) {
            if (error.response.status === 401) {
                logout()
            }
        }
    }

    const renderListaHermanos = (lista) => {
        return [...lista.map((colegio) =>  (<li>{colegio.nombre}</li>) )]
    };

    const renderFilasColegiosHermanos = () => {
        return allClientesHermanos.map((familia, index) => (
            <tr key={'tr-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{familia.nombre}</p>
                </td>
                <td>
                    <ul>
                        {renderListaHermanos(familia.lista)}
                    </ul>
                    <button className="btn btn-link btn-sm fw-bold" onClick={handleShow}>Añadir</button>
                </td>
                <td>
                    <div className="d-flex">
                        <button className="btn btn-danger btn-sm mx-1">Borrar</button>
                    </div>
                </td>
            </tr>
        ));
    };


    useEffect(()=>{
        if (!show) {
            console.log('Se cerro, renderiza');
            getDatosClientesHermanos()
        }
        getClientesList()
    },[show])

    return (
       <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Colegios Comunes</h6>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nueva</button>
                </div>
            </div>
            <div className="mb-3 row">
                <p className="fw-bold mb-1">Filtros:</p>
                <div className="row">
                    <div className="col-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar:"/>
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
                                    <th scope="col">Nombre Familia</th>
                                    <th scope="col">Colegios comunes</th>
                                    <th scope="col">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { renderFilasColegiosHermanos() }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ModalNuevoColegioComun show={show} handleClose={handleClose}></ModalNuevoColegioComun>
       </div> 
    )
}

export default CatalogoFamilias;