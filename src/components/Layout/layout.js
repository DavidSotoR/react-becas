import { Link, Outlet } from "react-router-dom"
import React, { Suspense, useContext, useEffect, useState } from "react"
import Navbar from "../NavBar/NavBar"
import { AuthContext } from "../../context/AuthContext";
import PathConstants from "../../routes/pathsConstants";
import { Menu, MenuItem, Sidebar, SubMenu, menuClasses } from "react-pro-sidebar";

export default function Layout() {
    const { isLoggedIn, userSession,roleSession, userActive, logout } = useContext(AuthContext);
    const [ active, setActive ] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const Logout = () => {
        localStorage.clear()
        window.location.replace('/')
      }
    useEffect(()=>{
      if (collapsed) {
        
      }
    },[collapsed])

    useEffect(()=>{
      if (userActive === null) {
          setActive(false)
      } else {
          var ls = localStorage.getItem('ua')
          console.log('este es el valor ' + ls);
          var act
          if (ls == true) {
              setActive(true)
              act = true
          } else {
              act = false
              setActive(false)
          }
      }
    })

    return (
        <>
            {/* <Navbar /> */}
            <main className={ !isLoggedIn ? 'background-login' : ''}>
                <div className="row m-0">
                    {isLoggedIn && (
                        <Sidebar collapsed={collapsed} rootStyles={{
                              backgroundColor: '#47D1D6',
                              overflowY: 'auto',
                              height:'100vh',
                              paddingRight: '0px',
                              paddingLeft: '0px'
                          }}>
                            <div className={ collapsed ? 'mt-3 d-flex justify-content-center align-items-center text-light' : 'mt-3 pe-3 d-flex justify-content-end align-items-center text-light' }>
                              { collapsed ?
                                (<ion-icon size="large" onClick={() => setCollapsed(!collapsed)} name="menu-outline"></ion-icon>) :
                                (<ion-icon size="large" onClick={() => setCollapsed(!collapsed)} name="close-circle-outline"></ion-icon>)
                              }
                            </div>
                        <Menu
                            rootStyles={{ 
                              backgroundColor: "#47D1D6",
                              ['.'+menuClasses.button]:{
                                '&:hover':{
                                  color:'white',
                                  background: "rgba(0,0,0,.4)",
                                  borderRadius: "5px",
                                }
                              }
                            }}
                            menuItemStyles={{
                                button: ({ level, active, disabled }) => {
                                  // only apply styles on first level elements of the tree
                                  if (level === 0)
                                    return {
                                      color: active ? 'black' : 'white',
                                      fontWeight: 'bold',
                                      backgroundColor: active ? '#black' : undefined,
                                      '&:hover': {
                                        color: '#777777',
                                        borderRadius:'5px',
                                      },
                                    };
                                },
                              }}
                        >
                            
                            
                            <div className="d-flex justify-content-center align-items-center">
                              <img src='/img/logo_principal_blanco.png' style={{ width:'200px', maxWidth:'100%' }} alt="Descripción de la imagen" />
                            </div>
                          
                          <MenuItem component={<Link to={PathConstants.HOME} />}> 
                              { collapsed ? (<div className="ion-text-center"><ion-icon name="home" size="large"/></div>):(<p>INICIO</p>)}
                          </MenuItem>

                          { roleSession === 'Familias' && active &&
                              <MenuItem component={<Link to={PathConstants.DATOSFAMILIA} />}> 
                                { collapsed ? (<div className="ion-text-center"><ion-icon name="id-card-outline" size="large"></ion-icon></div>):(<p>DATOS CONTACTOS</p>)}
                            </MenuItem>
                          }

                          { roleSession === 'Administrador' &&
                            <>
                          
                            <MenuItem component={<Link to={PathConstants.ESTUDIOS} />}>  
                                { collapsed ? (<div className="ion-text-center"><ion-icon name="folder-open-outline" size="large"/></div>):(<p>ASIGNACIONES</p>)}
                            </MenuItem>
                            
                              {/*<MenuItem component={<Link to={PathConstants.CICLOSESCOLARES} />}> 
                                {collapsed ? (<div className="ion-text-center"><ion-icon size="large" name="school"/></div>):(<p>CICLOS ESCOLARES</p>)}
                              </MenuItem>*/}
                            <SubMenu 
                              label="NUEVO ESTUDIO"  
                              icon={ collapsed && ( <div className="d-flex justify-content-center align-items-center"> <ion-icon size="large" name="documents-outline"/></div> )}
                              rootStyles={{
                                color:"white",
                                ['& > .' + menuClasses.button]: { backgroundColor: '#47D1D6', color: 'white', '&:hover': { backgroundColor: '#47D1D6',},},
                                ['.' + menuClasses.subMenuContent]: { backgroundColor: '#47D1D6', fontWeight: 'bold'},
                              }}
                            >
                                <MenuItem component={<Link to={PathConstants.ESTUDIOSOCIOECONOMICO} />}> SOCIOECONOMICO</MenuItem>
                                <MenuItem component={<Link to={PathConstants.ESTUDIOLABORAL} />}> LABORAL</MenuItem>
                            </SubMenu>
                              
                              
                              {/*<MenuItem component={<Link to={PathConstants.SERVICIOESTUDIO} />}> 
                                {collapsed ? (<div className="ion-text-center"><ion-icon size="large" name="school"/></div>):(<p>NUEVO ESTUDIO</p>)}
                              </MenuItem>*/}

                            <SubMenu 
                              label="CATALOGOS"  
                              icon={ collapsed && (<div className="d-flex justify-content-center align-items-center"><ion-icon size="large" name="file-tray-full"/></div>) }
                              rootStyles={{
                                color:"white",
                                ['& > .' + menuClasses.button]: { backgroundColor: '#47D1D6', color: 'white', '&:hover': { backgroundColor: '#47D1D6',},},
                                ['.' + menuClasses.subMenuContent]: { backgroundColor: '#47D1D6', fontWeight: 'bold' },
                              }}
                            >
                                <MenuItem component={<Link to={PathConstants.PROYECTOS} />}> PROYECTOS</MenuItem>
                                <MenuItem component={<Link to={PathConstants.ENCUESTAS} />}> ENCUESTAS</MenuItem>
                                <MenuItem component={<Link to={PathConstants.USUARIOS}  />}> USUARIOS</MenuItem>
                                <MenuItem component={<Link to={PathConstants.PERFILES}  />}> PERFILES</MenuItem>
                                {/*<MenuItem component={<Link to={PathConstants.FAMILIAS}  />}> FAMILIAS</MenuItem>*/}
                                <MenuItem component={<Link to={PathConstants.CLIENTES}  />}> CLIENTES</MenuItem>
                                <MenuItem component={<Link to={PathConstants.COLEGIOSCOMUNES} />}> COLEGIOS COMUNES</MenuItem>
                            </SubMenu>
                            </>
                          }
                          
                          <MenuItem onClick={Logout} className="ps-1"> 
                          { collapsed ?
                                (<ion-icon  name="log-out" size="large"/>):(<p>CERRAR SESIÓN</p>)
                              }
                          </MenuItem>
                        </Menu>
                      </Sidebar>
                    )}
                    
                    <div className="col pt-5 scrollable-content" style={{ height:'100vh' }}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Outlet />
                    </Suspense>
                    </div>
                </div>
                
            </main>
        </>
    )
}