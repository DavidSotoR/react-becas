import axios from "axios";
import React,{ useContext, useEffect, useState } from "react";
import UsuarioCrear from "./UsuarioCrear";
import { Button, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

function Usuarios() {
    const { logout } = useContext(AuthContext);
    const [ clearForm, setClearForm ] = useState(false)
    const [ btnEnable, setBtnEnable ] = useState(true)
    const [ allUsuarios, setAllUsuarios ] = useState([])
    const [ dataPostUsuario, setDataPostUsuario ] = useState({})
    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false); 
    const handleShow = () => setShow(true); 

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const defaultValuesForm = () =>{
        setClearForm(false)

    }

    const postCrearUsuario = async () => {
        var data = dataPostUsuario;
        try {
            const resp = await axios.post('http://localhost:8000/api/auth/register', data, config)
            console.log(resp);
            handleClose()
            getAllDataUsuarios()
            setClearForm(true)
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                logout()
            }
        }   
    }

    const getAllDataUsuarios = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/usuarios', config);
            console.log(resp);
            setAllUsuarios(resp.data);
        } catch (error) {
            console.error("Error fetching perfiles:", error);
            if (error.response.status === 401) {
                logout()
            }
        }
    }

    const getNamePerfil = (id) => {
        var name = ''
        switch (id) {
            case 1:
                name = 'Administrador'
                break;
            case 2:
                name = 'Gerencia'
                break;

            case 3:
                name = 'Calidad'
                break;

            case 4:
                name = 'Colaboradores'
                break;

            case 5:
                name = 'Empresas'
                break;

            case 6:
                name = 'Familias'
                break;
            default:
                name = 'Sin Identificar'
                break;
        }

        return name
    }

    const getDatosPost = (datosPost, pbtnEnable) => {
        var data = datosPost
        setDataPostUsuario(data)
        setBtnEnable(pbtnEnable)
        console.log(btnEnable);
    }

    const sendDataPost = () => {
        console.log(dataPostUsuario);
        postCrearUsuario()
    }

    useEffect( ()=>{
        getAllDataUsuarios();
    }, [])

    const renderFilasTablaUsuarios = () => {
        return allUsuarios.map((usuario, index) => (
            <tr key={'tr-usuario-'+index}>
                <td>
                    <p>{usuario.id}</p>
                </td>
                <td>
                    <p>{usuario.name}</p>
                </td>
                <td>
                    <p>{usuario.email}</p>
                </td>
                <td>
                    <p>{ getNamePerfil(usuario.id_perfil)}</p>
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
    
    return (
        <div className="container mt-3">
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="">
                    <h6 style={{ fontWeight: 'bold' }}>Catalogo de Usuarios</h6>
                </div>
                <div className="">
                    <Button className="btn btn-primary btn-sm" onClick={handleShow}>Agregar Usuario</Button>
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
                        <option value="0">Seleccione un Perfil</option>
                    </select>
                    </div>
                </div>
            </div>
            <hr></hr>
            <div className="row">
                <div className="col" >
                    <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col" className="col-id">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Email</th>
                            <th scope="col">Perfil</th>
                            <th scope="col">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderFilasTablaUsuarios() }
                        </tbody>
                    </table>
                    </div>
                
                </div>
            </div>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '50vh', overflowY: 'scroll' }}>
                    <UsuarioCrear onCreate={getDatosPost} clear={ defaultValuesForm } clearForm={ clearForm } />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button variant="primary" disabled={ btnEnable } onClick={sendDataPost}>Crear</Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Usuarios;