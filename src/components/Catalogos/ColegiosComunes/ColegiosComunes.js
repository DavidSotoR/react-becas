import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import ModalNuevoColegioComun from "./ModalNuevoColegioComun";
import ModalEnlazarColegioComun from "./ModalEnlazarColegioComun";
import ModalEliminarColegioComun from "./ModalEliminarColegioComun";
import { Button } from "react-bootstrap";

function CatalogoFamilias() {
  const { logout } = useContext(AuthContext);
  const APIURL = process.env.REACT_APP_API_URL;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const [allClientes, setAllClientes] = useState([]);
  const [allClientesHermanos, setAllClientesHermanos] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEnlazar, setShowEnlazar] = useState(false);
  const [idColegioComun, setIdColegioComun] = useState(0);
  const [tituloColegioComun, setTituloColegioComun] = useState("");

  const handleCloseEnlazar = () => {
    setShowEnlazar(false);
    setIdColegioComun(0);
    setTituloColegioComun("");
  };
  const handleShowEnlazar = (id, nombre) => {
    setShowEnlazar(true);
    setIdColegioComun(id);
    setTituloColegioComun(nombre);
  };
  //
  const [showEliminar, setShowEliminar] = useState(false);
  const [idColegioComunEliminar, setIdColegioComunEliminar] = useState(0);
  const [nombreColegioComunEliminar, setNombreColegioComunEliminar] =
    useState("");

  const handleCloseEliminar = () => {
    setShowEliminar(false);
    setIdColegioComunEliminar(0);
    setNombreColegioComunEliminar("");
  };
  const handleShowEliminar = (id, nombre) => {
    setShowEliminar(true);
    setIdColegioComunEliminar(id);
    setNombreColegioComunEliminar(nombre);
  };

  const getDatosClientesHermanos = () => {
    axios
      .get(APIURL + "/clientes/hermanos?lista=1", config)
      .then((resp) => {
        console.log(resp);
        setAllClientesHermanos(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const getClientesList = async () => {
    try {
      const resp = await axios.get(APIURL + "/clientes", config);
      setAllClientes(resp.data);
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  const renderListaHermanos = (lista) => {
    return [
      ...lista.map((colegio, index) => (
        <li key={"li-" + index} style={{ display: "flex" }}>
          <ion-icon
            style={{ marginRight: "5px", marginTop: "2px", cursor: "pointer" }}
            onClick={() => handleShowEliminar(colegio.id, colegio.nombre)}
            name="trash-outline"
          />
          <p>{colegio.nombre}</p>
        </li>
      )),
    ];
  };

  const renderFilasColegiosHermanos = () => {
    if (!allClientesHermanos) {
      return "";
    }
    return allClientesHermanos.map((familia, index) => (
      <tr key={"tr-" + index}>
        <td>
          <p style={{ fontWeight: "bold" }}>{familia.nombre}</p>
        </td>
        <td>
          {familia?.lista.length > 0 && (
            <ul style={{ listStyle: "none" }}>
              {renderListaHermanos(familia.lista)}
            </ul>
          )}

          <button
            className="btn btn-link btn-sm fw-bold"
            onClick={() => handleShowEnlazar(familia.id, familia.nombre)}
          >
            Añadir
          </button>
        </td>
        <td>
          <div className="d-flex">
            <button className="btn btn-danger btn-sm mx-1">Borrar</button>
          </div>
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    if (!show) {
      console.log("Se cerro, renderiza");
      getDatosClientesHermanos();
    }
    getClientesList();
  }, [show]);

  useEffect(() => {
    if (!showEnlazar) {
      console.log("Se cerro, renderiza");
      getDatosClientesHermanos();
    }
    getClientesList();
  }, [showEnlazar]);

  useEffect(() => {
    if (!showEliminar) {
      console.log("Se cerro, renderiza");
      getDatosClientesHermanos();
    }
    getClientesList();
  }, [showEliminar]);

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-3">
        <div className="">
          <h6 style={{ fontWeight: "bold" }}>Colegios Comunes</h6>
        </div>
      </div>
      <div className="mb-3 row">
        <div className="col-12 col-md-1">
          <p className="fw-bold mb-1">Filtros:</p>
        </div>
        <div className="col-6 col-md-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar:"
          />
        </div>
        <div className="col-6 col-md-3">
          <button
            className="btn btn-primary btn-sm fw-bold"
            onClick={handleShow}
          >
            Nueva Relación
          </button>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Nombre colegios comunes</th>
                  <th scope="col">Colegios</th>
                  <th scope="col">Opciones</th>
                </tr>
              </thead>
              <tbody>{renderFilasColegiosHermanos()}</tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalNuevoColegioComun
        show={show}
        handleClose={handleClose}
      ></ModalNuevoColegioComun>
      <ModalEnlazarColegioComun
        showNuevoHemano={showEnlazar}
        handleNuevoHemanoClose={handleCloseEnlazar}
        idColegioComun={idColegioComun}
        tituloColegioComun={tituloColegioComun}
      ></ModalEnlazarColegioComun>
      <ModalEliminarColegioComun
        show={showEliminar}
        handleClose={handleCloseEliminar}
        idColegio={idColegioComunEliminar}
        nombreCoegio={nombreColegioComunEliminar}
      ></ModalEliminarColegioComun>
    </div>
  );
}

export default CatalogoFamilias;
