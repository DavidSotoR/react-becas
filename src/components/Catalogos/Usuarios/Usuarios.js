import axios from "axios";
import { useState } from "react";

function Usuarios() {
    const [ allUsuarios, setAllUsuarios ] = useState([])

    const getAllDataUsuarios = async () => {
        var resp = await axios.get('http://localhost:8000/api/auth/usuarios')
    }
    
    return (
        <div className="container mt-3">
            <div className="row mb-3">
                <div className="col-4">
                    <h4>Catalogo de Usuarios</h4>
                </div>
                <div className="col">
                    <button className="btn btn-primary">Agregar Usuario</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                <table class="table">
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
                        
                    </tbody>
                </table>
                </div>
            </div>

        </div>
    )
}

export default Usuarios;