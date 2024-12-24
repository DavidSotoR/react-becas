import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ModalCliente from "./ModalCliente";
import ResaltarTexto from "../../ResaltarTexto/ResaltarTexto";
import axios from "axios";
import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";
import Table from "../../../../node_modules/react-bootstrap/esm/Table";
import { json } from "../../../../node_modules/react-router-dom/dist/index";

function Clientes() {
  const APIURL = process.env.REACT_APP_API_URL;
  const [allClientes, setAllClientes] = useState([]);
  const [allTiposClientes, setallTiposClientes] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tiposCliente, setTiposCliente] = useState("");
  const [search, setSearch] = useState("");

  const [showModalCliente, setShowModalCliente] = useState(false);
  const [dataShowCliente, setDataShowCliente] = useState(null);

  const handleCloseShowCliente = () => setShowModalCliente(false);
  const handleShowShowCliente = () => setShowModalCliente(true);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const getDataClientes = () => {
    let paramsConfig = config;
    const params = new URLSearchParams();
    if (tiposCliente !== "") {
      params.append("id_tipo_cliente", tiposCliente);
      paramsConfig["params"] = params;
    }

    axios
      .get(APIURL + "/clientes", paramsConfig)
      .then((resp) => {
        setAllClientes(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };
  const getDataTiposClientes = () => {
    axios
      .get(APIURL + "/clientes/tipos", config)
      .then((resp) => {
        setallTiposClientes(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const renderOptionTiposClientes = () => {
    return [
      <option key={"select-tc-" + 0} value="">
        Todos los clientes
      </option>,
      ...allTiposClientes.map((option) => (
        <option key={"select-tc-" + option.id} value={option.id}>
          {" "}
          {option.nombre}{" "}
        </option>
      )),
    ];
  };

  const filtroTipoCliente = (e) => {
    const tipo_cliente = e.target.value;
    console.log(e);
    setTiposCliente(tipo_cliente);
  };

  const searchText = (e) => {
    const buscar = e.target.value;
    setSearch(buscar);
  };

  const allClientesFiltrados = allClientes.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const showDataCliente = (data = null) => {
    console.log(data);
    setShowModalCliente(true);
    setDataShowCliente(data);
  };

  function crearDireccion(data) {
    const {
      numero_exterior,
      calle,
      colonia,
      ciudad,
      estado,
      codigo_postal,
      pais,
    } = data;

    var direccion =
      `${numero_exterior ? numero_exterior + ", " : ""}` +
      `${calle ? calle + ", " : ""}` +
      `${colonia ? colonia + ", " : ""}` +
      `${ciudad ? ciudad + ", " : ""}` +
      `${estado ? estado + ", " : ""}` +
      `${codigo_postal ? codigo_postal + ", " : ""}` +
      `${pais ? pais : ""}`;

    if (direccion == "") {
      return "SIN DATO";
    }
    return direccion;
  }

  useEffect(() => {
    getDataTiposClientes();
  }, []);
  useEffect(() => {
    if (!show) {
      getDataClientes();
    }
  }, [show]);
  useEffect(() => {
    getDataClientes();
  }, [tiposCliente]);

  const renderFilasTablaClientes = () => {
    return allClientesFiltrados.map((cliente, index) => (
      <tr key={"tr-cliente-" + index}>
        <td>
          <p>{cliente.id}</p>
        </td>
        <td>
          <p>{cliente.tipo_cliente.nombre}</p>
        </td>
        <td>
          <p>
            <ResaltarTexto texto={cliente.nombre} reslatar={search} />
          </p>
        </td>
        <td>
          <p>{cliente.descripcion}</p>
        </td>
        <td>
          <p style={{ lineBreak: "anywhere" }}>
            {cliente.notificaciones_email}
          </p>
        </td>
        <td>
          <div className="d-flex justify-content-end">
            <button
              onClick={() => {
                showDataCliente(cliente);
              }}
              className="btn btn-small btn-info mx-1 btn-sm text-white fw-bold"
            >
              <ion-icon name="eye-outline"></ion-icon>
            </button>
            <Link
              to={"/clientes/" + cliente.id}
              className="btn btn-primary mx-1 btn-sm"
            >
              <ion-icon name="create-outline"></ion-icon>
            </Link>
            <button className="btn btn-small btn-danger mx-1 btn-sm">
              <ion-icon name="trash-outline"></ion-icon>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between mb-3">
        <div className="">
          <h6 style={{ fontWeight: "bold" }}>Catalogo Clientes</h6>
        </div>
      </div>
      <div className="mb-3 row">
        <p className="fw-bold mb-1">Filtros:</p>
        <div className="row">
          <div className="col-8 col-md-3 mb-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar..."
              value={search}
              onChange={searchText}
            />
          </div>
          <div className="col-8 col-md-3 mb-3">
            <Form.Select
              className="form-select form-select-sm"
              name="id_tipo_cliente"
              id="id_tipo_cliente"
              onChange={(e) => filtroTipoCliente(e)}
            >
              {renderOptionTiposClientes()}
            </Form.Select>
          </div>
          <div className="col-12 col-md-4 mb-3">
            <Link
              className="btn btn-primary btn-sm"
              to={PathConstants.CLIENTENUEVO}
            >
              Nuevo Cliente
            </Link>
            {/* <button className="btn btn-primary btn-sm fw-bold" onClick={handleShow}>Nuevo Cliente</button> */}
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="table-wrapper">
        <table className="table" style={{ minWidth: "700px" }}>
          <thead>
            <tr>
              <th scope="col" className="col-id">
                #
              </th>
              <th scope="col">Tipo</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Email</th>
              <th scope="col" className="text-end">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>{renderFilasTablaClientes()}</tbody>
        </table>
      </div>
      <ModalCliente show={show} handleClose={handleCloseShowCliente} />
      <Modal
        show={showModalCliente}
        onHide={handleCloseShowCliente}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {dataShowCliente && (
              <>
                {dataShowCliente.tipo_cliente.id == 1 ? "Escuela" : "Empresa"}:{" "}
                {dataShowCliente.nombre ?? "SIN DATO"}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataShowCliente && (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>Cliente</td>
                  <td>{dataShowCliente.nombre ?? "SIN DATO"}</td>
                </tr>
                <tr>
                  <td>Descripción</td>
                  <td>{dataShowCliente.descripcion ?? "SIN DATO"}</td>
                </tr>
                <tr>
                  <td>Contacto Email</td>
                  <td>{dataShowCliente.notificaciones_email ?? "SIN DATO"}</td>
                </tr>
                <tr>
                  <td>
                    <p className="mb-0">Contatos:</p>
                    <p className="mb-1">
                      {" "}
                      {dataShowCliente.nombre_uno ?? "Contacto 1"}
                    </p>
                    <p className="mb-1">
                      {dataShowCliente.nombre_dos ?? "Contacto 2"}
                    </p>
                    <p className="mb-1">Contacto Celular</p>
                  </td>
                  <td>
                    <p className="mb-0">Telefonos:</p>
                    <p className="mb-1">
                      {dataShowCliente.telefono_uno ?? "SIN DATO"}
                    </p>
                    <p className="mb-1">
                      {dataShowCliente.telefono_dos ?? "SIN DATO"}
                    </p>
                    <p className="mb-0">
                      {dataShowCliente.telefono_mobil ?? "SIN DATO"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>Datos Fiscales</td>
                  <td>
                    <p className="mb-1">
                      Persona:{" "}
                      {dataShowCliente.tipo_persona.toUpperCase() ?? "SIN DATO"}
                    </p>
                    <p className="mb-1">
                      Razón Social: {dataShowCliente.rason_social ?? "SIN DATO"}
                    </p>
                    <p className="mb-1">
                      RFC: {dataShowCliente.rfc ?? "SIN DATO"}
                    </p>
                    <p className="mb-1">
                      Requiere Facturar:{" "}
                      {dataShowCliente.requiere_facturar ? "SI" : "NO"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>Dirección</td>
                  <td>{crearDireccion(dataShowCliente)}</td>
                </tr>
                <tr>
                  <td>Documentación</td>
                  <td>
                    {dataShowCliente.documentacion_digital
                      ? "Digital"
                      : "Fisico"}
                  </td>
                </tr>
                <tr>
                  <td>Encuesta Asignada</td>
                  <td>
                    {dataShowCliente.encuesta_asignada ? dataShowCliente.encuesta_asignada.nombre : 'SIN DATO'}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseShowCliente}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Clientes;
