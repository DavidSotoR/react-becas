import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Modal, Button } from "react-bootstrap";

function OrdenesServicios() {
  const APIURL = process.env.REACT_APP_API_URL;
  const CONFIG = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [flagInit, setFlagInit] = useState(false);
  const [ordenesServicio, setOrdenesServicio] = useState([]);
  const [proyectosOptions, setProyectosOptions] = useState([]);
  const [clientesOptions, setClientesOptions] = useState([]);

  const [formValid, setFormValid] = useState(false);
  const modelOrdenServicio = {
    id_proyecto: 0,
    id_cliente: 0,
    descripcion: "",
    notas: "",
    fecha_estimada_entrega: "",
    fecha_estimada_finalizacion: "",
    activo: true,
  }
  const [dataFormOrdenServicio, setDataFormOrdenServicio] = useState(modelOrdenServicio);

  const [showNuevoOrdenServicio, setShowNuevoOrdenServicio] = useState(false);
  const handleCloseNuevoOrdenServicio = () => setShowNuevoOrdenServicio(false);
  const handleShowNuevoOrdenServicio = () => setShowNuevoOrdenServicio(true);

  const getOrdenesServicios = async () => {
    try {
      var resp = await axios.get(APIURL + "/ordenes-servicio", CONFIG);
      setOrdenesServicio(resp.data);
    } catch (error) {
      console.log(error);
      if (resp.response.status === 401) {
        logout();
      }
    }
  };

  const getAllProyectos = async () => {
    try {
      var resp = await axios.get(APIURL + "/proyectos/filtro", CONFIG);
      console.log(resp.data);
      setProyectosOptions(resp.data);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  const getAllClientes = async (idProy) => {
    try {
      var resp = await axios.get(APIURL + "/clientes/filtro/proyecto/" + idProy, CONFIG);
      console.log(resp);
      setClientesOptions(resp.data);
    } catch (error) {
      if (error.status === 401) {
        logout();
      }
    }
  };

  const renderFilasTablaOS = () => {
    return ordenesServicio.map((os, index) => (
      <tr key={"tr-orden-" + index}>
        <td className="col-id">{os.id}</td>
        <td className="col-nombre">{os.proyecto.nombre}</td>
        <td className="col-cuenta">
          <p>{os.activo ? "Activo" : "Inactivo"}</p>
        </td>
        <td>
          <p>{os?.cliente ? os.cliente.nombre : "SIN DATO"}</p>
        </td>
        <td>
          <button className="btn">Editar</button>
        </td>
      </tr>
    ));
  };

  const renderOpcionesProyectosSelect = () => {
    return [
      ...proyectosOptions.map((os, index) => (
        <option key={"opt-proy-" + index} value={`${os.id}`}>
          {os.nombre}
        </option>
      )),
    ];
  };

  const renderOpcionesClienteSelect = () => {
    return [
      ...clientesOptions.map((cli, index) => (
        <option key={"opt-proy-" + index} value={`${cli.id}`}>
          {cli.nombre}
        </option>
      )),
    ];
  }

  const handleCheckChange = (e) => {
    setDataFormOrdenServicio((prevState) => ({
      ...prevState,
      activo: e.target.checked,
    }));
  };

  const formInputChange = (e) => {
    const { name, value } = e.target;
    setDataFormOrdenServicio((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changeDataFormOrdenServicio = (e) => {
    var { value, name } = e.target;
    
    if (name == 'id_proyecto') {
      getAllClientes(value)
    }
    
    setDataFormOrdenServicio((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
  }

  const sendDataNuevaOrden = () => {        
      axios.post(`${APIURL}/proyectos/clientes/ordenes-servicio`,dataFormOrdenServicio,CONFIG).then((resp)=>{
        console.log(resp);
        handleCloseNuevoOrdenServicio()
        
      }).catch((resp)=>{
          console.log(resp);
      })
  }

  useEffect(() => {
    if (!flagInit) {
      getOrdenesServicios();
      getAllProyectos();
      setFlagInit(true); // Activar el flag después de la primera ejecución
    }
  }, [flagInit]);

  return (
    <div className="container mt-3">
      <h4>Ordenes de Servicio</h4>
      <div className="row">
        <div className="col-12">
          <p className="fw-bold mb-2">FILTROS:</p>
        </div>
        <div className="col-3">
          <input
            type="text"
            readonly
            className="form-control form-control-sm"
            id="filtro_buscar"
            name="filtro_buscar"
            placeholder="BUSCAR:"
          />
        </div>
        <div className="col-3">
          <Form.Select
            aria-label="Default select example"
            className="form-control-sm"
          >
            <option value="all">Proyectos</option>
            {renderOpcionesProyectosSelect()}
          </Form.Select>
        </div>
        <div className="col-3">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              handleShowNuevoOrdenServicio();
            }}
          >
            {" "}
            Crear Orden Servicio{" "}
          </button>
        </div>
        <div className="col-12 my-3">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Orden</th>
                <th scope="col">Proyecto</th>
                <th scope="col">Activo</th>
                <th scope="col">Cliente</th>
                <th scope="col">Opciones</th>
              </tr>
            </thead>
            <tbody>{renderFilasTablaOS()}</tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showNuevoOrdenServicio}
        onHide={handleCloseNuevoOrdenServicio}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nueva órden de servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Form.Select
              aria-label="Default select example" name="id_proyecto"
              className="form-control-sm" onChange={(e)=>{ changeDataFormOrdenServicio(e) } }
            >
              <option value="0">Seleccione Proyecto</option>
              {renderOpcionesProyectosSelect()}
            </Form.Select>
          </div>
          <div className="mb-3">
            <Form.Select
              aria-label="Default select example" name="id_cliente"
              className="form-control-sm" onChange={(e)=>{ changeDataFormOrdenServicio(e) } }
            >
              <option value="0">Seleccione Cliente</option>
              {renderOpcionesClienteSelect()}
            </Form.Select>
          </div>
          <div className="mb-3">
            <label>Descripcion</label>
            <input
              type="text"
              className="form-control"
              name="descripcion"
              onChange={(e) => formInputChange(e)}
            />
          </div>
          <div className="mb-3">
            <label>Estado: </label>
            <Form.Check type="switch">
              <Form.Check.Input
                name="activo"
                onChange={(e) => {
                  handleCheckChange(e);
                }}
                style={{ width: "2rem" }}
                checked={dataFormOrdenServicio.activo}
                type="checkbox"
              />
              <Form.Check.Label>
                {" "}
                <span className="pl-3">
                  {dataFormOrdenServicio.activo ? "Activo" : "Inactivo"}
                </span>{" "}
              </Form.Check.Label>
            </Form.Check>
          </div>

          <div className="mb-3">
            <label>Notas:</label>
            <input
              type="text"
              className="form-control"
              name="notas"
              onChange={(e) => formInputChange(e)}
            />
          </div>

          <div className="mb-3">
            <label>Fecha estimada de entrega de expedientes:</label>
            <input
              type="date"
              className="form-control"
              name="fecha_estimada_entrega"
              onChange={(e) => formInputChange(e)}
            />
          </div>

          <div className="mb-3">
            <label>
              Fecha estimada de entrega de finalizacion de servicio:
            </label>
            <input
              type="date"
              className="form-control"
              name="fecha_estimada_finalizacion"
              onChange={(e) => formInputChange(e)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNuevoOrdenServicio}>
            Close
          </Button>
          <Button variant="primary" onClick={sendDataNuevaOrden}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrdenesServicios;
