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
    const [ inputSeleccionado, setInputSeleccionado ] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_tipo_cliente: '',
        nombre:'',
        descripcion: '',
        notificaciones_email: '',
        id_clientes_hermanos: null,
        rso: '',
        nombre_uno: '',
        telefono_uno: '',
        nombre_dos: '',
        telefono_dos: '',
        telefono_mobil: '',
        calle: '',
        entre_cale: '',
        colonia: '',
        codigo_postal: '',
        ciudad: '',
        estado: '',
        pais: '',
        rason_social: ''
    })

    const [ formDataOld, setFormDataOld ] = useState({})
    const [ initComp, setInitComp ] = useState(false)

    const [ arrayErrors, setArrayErrors ] = useState([])
    const [idSet, setIdSet] = useState(new Set());

    const formInputChange =(e) => {
        var name = e.target.name
        setInputSeleccionado(name)
        var value = (e.target.value === "null") ? null : e.target.value;

        if (name === 'tipo_persona') {
            return 0;
        }
        if (name === 'requiere_facturar') {
            return 0;
        }
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

    const contieneErrorInput = (id) => {
        return arrayErrors.some(error => error.id === id);
    }

    const obtenerErrorMensaje = (id) => {
        var objError = arrayErrors.find(error => error.id === id);
        return objError.msg
    }

    const removeInputValid = (value) => {
        setArrayErrors(prevArrayErrors => prevArrayErrors.filter(error => error.id !== value));
        setIdSet(prevIdSet => {
            const nuevoIdSet = new Set(prevIdSet);
            nuevoIdSet.delete(value);
            return nuevoIdSet;
        });
    }
    
    const validarValoresBtn = (form) =>{
        return Object.values(form).every(valor => valor !== '' && valor !== null);
    }

    const validateFields = (from) => {
        if (inputSeleccionado !== '' && inputSeleccionado === 'id_tipo_cliente') {
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
        }
        
        if (inputSeleccionado !== '' && inputSeleccionado === 'id_clientes_hermanos') {
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
        }
        
        if (inputSeleccionado !== '' && inputSeleccionado === 'nombre') {
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
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'descripcion') {
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
        }
        
        if (inputSeleccionado !== '' && inputSeleccionado === 'notificaciones_email') {
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
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'rso') {
            if (from?.rso.length <=3 || validateContieneEspacios(from.rso)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo RSO es obligatorio.'
                error.id = 6
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from?.rso.length >= 3 && !validateContieneEspacios(from.rso)) {
                removeInputValid(6)
            }   
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'rason_social') {
            if (from?.rason_social.length <=3 || validateContieneEspacios(from.rason_social)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Razón Social es obligatorio.'
                error.id = 7
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from?.rason_social.length >= 3 && !validateContieneEspacios(from.rason_social)) {
                removeInputValid(7)
            }   
        }
        
        if (inputSeleccionado !== '' && inputSeleccionado === 'nombre_uno') {
            if (from.nombre_uno === null || from?.nombre_uno.length <= 3 || validateContieneEspacios(from.nombre_uno)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Nombre 1 es obligatorio, debe contener mas de 3 caracteres.'
                error.id = 8
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.nombre_uno && from.nombre_uno.length >= 3 && !validateContieneEspacios(from.nombre_uno)) {
                removeInputValid(8)
            }            
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'telefono_uno') {
            if (from.telefono_uno === null || from.telefono_uno.length !== 10) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Telefono 1 es obligatorio, debe contener 10 digitos.'
                error.id = 9
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.telefono_uno && from.telefono_uno.length === 10 && !validateContieneEspacios(from.telefono_uno)) {
                removeInputValid(9)
            }            
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'nombre_dos') {
            //if (from || from.nombre_dos !== null || from?.nombre_dos.length !== 0) {
                if (from.nombre_dos === null || from.nombre_dos.length <= 3 || validateContieneEspacios(from.nombre_dos)) {
                    var messageError = ''
                    var error = { msg: '', id: 0 }
                    messageError = 'Campo Nombre 2 debe ser valido, debe contener mas de 3 caracteres.'
                    error.id = 10
                    error.msg = messageError
                    if (!idSet.has(error.id)) {
                        setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                        setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                    }
                } if (from.nombre_dos && from?.nombre_dos.length > 0 && !validateContieneEspacios(from.nombre_dos)) {
                    removeInputValid(10)
                }   
            /* } else if (from.nombre_dos && from?.nombre_dos.length > 0) {
                removeInputValid(10)
            }  */  
        }  

        if (inputSeleccionado !== '' && inputSeleccionado === 'telefono_dos') {
            //if (from || from.telefono_dos !== null || from?.telefono_dos.length !== 0) {
                if (from?.telefono_dos.length !== 10 && validateContieneEspacios(from.telefono_dos)) {
                    var messageError = ''
                    var error = { msg: '', id: 0 }
                    messageError = 'Campo Telefono 2 debe contener 10 digitos.'
                    error.id = 11
                    error.msg = messageError
                    if (!idSet.has(error.id)) {
                        setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                        setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                    }
                } else if (from.telefono_dos && from?.telefono_dos.length === 10 && !validateContieneEspacios(from.telefono_dos)) {
                    removeInputValid(11)
                } 
            /* } else if (from.telefono_dos && from?.telefono_dos.length === 10) {
                removeInputValid(11)
            }  */  
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'telefono_mobil') {
            if (from.telefono_mobil === null || from?.telefono_mobil.length !== 10 || validateContieneEspacios(from.telefono_mobil)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Telefono Mobil es obligatorio, debe contener 10 digitos.'
                error.id = 12
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.telefono_mobil && from?.telefono_mobil.length === 10 && !validateContieneEspacios(from.telefono_mobil)) {
                removeInputValid(12)
            }
        }        

        if (inputSeleccionado !== '' && inputSeleccionado === 'calle') {
            if (from.calle === null || from?.calle.length <= 3 || validateContieneEspacios(from.calle)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Calle es obligatorio.'
                error.id = 13
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.calle && from?.calle.length >= 3 && !validateContieneEspacios(from.calle)) {
                removeInputValid(13)
            }
        }        

        if (inputSeleccionado !== '' && inputSeleccionado === 'entre_cale') {
            if (from.entre_cale === null || from?.entre_cale.length <= 3 || validateContieneEspacios(from.entre_cale)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Entre Calles es obligatorio.'
                error.id = 14
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.entre_cale && from?.entre_cale.length >= 3 && !validateContieneEspacios(from.entre_cale)) {
                removeInputValid(14)
            }
        }        

        if (inputSeleccionado !== '' && inputSeleccionado === 'colonia') {
            if (from.colonia === null || from?.colonia.length <= 3 || validateContieneEspacios(from.colonia)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Entre Calles es obligatorio.'
                error.id = 15
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.colonia && from?.colonia.length >= 3 && !validateContieneEspacios(from.colonia)) {
                removeInputValid(15)
            }    
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'codigo_postal') {
            if (from.codigo_postal === null || from?.codigo_postal.length < 5 || validateContieneEspacios(from.codigo_postal)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Codigo Postal es obligatorio.'
                error.id = 16
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.codigo_postal && from?.codigo_postal.length > 5 && !validateContieneEspacios(from.codigo_postal)) {
                removeInputValid(16)
            }
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'ciudad') {
            if (from.ciudad === null || from?.ciudad.length < 3 || validateContieneEspacios(from.ciudad)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Ciudad es obligatorio.'
                error.id = 17
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.ciudad && from?.ciudad.length > 3 && !validateContieneEspacios(from.ciudad)) {
                removeInputValid(17)
            }   
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'estado') {
            if (from.estado === null || from?.estado.length < 3 || validateContieneEspacios(from.estado)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Ciudad es obligatorio.'
                error.id = 18
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.estado && from?.estado.length > 3 && !validateContieneEspacios(from.estado)) {
                removeInputValid(18)
            }
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'pais') {
            if (from.pais === null || from?.pais.length < 3 || validateContieneEspacios(from.pais)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Pais es obligatorio.'
                error.id = 19
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (from.pais && from?.pais.length > 3 && !validateContieneEspacios(from.pais)) {
                removeInputValid(19)
            }   
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

    const getDataCliente = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes/'+ID, config).then(res => res)
            setValueCliente(resp.data)
            setFormData(resp.data)
            setFormDataOld(resp.data)
            console.log(resp.data);
            
        } catch (error) {
            console.error(error);
            if (error?.response?.status === 401) {
                logout()
            }
            setValueCliente(error);
        }
    }

    useEffect(()=>{
        validateFields(formData);
        
    }, [formData])

    useEffect(()=>{
        if (arrayErrors.length === 0 && validarValoresBtn(formData)) {
            
            setFormValid(false)
        } else {
            setFormValid(true)
        }
        
    },[arrayErrors])

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
                        { contieneErrorInput(3) && <span className="error-msg"> {obtenerErrorMensaje(3)} </span> }
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Descripción</label>
                        <input value={formData.descripcion} type="text" className="form-control" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(4) && <span className="error-msg"> {obtenerErrorMensaje(4)} </span> }
                    </div>
                </div>
                
                <div className="col-5">
                    <div className="mb-3">
                        <label>Notificaciones Email</label>
                        <input value={formData.notificaciones_email} type="email" className="form-control" name="notificaciones_email" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(5) && <span className="error-msg"> {obtenerErrorMensaje(5)} </span> }
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>RSO</label>
                        <input value={formData.rso} type="text" className="form-control" name="rso" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(6) && <span className="error-msg"> {obtenerErrorMensaje(6)} </span> }
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Razón Social</label>
                        <input value={formData.rason_social} type="text" className="form-control" name="rason_social" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(7) && <span className="error-msg"> {obtenerErrorMensaje(7)} </span> }
                    </div>
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-2 pt-3">
                            <Form.Check type="radio" id="persona_fisica" name="tipo_persona" label="Persona Fisica" value="fisica" onChange={(e)=> formInputChange(e)}/>
                            <Form.Check type="radio" id="persona_moral" name="tipo_persona" label="Persona Moral" value="moral" onChange={(e)=> formInputChange(e)}/>
                        </div>
                        <div className="col-5">
                            <label className="fw-bold">RFC</label>
                            <input type="text" className="form-control form-control-sm" name="rfc" onChange={(e)=> formInputChange(e)}/>
                        </div>
                        <div className="col" style={{ paddingTop: "2rem" }}>
                            <Form.Check type="switch">
                                <Form.Check.Input name="requiere_facturar" onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Requiere facturar </span></Form.Check.Label>
                            </Form.Check>
                        </div>
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
                        { contieneErrorInput(8) && <span className="error-msg"> {obtenerErrorMensaje(8)} </span> }
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 1</label>
                        <input value={formData.telefono_uno} type="text" className="form-control" name="telefono_uno" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(9) && <span className="error-msg"> {obtenerErrorMensaje(9)} </span> }
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Nombre 2</label>
                        <input value={formData.nombre_dos} type="text" className="form-control" name="nombre_dos" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(10) && <span className="error-msg"> {obtenerErrorMensaje(10)} </span> }
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 2</label>
                        <input value={formData.telefono_dos} type="text" className="form-control" name="telefono_dos" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(11) && <span className="error-msg"> {obtenerErrorMensaje(11)} </span> }
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono Móvil</label>
                        <input value={formData.telefono_mobil} type="text" className="form-control" name="telefono_mobil" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(12) && <span className="error-msg"> {obtenerErrorMensaje(12)} </span> }
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
                        { contieneErrorInput(13) && <span className="error-msg"> {obtenerErrorMensaje(13)} </span> }
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Entre Calles</label>
                        <input value={formData.entre_cale} type="text" className="form-control" name="entre_cale" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(14) && <span className="error-msg"> {obtenerErrorMensaje(14)} </span> }
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Colonia</label>
                        <input value={formData.colonia} type="text" className="form-control" name="colonia" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(15) && <span className="error-msg"> {obtenerErrorMensaje(15)} </span> }
                    </div> 
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Codigo Postal</label>
                        <input value={formData.codigo_postal} type="text" className="form-control" name="codigo_postal" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(16) && <span className="error-msg"> {obtenerErrorMensaje(16)} </span> }
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Ciudad</label>
                        <input value={formData.ciudad} type="text" className="form-control" name="ciudad" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(17) && <span className="error-msg"> {obtenerErrorMensaje(17)} </span> }
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Estado</label>
                        <input value={formData.estado} type="text" className="form-control" name="estado" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(18) && <span className="error-msg"> {obtenerErrorMensaje(18)} </span> }
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Pais</label>
                        <input value={formData.pais} type="text" className="form-control" name="pais" onChange={(e)=> formInputChange(e)}/>
                        { contieneErrorInput(19) && <span className="error-msg"> {obtenerErrorMensaje(19)} </span> }
                    </div>
                </div>
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <div className="mb-3">
                        <button disabled={ formValid } onClick={ sendUpdateCliente } className="btn btn-primary">GUARDAR DATOS</button>
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