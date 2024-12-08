import { Link } from "react-router-dom";
import PathConstants from "../../routes/pathsConstants";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";


function HomePageFamilia() {
    const { logout, userID, userActive } = useContext(AuthContext);
    const [ tieneSE, setTieneSE ] = useState(false);
    const [ active, setActive ] = useState(false);
    const [ password, setPassword ] = useState('')
    const [ passwordConfirmar, setPasswordConfirmar ] = useState('')
    const [ errorMsg , setErrorMsg ] = useState('');
    const [ idSE, setIdSE ] = useState(0);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getDataEstudioSocioeconomico = () =>{
        //mandar user ID
        if (userActive === null && localStorage.getItem('ua') === 'false') {
            setActive(false)
        } else {
            var ls = localStorage.getItem('ua')
            var act
            if (ls === "true") {
                setActive(true)
                act = true
            } 
            if (ls === "false" || ls === null || ls === "null") {
                act = false
                setActive(false)
            }
        }
        
        axios.get(APIURL+'/familias/'+ userID +'/estudio/socioeconomico', config).then((resp)=>{
            console.log(resp);
            if (resp.data.id) {
                console.log('contiene datos');
                setTieneSE(true)
                setIdSE(resp.data.id)
                localStorage.setItem('se', resp.data.id)
                
            } else {
                console.log('mo contiene datps');
                setTieneSE(false)
            }
            
        }).catch((err)=>{
            console.log(err);
            
            setTieneSE(false)
            if (err.response.status === 401) {
                logout()
            }
        })
    }

    const sendActualizarPassword = () => {
        var data = {
            password: password,
            password_confirmar: passwordConfirmar,
            id: userID,
        }
        axios.put(APIURL+'/usuarios/'+ userID +'/password', data, config).then((resp)=>{
            if (resp.data.confirmado) {
                alert(resp.data.message);
                logout()
            }
        }).catch((err)=>{
            console.log(err);
            setErrorMsg( err.response.data.message )
            setTieneSE(false)
            if (err.response.status === 401) {
                logout()
            }
        })
        //usuarios/{id}/password
        
    }

    const changeData = (e) => {
        var { value, name }  = e.target
        if (name == 'password') {
            setPassword(value)
        }
        if (name == 'password_confirmar') {
            setPasswordConfirmar(value)
        }
        
    }

    useEffect(()=>{
        getDataEstudioSocioeconomico()
    },[])
    
    return (
        <div className="container mt-5 d-flex justify-content-center">
            {  active ? (
                <div className="row">
                    <div className="col-12">
                        <h5>Debe Ingresar la siguiente lista de archivos para continuar el proceso de becas.</h5>
                        <p>La papeleria solicitada es de ambos Padres o Tutor que se encuentre laborando.</p>
                    </div>
                    <div className="col-12">
                        <ol className="list-group list-group-numbered">
                            <li className="list-group-item">
                                <span className="fw-bold">INGRESOS</span> (Una de las 3 opciones) 
                                <div className="ms-2 me-auto">
                                    <ul>
                                        <li>Recibos de nomina de los ultimos 3 meses.</li>
                                        <li>Carta en Hoja membretada, firmada, con sello que contenga la informacion 
                                            detallada(Ingreso mensual, prestaciones, montos).
                                        </li>
                                        <li>Estados de cuenta bancario.</li>
                                    </ul>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <span className="fw-bold">DESEMPLEO</span> 
                                <div className="ms-2 me-auto">
                                    <ul>
                                        <li>Carta del ultimo empleo con fecha de separacion, membretada, firmada y con sello.</li>
                                    </ul>
                                </div>
                            </li>
                            <li className="list-group-item">
                            <span className="fw-bold">CASA HABITACION</span> 
                                <div className="ms-2 me-auto">
                                    <ul>
                                        <li>
                                            Si la casa es propia o hipotecada comprobante del predial o estado de cuenta
                                            donde venga el monto que pago y debe.
                                        </li>
                                        <li>
                                            Si la casa es de renta comprobante de contrato o recibo de pago mensual.
                                        </li>
                                        <li>
                                            Si la casa es prestada comrobante del predial del dueño de la propiedad.
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <span className="fw-bold">AUTOMÓVILES</span> (propios, de la empresa o prestados) comprobar con:
                                <div className="ms-2 me-auto">
                                    <ul>
                                        <li>Tarjeta de circulación</li>
                                    </ul>
                                </div>
                            </li>
                            <li className="list-group-item">
                                <span className="fw-bold">COMPROBANTES DE</span>
                                <div className="ms-2 me-auto">
                                    <ul>
                                        <li>RECIBOS DE luz, agua, gas, telefono, celulares (últimos 2 recibos)</li>
                                        <li>DEUDAS (estados de cuenta de tarjetas de crédito, crédito automotriz, crédito hipotecario,
                                            tarjetas departamentales).</li>
                                        <li>DE TODO PAGO REALIZADO seguros de GMM, vida, segubecas, de autos, préstamos bancarios, etc</li>
                                    </ul>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div className="col-12 mt-5 p-3">
                        <h5>NOTA IMPORTANTE</h5>
                        <p className="fw-bold">SE SUBEN LOS ARCHIVOS EN PDF, AL LINK PROPORCIONADOS POR EL COLEGIO,
                        NO SE ACEPTARAN DOCUMENTOS EN FOTOGRAFIAS.</p>
                        <p className="fw-bold">EN EL CASO QUE LOS DOCUMETNOS LOS SOLICITE EL COLEGIO DE MANERA FISICA,
                        ENTREGAR 1 JUEGO DE COPIAS Y TENER PARA EL MOMENTO DEL ESTUDIO LOS ORIGINALES</p>
                    </div>
                    <div className="col-12 d-flex justify-content-center pb-5">
                        { tieneSE ? (<Link className="btn btn-primary" to={`${PathConstants.FAMILIASFILES}?idse=${idSE}` }>Subir Archivos</Link>): (
                            <div className="red-dotted-border p-3">
                                <p className="fw-bold text-danger p-0 mb-2"> Familia no cuenta con un Estudio Socioeconomico activo asginado. </p>
                                <p className="fw-bold text-danger p-0 mb-2"> Contactar: info@sinergia.com </p>
                                <p className="fw-bold text-danger p-0 mb-2"> Tel.: +52 1111 1111 </p>
                            </div>
                            
                        ) }
                        
                    </div>
                </div>
            ) : (
                <div>
                    <h5 className="fw-bold">ACTUALICE SUS DATOS.</h5>
                    <p>Antes de iniciar a actualizar sus datos para la beca debe de cambiar su contraseña de su cuenta creada.</p>
                    <div className="row row-cols-1">
                        <div class="mb-3 col-12 col-md-4">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control w-40" name="password" id="password" placeholder="Contraseña" onChangeCapture={ (e) => changeData(e)}/>
                        </div>
                        <div class="mb-3 col-12 col-md-4">
                            <label for="password_confirm" class="form-label">Confirmar Contraseña</label>
                            <input type="password" class="form-control w-40" name="password_confirmar" id="password_confirm" placeholder="Confirmar Contraseña" onChangeCapture={ (e) => changeData(e)}/>
                        </div>
                        { errorMsg !== '' &&
                            <div className="col-12">
                                <p className="text-danger fw-medium">{errorMsg}</p>
                            </div>
                            
                        }
                        <div className="col-12">
                        <button className="btn btn-primary" onClick={()=>sendActualizarPassword()}>Actualizar Contraseña</button>
                        </div>
                        
                    </div>
                </div>
            )
                
            }
            
        </div>
    )
}


export default HomePageFamilia;