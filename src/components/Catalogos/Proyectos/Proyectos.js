import axios from "axios";
import ModalProyectos from "./ModalProyectos";
import Modal from "react-bootstrap/Modal";

import { useContext, useEffect, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { AuthContext } from "../../../context/AuthContext";
import ResaltarTexto from "../../ResaltarTexto/ResaltarTexto";
import { Link } from "react-router-dom";

function Proyectos() {
  const { logout } = useContext(AuthContext);
  const APIURL = process.env.REACT_APP_API_URL;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const [activos, setActivos] = useState("all");
  const [tipoCliente, setTipoCliente] = useState("Escuelas");
  const [idTipoCliente, setIdTipoCliente] = useState(1);
  const [allTiposClientes, setAllTiposClientes] = useState([]);
  const [allProyectos, setAllProyectos] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [search, setSearch] = useState("");

  const [showActiveProyecto, setShowActiveProyecto] = useState(false);
  const handleCloseActiveProyecto = () => setShowActiveProyecto(false);
  const handleShowActiveProyecto = () => setShowActiveProyecto(true);
  const [proyectoToEdit, setProyectoToEdit] = useState(null);

  const [showEliminarProyecto, setShowEliminarProyecto] = useState(false);
  const handleCloseEliminarProyecto = () => setShowEliminarProyecto(false);
  const handleShowEliminarProyecto = () => setShowEliminarProyecto(true);

  const searchText = (e) => {
    const buscar = e.target.value;
    setSearch(buscar);
  };

  const filtroProyectosActivos = (e) => {
    const activos = e.target.value;
    setActivos(activos);
  };

  const changeTipoCliente = (id) => {
    setIdTipoCliente(id);
    setAllProyectos([]);
  };

  const getTiposClientes = async () => {
    try {
      const resp = await axios.get(APIURL + "/clientes/tipos", config);
      setAllTiposClientes(resp.data);
    } catch (error) {
      console.error("Error fetching Ciclos Escolares:", error);
      if (error?.response.status === 401) {
        logout();
      } else {
        alert("Ocurrio un ERROR en el REQUEST");
        console.log(error);
      }
    }
  };

  const getProyectosList = async () => {
    try {
      const resp = await axios.get(
        APIURL +
          `/proyectos?id_tipo_cliente=${idTipoCliente}&activo=${activos}`,
        config
      );
      setAllProyectos(resp.data);
    } catch (error) {
      if (error?.response.status === 401) {
        logout();
      } else {
        console.log(error);
        alert("Error al solicitar información");
      }
    }
  };

  const updateProyectoID = async () => {
    try {
      const resp = await axios.post(
        APIURL + `/proyectos/editar`,
        proyectoToEdit,
        config
      );
      getProyectosList()
      setShowActiveProyecto(false)
      setShowAlert(true)
      console.log(resp);
    } catch (error) {
      if (error?.response.status === 401) {
        logout();
      } else {
        console.log(error);
        setShowAlertError(true)
        //alert("Error al solicitar información");
      }
    }
  };

  const borrarProyecto = async () => {
    try {
      const resp = await axios.put(
        APIURL + `/proyectos/borrar`,
        proyectoToEdit,
        config
      );
      getProyectosList()
      setShowEliminarProyecto(false)
      setShowAlert(true)
      console.log(resp);
    } catch (error) {
      if (error?.response.status === 401) {
        logout();
      } else {
        setShowAlertError(true)
        console.log(error);
        //alert("Error al solicitar información");
      }
    }
  }

  const openEditProyecto = (proyecto, option) => {
    setProyectoToEdit(proyecto);

    if (option === 'eliminar') {
      setShowEliminarProyecto(true)
    }

    if (option === 'editar') {
      setShowActiveProyecto(true);
    }
    
  };

  useEffect(() => {
    getTiposClientes();
    getProyectosList();
  }, []);

  useEffect(() => {
    getProyectosList();
    setSearch("");
  }, [activos, idTipoCliente]);

  useEffect(() => {
    if (!show) {
      getProyectosList();
    }
  }, [show]);

  useEffect(() => {
    const tipoClienteObj = allTiposClientes.find(
      (tc) => tc.id === idTipoCliente
    );
    if (tipoClienteObj) {
      setTipoCliente(tipoClienteObj.nombre);
    }
  }, [idTipoCliente, allTiposClientes]);

  const allProyectosFiltrados = allProyectos.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const renderFilasTablaProyectos = () => {
    return allProyectosFiltrados.map((proyecto, index) => (
      <tr key={"tr-proyecto-" + index}>
        <td>{proyecto.id}</td>
        <td>{proyecto.activo ? "Sí" : "No"}</td>
        <td>
          <p>
            <ResaltarTexto texto={proyecto.nombre} reslatar={search} />
          </p>
        </td>
        <td>
          <div className="d-flex justify-content-start">
            <Link
              className="btn"
               title="Editar Datos"
              onClick={() => openEditProyecto(proyecto, 'editar')}
            >
              <i className="bi bi-pencil-square"></i>
            </Link>
            <Link
              className="btn"
              to={`/proyectos/${proyecto.id}`}
            >
              <i className="bi bi-files text-blue" title="Archivo Proyecto"></i>
            </Link>
            <Link
              className="btn"
              title="Eliminar Proyecto"
              onClick={() => openEditProyecto(proyecto, 'eliminar')}
            >
              <i
                className="bi bi-trash text-danger"
                title="Archivo Proyecto"
              ></i>
            </Link>
          </div>
        </td>
      </tr>
    ));
  };

  const activarProyecto = (e) => {
    var { name, checked } = e.target;
    console.log(name, checked);
    
    setProyectoToEdit((prevState) => ({
      ...prevState,
      [name]: checked
    }));
  };

  const editarDatosProyecto = (e) => {
    var { name, value } = e.target;
    
    setProyectoToEdit((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="">
          <h6 style={{ fontWeight: "bold" }}>Proyectos</h6>
        </div>
      </div>

      <div className="mb-3 row">
        <p className="fw-bold mb-1">Filtros:</p>
        <div className="row">
          <div className="col-12 col-md-3 mb-1">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar:"
              value={search}
              onChange={searchText}
            />
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-1">
            <Form.Select
              className="form-select form-select-sm"
              name="id_tipo_cliente"
              id="id_tipo_cliente"
              onChange={(e) => filtroProyectosActivos(e)}
            >
              <option value="1">Escuelas</option>
              <option value="2">Empresas</option>
            </Form.Select>
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-1">
            <Form.Select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => filtroProyectosActivos(e)}
            >
              <option value="all">Activos/Inactivos</option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </Form.Select>
          </div>
          <div className="col-12 col-md-3 d-flex justify-content-end justify-content-md-start ">
            <Button
              className="btn btn-primary btn-sm fw-bold "
              onClick={handleShow}
            >
              Nuevo Proyecto
            </Button>
          </div>
        </div>
      </div>
      <Tabs>
        <TabList>
          {allTiposClientes.map((tab) => (
            <Tab
              key={"tab-" + tab.id}
              onClick={() => changeTipoCliente(tab.id)}
            >
              {tab.nombre}
            </Tab>
          ))}
        </TabList>

        {allTiposClientes.map((tab) => (
          <TabPanel key={"tap-" + tab.id}>
            <div className="row">
              <div className="col">
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="">#</th>
                        <th className="">Activo</th>
                        <th>Nombre</th>
                        <th>Añadir</th>
                      </tr>
                    </thead>
                    <tbody>{renderFilasTablaProyectos()}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabPanel>
        ))}
      </Tabs>

      <Modal
        show={showActiveProyecto}
        onHide={handleCloseActiveProyecto}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edicion Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {proyectoToEdit && (
            <div>
              {/* <p>Proyecto: {proyectoToEdit.nombre}</p> */}
              <div class="mb-3">
                <label
                  for="exampleFormControlInput1"
                  className="form-label fw-bold"
                >
                  Proyecto:
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="nombre"
                  placeholder="Proyecto"
                  value={proyectoToEdit.nombre}
                  onChange={ (e) => { editarDatosProyecto(e) } }
                />
              </div>
              <p className="mb-1 fw-bold">Estatus:</p>
              <div className="mb-3">
                <Form>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                    label="Activo"
                    name="activo"
                    onChange={(e) => {
                      activarProyecto(e);
                    }}
                    checked={proyectoToEdit.activo}
                  />
                </Form>
              </div>
              <p className="mb-2 fw-bold">Clinte Tipo:</p>
              <Form.Select name="id_tipo_cliente"
                aria-label="Default select example" onChange={ (e) => { editarDatosProyecto(e) } }
                value={proyectoToEdit.id_tipo_cliente}
              >
                <option value="1">Escuela</option>
                <option value="2">Empresa</option>
              </Form.Select>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => {
              handleCloseActiveProyecto();
            }}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => updateProyectoID()}
          >
            Actualizar
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEliminarProyecto}
        onHide={handleCloseEliminarProyecto}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {proyectoToEdit && (
            <div>
              <p className="mb-1 fw-bold">Proyecto: {proyectoToEdit.nombre}</p>
              <p className="mb-1 fw-bold">
                Estatus: {proyectoToEdit.activo === 1 ? "Activo" : "Inactivo"}
              </p>
              <p className="mb-2 fw-bold">
                Clinte Tipo:{" "}
                {proyectoToEdit.id_tipo_cliente === 1 ? "Escuela" : "Empresa"}
              </p>
            </div>
          )}
          <p className="text-danger fw-bold">
            **El siguiente elemento seleccionado se ELIMINARA del listado del
            catalogo.**
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => {
              handleCloseEliminarProyecto();
            }}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => borrarProyecto()}
          >
            Eliminar
          </button>
        </Modal.Footer>
      </Modal>

      <ModalProyectos
        key="mp"
        show={show}
        handleClose={handleClose}
        idTipoCliente={idTipoCliente}
        TipoCliente={tipoCliente}
      />

      <Alert show={showAlert} onClose={()=>{ setShowAlert(false) }} variant="success" className="alert-flotante" dismissible>
          <Alert.Heading>Success</Alert.Heading>
          <p>
              Se ha guardado correctamente los datos.
          </p>
      </Alert>
      <Alert show={showAlertError} onClose={()=>{ setShowAlertError(false) }} variant="danger" className="alert-flotante" dismissible>
          <Alert.Heading>Success</Alert.Heading>
          <p>
              Ocurrio un ERROR al realizar Request.
          </p>
      </Alert>
    </div>
  );
}

export default Proyectos;
