import { useContext, useEffect, useMemo, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { AuthContext } from "context/AuthContext";

function Sucursales(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    };
    const { logout } = useContext(AuthContext);

    const [empresas, setEmpresas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [nuevaSucursal, setNuevaSucursal] = useState({
        id_cliente: 0,
        nombre: '',
        telefono: '',
        domicilio: '',
        razon_social: '',
    });

    const [showNuevaSucursal, setShowNuevaSucursal] = useState(false);

    const handleCloseNuevaSucursal = () => setShowNuevaSucursal(false);
    const handleShowNuevaSucursal = () => setShowNuevaSucursal(true);

    const getDatosEmpresas = async () => {
        let resp
        try{
            resp = await axios.get(APIURL+'/empresas/lista', config);
            setEmpresas(resp.data);
        }catch(error){
            console.log(error.response.status);
            if (error.response.status === 401) {
                logout()
            }
        }
        
        
    }

    const getDatosSucursales = async () => {
        let resp
        try{
            resp = await axios.post(APIURL+'/empresas/sucursal/lista', config);
            setSucursales(resp.data);
        }catch(error){
            console.log(error.response.status);
            if (error.response.status === 401) {
                logout()
            }
        }
        
        
    }

    const formInputNuevaSucursalChange =(e) => {
        var name = e.target.name
        var value = e.target.value
        setNuevaSucursal(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const postNuevaSucursal = async () => {
        try {
            let resp = await axios.post(APIURL+'/empresas/sucursal/nueva', nuevaSucursal, config);
            console.log(resp.data);
            handleCloseNuevaSucursal()
        } catch (error) {
            console.log(error.response.status);
            if (error.response.status === 401) {
                logout()
            }
        }
        
    }

    const renderOptionsEmpresas = useMemo(() =>{
        console.log('render Datos');
        return [<option key={'empresa-0'} value="0">Seleccione una Opción</option>,...empresas.map((ch) => (
            <option key={'empresa-'+ch.id} value={ch.id}> {ch.nombre} </option>
        ))]
            
    }, [empresas])

    const renderRowsTableSucursales = useMemo(() =>{
        console.log('render Datos');
        return [...sucursales.map((ch,index) => (
            <tr key={'row-'+index}>
                <td>{ch.id}</td>
                <td>{ch.id_cliente}</td>
                <td>{ch.nombre}</td>
                <td>{ch.telefono}</td>
                <td>
                    <Button className="btn-primary btn-sm fw-bold">Editar</Button>
                    <Button className="btn-danger btn-sm fw-bold">Eliminar</Button>
                </td>
            </tr>
        ))]
            
    }, [sucursales])

    useEffect(() => {
        getDatosEmpresas()
        getDatosSucursales()
    }, [])

    return (
        <div className="row">
            <div className="col-12">
                <p className="fw-bold">Sucursales De Empresas</p>
            </div>
            <div className="col-12 mb-3">
                <div className="d-flex align-items-center">
                    <div className="w-25">
                        <span>Seleccione la empresa:</span>
                        <select className="form-select" aria-label="Default select example">
                            {renderOptionsEmpresas}
                        </select>
                    </div>
                    <div className="mx-3 pt-3">
                        <button className="btn btn-primary btn-sm" onClick={handleShowNuevaSucursal}>Nueva Sucursal</button>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-3">
                <p className="fw-bold">Lista de Sucursales:</p>
                <table className="table">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Empresa</td>
                            <td>Sucursal</td>
                            <td>Contacto</td>
                            <td>Acciones</td>
                        </tr>
                    </thead>
                    <tbody>
                        {renderRowsTableSucursales}
                    </tbody>
                </table>
            </div>

            <Modal show={showNuevaSucursal} onHide={handleCloseNuevaSucursal}>
                <Modal.Header closeButton>
                <Modal.Title>Crear Sucursal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="mb-3">
                            <span>Seleccione la empresa:</span>
                            <select value={nuevaSucursal.id_cliente} name="id_cliente" className="form-select" aria-label="Default select example" onChange={formInputNuevaSucursalChange}>
                                {renderOptionsEmpresas}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefono" className="form-label">Nombre:</label>
                            <input value={nuevaSucursal.nombre} type="text" className="form-control" name="nombre" placeholder="nombre" onChange={formInputNuevaSucursalChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefono" className="form-label">Telefono</label>
                            <input value={nuevaSucursal.telefono} type="text" className="form-control" name="telefono" placeholder="Telefono" onChange={formInputNuevaSucursalChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefono" className="form-label">Domicilio</label>
                            <input value={nuevaSucursal.domicilio} type="text" className="form-control" name="domicilio" placeholder="Domicilio" onChange={formInputNuevaSucursalChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefono" className="form-label">Razon Social</label>
                            <input value={nuevaSucursal.razon_social} type="text" className="form-control" name="razon_social" placeholder="Razon Social" onChange={formInputNuevaSucursalChange}/>
                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseNuevaSucursal}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={postNuevaSucursal}>
                    Guardar
                </Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    )

}

export default Sucursales;