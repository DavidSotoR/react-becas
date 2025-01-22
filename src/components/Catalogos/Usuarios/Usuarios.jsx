import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { ModalActivarUsuario } from "./ModalActivarUsuario";
import { ModalActivarAllUsuario } from "./ModalActivarAllUsuarios";
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
  const [hasInitialized, setHasInitialized] = useState(false);

  const [showActivar, setShowActivar] = useState(false);
  const handleCloseActivar = () => setShowActivar(false);
  const handleShowActivar = () => setShowActivar(true);
  const [userToActive, setUserToActive] = useState(null);

  const [search, setSearch] = useState("");
  const [searchPorPerfil, setSearchPorPerfil] = useState(0);
  const [searchPorCliente, setSearchPorCliente] = useState(0);
  const [searchPorActivo, setSearchPorActivo] = useState("all");

  const [userSelected, setUserSelected] = useState(null);

  const [showUpdate, setShowUpdate] = useState(false);
  const [showModalActivaCuentas, setShowModalActivaCuentas] = useState(false);
  const [optionSelectedAllUsuarios, setOptionSelectedAllUsuarios] = useState(1);

  const handleCloseModalAll = () => setShowModalActivaCuentas(false);
  const handleShowModalAll = () => setShowUpdate(true);

  const [dataFormActivarDeshabiliar, setDataFormActivarDeshabiliar] = useState(
    []
  );

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const habilitarDeshabilitarCuentas = (opcion) => {
    setShowModalActivaCuentas(!showModalActivaCuentas);
    setOptionSelectedAllUsuarios(opcion);
    var usuariosSlct = [];
    allUsuariosFiltrados.forEach((element) => {
      if (existInAllUsuarioSelected(element.id)) {
        usuariosSlct.push({
          id: element.id,
          email: element.email,
          cliente: element.cliente ? element.cliente.nombre : "INTERNO",
        });
      }
    });
    setDataFormActivarDeshabiliar(usuariosSlct);
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
    handleShowActivar();
    setUserToActive(usuario);
  };

  const getAllDataUsuarios = async () => {
    var qPerfil = searchPorPerfil;
    var qCliente = searchPorCliente;
    var qText = search;
    var qActivo = searchPorActivo;
    try {
      const resp = await axios.get(
        `${APIURL}/usuarios?search=${qText}&perfil=${qPerfil}&cliente=${qCliente}&activo=${qActivo}`,
        config
      );
      console.log(resp);
      var listaUsuarios = resp.data;

      setAllUsuarios(listaUsuarios);
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

    var selected = [];
    if (name === "checkuser-all") {
      setCheckAllSelected(checked);
      if (checked) {
        allUsuarios.forEach((usu) => {
          selected.push(usu.id);
        });
      } else {
        selected = [];
      }
      setListaUsuSelected(selected);
    } else if (name !== "checkuser-all") {
      var idUserSelected = name.split("-")[1];
      var idUser = parseInt(idUserSelected);
      var selected = [];
      if (checked) {
        if (existInAllUsuarioSelected(idUser)) {
          selected = listaUsuSelected.filter((elemento) => elemento !== idUser);
          setListaUsuSelected(selected);
        } else {
          setListaUsuSelected((prevUsuarios) => {
            return [...prevUsuarios, idUser];
          });
        }
      } else {
        selected = listaUsuSelected.filter((elemento) => elemento !== idUser);
        setListaUsuSelected(selected);
      }
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
              onClick={() => showDataUsuario(usuario)}
            >
              <ion-icon
                name="eye"
                style={{ fontWeight: "bolder!important", fontSize: "x-large" }}
              ></ion-icon>
            </button>
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

  const searchUsuarioPorCliente = (e) => {
    var value = e.target.value;
    setSearchPorCliente(value);
  };

  const searchUsuarioPorActivo = (e) => {
    var value = e.target.value;
    setSearchPorActivo(value);
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

  const showDataUsuario = (data) => {
    console.log(data);
    navigate("/usuarios/" + data.id + "/ver");

  };

  useEffect(() => {
    if (!hasInitialized) {
      // Carga inicial
      console.log('Carga inicial de datos');
      getAllDataUsuarios();
      setHasInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (APIURL) {
      getAllPerfiles();
      getAllClientes();
      //getAllDataUsuarios();
    }
  }, [APIURL]);

  useEffect(() => {
    if (hasInitialized && !showUpdate) {
      console.log('showUpdate');
      getAllDataUsuarios();
    }
  }, [showUpdate]);

  useEffect(() => {
    if (hasInitialized && !showActivar) {
      console.log('showActivar');
      getAllDataUsuarios();
    }
  }, [showActivar]);

  useEffect(() => {
    if (hasInitialized) {
      console.log('searchs filtroas');
      getAllDataUsuarios();
    }
  }, [searchPorPerfil, searchPorCliente, searchPorActivo]);

  useEffect(() => {
    if (hasInitialized && !showModalActivaCuentas) {
      console.log('showModalActivaCuentas');
      getAllDataUsuarios();
      setListaUsuSelected([]);
      setCheckAllSelected(false);
    }
  }, [showModalActivaCuentas]);

  return (
    <div className="container mt-3">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="">
          <h6 style={{ fontWeight: "bold" }}>Catalogo de Usuarios</h6>
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
      <div className="mb-3">
        <div className="row">
          <div className="col-12 col-md-12">
            <p className="fw-bold m-0 me-1">Filtros:</p>
          </div>
          <div className="col-12 col-md-3 col-lg-2 mb-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar:"
              onChange={(e) => {
                searchText(e);
              }}
            />
          </div>
          <div className="col-6 col-md-3 col-lg-2 mb-2">
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => {
                searchUsuarioPorPerfil(e);
              }}
            >
              <option value="0">Perfiles</option>
              {renderFiltroPerfiles()}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2 mb-2">
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => {
                searchUsuarioPorCliente(e);
              }}
            >
              <option value="0">Clientes</option>
              {renderFiltroClientes()}
            </select>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={(e) => {
                searchUsuarioPorActivo(e);
              }}
            >
              <option value="all">Activos/Inactivos</option>
              <option value="0">Inactivos</option>
              <option value="1">Activos</option>
            </select>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="row">
        <div className="col">
          <div className="table-wrapper">
            {listaUsuSelected.length > 0 && (
              <div className="d-flex mb-3">
                <button
                  className="btn btn-primary btn-sm mx-1"
                  onClick={() => habilitarDeshabilitarCuentas(1)}
                >
                  Activar Cuentas
                </button>
                <button
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => habilitarDeshabilitarCuentas(0)}
                >
                  Deshabilitar Cuentas
                </button>
              </div>
            )}

            <div className="table-wrapper" style={{ overflowX: "auto" }}>
              <table
                className="table"
                style={{ minWidth: "700px", overflowX: "auto" }}
              >
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
      </div>
      {showActivar && (
        <ModalActivarUsuario
          show={showActivar}
          onHide={handleCloseActivar}
          p_usuario={userToActive}
          activar_desactivar={returnValorSwitch}
        ></ModalActivarUsuario>
      )}
      {showModalActivaCuentas && dataFormActivarDeshabiliar.length && (
        <ModalActivarAllUsuario
          show={showModalActivaCuentas}
          onHide={handleCloseModalAll}
          list_usuario={dataFormActivarDeshabiliar}
          activar_desactivar={optionSelectedAllUsuarios}
        ></ModalActivarAllUsuario>
      )}
    </div>
  );
}

export default Usuarios;
