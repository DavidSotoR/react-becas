import { useContext, useEffect, useState } from "react";
import ModalNuevaOrdenDeTrabajo from "./ModalNuevaOrdenDeTrabajo";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";

function TablaOrdenesDeTrabajo({ ID, idCliente, idTipoCliente }) {
  const { logout } = useContext(AuthContext);
  const APIURL = process.env.REACT_APP_API_URL;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [allOrdenesServicio, setAllOrdenesServicio] = useState([]);

  const getOrdenesServicioProyectoID = () => {
    axios
      .get(
        `${APIURL}/proyectos/${ID}/clientes/${idCliente}/ordenes-servicio`,
        config
      )
      .then((resp) => {
        setAllOrdenesServicio(resp.data);
      })
      .catch((error) => {
        if (error?.response.status === 401) {
          logout();
        } else {
          console.log(error);
          alert("Error al solicitar información");
        }
      });
  };
  useEffect(() => {
    getOrdenesServicioProyectoID();
  }, []);
  useEffect(() => {
    if (!show) {
      getOrdenesServicioProyectoID();
    }
  }, [show]);

  const renderFilasTablaODP = () => {
    return allOrdenesServicio.map((odp, index) => (
      <tr key={"tr-odp-" + index}>
        <td>
          <p>{odp.id}</p>
        </td>
        <td>
          <p>{odp.descripcion}</p>
        </td>
        <td>
          <p>{odp.notas}</p>
        </td>
        <td>
          <p>{odp.fecha_estimada_entrega}</p>
        </td>
        <td>
          <p>{odp.fecha_real_entrega}</p>
        </td>
        <td>
          <p>{odp.fecha_estimada_finalizacion}</p>
        </td>
        <td>
          <p>{odp.fecha_real_finalizacion}</p>
        </td>
        <td>
          <p>Opciones</p>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <div className="">
          <h5>Lista de Ordenes de servicio:</h5>
        </div>
        <div className="">
          <button
            className="btn btn-primary btn-sm fw-bold"
            onClick={handleShow}
          >
            <i className="bi bi-plus-square"></i>
            <span className="btn-text-display ms-1">Nueva Orden</span>
          </button>
        </div>
      </div>
      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table className="table" style={{ minWidth: "700px" }}>
          <thead>
            <tr>
              <th scope="col">No. Orden</th>
              <th scope="col">Descriocion</th>
              <th scope="col">Notas</th>
              <th scope="col">Fecha estamada de entrega</th>
              <th scope="col">Fecha real de entrega</th>
              <th scope="col">Fecha estamada de finalizacion</th>
              <th scope="col">Fecha real de finalizacion</th>
              <th scope="col">Opciones</th>
            </tr>
          </thead>
          <tbody>{renderFilasTablaODP()}</tbody>
        </table>
      </div>
      <ModalNuevaOrdenDeTrabajo
        show={show}
        handleClose={handleClose}
        idProyecto={ID}
        idCliente={idCliente}
      ></ModalNuevaOrdenDeTrabajo>
    </div>
  );
}

export default TablaOrdenesDeTrabajo;
