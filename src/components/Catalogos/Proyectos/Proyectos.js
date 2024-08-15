import axios from "axios";
import ModalProyectos from "./ModalProyectos"
import { useContext, useEffect, useState } from "react";
import { Button,Form } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { AuthContext } from "../../../context/AuthContext";
import ResaltarTexto from "../../ResaltarTexto/ResaltarTexto";
import { Link } from "react-router-dom";

function Proyectos() {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [ activos,setActivos ] = useState(1);
    const [ tipoCliente, setTipoCliente ] = useState("Escuelas")
    const [ idTipoCliente, setIdTipoCliente ] = useState(1)
    const [ allTiposClientes, setAllTiposClientes ] = useState([])
    const [ allProyectos, setAllProyectos ] = useState([])
    const [ show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [search,setSearch] = useState("");
    
    const searchText = (e) => {
        const buscar = e.target.value;
        setSearch(buscar);
    }

    const filtroProyectosActivos = (e) => {
        const activos = e.target.value;
        setActivos(activos);
    }

    const changeTipoCliente = (id) => {
        setIdTipoCliente(id);
        setAllProyectos([]);
    }

    const getTiposClientes = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes/tipos', config);
            setAllTiposClientes(resp.data);
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

    const getProyectosList = async () => {
        try {
            const resp = await axios.get(APIURL+`/proyectos?id_tipo_cliente=${idTipoCliente}&activo=${activos}`, config);
            setAllProyectos(resp.data);
        } catch (error) {
            if (error?.response.status === 401) {
                logout()
            } else {
                console.log(error);
                alert('Error al solicitar información');
            }
        }
    }

    useEffect( ()=>{
        getTiposClientes();
        getProyectosList();
    },[])

    useEffect( ()=>{
        getProyectosList();
        setSearch("");
    }, [activos,idTipoCliente])

    useEffect( ()=>{
        if (!show) {
            getProyectosList()
        }
    }, [show])

    useEffect(() => {
        const tipoClienteObj = allTiposClientes.find(tc => tc.id === idTipoCliente);
        if (tipoClienteObj) {
            setTipoCliente(tipoClienteObj.nombre);
        }
    }, [idTipoCliente, allTiposClientes]);

    const allProyectosFiltrados = allProyectos.filter(item =>
        item.nombre.toLowerCase().includes(search.toLowerCase())
    );
    const renderFilasTablaProyectos = () => {
        return allProyectosFiltrados.map((proyecto, index) => (
            <tr key={'tr-proyecto-' + index}>
                <td>{proyecto.id}</td>
                <td>{proyecto.activo ? 'Sí' : 'No'}</td>
                <td><p><ResaltarTexto texto={proyecto.nombre} reslatar={search}/></p></td>
                <td>
                    <div className="d-flex">
                        <Link className="btn btn-primary btn-sm" to={`/proyectos/${proyecto.id}`}>Editar</Link>
                    </div>
                </td>
            </tr>
        ));
    };
    
    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Proyectos</h6>
                </div>
                <div className="">
                    <Button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nuevo Proyecto</Button>
                </div>
            </div>
            
            <div className="mb-3 row">
                <p className="fw-bold mb-1">Filtros:</p>
                <div className="row">
                    <div className="col-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar:" value={search} onChange={searchText}/>
                    </div>
                    <div className="col-3">
                        
                    <Form.Select className="form-select form-select-sm" name="id_tipo_cliente" id="id_tipo_cliente" onChange={(e)=> filtroProyectosActivos(e)}>
                        <option value="1">Activos</option>
                        <option value="0">Inactivos</option>
                    </Form.Select>
                    </div>
                </div>
            </div>
            <Tabs>
                <TabList>
                    {allTiposClientes.map(tab =>(
                        <Tab key={'tab-' + tab.id} onClick={() => changeTipoCliente(tab.id)}>{tab.nombre}</Tab>
                    ))}
                </TabList>

                {allTiposClientes.map(tab => (
                    <TabPanel key={'tap-' + tab.id}>
                        <div className="row">
                            <div className="col">
                                <div className="table-wrapper">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="col-id">#</th>
                                                <th scope="col" className="col-activo">Activo</th>
                                                <th scope="col">Nombre</th>
                                                <th scope="col" className="col-1">Añadir</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderFilasTablaProyectos()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                ))}
            </Tabs>




            
            <ModalProyectos key="mp"  show={show} handleClose={handleClose} idTipoCliente={idTipoCliente} TipoCliente={tipoCliente}/>
        </div>
    )
}

export default Proyectos;