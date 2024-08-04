import { useEffect, useState } from "react";
import { Button,Form, Modal } from "react-bootstrap";
import ModalCliente from "./ModalCliente";
import ResaltarTexto from "../../ResaltarTexto/ResaltarTexto";
import axios from "axios";
import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";

function Clientes() {
    const APIURL = process.env.REACT_APP_API_URL;
    const [ allClientes, setAllClientes ] = useState([]);
    const [ allTiposClientes, setallTiposClientes ] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [tiposCliente,setTiposCliente] = useState("");
    const [search,setSearch] = useState("");
    
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getDataClientes = () =>{
        let paramsConfig = config;
        const params = new URLSearchParams();
        if(tiposCliente !== ""){
            params.append("id_tipo_cliente",tiposCliente)
            paramsConfig["params"]=params;
        }

        axios.get(APIURL+'/clientes',paramsConfig).then((resp)=>{
            setAllClientes(resp.data)
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    const getDataTiposClientes= () =>{
        axios.get(APIURL+'/clientes/tipos',config).then((resp)=>{
            setallTiposClientes(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const renderOptionTiposClientes = () => {
        return [<option key={'select-tc-'+0} value="" >Todos los clientes</option>,...allTiposClientes.map((option) => (
            <option key={'select-tc-'+option.id} value={option.id}> {option.nombre} </option>
        ))]
    }
    

    const filtroTipoCliente = (e) => {
        const tipo_cliente = e.target.value;
        console.log(e);
        setTiposCliente(tipo_cliente);
    }

    const searchText = (e) => {
        const buscar = e.target.value;
        setSearch(buscar);
    }

    const allClientesFiltrados = allClientes.filter(item =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(()=>{
        getDataTiposClientes();
        if (!show) {
            //console.log('Se cerro, renderiza');
            getDataClientes();
        }

        if(tiposCliente){
            getDataClientes();
        }

    },[show,tiposCliente])


    const renderFilasTablaClientes = () => {
        return allClientesFiltrados.map((cliente, index) => (
            <tr key={'tr-cliente-'+index}>
                <td>
                    <p>{cliente.id}</p>
                </td>
                <td>
                    <p>{cliente.tipo_cliente.nombre}</p>
                </td>
                <td>
                    <p><ResaltarTexto texto={cliente.nombre} reslatar={search}/></p>
                </td>
                <td>
                    <p>{ cliente.descripcion }</p>
                </td>
                <td>
                    <p>{ cliente.notificaciones_email }</p>
                </td>
                <td>
                    <div className="d-flex justify-content-start">
                        <Link to={'/clientes/'+cliente.id} className="btn btn-primary mx-1 btn-sm">Editar</Link>
                        <button className="btn btn-small btn-danger mx-1 btn-sm">X</button>
                    </div>
                </td>
            </tr>
        ));
    };


    return (
        <div className="container">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Catalogo Clientes</h6>
                </div>
                <div className="">
                    <Link className="btn btn-primary btn-sm" to={PathConstants.CLIENTENUEVO}>Nuevo Cliente</Link>
                    {/* <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nuevo Cliente</button> */}
                </div>
            </div>
            <div className="mb-3 row">
                <p className="fw-bold mb-1">Filtros:</p>
                <div className="row">
                    <div className="col-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar..." value={search} onChange={searchText}/>
                    </div>
                    <div className="col-3">
                        
                    <Form.Select className="form-select form-select-sm" name="id_tipo_cliente" id="id_tipo_cliente" onChange={(e)=> filtroTipoCliente(e)}>
                        {renderOptionTiposClientes()}
                    </Form.Select>
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