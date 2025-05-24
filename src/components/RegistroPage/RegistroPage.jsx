import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useParams } from "react-router-dom";
import axios from "axios";


const telefonoRegex = /^(?:\d{10})?$/;
const textoRegex = /^(?!.* {2})[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;
const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function RegistroPage(){
    const APIURL = process.env.REACT_APP_API_URL_REGISTRO;
    const APIURLEXTERNO = process.env.REACT_APP_API_URL_REGISTRO;
    const CONFIG = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const { token } = useParams()

    const { logout, execShowAlert } = useContext(AuthContext);

    const [dataCliente , setDataCliente] = useState(null)

    const [showSpinner , setShowSpinner] = useState(true)

    const [ errorLink, setErrorLink ] = useState(false)

    const [ registroCompleto, setRegistroCompleto ] = useState(false)

    const [ validToken, setValidToken ] = useState(false)

    const [dataRegistroCuenta, setDataRegistroCuenta] = useState({
        clave_familia: '',
        id_servicio_estado: 0,
        id_proyecto: 0,
        id_cliente:0,
        id_orden_servicio:0,
        matricula: '',
        candidato:'',
        situacion:'',
        email:'',
        telefono_movil:'',
        telefono_contacto:'',
        calle:'',
        numero_exterior:'',
        colonia:'',
        municipio:'',
        estado:'',
        codigo_postal:'',
        pais:'',
        direccion:'',
        padre:{
            id_familias_padres_tipo:'1',
            nombre:'',
            edad:'',
            vive:true,
            direccion:'',
            ocupacion_actual:'',
            empresa_trabajo:'',
            email:'',
            telefono_casa:'',
            contecto_principal:false,
        },
        madre:{
            id_familias_padres_tipo:'2',
            nombre:'',
            edad:'',
            vive:true,
            direccion:'',
            ocupacion_actual:'',
            empresa_trabajo:'',
            email:'',
            telefono_casa:'',
            contecto_principal:false,
        }
    })

    const validateTelefono = (data) => {
        return telefonoRegex.test(data);
    }

    const validateTexto = (data) => {
        return textoRegex.test(data);
    }

    const validateCorreo = (data) => {
        return correoRegex.test(data);
    }

    const formularioFamilia = (familiar = '') => {
        if(familiar === '') {
            return ''
        }
        return (
            <div className="tab-content-scroll">
                <div className="row px-2">
                    <div className="col-12 mb-3">
                        <label htmlFor="nombre" className="form-label"> Nombre </label>
                        <input type="text" className="form-control-sm form-control" 
                        id="nombre" name="nombre" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}/>
                    </div>
                    <div className="col-6 mb-3">
                        <label htmlFor="edad" className="form-label">Edad</label>
                        <input  type="number" className="form-control-sm form-control" 
                        id="edad" name="edad" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}/>
                    </div>
                    <div className="col-6 mb-3">
                        <p className="form-label">
                            Vivie
                        </p>
                        <div className="form-switch">
                            <input className="form-check-input" id="vive" 
                                name="vive" type="checkbox" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}
                                checked={dataRegistroCuenta[familiar].vive} role="switch" />
                            <label className="form-check-label">{(dataRegistroCuenta[familiar].vive) ? 'Si' : 'No'}</label>
                        </div>
                        
                    </div>
                    <div className="col-12 mb-2">
                        <label htmlFor="direccion" className="form-label">
                            Direccion:
                        </label>
                        <textarea
                            id="direccion"
                            name="direccion"
                            placeholder="Dirección..."
                            rows="2"
                            cols="50" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div className="col-12 mb-2">
                        <label htmlFor="ocupacion_actual" className="form-label">
                            Ocupacion actual:
                        </label>
                        <input 
                            type="text" 
                            className="form-control-sm form-control" 
                            id="ocupacion_actual" 
                            name="ocupacion_actual" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}
                        />
                    </div>
                    <div className="col-12 mb-2">
                        <label htmlFor="empresa_trabajo" className="form-label">
                            Empresa de trabajo:
                        </label>
                            <input 
                                type="text" 
                                className="form-control-sm form-control" 
                                id="empresa_trabajo" 
                                name="empresa_trabajo" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}
                            />
                    </div>
                    <div className="col-12 mb-2">
                        <label htmlFor="email" className="form-label">Correo:</label>
                        <input type="text" className="form-control-sm form-control"  
                        id="email" name="email" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}/>
                    </div>
                    <div className="col-6 mb-2">
                        <label htmlFor="telefono" className="form-label">Correo:</label>
                        <input type="text" className="form-control-sm form-control"  
                        id="telefono_casa" name="telefono_casa" onChange={(e) => {formInputChangeFamiliar(e, familiar)}}/>
                    </div>
                    <div className="col-6 mb-2">
                        <p className="form-label">
                            Contacto Principal:
                        </p>
                        <div className="form-switch">
                            <input 
                                className="form-check-input" 
                                id="contecto_principal" 
                                name="contecto_principal" 
                                type="checkbox" 
                                checked={dataRegistroCuenta[familiar].contecto_principal} onChange={(e) => {formInputChangeFamiliar(e, familiar)}}
                                role="switch" 
                                />
                            <label className="form-check-label">{(dataRegistroCuenta[familiar].contecto_principal) ? 'Si' : 'No'}</label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }

    const changeInputValue = (e) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        var {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : convertirAMayusculas(value);
        
        setDataRegistroCuenta(prevState => ({
            ...prevState,
            [name]: updatedValue
        }));

        if(type !== 'checkbox' && type !== 'number'){
            setTimeout(() => {
                e.target.setSelectionRange(start, end);
            }, 0);
        }
        
    }

    const casosEspeciales = (e,familiar='') => {
        
        var {name, value, type, checked } = e.target;
        let updatedValue = type === 'checkbox' ? checked : name === 'email' ? value :  convertirAMayusculas(value);

        if(name==='contecto_principal'){
            if(familiar==='padre'){
                if(updatedValue===true){
                    setDataRegistroCuenta(prevState => ({
                        ...prevState,
                        ['madre']:{
                            ...prevState['madre'],
                            ['contecto_principal']: false
                        }
                    }));
                }
            }
            if(familiar==='madre'){
                if(updatedValue===true){
                    setDataRegistroCuenta(prevState => ({
                        ...prevState,
                        ['padre']:{
                            ...prevState['padre'],
                            ['contecto_principal']: false
                        }
                    }));
                }
            }
        }

        
        console.log(updatedValue+' '+familiar);
    }

    const formInputChangeFamiliar = (e,familiar='') => {
        if(familiar ===''){
            return false;
        }
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        
        casosEspeciales(e,familiar);

        var {name, value, type, checked } = e.target;
        let updatedValue = type === 'checkbox' ? checked : name === 'email' ? value :  convertirAMayusculas(value);
        
        setDataRegistroCuenta(prevState => ({
            ...prevState,
            [familiar]:{
                ...prevState[familiar],
                [name]: updatedValue
            }
        }));


        if(type !== 'checkbox' && type !== 'number'){
            setTimeout(() => {
                e.target.setSelectionRange(start, end);
            }, 0);
        }
    }

    const sendDataRegistro = () => {

        var dataPost = dataRegistroCuenta;

        dataPost.id_cliente = dataCliente.cliente.id
        dataPost.id_proyecto = dataCliente.proyecto.id
        dataPost.id_orden_servicio = dataCliente.orden_servicio.id
        
        postDataRegistro(dataPost);
        console.log(dataPost);
    }

    const getDataCliente = async () => {
        axios.get('http://localhost:8000/api/registro/escuela/'+ token).then(resp=>{
            console.log(resp);
            var respData = resp.data
            if (respData.cliente !== null && respData.proyecto !== null && respData.orden_servicio !== null) {
                setDataCliente(resp.data)
                setShowSpinner(false)
            } else {
                console.log('NO ESTA FUNCIONANDO');
                setErrorLink(true)
            }
            
        })
        //console.log(dataCliente);
    }

    const postDataRegistro = (dataPost) => {
        axios.post('http://localhost:8000/api/registro/escuela/'+ token, dataPost).then(resp => {
            console.log(resp);
            execShowAlert({ type: 'success', title: 'COMPLETADO', message: 'SE REGISTRO CORRECTAMENTE FAMILIA.' })
            setRegistroCompleto(true);
        }).catch(error => {
            console.log(error);
            var err = error.response.data
            if (err.error) {
                console.log(err.errores);
                execShowAlert({ type: 'danger', title: 'ERROR AL REGISTRAR USUARIO', message: 'DATOS NO VALIDOS. REVISAR LOS DATOS INGRESADOS.' })
            }
            
        })
    }

    useEffect(()=>{
        if (token) {
            console.log(token);
            getDataCliente()
            
        }
        //getDataCliente()
    },[])


    return (
            <div className="card p-2 pt-4" /* className="card form-container" */>
                <div className={ showSpinner ? 'd-flex align-items-center justify-content-center' : 'd-none' } style={{height: '50vh'}}>
                    <div className={errorLink ? 'd-none' : 'd-block'}>
                        <h3 className="fw-bold text-center mb-2">Cargando formulario de registro</h3>
                        
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <div className={errorLink ? 'd-block p-3' : 'd-none'}>
                        <h3 className="fw-bold text-center mb-4 text-danger">ERROR EN LINK DE REGISTRO</h3>
                        <p className="fw-bold text-center mb-1">No se logro validar el link de registro generado por su proveedor. 
                            Debe contactar con su escuela/empresa para mas información.</p>
                        {/* <p className="fw-bold text-center">Debe contactar con su escuela/empresa para mas información.</p> */}
                    </div>
                    
                </div>
                <div className={showSpinner ? 'd-none' : 'row'} >
                    <div className="col-12">
                        <p className="fw-bold text-center mb-2">Registro de Estudio Socioeconomico</p>
                        <p className="fw-bold text-center mb-2">Escuela: { dataCliente ? dataCliente.cliente.nombre : 'SIN DATO' }</p>
                    </div>
                    <div className={ !registroCompleto ? "col-12" : "d-none" }>
                        <Tabs 
                        defaultActiveKey="familia"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        >
                            <Tab eventKey="familia" title="CUENTA">
                                <div className="tab-content-scroll">
                                    <div className="row px-2">
                                        <div className="col-12 mb-3">
                                            <label htmlFor="clave_familia" className="form-label mb-1"> CLAVE: </label>
                                            <input type="text" className="form-control-sm form-control" 
                                            id="clave_familia" name="clave_familia" onChange={(e) => {changeInputValue(e)}}/>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label htmlFor="candidato" className="form-label p-0 mb-1">Nombre Familia:</label>
                                            <input key={"AES-candidato"} value={dataRegistroCuenta.candidato} type="text" onChange={(e) => {changeInputValue(e)}}
                                            className="form-control-sm form-control form-control-sm p-0" id="candidato" name="candidato"/>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label htmlFor="situacion" className="form-label mb-1">Situacion:</label>
                                            <textarea id="situacion" name="situacion" onChange={(e) => {changeInputValue(e)}}
                                                placeholder="situacion..." rows="2" cols="50" style={{ width: '100%' }}/>
                                        </div>
                                    
                                        <div className="row">
                                            <div className="col-6 col-md-5">
                                                <div className="mb-3">
                                                    <label htmlFor="calle" className="form-label mb-1">Calle:</label>
                                                    <input key={"AES-calle"} type="text" onChange={(e) => {changeInputValue(e)}} 
                                                    className="form-control-sm form-control" id="calle" name="calle" />
                                                </div>
                                            </div>
                    
                                            <div className="col-6 col-md-3">
                                                <div className="mb-3">
                                                    <label htmlFor="numero_exterior" className="form-label mb-1">No Exterior:</label>
                                                    <input key={"AES-numero_exterior"} type="text" onChange={(e) => {changeInputValue(e)}}
                                                    className="form-control-sm form-control" id="numero_exterior" name="numero_exterior" />
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-3">
                                                <div className="mb-3 ">
                                                    <label htmlFor="codigo_postal" className="form-label mb-1">Código Postal:</label>
                                                    <input key={"AES-codigo_postal"} type="text" onChange={(e) => {changeInputValue(e)}} 
                                                    className="form-control-sm form-control" id="codigo_postal" name="codigo_postal"/>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-5">
                                                <div className="mb-3">
                                                    <label htmlFor="colonia" className="form-label mb-1">Colonia:</label>
                                                    <input key={"AES-colonia"} type="text" onChange={(e) => {changeInputValue(e)}} 
                                                    className="form-control-sm form-control" id="colonia" name="colonia"/>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-5">
                                                <div className="mb-3">
                                                    <label htmlFor="municipio" className="form-label mb-1">Municipio:</label>
                                                    <input key={"AES-municipio"} type="text" onChange={(e) => {changeInputValue(e)}} 
                                                    className="form-control-sm form-control" id="municipio" name="municipio"/>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-5">
                                                <div className="mb-3 ">
                                                    <label htmlFor="estado" className="form-label mb-1">Estado:</label>
                                                    <input key={"AES-estado"} type="text" onChange={(e) => {changeInputValue(e)}} 
                                                    className="form-control-sm form-control" id="estado" name="estado" />
                                                </div>
                                            </div>
                                            
                                            <div className="col-6 col-md-5">
                                                <div className="mb-3 ">
                                                    <label htmlFor="pais" className="form-label mb-1">País:</label>
                                                    <input key={"AES-pais"} type="text" onChange={(e) => {changeInputValue(e)}} 
                                                    className="form-control-sm form-control" id="pais" name="pais" />
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
                    <div className={ !registroCompleto ? "col-12 text-center my-2" : "d-none" }>
                        <button className="btn btn-info text-white fw-bold" onClick={()=> { sendDataRegistro() }}>Registrar</button>
                    </div>
                    <div className={ registroCompleto ? "col-12" : "d-none" } style={{ height: '40vh' }}>
                        <div className="d-block justify-content-center ">
                            <h3 className="fw-bold text-success text-center my-2">REGISTRO COMPLETADO</h3>
                            <p className="fw-bold text-center my-2">Se completo registro de familia. Revisar correo para validar e ingresar a su cuenta en el sistema.</p>
                            <div className="d-flex justify-content-center align-items-center">
                                <i style={{ fontSize: '8rem' }} className="bi bi-check-circle-fill text-success " ></i>
                            </div>
                            <div className="d-flex justify-content-center">
                                <p className="fw-bold">Ir a Inicio de Sesión: <a href="http://localhost:3000/login">INICIAR</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default RegistroPage;
