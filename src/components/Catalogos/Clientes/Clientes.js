import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ModalCliente from "./ModalCliente";
import axios from "axios";

function Clientes() {
    const [ allClientes, setAllClientes ] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getDataClientes = () =>{
        axios.get('http://localhost:8000/api/auth/clientes',config).then((resp)=>{
            console.log(resp);
            setAllClientes(resp.data)
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const rtnTypeCliente = (id) =>{
        var tipo = ''
        switch (id) {
            case 1:
                tipo = 'Escuela'
                break;
        
            case 2:
                tipo = 'Empresa'
                break;
    
            default:
                tipo = 'Sin identificar'
                break;
        }
        return tipo
    }

    const renderFilasTablaClientes = () => {
        return allClientes.map((cliente, index) => (
            <tr key={'tr-cliente-'+index}>
                <td>
                    <p>{cliente.id}</p>
                </td>
                <td>
                    <p>{rtnTypeCliente(cliente.id_tipo_cliente)}</p>
                </td>
                <td>
                    <p>{cliente.nombre}</p>
                </td>
                <td>
                    <p>{ cliente.descripcion }</p>
                </td>
                <td>
                    <p>{ cliente.notificaciones_email }</p>
                </td>
                <td>
                    <div className="d-flex justify-content-start">
                        <button className="btn btn-primary mx-1 btn-sm">Editar</button>
                        <button className="btn btn-small btn-danger mx-1 btn-sm">X</button>
                    </div>
                </td>
            </tr>
        ));
    };

    useEffect(()=>{
        if (!show) {
            console.log('Se cerro, renderiza');
            getDataClientes()
        }
    },[show])

    return (
        <div className="container">
            <div className="mt-3 d-flex justify-content-between">
                <div className="">
                    <p className="fw-bold fs-3">Catalogo Clientes</p>
                </div>
                <div className="pt-3">
                    <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Crear Cliente</button>
                </div>
            </div>
            <div className="table">
                <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Email</th>
                        <th scope="col">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    { renderFilasTablaClientes() }
                </tbody>
                </table>
            </div>
            <ModalCliente show={show} handleClose={handleClose}/>
        </div>
        
    )
}

export default Clientes;