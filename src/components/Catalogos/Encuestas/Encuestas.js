import { useContext, useEffect, useState } from "react";
import ModalNuevaEncuesta from "./ModalNuevaEncuesta";
import { AuthContext } from "../../../context/AuthContext";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import ModalCopiaEncuesta from "./ModalCopiaEncuesta";
import PathConstants from "routes/pathsConstants";

export default function Encuestas() {
  const APIURL = process.env.REACT_APP_API_URL;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const { logout } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  const [showMCopia, setShowMCopia] = useState(false);
  const handleCloseMCopia = () => setShowMCopia(false);
  const handleShowMCopia = () => setShowMCopia(true);

  const [encuestaSeleccionada,setEncuestaSeleccionada] = useState({});


  const [listaEncuestas, setListasEncuestas] = useState([]);

  const getListaEncuestas = () => {
    axios
      .get(APIURL + "/catalogos/encuestas", config)
      .then((resp) => {
        setListasEncuestas(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const seleccionarEncuesta = (encuesta) => {
    setEncuestaSeleccionada(encuesta);
    handleShowMCopia();
  }

  const renderFilasEncuestas = () => {
    return listaEncuestas.map((encuesta, index) => (
      <tr key={"trle-" + index}>
        <td>
          <p style={{ fontWeight: "bold" }}>{encuesta.id}</p>
        </td>
        <td>
          <p style={{ fontWeight: "bold" }}>{encuesta.tipo_cliente?.nombre}</p>
        </td>
        <td>
          <p style={{ fontWeight: "bold" }}>{encuesta.nombre}</p>
        </td>
        <td>
          <p style={{ fontWeight: "bold" }}>{encuesta.descripcion}</p>
        </td>
        <td>
          { (encuesta.id_tipo_cliente === 2) ? 
          (
            <div>
              <Link
                className="btn"
                title="Ver Formulario"
                to={`${PathConstants.ESECDB}`}
              >
                <i className="bi bi-pencil-square"></i>
              </Link>
            </div>
          ) : (
            <div className="d-flex justify-content-start">
              <Link
                className="btn"
                title="Editar Datos"
                to={`/encuestas/${encuesta.id}`}
              >
                <i className="bi bi-pencil-square"></i>
              </Link>
              <Link
                className="btn"
                to={`/encuestas/${encuesta.id}`}
              >
                <i className="bi bi-file-earmark-text text-blue" title="Archivo Proyecto"></i>
              </Link>
              <Link
                className="btn"
                title="Eliminar Proyecto"
                onClick={() => seleccionarEncuesta(encuesta) }
              >
                <i
                  className="bi bi-stack text-dark"
                  title="Crear copia"
                ></i>
              </Link>
            </div>
          )  
          }
          
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    if (!show) {
      getListaEncuestas();
    }
  }, [show]);

  useEffect(() => {
    if (!showMCopia) {
      getListaEncuestas();
    }
  }, [showMCopia]);

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-3">
        <div className="">
          <h6 style={{ fontWeight: "bold" }}>Catalogo Encuestas</h6>
        </div>
        <div className="">
          <button
            className="btn btn-primary btn-sm fw-bold"
            onClick={handleShow}
          >
            Nueva Encuesta
          </button>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col">
          <div className="table-wrapper" style={{ overflowX: "auto" }}>
            <table className="table" style={{ minWidth: "650px" }}>
              <thead>
                <tr>
                  <th scope="col" className="col-id">
                    ID
                  </th>
                  <th scope="col">Tipo Cliente</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Descripcion</th>
                  <th scope="col" className="text-center">
                    Opciones
                  </th>
                </tr>
              </thead>
              <tbody>{renderFilasEncuestas()}</tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalNuevaEncuesta
        show={show}
        handleClose={handleClose}
      />
      <ModalCopiaEncuesta
        show={showMCopia}
        handleClose={handleCloseMCopia}
        encuesta={encuestaSeleccionada}
      />
    </div>
  );
}
