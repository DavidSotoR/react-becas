import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import ResaltarTexto from "../../../ResaltarTexto/ResaltarTexto";
import ModalEnlazarCliente from "./ModalEnlazarCliente";

function TablaClientesProyecto({ ID , idTipoCliente}) {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [ show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [ allClientes, setAllClientes ] = useState([]);
    const [search,setSearch] = useState("");
    
    const getClientesProyectoID = () =>{
        axios.get(`${APIURL}/proyectos/${ID}/clientes`,config).then((resp)=>{
            setAllClientes(resp.data)
        }).catch((resp)=>{
            console.log(resp);
        });
    }
    useEffect(()=>{
        getClientesProyectoID();
    },[]);
    
    useEffect( ()=>{
        if (!show) {
            getClientesProyectoID();
        }
    }, [show])

    const allClientesFiltrados = allClientes.filter(item =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const renderFilasTablaClientes = () => {
        return allClientesFiltrados.map((cliente, index) => (
            <tr key={'tr-cliente-'+index}>
                <td>
                    <p>{index}</p>
                </td>
                <td>
                    <p><ResaltarTexto texto={cliente.nombre} reslatar={search}/></p>
                </td>
                <td>
                    <p>Opciones</p>
                </td>
            </tr>
        ));
    };

    return (
        <div>
        <div className="d-flex justify-content-between mb-3">
            <div className="">
            <h3>Lista de clientes enalzados al proyecto:</h3>
            </div>
            <div className="">
            <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Agregar Clientes</button>
            </div>
        </div>
            <div className="table-wrapper">
                <table className="table">
                <thead>
                    <tr>
                        <th scope="col" className="col-id">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Encuesta</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    { renderFilasTablaClientes() }
                </tbody>
                </table>
            </div>
            <ModalEnlazarCliente show={show} handleClose={handleClose} idProyecto={ID} idTipoCliente={idTipoCliente}></ModalEnlazarCliente>
        </div>
        );
}

export default TablaClientesProyecto;