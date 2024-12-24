import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

function Perfiles() {
  const [search, setSearch] = useState("");
  const [allPerfiles, setAllPerfiles] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("1");
  const { logout } = useContext(AuthContext);
  const APIURL = process.env.REACT_APP_API_URL;

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const getPerfilesList = async () => {
    try {
      const resp = await axios.get(APIURL + "/perfiles", config);
      var perfiles = resp.data;
      //console.log(perfiles);
      var perfilesFiltrados = [];
      if (filtroActivo === "1") {
        //console.log(filtroActivo);
        perfilesFiltrados = perfiles.filter((item) => item.activo === 1);
      } else {
        perfilesFiltrados = perfiles.filter((item) => item.activo === 0);
      }
      setAllPerfiles(perfilesFiltrados);
    } catch (error) {
      //console.error("Error fetching perfiles:", error);
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  const filtroActivoSearch = (e) => {
    const activo = e.target.value;
    //console.log(activo);
    setFiltroActivo(activo);
  };

  const searchText = (e) => {
    const buscar = e.target.value;
    setSearch(buscar);
  };

  const allPerfilesFiltrados = allPerfiles.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    getPerfilesList();
  }, [filtroActivo]);

  /* useEffect(() => {
        getPerfilesList();
    }, [filtroActivo]); */

  const renderFilasTablaPerfiles = () => {
    return allPerfilesFiltrados.map((perfil, index) => (
      <tr key={"tr-perfil-" + index}>
        <td>
          <p>{perfil.id}</p>
        </td>
        <td>
          <p>{perfil.activo ? "Si" : "No"}</p>
        </td>
        <td>
          <p className="mb-0">{perfil.nombre}</p>
          <p className="text-secondary mb-0">
            <i>Descripcion: {perfil.descripcion}</i>
          </p>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between mb-3">
        <div className="">
          <h6 style={{ fontWeight: "bold" }}>Lista de Perfiles:</h6>
        </div>
      </div>

      <div className="mb-3 row">
        <p className="fw-bold mb-1">Filtros:</p>
        <div className="row">
          <div className="col-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar:"
              onChange={searchText}
            />
          </div>
          <div className="col-3">
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => {
                filtroActivoSearch(e);
              }}
            >
              <option value="1" selected={true}>
                Activos
              </option>
              <option value="0">Inactivos</option>
            </select>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="col-id">
                    #
                  </th>
                  <th scope="col" className="col-activo">
                    Activo
                  </th>
                  <th scope="col">Nombre</th>
                </tr>
              </thead>
              <tbody>{renderFilasTablaPerfiles()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfiles;
