import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";



function RegistroPage(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    const formularioFamilia = (familiar = '') => {
        if(familiar === '') {
            return ''
        }
        return (
            <div className="tab-content-scroll">
                <div className="row">
                    <div className="col-12">
                        <label htmlFor="nombre" className="form-label"> Nombre </label>
                        <input type="text" className="form-control" id="nombre" name="nombre" />
                    </div>
                    <div className="col-12">
                        <label htmlFor="edad" className="form-label">Edad</label>
                        <input  type="number" className="form-control" id="edad" name="edad"/>
                    </div>
                    <div className="col-12">
                        <p className="form-label">
                            Vivie
                        </p>
                        <div className="form-switch">
                            <input 
                                className="form-check-input" 
                                id="vive" 
                                name="vive" 
                                type="checkbox" 
                                checked={true}
                                role="switch" 
                                />
                            <label className="form-check-label">{(true) ? 'Si' : 'No'}</label>
                        </div>
                        
                    </div>
                    <div className="col-12">
                        <label htmlFor="direccion" className="form-label">
                            Direccion:
                        </label>
                        <textarea
                            id="direccion"
                            name="direccion"
                            placeholder="Dirección..."
                            rows="4"
                            cols="10"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="ocupacion_actual" className="form-label">
                            Ocupacion actual:
                        </label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="ocupacion_actual" 
                                name="ocupacion_actual"
                            />
                    </div>
                    <div className="col-12">
                        <label htmlFor="empresa_trabajo" className="form-label">
                            Empresa de trabajo:
                        </label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="empresa_trabajo" 
                                name="empresa_trabajo"
                            />
                    </div>
                    <div className="col-12">
                        <label htmlFor="email" className="form-label">Correo:</label>
                        <input type="text" className="form-control"  id="email" name="email" />
                    </div>
                    <div className="col-12">
                        <p className="form-label">
                            Contacto Principal:
                        </p>
                        <div className="form-switch">
                            <input 
                                className="form-check-input" 
                                id="contecto_principal" 
                                name="contecto_principal" 
                                type="checkbox" 
                                checked={true}
                                role="switch" 
                                />
                            <label className="form-check-label">{(true) ? 'Si' : 'No'}</label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
            <div className="card form-container">
                <div className="row">
                    <div className="col-12">
                        <p className="fw-bold text-center mb-2">Registro de Estudio Socioeconomico</p>
                        <p className="fw-bold text-center mb-2">Escuela: </p>
                    </div>
                    <div className="col-12">
                        <Tabs 
                        defaultActiveKey="familia"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        >
                            <Tab eventKey="familia" title="CUENTA">
                                <div className="tab-content-scroll">
                                    <div className="row px-2">
                                        <div className="col-12 mb-3">
                                            <label htmlFor="candidato" className="form-label p-0">Nombre Familia:</label>
                                            <input key={"AES-candidato"} type="text" className="form-control form-control-sm p-0" id="candidato" name="candidato"/>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label htmlFor="situacion" className="form-label">Situacion:</label>
                                            <textarea id="situacion" name="situacion"
                                                placeholder="situacion..." rows="4" cols="50" style={{ width: '100%' }} />
                                        </div>
                                    
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="mb-3 row">
                                                    <label htmlFor="calle" className="col-sm-2 col-form-label">Calle:</label>
                                                    <div className="col-sm-10">
                                                        <input key={"AES-calle"} type="text" className="form-control" id="calle" name="calle" />
                                                    </div>
                                                </div>
                                            </div>
                    
                                            <div className="col-sm-6">
                                                <div className="mb-3 row">
                                                    <label htmlFor="numero_exterior" className="col-sm-4 col-form-label">No Exterior:</label>
                                                    <div className="col-sm-8">
                                                        <input key={"AES-numero_exterior"} type="text" className="form-control" id="numero_exterior" name="numero_exterior" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="mb-3 row">
                                                    <label htmlFor="colonia" className="col-sm-4 col-form-label">Colonia:</label>
                                                    <div className="col-sm-8">
                                                        <input key={"AES-colonia"} type="text" className="form-control" id="colonia" name="colonia"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="mb-3 row">
                                                    <label htmlFor="municipio" className="col-sm-4 col-form-label">Municipio:</label>
                                                    <div className="col-sm-8">
                                                        <input key={"AES-municipio"} type="text" className="form-control" id="municipio" name="municipio"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="mb-3 row">
                                                    <label htmlFor="estado" className="col-sm-4 col-form-label">Estado:</label>
                                                    <div className="col-sm-8">
                                                        <input key={"AES-estado"} type="text" className="form-control" id="estado" name="estado" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="mb-3 row">
                                                    <label htmlFor="codigo_postal" className="col-sm-4 col-form-label">Código Postal:</label>
                                                    <div className="col-sm-8">
                                                        <input key={"AES-codigo_postal"} type="text" className="form-control" id="codigo_postal" name="codigo_postal"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="mb-3 row">
                                                    <label htmlFor="pais" className="col-sm-4 col-form-label">País:</label>
                                                    <div className="col-sm-8">
                                                        <input key={"AES-pais"} type="text" className="form-control" id="pais" name="pais" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="contactos" title="PADRE">
                                {formularioFamilia('padre')}
                            </Tab>
                            <Tab eventKey="direccion" title="MADRE">
                                {formularioFamilia('madre')}
                            </Tab>
                        </Tabs>
                    </div>
                    <div className="col-12 text-center">
                        <button className="btn btn-info text-white fw-bold">Registrar</button>
                    </div>
                </div>
            </div>
    )
}

export default RegistroPage;
