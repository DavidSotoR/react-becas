import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";
import { useState } from "react";

function CatalogoFamilias() {
    const [ allFamilias, setAllFamilias ] = useState([
        { id: 1, nombre: 'Soto Resendiz', colegio: "Alfa & Omega" }
    ])

    const renderFilasTablaFamilias = () => {
        return allFamilias.map((familia, index) => (
            <tr key={'tr-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{familia.id}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{familia.nombre}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{familia.colegio}</p>
                </td>
                <td>
                    <div className="d-flex">
                        <button className="btn btn-primary btn-sm mx-1">Editar</button>
                        <button className="btn btn-danger btn-sm mx-1">Borrar</button>
                    </div>
                </td>
            </tr>
        ));
    };
    
    return (
       <div className="container mt-3">
            <div className="row">
                <div className="col">
                    <h3>Catalogo Familias</h3>
                </div>
                <div className="col">
                    <Link className="btn btn-primary" to={PathConstants.FAMILIASALTA}>Agregar Familia</Link>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">FAMILIA</th>
                                <th scope="col">COLEGIO</th>
                                <th scope="col">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderFilasTablaFamilias() }
                        </tbody>
                    </table>
                </div>
            </div>
       </div> 
    )
}

export default CatalogoFamilias;