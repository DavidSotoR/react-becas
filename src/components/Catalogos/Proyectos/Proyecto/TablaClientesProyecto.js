import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import ResaltarTexto from "../../../ResaltarTexto/ResaltarTexto";
import ModalEnlazarCliente from "./ModalEnlazarCliente_tmp";
import TablaOrdenesDeTrabajo from "./TablaOrdenesDeTrabajo";

function TablaClientesProyecto({ ID, idTipoCliente }) {
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

  const [allClientes, setAllClientes] = useState([]);
  const [search, setSearch] = useState("");

  const getClientesProyectoID = () => {
    axios
      .get(`${APIURL}/proyectos/${ID}/clientes-encuestas`, config)
      .then((resp) => {
        setAllClientes(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const handleEditClick = (cliente) => {
    alert(cliente.nombre);
  };

  const searchText = (e) => {
    const buscar = e.target.value;
    setSearch(buscar);
  };

  useEffect(() => {
    getClientesProyectoID();
  }, []);

  useEffect(() => {
    if (!show) {
      getClientesProyectoID();
    }
  }, [show]);

  const allClientesFiltrados = allClientes.filter((item) =>
    item.cliente.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const renderFilasTablaClientes = () => {
    return allClientesFiltrados.map((a, index) => (
      <tr key={"tr-cliente-" + index}>
        <td>
          <p>{index}</p>
        </td>
        <td>
          <p>
            <ResaltarTexto texto={a.cliente.nombre} reslatar={search} />
          </p>
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
          <h4>Lista de clientes:</h4>
        </div>
        <div className="">
          <button
            className="btn btn-primary btn-sm fw-bold"
            onClick={handleShow}
          >
            Agregar Clientes
          </button>
        </div>
      </div>
      <div>
        <hr />
        <div className="row">
          <div className="col-2 col-md-2 col-lg-1">
            <label htmlFor="search" className="col-sm-2 col-form-label">
              Buscar:
            </label>
          </div>

          <div className="col-5 col-md-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar..."
              value={search}
              onChange={searchText}
            />
          </div>
        </div>
        <hr />
      </div>
      {/*<div className="table-wrapper">
            <table className="table">
            <thead>
                <tr>
                    <th scope="col" className="col-id">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Encuesta</th>
                    <th scope="col">Opciones</th>
                </tr>
            </thead>
            <tbody>
                { renderFilasTablaClientes() }
            </tbody>
            </table>
        </div>*/}

      <div className="tab-content">
        {allClientesFiltrados.map((a, i) => (
          <div
            key={"pg-" + a.cliente.id}
            className={`mb-3 p-3 rounded border-opacity-75 border-static`}
          >
            <div className="d-flex justify-content-between mb-3">
              <div className="">
                <h5>
                  <ResaltarTexto texto={a.cliente.nombre} reslatar={search} />
                </h5>
              </div>
              <div className="">
                <div className="dropdown">
                  <button
                    className="btn btn-sm fw-bold"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Acciones
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => handleEditClick(a)}
                      >
                        Editar
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" type="button">
                        Eliminar
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" type="button">
                        Nueva orden de servicio
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-4 row mt-2">
                <p>
                  <b>Formato: {a.encuesta.nombre}</b>
                </p>
              </div>
            </div>
            <div>
              {/*JSON.stringify(a)*/}
              <TablaOrdenesDeTrabajo
                ID={ID}
                idCliente={a.id_cliente}
                idTipoCliente={a.id_tipo_cliente}
              ></TablaOrdenesDeTrabajo>
            </div>
          </div>
        ))}
      </div>
      <ModalEnlazarCliente
        show={show}
        handleClose={handleClose}
        idProyecto={ID}
        idTipoCliente={idTipoCliente}
      ></ModalEnlazarCliente>
    </div>
  );
}

export default TablaClientesProyecto;
