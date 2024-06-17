import { Link, Outlet } from "react-router-dom"
import { Suspense, useContext } from "react"
import Navbar from "../NavBar/NavBar"
import { AuthContext } from "../../context/AuthContext";
import PathConstants from "../../routes/pathsConstants";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";

export default function Layout() {
    const { isLoggedIn, userSession,roleSession, logout } = useContext(AuthContext);
    const Logout = () => {
        localStorage.clear()
        window.location.replace('/')
      }
    return (
        <>
            {/* <Navbar /> */}
            <main>
                <div className="row m-0">
                    {isLoggedIn && (
                        <Sidebar rootStyles={{
                              backgroundColor: '#47D1D6',
                          }}>
                        <Menu
                            rootStyles={{ backgroundColor: "#47D1D6"}}
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
                            <img src='/img/logo_principal_blanco.png' style={{ width:'200px' }} alt="Descripción de la imagen" />
                            </div>
                          
                          <MenuItem component={<Link to={PathConstants.HOME} />}> INICIO</MenuItem>
                            <SubMenu label="CATALOGOS">
                                <MenuItem component={<Link to={PathConstants.USUARIOS} />}> USUARIOS</MenuItem>
                                <MenuItem component={<Link to={PathConstants.PERFILES} />}> PERFILES</MenuItem>
                            </SubMenu>
                          <MenuItem onClick={Logout}> Logout</MenuItem>
                        </Menu>
                      </Sidebar>
                    )}
                    
                    <div className="col scrollable-content">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Outlet />
                    </Suspense>
                    </div>
                </div>
                
            </main>
        </>
    )
}