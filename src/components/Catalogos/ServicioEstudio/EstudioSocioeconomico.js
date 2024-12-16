import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Button, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ResaltarTexto from "../../ResaltarTexto/ResaltarTexto";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Avatar from "react-avatar";

function ServicioEstudio() {
  const { logout } = useContext(AuthContext);
  const APIURL = process.env.REACT_APP_API_URL;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const navigate = useNavigate();
  const location = useLocation();

  const [tiposClientes, setTiposClientes] = useState([]);

  const [proyectos, setProyectos] = useState([]);
  const [proyectoClientes, setProyectoClientes] = useState([]);
  const [ordenesServicio, setOrdenesServicio] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [allEstudiosSocioeconomicos, setAllEstudiosSocioeconomicos] = useState(
    []
  );

  const [tipoClienteSeleccionado] = useState("1");
  const [preyecto, setProyecto] = useState(location.state?.idProyecto || "");
  const [cliente, setCliente] = useState(location.state?.idCliente || "");
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);

  const [switchAsignarColaborador, setSwitchAsignarColaborador] =
    useState(false);
  const [switchCrearCuentaFamilia, setSwitchCrearCuentaFamilia] =
    useState(false);

  const [errorsCargaMasiva, setErrorsCargaMasiva] = useState([]);
  const [totalInserts, setTotalInserts] = useState(0);
  const [dataToInsert, setDataToInsert] = useState([]);
  const [dataError, setDataError] = useState([]);
  const [dataReactivada, setDataReactivada] = useState([]);
  const [dataNoAsignada, setDataNoAsignada] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [tabResponse, setTabResponse] = useState("exitosos");

  const [ loadign, setLoading ] = useState(false)

  const [openModalCargarArchivo, setOpenModalCargarArchivo] = useState(false);
  const changeOpenModalArchivo = () => {
    setOpenModalCargarArchivo(!openModalCargarArchivo);
    setShowErrors(false);
  };
  const animatedComponents = makeAnimated;

  const [fromData, setFormData] = useState({
    id_servicio_estado: "1",
    id_proyecto: location.state?.idProyecto || "",
    id_cliente: location.state?.idCliente || "",
    id_orden_servicio: location.state?.idOrdenServicio || "",
    id_colaborador: "",
  });

  const searchText = (e) => {
    const buscar = e.target.value;
    setSearch(buscar);
  };

  const handelNavegate = () => {
    navigate(
      `/estudio-socioeconomico/nuevo/${fromData.id_proyecto}/${fromData.id_cliente}/${fromData.id_orden_servicio}`
    );
  };

  const formInputChange = (e) => {
    var { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const getProyectos = () => {
    axios
      .get(
        `${APIURL}/proyectos?activo=1&id_tipo_cliente=${tipoClienteSeleccionado}`,
        config
      )
      .then((resp) => {
        setProyectos(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };
  const getProyectoClientes = () => {
    if (preyecto === "") {
      return true;
    }
    axios
      .get(`${APIURL}/proyectos/${preyecto}/clientes`, config)
      .then((resp) => {
        setProyectoClientes(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };
  const getOrdenesServicio = () => {
    if (preyecto === "") {
      return true;
    }
    if (!cliente || cliente === "") {
      return true;
    }
    axios
      .get(
        `${APIURL}/proyectos/${preyecto}/clientes/${cliente}/ordenes-servicio`,
        config
      )
      .then((resp) => {
        setOrdenesServicio(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };
  const getEstudiosSocioeconomicos = () => {
    if (!preyecto) {
      setAllEstudiosSocioeconomicos([]);
      return true;
    }
    axios
      .get(`${APIURL}/estudio/socioeconomico`, {
        params: fromData,
        headers: config.headers,
      })
      .then((resp) => {
        setAllEstudiosSocioeconomicos(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const handlerChangeSelectClientes = (e) => {
    if (e && e.length) {
      const allValues = e.map((e) => e.value);
      setFormData((prevState) => ({
        ...prevState,
        colegios_comunes: allValues,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        colegios_comunes: [],
      }));
    }
  };

  const renderOptionProyectos = () => {
    return [
      <option key={"select-p-0"} value="">
        {" "}
        Seleccione un proyecto{" "}
      </option>,
      ...proyectos.map((option) => (
        <option key={"select-tcp-" + option.id} value={option.id}>
          {" "}
          {option.nombre}{" "}
        </option>
      )),
    ];
  };
  const renderOptionProyectoClientes = () => {
    return [
      <option key={"select-p-0"} value="">
        {" "}
        Seleccione una Cliente
      </option>,
      ...proyectoClientes.map((option) => (
        <option key={"select-pc-" + option.id} value={option.id}>
          {" "}
          {option.nombre}{" "}
        </option>
      )),
    ];
  };
  const renderOptionOrdenesServicios = () => {
    return [
      <option key={"select-p-0"} value="">
        {" "}
        Seleccione una orden de servicio{" "}
      </option>,
      ...ordenesServicio.map((option) => (
        <option key={"select-pc-" + option.id} value={option.id}>
          {" "}
          #{option.id} {option.descripcion}{" "}
        </option>
      )),
    ];
  };

  const actualizoInputFiles = (e, name) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // Obtener el primer archivo
    }
  };

  const changeSwitchModalCargaMasiva = (e) => {
    console.log(e.target.checked);
    if (e.target.name === "enableAsignarColaborador") {
      setSwitchAsignarColaborador(e.target.checked);
    }

    if (e.target.name === "enableCrearUsuariosFamilia") {
      setSwitchCrearCuentaFamilia(e.target.checked);
    }
  };

  useEffect(() => {
    getProyectos();
  }, []);

  useEffect(() => {
    getProyectoClientes();
  }, [preyecto]);

  useEffect(() => {
    getOrdenesServicio();
  }, [fromData.id_cliente]);

  useEffect(() => {
    if (openModalCargarArchivo) {
      console.log(openModalCargarArchivo);
    }
  }, openModalCargarArchivo);

  useEffect(() => {
    if (fromData.id_proyecto) {
      getEstudiosSocioeconomicos();
    } else {
      getEstudiosSocioeconomicos([]);
    }
  }, [fromData.id_proyecto, fromData.id_cliente, fromData.id_orden_servicio]);

  const allEstudiosSocioeconomicosFiltrados = allEstudiosSocioeconomicos.filter(
    (item) => item.candidato.toLowerCase().includes(search.toLowerCase())
  );

  const avatarColaborador = (colaborador) => {
    if (!colaborador) {
      return "";
    }
    return (
      <>
        <div className="d-flex">
          <div className="align-self-center">
            <Avatar name={colaborador.name} size="30" round={true} />
          </div>
          <div className="ps-1 align-self-center">
            <span>{colaborador.name}</span>
            <br />
            <span>{colaborador.email}</span>
          </div>
        </div>
      </>
    );
  };

  const sendCorreo = (data) => {
    var idFamilia = data.id_familia;

    axios
      .post(
        APIURL + "/familias/" + idFamilia + "/estudio/socioeconomico/correo",
        data,
        config
      )
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(data);
  };

  const renderFilasTablaEstudiosSocioeconomicos = () => {
    return allEstudiosSocioeconomicosFiltrados.map((estudio, index) => (
      <tr key={"tr-cliente-" + index}>
        <td>
          <p>#{estudio.id}</p>
        </td>
        <td>
          <p>
            <ResaltarTexto texto={estudio.candidato} reslatar={search} />
          </p>
        </td>
        <td>
          <p>{estudio.situacion}</p>
        </td>
        <td>
          <p>{estudio.email}</p>
        </td>
        <td>
          {estudio?.colaborador && avatarColaborador(estudio.colaborador)}
        </td>
        <td>
          <div className="d-flex flex-row-reverse bd-highlight">
            <button
              onClick={() => sendCorreo(estudio)}
              className="btn btn-primary btn-sm mx-1 d-flex justify-content-center align-items-center"
            >
              <ion-icon name="mail-outline"></ion-icon>
            </button>
            <Link
              className="btn btn-primary btn-sm"
              to={`/estudio-socioeconomico/${estudio.id}`}
            >
              Ver
            </Link>
          </div>
        </td>
      </tr>
    ));
  };

  const renderExitosos = () => {
    return dataToInsert.map((exito, index) => {
      return (
        <li
          key={index}
          className="list-group-item list-group-item-action list-group-item-success"
        >
          <div className="d-flex w-100 justify-content-between">
            <p className="mb-1">Familia: {exito.name}</p>
            <small className="text-body-secondary">{index + 1}</small>
          </div>
          <p className="mb-1">
            Usuairo registrado:{" "}
            <span className="fw-bold">{exito.email ?? "NO VALIDO"}</span>.
          </p>
        </li>
      );
    });
  };

  const renderNoAsignado = () => {
    return dataNoAsignada.map((noasignado, index) => {
      return (
        <li
          key={index}
          className="list-group-item list-group-item-action list-group-item-warning"
        >
          <div className="d-flex w-100 justify-content-between">
            <p className="mb-1">Familia: {noasignado.familia.candidato}</p>
            <small className="text-body-secondary">{index + 1}</small>
          </div>
          <p className="mb-1">
            Error al asignar Colaborador:{" "}
            <span className="fw-bold">{noasignado.familia.email ?? "NO VALIDO"}</span>.
          </p>
        </li>
      );
    });
  };

  const renderReactivados = () => {
    return dataReactivada.map((re, index) => {
      return (
        <li
          key={index}
          className="list-group-item list-group-item-action list-group-item-info"
        >
          <div className="d-flex w-100 justify-content-between">
            <p className="mb-1">Nombre: {re.name}</p>
            <small className="text-body-secondary">{index + 1}</small>
          </div>
          <p className="mb-1">
            Usuario Reactivado:{" "}
            <span className="fw-bold">{re.email ?? "NO VALIDO"}</span>.
          </p>
        </li>
      );
    });
  };

  const renderErrores = () => {
    console.log("entra");
    console.log(errorsCargaMasiva);

    return errorsCargaMasiva.map((error, index) => {
      if (error.tipo === "existe") {
        return (
          <li
            key={index}
            className="list-group-item list-group-item-action list-group-item-danger"
          >
            <div className="d-flex w-100 justify-content-between">
              <p className="mb-1">Error: {error.error}</p>
              <small className="text-body-secondary">Error {index + 1}</small>
            </div>
            <p className="mb-1">
              Error al registrar Cuenta:{" "}
              <span className="fw-bold">
                {error.familia?.email ?? "NO VALIDO"}
              </span>
              .
            </p>
          </li>
        );
      } else if (error.tipo === "validador") {
        return (
          <li
            key={index}
            className="list-group-item list-group-item-action list-group-item-danger"
          >
            <div className="d-flex w-100 justify-content-between">
              <p className="mb-1">{error.error}</p>
              <small className="text-body-secondary">Error {index + 1}</small>
            </div>
            <p className="mb-1">
              Error al registrar: Email:{" "}
              <span className="fw-bold">
                {error.familia?.email ?? "NO VALIDO"}
              </span>{" "}
              - <span>Familia: {error.familia?.name ?? "NO VALIDO"}</span>.
            </p>
          </li>
        );
      } else {
        return null; // Manejo de otros tipos de errores, si es necesario
      }
    });
  };

  const subirArchivoFamiliaSE = () => {
    setLoading(true)
    const formData = new FormData();
    if (!file) {
      alert("Seleccione un archivo antes de subir.");
      return;
    }

    formData.append("enableAltaFamilia", switchCrearCuentaFamilia);
    formData.append("enableAsignarColaborador", switchAsignarColaborador);
    formData.append("id_cliente", cliente);
    formData.append("id_proyecto", preyecto);
    formData.append("id_orden_servicio", fromData.id_orden_servicio);
    formData.append("file", file); // Importante: 'files[]' para múltiples archivos

    axios
      .post(APIURL + "/estudio/socioeconomico/carga/familias", formData, config)
      .then((resp) => {
        console.log(resp);
        setErrorsCargaMasiva(resp.data.errors);
        setTotalInserts(resp.data.total_insert);
        setDataToInsert(resp.data.dataToInsert);
        setDataError(resp.data.errors);
        setDataNoAsignada(resp.data.no_asignadas);
        setDataReactivada(resp.data.reactivados);
        setShowErrors(true);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
        if (err.response.status === 401) {
          logout();
        }
      });
  };

  const changeTabResponse = (tab) => {
    setTabResponse(tab);
  };

  const descargarArchivo = async () => {
    try {
      const response = await axios.get(
        APIURL + "/estudio/socioeconomico/formatoalta/descargar",
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "formato_test.csv"); // Nombre sugerido para el archivo
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  return (
    <>
      <div className="container mt-3">
        <div className="d-flex justify-content-between mb-3">
          <div className="">
            <h6 style={{ fontWeight: "bold" }}>Nuevo Estudio Socioeconómico</h6>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-2">
            <label
              htmlFor="id_proyecto"
              className="form-label"
              style={{ marginBottom: "1px", color: "darkolivegreen" }}
            >
              Proyecto:
            </label>
            <Form.Select
              className="form-select form-select-sm"
              name="id_proyecto"
              id="id_proyecto"
              value={preyecto}
              onChange={(e) => {
                setProyecto(e.target.value);
                setFormData((prevState) => ({
                  ...prevState,
                  id_proyecto: e.target.value,
                }));
              }}
            >
              {renderOptionProyectos()}
            </Form.Select>
          </div>
          <div className="col-md-3">
            <label
              htmlFor="id_cliente"
              className="form-label"
              style={{ marginBottom: "1px", color: "darkolivegreen" }}
            >
              Cliente:
            </label>
            <Form.Select
              className="form-select form-select-sm"
              name="id_cliente"
              id="id_cliente"
              value={fromData.id_cliente}
              onChange={(e) => {
                formInputChange(e);
                setCliente(e.target.value);
              }}
            >
              {renderOptionProyectoClientes()}
            </Form.Select>
          </div>
          <div className="col-md-3">
            <label
              htmlFor="id_orden_servicio"
              className="form-label"
              style={{ marginBottom: "1px", color: "darkolivegreen" }}
            >
              Orden de servicio: #{fromData.id_orden_servicio}
            </label>
            <Form.Select
              className="form-select form-select-sm"
              name="id_orden_servicio"
              id="id_orden_servicio"
              value={fromData.id_orden_servicio}
              onChange={(e) => formInputChange(e)}
            >
              {renderOptionOrdenesServicios()}
            </Form.Select>
          </div>

          {fromData.id_orden_servicio && (
            <div className="col-md-4 d-flex align-self-end">
              <Button
                className="btn btn-primary btn-sm fw-bold me-1"
                onClick={(e) => {
                  handelNavegate();
                }}
              >
                Nueva Familia
              </Button>
              <Button
                className="btn btn-primary btn-sm"
                onClick={() => changeOpenModalArchivo()}
              >
                Cargar Familias
              </Button>
            </div>
          )}
        </div>
        <hr />
        <div className="row">
          <div className="col-4 row">
            <label htmlFor="search" className="col-sm-2 col-form-label">
              Buscar:
            </label>
            <div className="col-10">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar..."
                value={search}
                onChange={searchText}
              />
            </div>
          </div>
        </div>

        <br />
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="col-id">
                #
              </th>
              <th scope="col">Familia</th>
              <th scope="col">Descripción</th>
              <th scope="col">Email</th>
              <th scope="col">Colaborador</th>
              <th scope="col">Opciones</th>
            </tr>
          </thead>
          <tbody>{renderFilasTablaEstudiosSocioeconomicos()}</tbody>
        </table>
      </div>
      <Modal show={openModalCargarArchivo} onHide={changeOpenModalArchivo}>
        <Modal.Header closeButton>
          <Modal.Title>Alta de Familias por Archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              onChange={(e) => {
                changeSwitchModalCargaMasiva(e);
              }}
              name="enableAsignarColaborador"
              id="enableAsignar"
            />
            <label className="form-check-label" for="enableAsignar">
              Asignar Colaborador para Estudio(EN DESARROLLO)
            </label>
          </div>
          {/* <div className="mb-3 form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" onChange={ (e) => { changeSwitchModalCargaMasiva(e) } } name="enableCrearUsuariosFamilia" id="enableCrearUsuarios"/>
                    <label className="form-check-label" for="enableCrearUsuarios" >Crear usuarios para alta de Familias (EN DESARROLLO)</label>
                </div> */}
          <div className="row">
            <div className="col-3">
              <p className="m-0 p-0">Formato a Subir:</p>
              <a className="mb-3" onClick={descargarArchivo}>
                Formato excel
              </a>
            </div>
            <div className="col-9">
              <Form>
                <input hidden name="proyecto" value={preyecto}></input>
                <input hidden name="cliente" value={cliente}></input>
                <input
                  hidden
                  name="proyecto"
                  value={fromData.id_orden_servicio}
                ></input>
                <input
                  className="form-control"
                  onChange={(e) => {
                    actualizoInputFiles(e);
                  }}
                  accept=".csv, .xls, .xlsx"
                  type="file"
                  id="formFileFamiliasES"
                />
              </Form>
            </div>
          </div>
          {
            loadign && 
            <div className="d-flex justify-content-center align-items-center mt-3 mb-3">
            <div class="spinner-border text-info text-center" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            </div>
            
          }
          {showErrors && (
            <div className="row mt-4">
              <div className="col-12">
                {/* <p className="fw-bold fs-5">Ejecucion Terminada</p>
                    Total de Familias Agregadas: { totalInserts }
                    <p>Total Errores: { errorsCargaMasiva.length }</p> */}
                <ul className="nav nav-underline mb-2">
                  <li className="nav-item ">
                    <a
                      className={
                        tabResponse === "exitosos"
                          ? "nav-link link-success fw-bold active"
                          : "nav-link link-success fw-bold"
                      }
                      aria-current="page"
                      onClick={() => changeTabResponse("exitosos")}
                    >
                      Exitosos({dataToInsert.length})
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={
                        tabResponse === "errores"
                          ? "nav-link link-danger fw-bold active"
                          : "nav-link link-danger fw-bold"
                      }
                      onClick={() => changeTabResponse("errores")}
                    >
                      Error({dataError.length})
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={
                        tabResponse === "noasignados"
                          ? "nav-link link-warning fw-bold active"
                          : "nav-link link-warning fw-bold"
                      }
                      onClick={() => changeTabResponse("noasignados")}
                    >
                      No asignados({dataNoAsignada.length})
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={
                        tabResponse === "reactivados"
                          ? "nav-link link-info fw-bold active"
                          : "nav-link link-info fw-bold"
                      }
                      onClick={() => changeTabResponse("reactivados")}
                    >
                      Reactivados({dataReactivada.length})
                    </a>
                  </li>
                </ul>
              </div>
              <div
                className="col-12"
                style={{ height: "30vh", overflowY: "auto" }}
              >
                {tabResponse === "exitosos" && (
                  <ul className="list-group">{renderExitosos()}</ul>
                )}
                {tabResponse === "errores" && (
                  <ul className="list-group">{renderErrores()}</ul>
                )}
                {tabResponse === "noasignados" && (
                  <ul className="list-group">{renderNoAsignado()}</ul>
                )}
                {tabResponse === "reactivados" && (
                  <ul className="list-group">{renderReactivados()}</ul>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={changeOpenModalArchivo}>
            Cancelar
          </Button>
          <Button
            className="btn btn-primary mt-2"
            variant="primary"
            onClick={subirArchivoFamiliaSE}
          >
            Subir Archivo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ServicioEstudio;
