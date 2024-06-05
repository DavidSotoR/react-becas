import axios from "axios";
import React,{ useEffect, useState } from "react";
import UsuarioCrear from "./UsuarioCrear";

function Usuarios() {
    const [ allUsuarios, setAllUsuarios ] = useState([])
    const [ dataPostUsuario, setDataPostUsuario ] = useState({})

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const getAllDataUsuarios = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/usuarios', config);
            console.log(resp);
            setAllUsuarios(resp.data);
        } catch (error) {
            console.error("Error fetching perfiles:", error);
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

    const getDatosPost = (datosPost) => {
        setDataPostUsuario(datosPost)
    }

    const sendDataPost = () => {
        console.log(dataPostUsuario);
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
                        <button className="btn btn-primary mx-1">Editar</button>
                        <button className="btn btn-small btn-danger mx-1">X</button>
                    </div>
                </td>
            </tr>
        ));
    };
    
    return (
        <div className="container mt-3">
            <div className="row mb-3">
                <div className="col">
                    <h4>Catalogo de Usuarios</h4>
                </div>
                <div className="col d-flex flex-row-reverse">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Agregar Usuario</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
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

            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Crear Nuevo Usuario</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <UsuarioCrear onCreate={ getDatosPost }/>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onClick={ sendDataPost }>Crear</button>
                </div>
                </div>
            </div>
            </div>

        </div>
    )
}

export default Usuarios;