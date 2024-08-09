import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PageNuevoCliente() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
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

    const [ arrayErrors, setArrayErrors ] = useState([])
    const [idSet, setIdSet] = useState(new Set());

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
    
    const validateContieneEspacios = ( value ) =>{
        return /^\s|\s$|\s{2,}/.test(value);
    }
    
    const validateCorreo = (value) => {
        const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexCorreo.test(value);
    }

    const removeInputValid = (value) => {
        setArrayErrors(prevArrayErrors => prevArrayErrors.filter(error => error.id !== value));
        setIdSet(prevIdSet => {
            const nuevoIdSet = new Set(prevIdSet);
            nuevoIdSet.delete(value);
            return nuevoIdSet;
        });
    }

    const validateFields = (from) => {
        
        if (from?.id_tipo_cliente === '' || from.id_tipo_cliente === 'null') {
            var messageError = ''
            var error = { msg: '', id: 0 }
            messageError = 'Campo Tipo CLiente es OBLIGATORIO'
            error.id = 1
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }

        } else if (from.id_tipo_cliente !== '0' &&  from.id_tipo_cliente !== '') {
            removeInputValid(1)
        }


        if (from?.id_clientes_hermanos === '' || from.id_clientes_hermanos === 'null') {
            var messageError = ''
            var error = { msg: '', id: 0 }
            messageError = 'Campo Tipo CLiente Hermano es OBLIGATORIO'
            error.id = 2
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }

        } else if (from?.id_clientes_hermanos !== '' || from.id_clientes_hermanos !== 'null') {
            removeInputValid(2)
        }
        
        if (from?.nombre.length <= 3 || from.nombre === '' || validateContieneEspacios(from.nombre)) {
            var messageError = ''
            var error = { msg: '', id: 0 }
            messageError = 'Campo Nombre es OBLIGATORIO, debe contener mas de 3 caracteres, No debe contener espacios vacios al inicio o al final.'
            error.id = 3
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        } else if (from.nombre.length > 3 && !validateContieneEspacios(from.nombre)) {
            console.log('NOmbre es valido');
            removeInputValid(3)
            
        }

        if (from?.descripcion.length > 100 || validateContieneEspacios(from.descripcion)) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Descripcion debe contener menos de 100 caracteres y No debe contener espacios vacios al inicio o al final.'
            error.id = 4
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        } else if (from?.descripcion.length < 100 || !validateContieneEspacios(from.descripcion)) {
            removeInputValid(4)
        }
        
        if (!validateCorreo(from.notificaciones_email)) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Noficicaciones Email debe contener un email valido.'
            error.id = 5
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        } else if (validateCorreo(from.notificaciones_email)) {
            removeInputValid(5)
        }

        if (from.rso === null || from?.rso.length <=3) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo RSO es obligatorio.'
            error.id = 6
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from.nombre_uno === null || from?.nombre_uno.length <=3) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Nombre 1 es obligatorio, debe contener mas de 3 caracteres.'
            error.id = 7
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from.telefono_uno === null || from?.telefono_uno.length !== 10) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Telefono 1 es obligatorio, debe contener 10 digitos.'
            error.id = 8
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from || from.nombre_dos !== null || from?.nombre_dos.length !== 0) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            if (from || from.nombre_uno.length <= 3) {
                messageError = 'Campo Nombre 2 debe ser valido, debe contener mas de 3 caracteres.'
                error.id = 9
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            }
        }

        if (from || from.telefono_dos !== null || from?.telefono_dos.length !== 0) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            if (from || from?.telefono_dos.length !== 10) {
                messageError = 'Campo Telefono 2 debe contener 10 digitos.'
                error.id = 10
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            }
        }

        if (from || from.telefono_mobil === null || from?.telefono_mobil.length !== 10) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Telefono Mobil es obligatorio, debe contener 10 digitos.'
            error.id = 11
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from || from.calle === null || from?.calle.length <= 3) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Calle es obligatorio.'
            error.id = 12
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from || from.entre_cale === null || from?.entre_cale.length <= 3) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Entre Calles es obligatorio.'
            error.id = 13
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from || from.colonia === null || from?.colonia.length <= 3) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Entre Calles es obligatorio.'
            error.id = 14
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from || from.codigo_postal === null || from?.codigo_postal.length < 5) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Codigo Postal es obligatorio.'
            error.id = 15
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from || from.ciudad === null || from?.ciudad.length < 3) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Ciudad es obligatorio.'
            error.id = 16
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        if (from || from.estado === null || from?.estado.length < 3) {
            var messageError = ''
        var error = { msg: '', id: 0 }
            messageError = 'Campo Ciudad es obligatorio.'
            error.id = 17
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }
        if (from || from.pais === null || from?.pais.length < 3) {
            var messageError = ''
            var error = { msg: '', id: 0 }
            messageError = 'Campo Pais es obligatorio.'
            error.id = 18
            error.msg = messageError
            if (!idSet.has(error.id)) {
                setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
            }
        }

        /* if (arrayErrors.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        } */
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

    const sendDataClienteNuevo = () =>{
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
        console.log(dataPOST);
        console.log(arrayErrors);
        
        /* 
        navigate("/clientes") */
        /* axios.post(APIURL+'/clientes',dataPOST,config).then((resp)=>{
            console.log(resp);
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
        console.log(formData);
        
    }, [formData])

    useEffect(()=>{
        console.log(arrayErrors);
        
    },[arrayErrors])

    return (
        <div className="container">
            <p className="fw-bold">CREAR CLIENTE</p>
            <div className="row">
                <div className="col-5">
                    <div className="mb-3">
                    <label>Tipo Cliente</label>
                        <Form.Select aria-label="Default select example" name="id_tipo_cliente" onChange={(e)=> {formInputChange(e); changeTipoCliente(e);}}>
                            <option value="">Seleccione una Opción</option>
                            <option value="1">Escuela</option>
                            <option value="2">Empresa</option>
                        </Form.Select>
                    </div>
                </div>
                <div className="col-3 d-flex align-items-center">
                    {formData.id_tipo_cliente === "1" && (
                        <div className="mb-3 d-grid">
                            <Form.Check className="p-0">
                                <Form.Check.Label >Es Colegio Comun</Form.Check.Label>
                                <br></br>
                                <div className="mt-2 d-flex justify-content-center align-items-center">
                                <Form.Check.Input type='checkbox' name="es_colegio_comun" value="1" checked={esColegioComun} onChange={(e)=> selectEsColegioComun(e)}/>
                                </div>
                            </Form.Check>
                        </div>
                    )}
                </div>
                <div className="col-5">
                    {formData.id_tipo_cliente === "1" && esColegioComun === true && (
                    <div className="mb-3" >
                        <label>Colegios hermanos</label>
                        <Form.Select name="id_clientes_hermanos" id="id_clientes_hermanos" onChange={(e)=> formInputChange(e)}>
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
                        <input type="text" className="form-control" name="nombre" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Descripción</label>
                        <input type="text" className="form-control" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                
                <div className="col-5">
                    <div className="mb-3">
                        <label>Notificaciones Email</label>
                        <input type="email" className="form-control" name="notificaciones_email" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>RSO</label>
                        <input type="text" className="form-control" name="rso" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Razón Social</label>
                        <input type="text" className="form-control" name="rason_social" onChange={(e)=> formInputChange(e)}/>
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
                        <input type="text" className="form-control" name="nombre_uno" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 1</label>
                        <input type="text" className="form-control" name="telefono_uno" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Nombre 2</label>
                        <input type="text" className="form-control" name="nombre_dos" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 2</label>
                        <input type="text" className="form-control" name="telefono_dos" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono Móvil</label>
                        <input type="text" className="form-control" name="telefono_mobil" onChange={(e)=> formInputChange(e)}/>
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
                        <input type="text" className="form-control" name="calle" onChange={(e)=> formInputChange(e)}/>
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Entre Calles</label>
                        <input type="text" className="form-control" name="entre_cale" onChange={(e)=> formInputChange(e)}/>
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Colonia</label>
                        <input type="text" className="form-control" name="colonia" onChange={(e)=> formInputChange(e)}/>
                    </div> 
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Codigo Postal</label>
                        <input type="text" className="form-control" name="codigo_postal" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Ciudad</label>
                        <input type="text" className="form-control" name="ciudad" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Estado</label>
                        <input type="text" className="form-control" name="estado" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Pais</label>
                        <input type="text" className="form-control" name="pais" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <div className="mb-3">
                        <button onClick={ sendDataClienteNuevo } className="btn btn-primary">GUARDAR DATOS</button>
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

export default PageNuevoCliente;