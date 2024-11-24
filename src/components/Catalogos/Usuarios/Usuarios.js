import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { ModalActivarUsuario } from "./ModalActivarUsuario";
import Avatar from "react-avatar";
import PathConstants from "../../../routes/pathsConstants";
import { Link, useNavigate } from "react-router-dom";

function Usuarios() {
  const APIURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [clearForm, setClearForm] = useState(false);
  const [btnEnable, setBtnEnable] = useState(true);
  const [allUsuarios, setAllUsuarios] = useState([]);
  const [allPerfiles, setAllPerfiles] = useState([]);
  const [allClientes, setAllClientes] = useState([]);
  const [listaUsuSelected, setListaUsuSelected] = useState([]);
  const [checkAllSelected, setCheckAllSelected] = useState(false);
  const [dataPostUsuario, setDataPostUsuario] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showActivar, setShowActivar] = useState(false);
  const handleCloseActivar = () => setShowActivar(false);
  const handleShowActivar = () => setShowActivar(true);
  const [userToActive, setUserToActive] = useState(null);

  const [search, setSearch] = useState("");
  const [searchPorPerfil, setSearchPorPerfil] = useState(null);

  const [userSelected, setUserSelected] = useState(null);

  const [showUpdate, setShowUpdate] = useState(false);
  const handleCloseUpdate = () => setShowUpdate(false);
  const handleShowUpdate = () => setShowUpdate(true);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const defaultValuesForm = () => {
    setClearForm(false);
  };

  const postCrearUsuario = async () => {
    var data = dataPostUsuario;
    try {
      const resp = await axios.post(
        "http://localhost:8000/api/auth/register",
        data,
        config
      );
      console.log(resp);
      handleClose();
      getAllDataUsuarios();
      setClearForm(true);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  const returnValorSwitch = (nuevoValor) => {
    var nuevoEstado = nuevoValor;
    setAllUsuarios((prevState) =>
      prevState.map((user) =>
        user.id === userToActive.id ? { ...user, active: nuevoEstado } : user
      )
    );
  };

  const switchActiveChange = (e, usuario) => {
    /* console.log(e.target);
        console.log(usuario); */
    handleShowActivar();
    setUserToActive(usuario);
  };

  const getAllDataUsuarios = async () => {
    try {
      const resp = await axios.get(APIURL + "/usuarios", config);
      console.log(resp);
      var listaUsuarios = resp.data;
      var listafiltrada = [];
      switch (searchPorPerfil) {
        case "0":
        case undefined:
        case null:
          listafiltrada = listaUsuarios;
          break;
        case "1":
          listafiltrada = listaUsuarios.filter((item) => item.id_perfil === 1);
          break;
        case "2":
          listafiltrada = listaUsuarios.filter((item) => item.id_perfil === 2);
          break;
        case "3":
          listafiltrada = listaUsuarios.filter((item) => item.id_perfil === 3);
          break;
        case "4":
          listafiltrada = listaUsuarios.filter((item) => item.id_perfil === 4);
          break;
        case "5":
          listafiltrada = listaUsuarios.filter((item) => item.id_perfil === 5);
          break;
        case "6":
          listafiltrada = listaUsuarios.filter((item) => item.id_perfil === 6);
          break;
        default:
          listafiltrada = []; // O maneja otros casos según sea necesario
          break;
      }
      setAllUsuarios(listafiltrada);
    } catch (error) {
      console.error("Error fetching perfiles:", error);
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  const getAllPerfiles = async () => {
    try {
      const resp = await axios.get(APIURL + "/perfiles", config);
      setAllPerfiles(resp.data);
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  const getAllClientes = async () => {
    try {
      const resp = await axios.get(APIURL + "/clientes", config);
      setAllClientes(resp.data);
    } catch (error) {
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  const getNamePerfil = (id) => {
    var name = "";
    switch (id) {
      case 1:
        name = "Administrador";
        break;
      case 2:
        name = "Gerencia";
        break;

      case 3:
        name = "Calidad";
        break;

      case 4:
        name = "Colaboradores";
        break;

      case 5:
        name = "Empresas";
        break;

      case 6:
        name = "Familias";
        break;
      default:
        name = "Sin Identificar";
        break;
    }

    return name;
  };

  const checkboxChange = (e) => {
    var { name, value, checked } = e.target;
    console.log(checked);
    console.log(name);
    
    var selected = [];
    if (checked) {
      if (name === "checkuser-all") {
        setCheckAllSelected(checked);
        console.log("se seleccionan todos users");
        if (checked) {
          allUsuarios.forEach((usu) => {
              selected.push(usu.id);
          });
        } else {
          selected = [];
        }
        setListaUsuSelected(selected);
      } else {
        console.log('¿entro?');
        
        var idUserSelected = name.split("-")[1];
        var idUser = parseInt(idUserSelected);
        if (checked) {
          setListaUsuSelected((prevUsuarios) => {
              return [...prevUsuarios, idUser];
          });
        } else {
          var nuevo_array = listaUsuSelected.filter(elemento => elemento !== idUserSelected)
          setListaUsuSelected(nuevo_array)
        }
      }
    } else {
      setCheckAllSelected(checked)
      setListaUsuSelected(selected)
    }
    
  };

  const renderFiltroPerfiles = () => {
    return [
      ...allPerfiles.map((perfil) => (
        <option key={perfil.id} value={`${perfil.id}`}>
          {perfil.nombre}
        </option>
      )),
    ];
  };

  const renderFiltroClientes = () => {
    return [
      ...allClientes.map((cliente) => (
        <option key={cliente.id} value={`${cliente.id}`}>
          {cliente.nombre}
        </option>
      )),
    ];
  };

  const selectUserToUpdate = (usuario) => {
    console.log(usuario.id);

    navigate("/usuarios/" + usuario.id + "/actualizar");

    // setUserSelected(usuario)
    //setShowUpdate(!showUpdate)
  };

  const existInAllUsuarioSelected = (id) => {

    return listaUsuSelected.includes(id);
  };

  const renderFilasTablaUsuarios = () => {
    return allUsuariosFiltrados.map((usuario, index) => (
      <tr key={"tr-usuario-" + index}>
        <td className="col-id">
          <input
            type="checkbox"
            onChange={(e) => {
              checkboxChange(e);
            }}
            name={"checkuser-" + usuario.id}
            checked={existInAllUsuarioSelected(usuario.id)}
            id={"checkuser-" + usuario.id}
            value=""
          />
        </td>
        <td className="col-nombre">
          <div className="d-flex">
            <div>
              <Avatar name={usuario.name} size="30" round={true} />
            </div>
            <div className="ps-1 align-self-center">
              <span>{usuario.name}</span>
            </div>
          </div>
        </td>
        <td className="col-cuenta">
          <p>{usuario.email}</p>
        </td>
        <td>
          <p>{usuario?.id_cliente ? usuario.cliente.nombre : ""}</p>
        </td>
        <td>
          <p>{getNamePerfil(usuario.id_perfil)}</p>
        </td>
        <td>
          <div className="d-flex justify-content-start align-items-center">
            <Form.Check type="switch">
              <Form.Check.Input
                onChange={(e) => {
                  switchActiveChange(e, usuario);
                }}
                checked={usuario.active === 1}
                className="table-col-switch"
                name="documentacion_digital"
                type="checkbox"
              />
            </Form.Check>
          </div>
        </td>
        <td>
          <div className="d-flex justify-content-start">
            <button
              className="btn btn-outline-secondary mx-1 btn-sm p-1 pb-0"
              style={{ borderColor: "rgba(0,0,0,0)" }}
              onClick={() => {
                selectUserToUpdate(usuario);
              }}
            >
              <ion-icon
                style={{ fontWeight: "bolder!important", fontSize: "x-large" }}
                name="create"
              ></ion-icon>
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  const searchUsuarioPorPerfil = (e) => {
    var value = e.target.value;
    setSearchPorPerfil(value);
  };

  const searchText = (e) => {
    const buscar = e.target.value;
    setSearch(buscar);
  };

  const allUsuariosFiltrados = allUsuarios.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (APIURL) {
      getAllPerfiles();
      getAllClientes();
      //getAllDataUsuarios();
    }
  }, [APIURL]);

  useEffect(() => {
    if (!showUpdate) {
      getAllDataUsuarios();
    }
  }, [showUpdate]);

  useEffect(() => {
    if (!showActivar) {
      getAllDataUsuarios();
    }
  }, [showActivar]);

  useEffect(() => {
    if (!show) {
      getAllDataUsuarios();
    }
  }, [show]);

  useEffect(
    (e) => {

      if (searchPorPerfil) {
        console.log(searchPorPerfil);
        getAllDataUsuarios();
      }
    },
    [searchPorPerfil]
  );

  const showDataTest = () =>{
    console.log(listaUsuSelected);
  }

  return (
    <div className="container mt-3">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="">
          <h6 style={{ fontWeight: "bold" }}>Catalogo de Usuarios</h6>
          <button onClick={() => showDataTest()}>click</button>
        </div>
        <div className="">
          {/* <Button className="btn btn-primary btn-sm" onClick={handleShow}>Agregar Usuario</Button> */}
          <Link
            className="btn btn-primary btn-sm"
            to={PathConstants.USUARIOCREAR}
          >
            Agregar Usuario
          </Link>
        </div>
      </div>
      <div className="mb-3 d-flex">
        <div className="d-flex justify-content-center align-items-center">
          <p className="fw-bold m-0 me-1">Filtros:</p>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-3 col-sm-8 col-8">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar:"
              onChange={(e) => {
                searchText(e);
              }}
            />
          </div>
          <div className="col-lg-4 col-md-3 col-sm-6 col-6">
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => {
                searchUsuarioPorPerfil(e);
              }}
            >
              <option value="0">Seleccione un Perfil</option>
              {renderFiltroPerfiles()}
            </select>
          </div>
          <div className="col-lg-4 col-md-3 col-sm-6 col-6">
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
            >
              <option value="0">Seleccione un Cliente</option>
              {renderFiltroClientes()}
            </select>
          </div>
          
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col">
          <div className="table-wrapper">
          { listaUsuSelected.length > 0 &&
            <div className="d-flex mb-3">
              <button className="btn btn-primary btn-sm mx-1">Activar Cuentas</button>
              <button className="btn btn-warning btn-sm mx-1">Deshabilitar Cuentas</button>
            </div>
          }
          
            <table className="table">
              <thead>
                <tr>
                  <th className="col-id" style={{ verticalAlign: "top" }}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        checkboxChange(e);
                      }}
                      checked={checkAllSelected}
                      name={"checkuser-all"}
                      id={"check-user-all"}
                    />
                  </th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Cuenta</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Perfil</th>
                  <th scope="col">Activo</th>
                  <th scope="col">Opciones</th>
                </tr>
              </thead>
              <tbody>{renderFilasTablaUsuarios()}</tbody>
            </table>
          </div>
        </div>
      </div>
      {showActivar && (
        <ModalActivarUsuario
          show={showActivar}
          onHide={handleCloseActivar}
          p_usuario={userToActive}
          activar_desactivar={returnValorSwitch}
        ></ModalActivarUsuario>
      )}
    </div>
  );
}

export default Usuarios;
