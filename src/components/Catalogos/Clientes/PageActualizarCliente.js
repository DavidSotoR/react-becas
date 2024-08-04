import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function PageActualizarCliente() {
    const { logout } = useContext(AuthContext);
    const { ID } = useParams()
    const navigate = useNavigate();
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [ valueCliente, setValueCliente ] = useState(null)
    const [allColegiosHermanos,setAllColegiosHermanos] = useState([]);
    const [esColegioComun, setEsColegioComun] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_tipo_cliente: '',
        nombre:'',
        descripcion: '',
        notificaciones_email: '',
        id_clientes_hermanos: null,
        rso: null,
        nombre_uno: null,
        telefono_uno: null,
        nombre_dos: null,
        telefono_dos: null,
        telefono_mobil: null,
        calle: null,
        entre_cale: null,
        colonia: null,
        codigo_postal: null,
        ciudad: null,
        estado: null,
        pais: null,
        rason_social: null
    })

    const formInputChange =(e) => {
        var name = e.target.name
        var value = (e.target.value === "null") ? null : e.target.value;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

    }

    const changeTipoCliente = (e) =>{
        getAllColegiosHermanos(e.target.value);
    }

    const selectEsColegioComun = (e) => {
        setEsColegioComun(e.target.checked);
        if(!e.target.checked){

            setFormData((prevFormData) => ({
                ...prevFormData,
                id_clientes_hermanos: null
            }));
            //formData.id_tipo_cliente == 1 && esColegioComun == 1
            //formData.id_tipo_cliente == 1 && esColegioComun == 1
            /*
            setFormData(prevState => ({
                ...prevState,
                [id_clientes_hermanos]: null
            }));
            */
        }
    } 

    const validateFields = (from) => {
        var messageError = ''
        if (from.id_tipo_cliente === '') {
            messageError = 'Campo Tipo CLiente es OBLIGATORIO\n'
        }
        if (from.nombre.length <= 3 || from.nombre === '') {
            messageError += 'Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres\n'
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }
    
    const renderOptionsColegiosComunes = () =>{
        return [<option value="null">Seleccione una Opción</option>,...allColegiosHermanos.map((ch) => (
            <option key={ch.id} value={ch.id}> {ch.nombre} </option>
        ))]
    }
    
    const getAllColegiosHermanos = async (id_tipo_cliente) => {
        
        setAllColegiosHermanos([]);

        if(id_tipo_cliente !== "1"){
            return true;
        }

        try {
            const resp = await axios.get(APIURL+'/clientes/hermanos', config)
            console.log(resp.data);
            setAllColegiosHermanos(resp.data);
        } catch (resp) {
            if (resp?.response) {
                if (resp.response.status === 401) {
                    logout()
                }
            }
            console.log(resp);
        }
    }

    const sendUpdateCliente = () =>{
        //console.log(formData);
        var dataPOST = {
            "id_tipo_cliente": parseInt(formData.id_tipo_cliente,10),
            "nombre": formData.nombre,
            "descripcion": formData.descripcion,
            "notificaciones_email": formData.notificaciones_email,
            "id_clientes_hermanos": parseInt(formData.id_clientes_hermanos,10),
            "rso": formData.rso,
            "nombre_uno": formData.nombre_uno,
            "telefono_uno": formData.telefono_uno,
            "nombre_dos": formData.nombre_dos,
            "telefono_dos": formData.telefono_dos,
            "telefono_mobil": formData.telefono_mobil,
            "calle": formData.calle,
            "entre_cale": formData.entre_cale,
            "colonia": formData.colonia,
            "codigo_postal": formData.codigo_postal,
            "ciudad": formData.ciudad,
            "estado": formData.estado,
            "pais": formData.pais,
            "rason_social": formData.rason_social,
        }

        console.log(dataPOST)
        /* console.log(dataPOST);
        navigate("/clientes") */
        /* axios.post(APIURL+'/clientes',dataPOST,config).then((resp)=>{
            console.log(resp);
            //window.location.replace('http://localhost:3000/clientes')
            navigate("/clientes")
       
        }).catch((resp)=>{
            setShowAlertError(true)
            if(resp.code === "ERR_BAD_REQUEST" && resp.response.hasOwnProperty('data')){
                console.log(resp.response.data);
            }
            console.log(resp);
        }) */
        
    }

    

    useEffect(()=>{
        validateFields(formData);
    }, [formData])

    const getDataCliente = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes/'+ID, config).then(res => res)
            setValueCliente(resp.data)
            setFormData(resp.data)
            console.log(resp.data);
            
        } catch (error) {
            console.error(error);
            if (error?.response?.status === 401) {
                logout()
            }
            setValueCliente(error);
        }
    }

    useEffect(() => {
        const execFunc = async () => {
            if (valueCliente === null) {
                await getDataCliente();
            }
        };
        execFunc();
    }, [valueCliente]);

    return (
        <div className="container">
            <p className="fw-bold">ACTUALIZAR CLIENTE</p>
            <div className="row">
                <div className="col-5">
                    <div className="mb-3">
                    <label>Tipo Cliente</label>
                        <Form.Select value={formData.id_tipo_cliente} aria-label="Default select example" name="id_tipo_cliente" onChange={(e)=> {formInputChange(e); changeTipoCliente(e);}}>
                            <option value="">Seleccione una Opción</option>
                            <option value="1">Escuela</option>
                            <option value="2">Empresa</option>
                        </Form.Select>
                    </div>
                </div>
                <div className="col-3 d-flex align-items-center">
                    {formData.id_tipo_cliente === "1" && (
                    <div className="mb-3">
                    <label for="es_colegio_comun">Es colegio Comun</label><br/>
                        <input type="checkbox" id="es_colegio_comun" name="es_colegio_comun" value="1" checked={esColegioComun} onChange={(e)=> selectEsColegioComun(e)}/>
                    </div>
                    )}
                </div>
                <div className="col-5">
                    {formData.id_tipo_cliente === "1" && esColegioComun === true && (
                    <div className="mb-3" >
                        <label>Colegios hermanos</label>
                        <Form.Select value={formData.id_clientes_hermanos} name="id_clientes_hermanos" id="id_clientes_hermanos" onChange={(e)=> formInputChange(e)}>
                        {renderOptionsColegiosComunes()}
                        </Form.Select>
                    </div>
                    )}
                </div>
            </div>
            <hr></hr>
            <p className="fw-bold">DATOS DEL CLIENTE:</p>
            <div className="row">
                <div className="col-5">
                    <div className="mb-3">
                        <label>Nombre</label>
                        <input value={formData.nombre} type="text" className="form-control" name="nombre" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Descripción</label>
                        <input value={formData.descripcion} type="text" className="form-control" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                
                <div className="col-5">
                    <div className="mb-3">
                        <label>Notificaciones Email</label>
                        <input value={formData.notificaciones_email} type="email" className="form-control" name="notificaciones_email" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>RSO</label>
                        <input value={formData.rso} type="text" className="form-control" name="rso" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Razón Social</label>
                        <input value={formData.rason_social} type="text" className="form-control" name="rason_social" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>          
            </div>

            <hr></hr>

            <div className="row mb-3">
                <div className="col-12">
                    <p className="fw-bold"> CONTACTO: </p>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Nombre 1</label>
                        <input value={formData.nombre_uno} type="text" className="form-control" name="nombre_uno" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 1</label>
                        <input value={formData.telefono_uno} type="text" className="form-control" name="telefono_uno" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Nombre 2</label>
                        <input value={formData.nombre_dos} type="text" className="form-control" name="nombre_dos" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 2</label>
                        <input value={formData.telefono_dos} type="text" className="form-control" name="telefono_dos" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono Móvil</label>
                        <input value={formData.telefono_mobil} type="text" className="form-control" name="telefono_mobil" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
            </div>

            <hr></hr>
            
            <div className="row mb-3">
                <div className="col-12">
                    <p className="fw-bold"> DIRECCIÓN: </p>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Calle</label>
                        <input value={formData.calle} type="text" className="form-control" name="calle" onChange={(e)=> formInputChange(e)}/>
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Entre Calles</label>
                        <input value={formData.entre_cale} type="text" className="form-control" name="entre_cale" onChange={(e)=> formInputChange(e)}/>
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Colonia</label>
                        <input value={formData.colonia} type="text" className="form-control" name="colonia" onChange={(e)=> formInputChange(e)}/>
                    </div> 
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Codigo Postal</label>
                        <input value={formData.codigo_postal} type="text" className="form-control" name="codigo_postal" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Ciudad</label>
                        <input value={formData.ciudad} type="text" className="form-control" name="ciudad" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Estado</label>
                        <input value={formData.estado} type="text" className="form-control" name="estado" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Pais</label>
                        <input value={formData.pais} type="text" className="form-control" name="pais" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <div className="mb-3">
                        <button onClick={ sendUpdateCliente } className="btn btn-primary">GUARDAR DATOS</button>
                    </div>
                </div>
            </div>

            <Alert show={showAlert} onClose={()=>{ setShowAlert(false) }} variant="success" className="alert-flotante" dismissible>
                <Alert.Heading>Success</Alert.Heading>
                <p>
                    Se ha guardado correctamente los datos.
                </p>
            </Alert>
            <Alert show={showAlertError} onClose={()=>{ setShowAlertError(false) }} variant="danger" className="alert-flotante" dismissible>
                <Alert.Heading>Success</Alert.Heading>
                <p>
                    Ocurrio un ERROR al realizar Request.
                </p>
            </Alert>
        </div>
    )
}

export default PageActualizarCliente;