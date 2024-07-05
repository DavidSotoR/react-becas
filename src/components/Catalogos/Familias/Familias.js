import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ModalNuevaFamilia from "./ModalNuevaFamilia";
import { AuthContext } from "../../../context/AuthContext";

function CatalogoFamilias() {
    const { logout } = useContext(AuthContext);
    const [ allCiclosEscolares, setAllCiclosEscolares ] = useState([])
    const [ allFamilias, setAllFamilias ] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getDatosFamilia = () =>{
        axios.get('http://localhost:8000/api/auth/familias',config).then((resp)=>{
            console.log(resp);
            setAllFamilias(resp.data)
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    const getCiclosEscolaresList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/ciclos', config);
            setAllCiclosEscolares(resp.data);

        } catch (error) {
            if (error.response.status === 401) {
                logout()
            }
        }
    }

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
                    <p style={{ fontWeight: "bold" }}>{getAnioCicloEscolar(familia.id_ciclo_escolar)}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{familia.situacion_beca}</p>
                </td>
                <td>
                    <div className="d-flex">
                        <Link className="btn btn-primary btn-sm" to={`/familias/${familia.id}`}>Editar</Link>
                        {/* <button className="btn btn-primary btn-sm mx-1">Editar</button> */}
                        <button className="btn btn-danger btn-sm mx-1">Borrar</button>
                    </div>
                </td>
            </tr>
        ));
    };

    const getAnioCicloEscolar = (id) => {
        var anio = ''
        allCiclosEscolares.forEach((ciclo)=>{
            if (id === ciclo.id) {
                anio = `${ciclo.inicio.slice(0, -6)} a ${ciclo.fin.slice(0,-6)}`    
            }
        })
        return anio
    }

    useEffect(()=>{
        if (!show) {
            console.log('Se cerro, renderiza');
            getDatosFamilia()
        }
        getCiclosEscolaresList()
    },[show])

    return (
       <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Catalogo Familias</h6>
                </div>
                <div className="">
                    <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nueva Familia</button>
                </div>
            </div>
            <div className="mb-3 row">
                <p className="fw-bold mb-1">Filtros:</p>
                <div className="row">
                    <div className="col-3">
                        <input type="text" className="form-control form-control-sm" placeholder="Buscar:"/>
                    </div>
                    <div className="col-3">
                    <select className="form-select form-select-sm" aria-label="Default select example">
                        <option >Cliente</option>
                    </select>
                    </div>
                    <div className="col-3">
                    <select className="form-select form-select-sm" aria-label="Default select example">
                        <option >Ciclo Escolar</option>
                    </select>
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
                                    <th scope="col" className="col-id">ID</th>
                                    <th scope="col">Familia</th>
                                    <th scope="col">Ciclo Escolar</th>
                                    <th scope="col">Situacion Beca</th>
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
            <ModalNuevaFamilia show={show} handleClose={handleClose}></ModalNuevaFamilia>
       </div> 
    )
}

export default CatalogoFamilias;