import { useContext, useEffect, useState } from "react";
import ModalNuevaEncuesta from "./ModalNuevaEncuesta";
import { AuthContext } from "../../../context/AuthContext";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

function Encuestas() {
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [ listaEncuestas, setListasEncuestas ] = useState([])

    const getListaEncuestas = () =>{
        axios.get(APIURL+'/catalogos/encuestas',config).then((resp)=>{
            setListasEncuestas(resp.data)
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const renderFilasEncuestas = () => {
        return listaEncuestas.map((encuesta, index) => (
            <tr key={'trle-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{encuesta.id}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{encuesta.tipo_cliente?.nombre}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{encuesta.nombre}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{encuesta.descripcion}</p>
                </td>
                <td>
                    <div className="d-flex">
                        <Link className="btn btn-primary btn-sm" to={`/encuestas/${encuesta.id}`}>Editar</Link>
                    </div>
                </td>
            </tr>
        ));
    };

    useEffect(()=>{
        if (!show) {
            getListaEncuestas()
        }
    },[show])

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Catalogo Encuestas</h6>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nueva Encuesta</button>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-id">ID</th>
                                    <th scope="col">Tipo Cliente</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Descripcion</th>
                                    <th scope="col">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { renderFilasEncuestas() }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ModalNuevaEncuesta show={show} handleClose={handleClose}></ModalNuevaEncuesta>
        </div>
    )

}


export default Encuestas;


