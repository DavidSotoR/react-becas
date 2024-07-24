import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import ModalNuevoColegioComun from "./ModalNuevoColegioComun";
import ModalEnlazarColegioComun from "./ModalEnlazarColegioComun";
import ModalEliminarColegioComun from "./ModalEliminarColegioComun";

function CatalogoFamilias() {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [ allClientes, setAllClientes ] = useState([])
    const [ allClientesHermanos, setAllClientesHermanos ] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showEnlazar, setShowEnlazar] = useState(false);
    const [idColegioComun, setIdColegioComun] = useState(0);
    const [tituloColegioComun, setTituloColegioComun] = useState('');

    const handleCloseEnlazar = () => {
        setShowEnlazar(false);
        setIdColegioComun(0);
        setTituloColegioComun('');
    }
    const handleShowEnlazar = (id,nombre) => {
        setShowEnlazar(true);
        setIdColegioComun(id);
        setTituloColegioComun(nombre);
    }
    //
    const [showEliminar, setShowEliminar] = useState(false);
    const [idColegioComunEliminar, setIdColegioComunEliminar] = useState(0);
    const [nombreColegioComunEliminar, setNombreColegioComunEliminar] = useState('');
    
    const handleCloseEliminar = () => {
        setShowEliminar(false);
        setIdColegioComunEliminar(0);
        setNombreColegioComunEliminar('');
    }
    const handleShowEliminar = (id,nombre) => {
        setShowEliminar(true);
        setIdColegioComunEliminar(id);
        setNombreColegioComunEliminar(nombre);
    }

    
    const getDatosClientesHermanos = () =>{
        axios.get(APIURL+'/clientes/hermanos?lista=1',config).then((resp)=>{
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
        return [...lista.map((colegio,index) =>  (
        <li key={'li-'+index}> 
            <a onClick={() => handleShowEliminar(colegio.id,colegio.nombre)}>{colegio.nombre}</a>
        </li>
    ) )]
    };

    const renderFilasColegiosHermanos = () => {
        if(!allClientesHermanos){
            return "";
        }
        return allClientesHermanos.map((familia, index) => (
            <tr key={'tr-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{familia.nombre}</p>
                </td>
                <td>
                    { familia?.lista.length > 0 && 
                        <ul> 
                            {renderListaHermanos(familia.lista)}
                        </ul>
                    }
                    
                    <button className="btn btn-link btn-sm fw-bold" onClick={() =>handleShowEnlazar(familia.id,familia.nombre)}>Añadir</button>
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
        if(!showEnlazar){
            console.log('Se cerro, renderiza');
            getDatosClientesHermanos()
        }
        if(!showEliminar){
            console.log('Se cerro, renderiza');
            getDatosClientesHermanos()
        }
        getClientesList()
    },[show,showEnlazar,showEliminar])

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
                                    <th scope="col">Nombre colegios comunes</th>
                                    <th scope="col">Colegios</th>
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
            <ModalEnlazarColegioComun showNuevoHemano={ showEnlazar } handleNuevoHemanoClose={handleCloseEnlazar} idColegioComun={ idColegioComun } tituloColegioComun={ tituloColegioComun }></ModalEnlazarColegioComun>
            <ModalEliminarColegioComun show={ showEliminar } handleClose={handleCloseEliminar} idColegio={ idColegioComunEliminar } nombreCoegio={ nombreColegioComunEliminar }></ModalEliminarColegioComun>
       </div> 
    )
}

export default CatalogoFamilias;