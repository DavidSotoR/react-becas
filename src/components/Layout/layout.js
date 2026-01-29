import { Link, Outlet } from "react-router-dom";
import React, { Suspense, useContext, useEffect, useState } from "react";
import Navbar from "../NavBar/NavBar";
import { AuthContext } from "../../context/AuthContext";
import PathConstants from "../../routes/pathsConstants";
import {
  Menu,
  MenuItem,
  Sidebar,
  SubMenu,
  menuClasses,
} from "react-pro-sidebar";
import Avatar from "react-avatar";

export default function Layout() {
  const { isLoggedIn, userSession, roleSession, userActive, logout, ua, documentoDigital } = useContext(AuthContext);
  const [active, setActive] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const Logout = () => {
    localStorage.clear();
    window.location.replace("/");
  };

  const returnRutaFamiliaFiles = () => {
    return `${PathConstants.FAMILIASFILES}?idse=${localStorage.getItem("se")}`;
  };
  useEffect(() => {
    if (collapsed) {
    }
  }, [collapsed]);

  useEffect(() => {
    if (ua) {
      var ls = localStorage.getItem("ua");
      var act;
      if (ls === "true") {
        setActive(true);
        act = true;
      }
      if (ls === "false" || ls === null || ls === "null") {
        act = false;
        setActive(false);
      }
    } else {
      if (userActive === null && localStorage.getItem("ua") === "false") {
        setActive(false);
      } else {
        console.log("entra ua");

        var ls = localStorage.getItem("ua");
        console.log("este es el valor " + ls);
        var act;
        if (ls === "true") {
          setActive(true);
          act = true;
        }
        if (ls === "false" || ls === null || ls === "null") {
          act = false;
          setActive(false);
        }
      }
    }
  }, [ua]);

  return (
    <>
      {/* <Navbar /> */}
      <main className={!isLoggedIn ? "background-login" : ""}>
        <div className="row m-0">
          {isLoggedIn && (
            <Sidebar collapsed={collapsed}
              rootStyles={{
                backgroundColor: "#47D1D6",
                overflowY: "auto",
                height: "100vh",
                paddingRight: "0px",
                paddingLeft: "0px",
              }}
            >
              <div
                className={
                  collapsed
                    ? "mt-3 d-flex justify-content-center align-items-center text-light"
                    : "mt-3 pe-3 d-flex justify-content-end align-items-center text-light"
                }
              >
                {collapsed ? (
                  <ion-icon size="large" onClick={() => setCollapsed(!collapsed)} name="menu-outline" ></ion-icon>
                ) : (
                  <ion-icon size="large" onClick={() => setCollapsed(!collapsed)} name="close-circle-outline"></ion-icon>
                )}
              </div>
              <Menu
                rootStyles={{
                  backgroundColor: "#47D1D6",
                  ["." + menuClasses.button]: {
                    "&:hover": {
                      color: "white",
                      background: "rgba(0,0,0,.4)",
                      borderRadius: "5px",
                    },
                  },
                }}
                menuItemStyles={{
                  button: ({ level, active, disabled }) => {
                    // only apply styles on first level elements of the tree
                    if (level === 0)
                      return {
                        color: active ? "black" : "white",
                        fontWeight: "bold",
                        backgroundColor: active ? "#black" : undefined,
                        "&:hover": {
                          color: "#777777",
                          borderRadius: "5px",
                        },
                      };
                  },
                }}
              >
                <div className="d-flex justify-content-center align-items-center">
                  <img src="/img/logo_principal_blanco.png" style={{ width: "200px", maxWidth: "100%" }} alt="Descripción de la imagen" />
                </div>

                <MenuItem component={<Link to={PathConstants.HOME} />}>
                  {collapsed ? (
                    <div className="ion-text-center">
                      <ion-icon name="home" size="large" />
                    </div>
                  ) : (
                    <p class="mb-0">INICIO</p>
                  )}
                </MenuItem>

                {roleSession === "Familias" && active && (
                  <>
                  <MenuItem component={<Link to={PathConstants.DATOSFAMILIA} />} >
                    {collapsed ? (
                      <div className="ion-text-center">
                        <ion-icon name="id-card-outline" size="large" />
                      </div>
                    ) : (
                      <p className="mb-0">DATOS CONTACTOS</p>
                    )}
                  </MenuItem>
                  <MenuItem component={<Link to={`/micuenta`} />}>
                    {collapsed ? (
                      <div className="ion-text-center">
                        <ion-icon name="person" size="large" />
                      </div>
                    ) : (
                      <p className="pt-3">MI CUENTA</p>
                    )}
                  </MenuItem>
                  </>
                  
                )}

                {roleSession === "Familias" && active && localStorage.getItem('dd') === '1' && (
                  <MenuItem component={<Link to={`${returnRutaFamiliaFiles()}`} />}>
                    {collapsed ? (
                      <div className="ion-text-center">
                        <ion-icon name="cloud-upload-outline" size="large"
                        ></ion-icon>
                      </div>
                    ) : (
                      <p className="mb-0">SUBIR ARCHIVOS</p>
                    )}
                  </MenuItem>

                )}

                {roleSession === "Administrador" && (
                  <>
                    <MenuItem component={<Link to={PathConstants.ESTUDIOS} />}>
                      {collapsed ? (
                        <div className="ion-text-center">
                          <ion-icon name="folder-open-outline" size="large" />
                        </div>
                      ) : (
                        <p>ASIGNACIONES</p>
                      )}
                    </MenuItem>
                    <MenuItem component={<Link to={PathConstants.ORDENESSERVICIOS} />} >
                      {collapsed ? (
                        <div className="ion-text-center">
                          <ion-icon
                            name="albums-outline"
                            size="large"
                          ></ion-icon>
                        </div>
                      ) : (
                        <p>ORDENES DE SERVICIO</p>
                      )}
                    </MenuItem>

                    {/*<MenuItem component={<Link to={PathConstants.CICLOSESCOLARES} />}> 
                                {collapsed ? (<div className="ion-text-center"><ion-icon size="large" name="school"/></div>):(<p>CICLOS ESCOLARES</p>)}
                              </MenuItem>*/}
                    <SubMenu label="NUEVO ESTUDIO" icon={
                        collapsed && (
                          <div className="d-flex justify-content-center align-items-center">
                            {" "}
                            <ion-icon size="large" name="documents-outline" />
                          </div>
                        )
                      }
                      rootStyles={{
                        color: "white",
                        ["& > ." + menuClasses.button]: {
                          backgroundColor: "#47D1D6",
                          color: "white",
                          "&:hover": { backgroundColor: "#47D1D6" },
                        },
                        ["." + menuClasses.subMenuContent]: {
                          backgroundColor: "#47D1D6",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <MenuItem component={ <Link to={PathConstants.ESTUDIOSOCIOECONOMICO} />}>
                        {" "}
                        SOCIOECONOMICO
                      </MenuItem>
                    </SubMenu>

                    <SubMenu label="EMPRESAS" icon={
                        collapsed && (
                          <div className="d-flex justify-content-center align-items-center">
                            {" "}
                            <ion-icon size="large" name="business-outline" />
                          </div>
                        )
                      }
                      rootStyles={{
                        color: "white",
                        ["& > ." + menuClasses.button]: {
                          backgroundColor: "#47D1D6",
                          color: "white",
                          "&:hover": { backgroundColor: "#47D1D6" },
                        },
                        ["." + menuClasses.subMenuContent]: {
                          backgroundColor: "#47D1D6",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      {/* <MenuItem component={ <Link to={PathConstants.MODULOEMPRESAORDENESSERVICIO} />}>
                        {" "}
                        ORDENES SERVICIOS
                      </MenuItem> */}
                      <MenuItem
                        component={
                          <Link to={PathConstants.MODULOEMPRESASUCURSALES} />
                        }
                      >
                        {" "}
                        SUCURSALES
                      </MenuItem>
                      <MenuItem
                        component={
                          <Link to={PathConstants.MODULOEMPRESAEMPLEADOS} />
                        }
                      >
                        {" "}
                        EMPLEADOS
                      </MenuItem>
                      <MenuItem
                        component={
                          <Link
                            to={PathConstants.MODULOEMPRESAESTUDIOSOCIECONOMICO}
                          />
                        }
                      >
                        {" "}
                        ESTUDIO SOCIOECONOMICOS
                      </MenuItem>
                    </SubMenu>

                    <SubMenu label="CATALOGOS" icon={
                        collapsed && (
                          <div className="d-flex justify-content-center align-items-center">
                            <ion-icon size="large" name="file-tray-full" />
                          </div>
                        )
                      }
                      rootStyles={{
                        color: "white",
                        ["& > ." + menuClasses.button]: {
                          backgroundColor: "#47D1D6",
                          color: "white",
                          "&:hover": { backgroundColor: "#47D1D6" },
                        },
                        ["." + menuClasses.subMenuContent]: {
                          backgroundColor: "#47D1D6",
                          fontWeight: "bold",
                        },
                      }}
                    >
                      <MenuItem
                        component={<Link to={PathConstants.PROYECTOS} />}
                      >
                        {" "}
                        PROYECTOS
                      </MenuItem>
                      <MenuItem
                        component={<Link to={PathConstants.ENCUESTAS} />}
                      >
                        {" "}
                        ENCUESTAS
                      </MenuItem>
                      <MenuItem
                        component={<Link to={PathConstants.USUARIOS} />}
                      >
                        {" "}
                        USUARIOS
                      </MenuItem>
                      <MenuItem
                        component={<Link to={PathConstants.PERFILES} />}
                      >
                        {" "}
                        PERFILES
                      </MenuItem>
                      {/*<MenuItem component={<Link to={PathConstants.FAMILIAS}  />}> FAMILIAS</MenuItem>*/}
                      <MenuItem
                        component={<Link to={PathConstants.CLIENTES} />}
                      >
                        {" "}
                        CLIENTES
                      </MenuItem>
                      <MenuItem
                        component={<Link to={PathConstants.COLEGIOSCOMUNES} />}
                      >
                        {" "}
                        COLEGIOS COMUNES
                      </MenuItem>
                    </SubMenu>

                    <MenuItem component={<Link to={`/micuenta`} />}>
                      {collapsed ? (
                        <div className="ion-text-center">
                          <ion-icon name="person" size="large" />
                        </div>
                      ) : (
                        <p className="pt-3">MI CUENTA</p>
                      )}
                    </MenuItem>
                  </>
                )}
                

                <MenuItem onClick={Logout} className="ps-1">
                  {collapsed ? (
                    <ion-icon name="log-out" size="large" />
                  ) : (
                    <p className="pt-3">CERRAR SESIÓN</p>
                  )}
                </MenuItem>
              </Menu>
            </Sidebar>
          )}

          <div className="col pt-4 scrollable-content" style={{ height: "100vh" }}>
            {isLoggedIn && (
              <div className="d-flex justify-content-end">
                <div className="d-flex align-items-center">
                  <Avatar
                    name={localStorage.getItem("name")}
                    size="30"
                    round={true}
                  />
                </div>
                <div className="ps-1 align-self-center">
                  <p className="fw-bold m-0">
                    {localStorage.getItem("user") ?? "SIN DATO"}
                  </p>
                </div>
              </div>
            )}

            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
