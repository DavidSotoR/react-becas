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
  const filtroDefecto = {
    filtro_proyecto: "all",
    filtro_cliente: "all",
    filtro_buscar: "",
  };
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [flagInit, setFlagInit] = useState(false);
  const [ordenesServicio, setOrdenesServicio] = useState([]);
  const [proyectosOptions, setProyectosOptions] = useState([]);
  const [clientesOptions, setClientesOptions] = useState([]);
  const [filtro, setFiltro] = useState(filtroDefecto);

  const [formValid, setFormValid] = useState(false);
  const modelOrdenServicio = {
    id_proyecto: "0",
    id_cliente: "0",
    descripcion: "",
    notas: "",
    fecha_estimada_entrega: "",
    fecha_estimada_finalizacion: "",
    activo: true,
  };
  const [dataFormOrdenServicio, setDataFormOrdenServicio] = useState(modelOrdenServicio);
  const [ dataSelectedOrdenServicio, setDataSelectedOrdenServicio ] = useState(null);

  const [showNuevoOrdenServicio, setShowNuevoOrdenServicio] = useState(false);
  const handleCloseNuevoOrdenServicio = () => setShowNuevoOrdenServicio(false);
  const handleShowNuevoOrdenServicio = () => setShowNuevoOrdenServicio(true);

  const [showEditarOrdenServicio, setShowEditarOrdenServicio] = useState(false);
  const handleCloseEditarOrdenServicio = () => setShowEditarOrdenServicio(false);
  const handleShowEditarOrdenServicio = () => setShowEditarOrdenServicio(true);

  const getOrdenesServicios = async () => {
    try {
      var queryParams = `?search=${filtro.filtro_buscar}&id_proyecto=${filtro.filtro_proyecto}&id_cliente=${filtro.filtro_cliente}`;
      var resp = await axios.get(
        APIURL + "/ordenes-servicio" + queryParams,
        CONFIG
      );
      setOrdenesServicio(resp.data);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
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
      var resp = await axios.get(
        APIURL + "/clientes/filtro/proyecto/" + idProy,
        CONFIG
      );
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
        <td>{os.id}</td>
        <td>{os.proyecto.nombre}</td>
        <td>{os?.cliente ? os.cliente.nombre : "SIN DATO"}</td>
        <td>{os.descripcion}</td>
        <td>{os.activo ? "Activo" : "Inactivo"}</td>
        <td>
          <button
            className="btn btn-sm btn-outline-secondary p-1 py-0"
            style={{ borderColor: "rgba(0,0,0,0)" }}
            title="EDITAR" onClick={() => {editarOrdenServicio(os)}}
          >
            <ion-icon
              style={{ fontWeight: "bolder!important", fontSize: "x-large" }}
              name="create"
            ></ion-icon>
          </button>
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
        <option key={"opt-cli-" + index} value={`${cli.id}`}>
          {cli.nombre}
        </option>
      )),
    ];
  };

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

    if (name == "id_proyecto") {
      getAllClientes(value);
    }

    setDataFormOrdenServicio((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const changeDataEditarOrdenServicio = (e) => {
    var { value, name, checked } = e.target;

    if (name == "id_proyecto") {
      getAllClientes(value);
    }

    if (name === 'activo') {
      console.log(name , value);
      
      setDataSelectedOrdenServicio((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setDataSelectedOrdenServicio((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

  };

  const changeFilterOrdenes = (e) => {
    const { name, value } = e.target;

    setFiltro((prevState) => {
      let newFiltro = { ...prevState, [name]: value };

      if (name === "filtro_proyecto") {
        getAllClientes(value); // Obtener clientes asociados al proyecto
        newFiltro = { ...newFiltro, filtro_cliente: "all" }; // Resetear cliente al cambiar el proyecto
      }

      return newFiltro;
    });
  };

  const sendDataNuevaOrden = () => {
    axios
      .post(
        `${APIURL}/proyectos/clientes/ordenes-servicio`,
        dataFormOrdenServicio,
        CONFIG
      )
      .then((resp) => {
        console.log(resp);
        handleCloseNuevoOrdenServicio();
        getOrdenesServicios()
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const editarOrdenServicio = (or) => {
    setDataSelectedOrdenServicio(or);
    handleShowEditarOrdenServicio()
  }

  const sendDataEditarOrdenServicio = () => {
    var dataSend = {
      id: dataSelectedOrdenServicio.id,
      id_cliente: dataSelectedOrdenServicio.id_cliente,
      id_proyecto: dataSelectedOrdenServicio.id_proyecto,
      descripcion: dataSelectedOrdenServicio.descripcion,
      activo: dataSelectedOrdenServicio.activo,
      notas: dataSelectedOrdenServicio.notas,
      fecha_estimada_entrega: dataSelectedOrdenServicio.fecha_estimada_entrega,
      fecha_estimada_finalizacion: dataSelectedOrdenServicio.fecha_estimada_finalizacion,
    } 
    axios
    .put(
      `${APIURL}/proyectos/clientes/ordenes-servicio/${dataSelectedOrdenServicio.id}`,
      dataSend,
      CONFIG
    )
    .then((resp) => {
      console.log(resp);
      handleCloseEditarOrdenServicio();
      getOrdenesServicios()
    })
    .catch((resp) => {
      console.log(resp);
    });
    
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (flagInit) {
        getOrdenesServicios();
      }
    }, 1500)
    return () => clearTimeout(delayDebounce); 
  }, [filtro.filtro_buscar, filtro.filtro_proyecto, filtro.filtro_cliente]);

  useEffect(() => {
    if (!flagInit) {
      getOrdenesServicios();
      getAllProyectos();
      getAllClientes(0);
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
            onChange={(e) => {
              changeFilterOrdenes(e);
            }}
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
            name="filtro_proyecto"
            onChange={(e) => {
              changeFilterOrdenes(e);
            }}
          >
            <option value="all">Proyectos</option>
            {renderOpcionesProyectosSelect()}
          </Form.Select>
        </div>
        <div className="col-3">
          <Form.Select
            value={filtro.filtro_cliente}
            onChange={(e) => {
              changeFilterOrdenes(e);
            }}
            aria-label="Default select example"
            className="form-control-sm"
            name="filtro_cliente"
          >
            <option value="all">Clientes</option>
            {renderOpcionesClienteSelect()}
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
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col" style={{ width: "7%" }}>
                  Orden
                </th>
                <th scope="col">Proyecto</th>
                <th scope="col">Cliente</th>
                <th scope="col">Descripcion</th>
                <th scope="col" style={{ width: "10%" }}>
                  Activo
                </th>
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
              aria-label="Default select example"
              name="id_proyecto"
              className="form-control-sm"
              onChange={(e) => {
                changeDataFormOrdenServicio(e);
              }}
            >
              <option value="0">Seleccione Proyecto</option>
              {renderOpcionesProyectosSelect()}
            </Form.Select>
          </div>
          <div className="mb-3">
            <Form.Select
              aria-label="Default select example"
              name="id_cliente"
              className="form-control-sm"
              onChange={(e) => {
                changeDataFormOrdenServicio(e);
              }}
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

      <Modal show={showEditarOrdenServicio} onHide={handleCloseEditarOrdenServicio}>
        <Modal.Header closeButton>
          <Modal.Title>Editar orden de servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { dataSelectedOrdenServicio && (
            <>
              <div className="mb-3">
                <Form.Select
                  aria-label="Default select example"
                  name="id_proyecto"
                  className="form-control-sm"
                  value={ dataSelectedOrdenServicio.id_proyecto }
                  onChange={(e) => {
                    changeDataEditarOrdenServicio(e);
                  }}
                >
                  <option value="0">Seleccione Proyecto</option>
                  {renderOpcionesProyectosSelect()}
                </Form.Select>
              </div>
              <div className="mb-3">
                <Form.Select
                  aria-label="Default select example"
                  name="id_cliente"
                  value={ dataSelectedOrdenServicio.id_cliente }
                  className="form-control-sm"
                  onChange={(e) => {
                    changeDataEditarOrdenServicio(e);
                  }}
                >
                  <option value="0">Seleccione Cliente</option>
                  {renderOpcionesClienteSelect()}
                </Form.Select>
              </div>
              <div className="mb-3">
                <label>Descripcion</label>
                <input value={ dataSelectedOrdenServicio.descripcion }
                  type="text"
                  className="form-control"
                  name="descripcion"
                  onChange={(e) => changeDataEditarOrdenServicio(e)}
                />
              </div>
              <div className="mb-3">
                <label>Estado: </label>
                <Form.Check type="switch">
                  <Form.Check.Input
                    name="activo"
                    onChange={(e) => {
                      changeDataEditarOrdenServicio(e);
                    }}
                    style={{ width: "2rem" }}
                    checked={dataSelectedOrdenServicio.activo}
                    type="checkbox"
                  />
                  <Form.Check.Label>
                    {" "}
                    <span className="pl-3">
                      {dataSelectedOrdenServicio.activo ? "Activo" : "Inactivo"}
                    </span>{" "}
                  </Form.Check.Label>
                </Form.Check>
              </div>
              <div className="mb-3">
                <label>Notas:</label>
                <input value={ dataSelectedOrdenServicio.notas }
                  type="text"
                  className="form-control"
                  name="notas"
                  onChange={(e) => changeDataEditarOrdenServicio(e)}
                />
              </div>
              <div className="mb-3">
                <label>Fecha estimada de entrega de expedientes:</label>
                <input value={ dataSelectedOrdenServicio.fecha_estimada_entrega }
                  type="date"
                  className="form-control"
                  name="fecha_estimada_entrega"
                  onChange={(e) => changeDataEditarOrdenServicio(e)}
                />
              </div>
              <div className="mb-3">
                <label>
                  Fecha estimada de entrega de finalizacion de servicio:
                </label>
                <input value={ dataSelectedOrdenServicio.fecha_estimada_finalizacion }
                  type="date"
                  className="form-control"
                  name="fecha_estimada_finalizacion"
                  onChange={(e) => changeDataEditarOrdenServicio(e)}
                />
              </div>
            </>
          ) }
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditarOrdenServicio}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={sendDataEditarOrdenServicio}>
            Editar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrdenesServicios;
