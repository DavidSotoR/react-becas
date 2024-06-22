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
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Catalogo Clientes</h6>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nuevo Cliente</button>
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
                        <option >Tipo Cliente</option>
                    </select>
                    </div>
                </div>
            </div>
            <hr></hr>
            <div className="table-wrapper">
                <table className="table">
                <thead>
                    <tr>
                        <th scope="col" className="col-id">#</th>
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