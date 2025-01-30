import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function OrdenesServicios() {
  const APIURL = process.env.REACT_APP_API_URL;
  const CONFIG = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [flagInit, setFlagInit] = useState(false)
  const [ ordenesServicio, setOrdenesServicio ] = useState([])

  const getOrdenesServicios = async () => {
    var resp = await axios.get(APIURL+'/ordenes-servicio', CONFIG);
    console.log(resp); 
    setOrdenesServicio(resp.data)
  }

  const renderFilasTablaOS = () => {
      return ordenesServicio.map((os, index) => (
        <tr key={"tr-orden-" + index}>
          <td className="col-id">
            { os.id }
          </td>
          <td className="col-nombre">
            { os.proyecto.nombre }
          </td>
          <td className="col-cuenta">
            <p>{os.activo ? 'Activo' : 'Inactivo'}</p>
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

    useEffect(() => {
    if (!flagInit) {
        getOrdenesServicios();
        setFlagInit(true); // Activar el flag después de la primera ejecución
    }
    }, [flagInit]);

  return (
    <div className="container mt-3">
       <table class="table">
        <thead>
            <tr>
            <th scope="col">Orden</th>
            <th scope="col">Proyecto</th>
            <th scope="col">Activo</th>
            <th scope="col">Cliente</th>
            <th scope="col">Opciones</th>
            </tr>
        </thead>
        <tbody>
            { renderFilasTablaOS() }
        </tbody>
        </table>
    </div>
  );
}

export default OrdenesServicios;
