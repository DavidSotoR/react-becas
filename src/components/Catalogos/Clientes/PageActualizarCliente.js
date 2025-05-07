import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import PathConstants from "../../../routes/pathsConstants";
import ReactQuill from 'react-quill';

function PageActualizarCliente() {
    const urlIMG = "http://127.0.0.1:8000/storage/";

    const [preview, setPreview] = useState(null);
    const [fileLogo, setFileLogo] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileLogo(file)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const [content, setContent] = useState('');
    const handleChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            terminos: value,
        }));
        setContent(value);        
    };
    const modules = {
        toolbar: [
          [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'color': [] }, { 'background': [] }], // Cambios de color
          [{ 'align': [] }],
          ['link', 'image', 'video'], // Opciones para insertar multimedia
          ['clean'] // Botón para limpiar formato
        ],
      };
    const { logout, execShowAlert } = useContext(AuthContext);
    const { ID } = useParams()
    const navigate = useNavigate();
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }
    const [ valueCliente, setValueCliente ] = useState(null)
    const [allColegiosHermanos,setAllColegiosHermanos] = useState([]);
    const [esColegioComun, setEsColegioComun] = useState(false)
    const [ inputSeleccionado, setInputSeleccionado ] = useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);
    const [formValid, setFormValid] = useState(true)
    const [tipoPersona, setTipoPersona] = useState('')
    const [ errorLink, setErrorLink ] = useState(null)

    const [ linkRegistro, setLinkRegistro ] = useState(null)

    const [ allOptionsSelectEncuestas, setAllOptionsSelectEncuestas ] = useState([])

    const [formData, setFormData] = useState({
        id_tipo_cliente: '',
        nombre: '',
        descripcion: '',
        notificaciones_email: '',
        id_clientes_hermanos: '',
        id_catalogo_encuesta: '',
        documentacion_digital: false,
        requiere_facturar: false,
        habilitar_resumen: false,
        habilitar_logo: false,
        habilitar_alta_familias: false,
        ubicacion_logo: '',
        rso: '',
        nombre_uno: '',
        telefono_uno: '',
        tipo_persona: '',
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
        rason_social: '',
        rfc: '',
        terminos: ''
    })

    const [ formDataOld, setFormDataOld ] = useState({})
    const [ initComp, setInitComp ] = useState(false)

    const [ arrayErrors, setArrayErrors ] = useState([])
    const [idSet, setIdSet] = useState(new Set());

    const formInputChange =(e) => {
        var name = e.target.name
        setInputSeleccionado(name)
        var value = e.target.value //(e.target.value === "null") ? null : e.target.value;

        if (name === 'id_tipo_cliente' && value === '1') {
            getAllColegiosHermanos()
        }

        if (name === 'id_tipo_cliente' && value === '2') {
            setEsColegioComun(false)
            //return 0;
        }

        if (name === 'tipo_persona') {
            setTipoPersona(value)
            return 0;
        }
        if (name === 'requiere_facturar') {
            var newValue = !formData.requiere_facturar
            setFormData(prevState => ({
                ...prevState,
                [name]: newValue
            }));
            return 0;
        }
        if (name === 'documentacion_digital') {            
            var newValue = !formData.documentacion_digital
            setFormData(prevState => ({
                ...prevState,
                [name]: newValue
            }));
            return 0;
        }
        if (name === 'habilitar_resumen') {            
            var newValue = !formData.habilitar_resumen
            setFormData(prevState => ({
                ...prevState,
                [name]: newValue
            }));
            return 0;
        }

        if (name === 'habilitar_alta_familias') {       
            
            var newValue = !formData.habilitar_alta_familias
            
            if (newValue === true) {
                console.log('Generar link');
                generarLinkRegistro(formData)
            }

            setFormData(prevState => ({
                ...prevState,
                [name]: newValue
            }));
            return 0;
        }

        if (name === 'habilitar_logo') {            
            var newValue = !formData.habilitar_logo
            setFormData(prevState => ({
                ...prevState,
                [name]: newValue
            }));
            return 0;
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        //validarValoresBtn()

    }

    const changeTipoCliente = (e) =>{
        getAllColegiosHermanos(e.target.value);
    }

    const setValoresDeCliente = (data) =>{
        var actualData = formData
        actualData.id_tipo_cliente = data.id_tipo_cliente ?? ''
        actualData.nombre = data.nombre ?? ''
        actualData.descripcion =  data.descripcion ?? ''
        actualData.notificaciones_email =  data.notificaciones_email ?? ''
        actualData.id_clientes_hermanos =  data.id_clientes_hermanos ?? ''
        actualData.id_catalogo_encuesta =  data.id_catalogo_encuesta ?? ''
        actualData.documentacion_digital = data.documentacion_digital === 1 ? true : false
        actualData.requiere_facturar = data.requiere_facturar === 1 ? true : false
        actualData.habilitar_resumen = data.habilitar_resumen === 1 ? true : false
        actualData.rso =  data.rso ?? ''
        actualData.nombre_uno =  data.nombre_uno ?? ''
        actualData.telefono_uno =  data.telefono_uno ?? ''
        actualData.nombre_dos =  data.nombre_dos ?? ''
        actualData.telefono_dos =  data.telefono_dos ?? ''
        actualData.telefono_mobil =  data.telefono_mobil ?? ''
        actualData.calle =  data.calle ?? ''
        actualData.entre_cale =  data.entre_cale ?? ''
        actualData.colonia =  data.colonia ?? ''
        actualData.codigo_postal =  data.codigo_postal ?? ''
        actualData.ciudad =  data.ciudad ?? ''
        actualData.estado =  data.estado ?? ''
        actualData.pais =  data.pais ?? ''
        actualData.rason_social =  data.rason_social ?? ''
        actualData.rfc = data.rfc ?? ''
        actualData.tipo_persona = data.tipo_persona ?? ''
        actualData.ubicacion_logo = data.ubicacion_logo
        actualData.terminos = data.terminos
        actualData.habilitar_resumen = data.habilitar_resumen === 1 ? true : false
        actualData.habilitar_alta_familias = data.habilitar_alta_familias === 1 ? true : false
        actualData.habilitar_logo = data.habilitar_logo === 1 ? true : false
        setContent(data.terminos)
        setFormData(actualData)
        setFormDataOld(actualData)
        setTipoPersona(actualData.tipo_persona)
        if (actualData.id_clientes_hermanos && actualData.id_clientes_hermanos !== '0' && actualData.id_clientes_hermanos !== '') {
            setEsColegioComun(true)
        }
    }

    const selectEsColegioComun = (e) => {
        setEsColegioComun(e.target.checked);
        if(!e.target.checked){

            setFormData((prevFormData) => ({
                ...prevFormData,
                id_clientes_hermanos: null
            }));
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

    const isValidValue = (valor) => {
        return valor !== '' && valor !== null && valor !== '0' && valor !== 'null';
    };
    
    const validarValoresBtn = (form) =>{
                
        if (form.id_tipo_cliente === '1' || form.id_tipo_cliente === 1) {
            return Object.entries(form).every(([key, valor]) => {
                if ([
                    'id_clientes_hermanos', 'rso', 'tipo_persona', 'nombre_uno', 'telefono_uno',
                    'nombre_dos', 'telefono_dos', 'telefono_mobil', 'requiere_facturar',
                    'documentacion_digital', 'calle', 'entre_cale', 'colonia', 'codigo_postal',
                    'ciudad', 'estado', 'pais', 'rason_social', 'rfc', 'habilitar_resumen', 'terminos', 'ubicacion_logo'
                ].includes(key)) {
                    return true; // Ignora este campo y continúa
                }
                //console.log(key);
                
                //console.log(isValidValue(valor));
                return isValidValue(valor);
            });
        } else if (formData.id_tipo_cliente === '2' || form.id_tipo_cliente === 2) {
            return Object.entries(form).every(([key, valor]) => {
                if ([
                    'id_clientes_hermanos', 'rso', 'tipo_persona', 'nombre_uno', 'telefono_uno',
                    'nombre_dos', 'telefono_dos', 'telefono_mobil', 'requiere_facturar',
                    'documentacion_digital', 'calle', 'entre_cale', 'colonia', 'codigo_postal',
                    'ciudad', 'estado', 'pais', 'rason_social', 'rfc', 'habilitar_resumen', 'terminos', 'ubicacion_logo'
                ].includes(key)) {
                    return true; // Ignora este campo y continúa
                }
                //console.log(isValidValue(valor));
                return isValidValue(valor);
            });
        }
        //console.log('return flase');
        
        return false;
        
    }

    const validarRFC = (valor) => {
        if (tipoPersona === 'fisica') {
            if (valor.length === 12) {
                return true;
            }
        }

        if (tipoPersona === 'moral') {
            if (valor.length === 13) {
                return true
            }
        }

        return false
    }

    const validateSoloNumeros = (tel) => {
        return tel === '' || /^\d+$/.test(tel);
    }

    const validateFields = (from) => {
        if (inputSeleccionado !== '' && inputSeleccionado === 'id_catalogo_encuesta') {
            if (from?.id_catalogo_encuesta === '0' || from.id_catalogo_encuesta === 'null') {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Encuesta a Aplicar es OBLIGATORIO'
                error.id = 21
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
    
            } else if (from.id_catalogo_encuesta !== '0' &&  from.id_catalogo_encuesta !== '' &&  from.id_catalogo_encuesta !== 'null') {
                removeInputValid(21)
            }
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'id_tipo_cliente') {
            if (from?.id_tipo_cliente === 'null' || from.id_tipo_cliente === 'null' || from?.id_tipo_cliente === '') {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Tipo Cliente es OBLIGATORIO'
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
            if (/* from?.rso.length <=3 || */ validateContieneEspacios(from.rso)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo RSO es obligatorio.'
                error.id = 6
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from?.rso.length >= 3 && */ !validateContieneEspacios(from.rso)) {
                removeInputValid(6)
            }   
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'rason_social') {
            if (/* from?.rason_social.length <=3 ||  */validateContieneEspacios(from.rason_social)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Razón Social es obligatorio.'
                error.id = 7
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from?.rason_social.length >= 3 && */ !validateContieneEspacios(from.rason_social)) {
                removeInputValid(7)
            }   
        }
        
        if (inputSeleccionado !== '' && inputSeleccionado === 'nombre_uno') {
            if (/* from.nombre_uno === null || from?.nombre_uno.length <= 3 ||  */validateContieneEspacios(from.nombre_uno)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Nombre 1 es obligatorio, debe contener mas de 3 caracteres.'
                error.id = 8
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.nombre_uno && from.nombre_uno.length >= 3 &&  */!validateContieneEspacios(from.nombre_uno)) {
                removeInputValid(8)
            }            
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'telefono_uno') {
            if (/* from.telefono_uno === null || from.telefono_uno.length !== 10 ||  */!validateSoloNumeros(from.telefono_uno)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Telefono 1 es obligatorio, debe contener 10 digitos.'
                error.id = 9
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.telefono_uno && from.telefono_uno.length === 10 && */ !validateContieneEspacios(from.telefono_uno) && validateSoloNumeros(from.telefono_uno)) {
                removeInputValid(9)
            }            
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'nombre_dos') {
                if (/* from.nombre_dos === null || from.nombre_dos.length <= 3 || */ validateContieneEspacios(from.nombre_dos)) {
                    var messageError = ''
                    var error = { msg: '', id: 0 }
                    messageError = 'Campo Nombre 2 debe ser valido, debe contener mas de 3 caracteres.'
                    error.id = 10
                    error.msg = messageError
                    if (!idSet.has(error.id)) {
                        setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                        setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                    }
                } if (/* from.nombre_dos && from?.nombre_dos.length > 0 && */ !validateContieneEspacios(from.nombre_dos)) {
                    removeInputValid(10)
                }   
        }  

        if (inputSeleccionado !== '' && inputSeleccionado === 'telefono_dos') {
            if (/* from?.telefono_dos.length !== 10 ||  */validateContieneEspacios(from.telefono_dos) || !validateSoloNumeros(from.telefono_dos)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Telefono 2 debe contener 10 digitos.'
                error.id = 11
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.telefono_dos && from?.telefono_dos.length === 10 &&  */!validateContieneEspacios(from.telefono_dos) && validateSoloNumeros(from.telefono_dos)) {
                removeInputValid(11)
            } 
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'telefono_mobil') {
            if (/* from.telefono_mobil === null || from?.telefono_mobil.length !== 10 || */ validateContieneEspacios(from.telefono_mobil) || !validateSoloNumeros(from.telefono_mobil)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Telefono Mobil es obligatorio, debe contener 10 digitos.'
                error.id = 12
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.telefono_mobil && from?.telefono_mobil.length === 10 && */ !validateContieneEspacios(from.telefono_mobil) && validateSoloNumeros(from.telefono_mobil)) {
                removeInputValid(12)
            }
        }        

        if (inputSeleccionado !== '' && inputSeleccionado === 'calle') {
            if (/* from.calle === null || from?.calle.length <= 3 ||  */validateContieneEspacios(from.calle)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Calle es obligatorio.'
                error.id = 13
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.calle && from?.calle.length >= 3 &&  */!validateContieneEspacios(from.calle)) {
                removeInputValid(13)
            }
        }        

        if (inputSeleccionado !== '' && inputSeleccionado === 'entre_cale') {
            if (/* from.entre_cale === null || from?.entre_cale.length <= 3 || */ validateContieneEspacios(from.entre_cale)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Entre Calles es obligatorio.'
                error.id = 14
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.entre_cale && from?.entre_cale.length >= 3 && */ !validateContieneEspacios(from.entre_cale)) {
                removeInputValid(14)
            }
        }        

        if (inputSeleccionado !== '' && inputSeleccionado === 'colonia') {
            if (/* from.colonia === null || from?.colonia.length <= 3 || */ validateContieneEspacios(from.colonia)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Entre Calles es obligatorio.'
                error.id = 15
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.colonia && from?.colonia.length >= 3 && */ !validateContieneEspacios(from.colonia)) {
                removeInputValid(15)
            }    
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'codigo_postal') {
            if (/* from.codigo_postal === null || from?.codigo_postal.length < 5 || */ validateContieneEspacios(from.codigo_postal)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Codigo Postal es obligatorio.'
                error.id = 16
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.codigo_postal && from?.codigo_postal.length > 5 && */ !validateContieneEspacios(from.codigo_postal)) {
                removeInputValid(16)
            }
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'ciudad') {
            if (/* from.ciudad === null || from?.ciudad.length < 3 ||  */validateContieneEspacios(from.ciudad)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Ciudad es obligatorio.'
                error.id = 17
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.ciudad && from?.ciudad.length > 3 && */ !validateContieneEspacios(from.ciudad)) {
                removeInputValid(17)
            }   
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'estado') {
            if (/* from.estado === null || from?.estado.length < 3 || */ validateContieneEspacios(from.estado)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Ciudad es obligatorio.'
                error.id = 18
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.estado && from?.estado.length > 3 && */ !validateContieneEspacios(from.estado)) {
                removeInputValid(18)
            }
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'pais') {
            if (/* from.pais === null || from?.pais.length < 3 || */ validateContieneEspacios(from.pais)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo Pais es obligatorio.'
                error.id = 19
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (/* from.pais && from?.pais.length > 3 && */ !validateContieneEspacios(from.pais)) {
                removeInputValid(19)
            }   
        }

        if (inputSeleccionado !== '' && inputSeleccionado === 'rfc') {
            if (!validarRFC(from.rfc)) {
                var messageError = ''
                var error = { msg: '', id: 0 }
                messageError = 'Campo RFC debe ser valido.'
                error.id = 20
                error.msg = messageError
                if (!idSet.has(error.id)) {
                    setArrayErrors([...arrayErrors, error]);  // Agregar el nuevo objeto al array
                    setIdSet(new Set(idSet).add(error.id));  // Agregar el nuevo ID al Set
                }
            } else if (validarRFC(from.rfc)) {
                removeInputValid(20)
            }   
        }
    }
    
    const renderOptionsColegiosComunes = () =>{
        return [<option key={ "colegio-hermanos-0" } value="null">Seleccione una Opción</option>,...allColegiosHermanos.map((ch) => (
            <option key={"colegio-hermanos-"+ch.id} value={ch.id}> {ch.nombre} </option>
        ))]
    }

    const renderOptionsEncuestas = useMemo(() =>{
        return [<option key={'encuesta-0'} value="0">Seleccione una Opción</option>,...allOptionsSelectEncuestas.map((ch) => (
            <option key={'encuestas-'+ch.id} value={ch.id}> {ch.nombre} </option>
        ))]
            
    }, [allOptionsSelectEncuestas])

    const generarLinkRegistro = () => {
        //var dataCliente = data;
        axios.get(APIURL+'/clientes/'+ID+'/link/registro', config).then(resp=>{
            var data = resp.data
            console.log(resp);
            setLinkRegistro(data)
        })
        
    }
    
    const getAllColegiosHermanos = async (id_tipo_cliente) => {
        
        setAllColegiosHermanos([]);

        if(id_tipo_cliente !== "1"){
            return true;
        }

        try {
            const resp = await axios.get(APIURL+'/clientes/hermanos', config)
            setAllColegiosHermanos(resp.data);
        } catch (resp) {
            if (resp?.response) {
                if (resp.response.status === 401) {
                    logout()
                }
            }
            //console.log(resp);
        }
    }

    const getOptionsEncuestas = () => {
        axios.get(APIURL+"/catalogos/encuestas", config).then((resp) => {
            setAllOptionsSelectEncuestas(resp.data)
            
        }).catch((error)=>{
            if (error.response.status === 401) {
                logout()
            }
        })
    }

    const sendUpdateCliente = () =>{
        //console.log(formData);
        var dataPOST = {
            "id" : ID,
            "id_tipo_cliente": parseInt(formData.id_tipo_cliente,10),
            "nombre": formData.nombre,
            "descripcion": formData.descripcion,
            "notificaciones_email": formData.notificaciones_email,
            "id_clientes_hermanos": formData.id_tipo_cliente === '1' ? (parseInt(formData.id_clientes_hermanos, 10) || '') : '',//parseInt(formData.id_clientes_hermanos,10),
            "id_catalogo_encuesta": parseInt(formData.id_catalogo_encuesta, 10) ,
            "rso": formData.rso,
            "rfc": formData.rfc,
            'tipo_persona': tipoPersona,
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
            "documentacion_digital": formData.documentacion_digital ? 1 : 0,
            "habilitar_resumen": formData.habilitar_resumen ? 1 : 0,
            "requiere_facturar": formData.requiere_facturar ? 1 : 0,
            "habilitar_alta_familias": formData.habilitar_alta_familias ? 1 : 0,
            "habilitar_logo": formData.habilitar_logo ? 1 : 0, 
            'terminos': content,
        }
        
        const formDataSend = new FormData();
        
        Object.keys(dataPOST).forEach(key => {
            //if (dataPOST[key] !== null && dataPOST[key] !== undefined) {
                formDataSend.append(key, dataPOST[key]);
            //}
        });

        if (fileLogo) {
            formDataSend.append("logo", fileLogo);
        }

        if (dataPOST.id_tipo_cliente === 1 && dataPOST.id_clientes_hermanos === 'null' && esColegioComun) {
            alert('El campo Colegio Hermanos es obligatorio.')
            return 0
        }
        console.log(formDataSend);
        

        axios.post(APIURL+'/clientes/'+dataPOST.id , formDataSend ,config).then((resp)=>{
            console.log(resp.data);
            execShowAlert({ type: 'success', title: 'Cliente Actualizado', message: 'Datos del cliente actualizados.'})
            if (resp.data.tokenData === null) {
                setErrorLink(resp.data.error_link)
                execShowAlert({ type: 'warning', title: 'Cliente Actualizado', message: 'Se requiere asignar cliente a proyecto para generar LINK.'})
            } else {
                navigate("/clientes")
            }
            
       
        }).catch((resp)=>{
            setShowAlertError(true)
            if(resp.code === "ERR_BAD_REQUEST" && resp.response.hasOwnProperty('data')){
                console.log(resp.response.data);
                execShowAlert({ type: 'danger', title: 'Error al actualizar', message: 'Revisar los datos ingresados.'})
            }

            if (resp.response.status === 401) {
                logout()
            }
            console.log(resp);                                                                 
        })
        
    }

    const getDataCliente = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes/'+ID, config).then(res => res)
            setValoresDeCliente(resp.data)
            setTipoPersona(resp.data.tipo_persona)
            generarLinkRegistro()
            
        } catch (error) {
            console.error(error);
            if (error?.response?.status === 401) {
                logout()
            }
            setValueCliente(error);
        }
    }

    useEffect(()=>{
        if (tipoPersona === 'fisica' || tipoPersona === 'moral') {
            if (validarRFC(formData.rfc)) {
                console.log('es valido');
                
            } else {
                console.log('es invalido');
            }
        }
        
    }, [ tipoPersona ])

    useEffect(()=>{
       getAllColegiosHermanos('1') 
       getOptionsEncuestas()
    },[])

    useEffect(()=>{
        validateFields(formData);
        if (formData && formData.tipo_persona) {
            setTipoPersona(formData.tipo_persona);
        }
    }, [formData])

    useEffect(() => {
        // Tu lógica aquí, por ejemplo, para manejar cambios en documentacion_digital
        if ( arrayErrors.length === 0 && validarValoresBtn(formData)) {
            setFormValid(false)
        } else if (arrayErrors.length === 0 && validarValoresBtn(formData)) {
            setFormValid(false)
        } else {
            console.log('btn disable');
            
            setFormValid(true)
        }
    }, [formData.documentacion_digital, formData.requiere_facturar]);

    useEffect(()=>{
        
        if (arrayErrors.length === 0 ) {
            
            if ((formData.id_tipo_cliente === '1' || formData.id_tipo_cliente === 1) && validarValoresBtn(formData)) {
                setFormValid(false)
            } else if ((formData.id_tipo_cliente === '2' || formData.id_tipo_cliente === 2) && validarValoresBtn(formData)) {
                setFormValid(false)
            } else {
                console.log('btn disable');
                
                setFormValid(true)
            }
            
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
            <p><Link className="btn btn-info btn-sm text-white fw-bold" to={PathConstants.CLIENTES}>
            <i class="bi bi-arrow-left me-2"></i>
            Regresar</Link></p>
            <p className="fw-bold title-forms">ACTUALIZAR CLIENTE</p>
            <p className="fw-bold">DATOS DEL CLIENTE:</p>
            <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
            >
                <Tab eventKey="home" title="DATOS DEL CLIENTE" style={{ height: '55vh', overflowY: 'scroll', overflowX: 'clip' }}>
                <div className="row">
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Tipo Cliente</label>
                            <Form.Select aria-label="Default select example" value={ formData.id_tipo_cliente } name="id_tipo_cliente" onChange={(e)=> {formInputChange(e);}}>
                                <option value="null">Seleccione una Opción</option>
                                <option value="1">Escuela</option>
                                <option value="2">Empresa</option>
                            </Form.Select>
                            { contieneErrorInput(1) && <span className="error-msg"> {obtenerErrorMensaje(1)} </span> }
                        </div>
                    </div>
                
                    <div className="col-5 col-md-3 d-flex align-items-center justify-content-center">
                        <div className="mb-3 d-grid">
                            <Form.Check className="p-0">
                                <Form.Check.Label >Es Colegio Comun</Form.Check.Label>
                                <br></br>
                                <div className="mt-2 d-flex justify-content-center align-items-center">
                                <Form.Check.Input type='checkbox' name="es_colegio_comun" value="1" checked={esColegioComun} onChange={(e)=> selectEsColegioComun(e)}/>
                                </div>
                            </Form.Check>
                        </div>
                    </div>

                    {(esColegioComun === true )&& (
                    <div className="col-5">
                        <div className="mb-3" >
                            <label className="fw-bold">Colegios hermanos</label>
                            <Form.Select name="id_clientes_hermanos" value={ formData.id_clientes_hermanos } id="id_clientes_hermanos" onChange={(e)=> formInputChange(e)}>
                                {renderOptionsColegiosComunes()}
                            </Form.Select>
                        </div>
                    </div>
                    )}

                    <div className="col-5 mt-2">
                            <div className="mb-3">
                                <label className="fw-bold">Encuesta a aplicar:</label>
                                <Form.Select aria-label="Default select example" value={ formData.id_catalogo_encuesta } name="id_catalogo_encuesta" onChange={(e)=> {formInputChange(e);}}>
                                    { renderOptionsEncuestas }
                                </Form.Select>
                                { contieneErrorInput(21) && <span className="error-msg"> {obtenerErrorMensaje(21)} </span> }
                            </div>
                            
                    </div> 
                
                </div>
            
                <div className="row">
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Nombre</label>
                            <input type="text" value={ formData.nombre } className="form-control form-control-sm" name="nombre" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(3) && <span className="error-msg"> {obtenerErrorMensaje(3)} </span> }
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Descripción</label>
                            <input type="text" value={ formData.descripcion } className="form-control form-control-sm" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(4) && <span className="error-msg"> {obtenerErrorMensaje(4)} </span> }
                        </div>
                    </div>
                    
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Notificaciones Email</label>
                            <input type="email" value={ formData.notificaciones_email } className="form-control form-control-sm" name="notificaciones_email" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(5) && <span className="error-msg"> {obtenerErrorMensaje(5)} </span> }
                        </div>
                    </div>
                    
                    
                </div>

                <div className="row">
                    <div className="col-12 pt-3">
                        <p className="fw-bold pb-1 mb-1"> Seleccione el tipo de persona fiscal al que pertenece: </p>
                        <div className="d-flex pb-3">
                            <Form.Check checked={ tipoPersona === "fisica" } className="me-5" type="radio" id="persona_fisica" name="tipo_persona" label="Persona Fisica" value="fisica" onChange={(e)=> formInputChange(e)}/>
                            <Form.Check checked={ tipoPersona === "moral" } type="radio" id="persona_moral" name="tipo_persona" label="Persona Moral" value="moral" onChange={(e)=> formInputChange(e)}/>
                        </div>
                        
                    </div>
                    { tipoPersona !== '' &&
                        <>
                        <div className="col-5">
                            <label className="fw-bold">RFC</label>
                            <input type="text" value={ formData.rfc } className="form-control form-control-sm" name="rfc" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(20) && <span className="error-msg"> {obtenerErrorMensaje(20)} </span> }
                        </div>
                        <div className="col-5">
                            <div className="mb-3">
                                <label className="fw-bold">RSO</label>
                                <input type="text" value={ formData.rso } className="form-control form-control-sm" name="rso" onChange={(e)=> formInputChange(e)}/>
                                { contieneErrorInput(6) && <span className="error-msg"> {obtenerErrorMensaje(6)} </span> }
                            </div>
                        </div>
                        <div className="col-5">
                            <div className="mb-3">
                                <label className="fw-bold">Razón Social</label>
                                <input type="text" value={ formData.rason_social } className="form-control form-control-sm" name="rason_social" onChange={(e)=> formInputChange(e)}/>
                                { contieneErrorInput(7) && <span className="error-msg"> {obtenerErrorMensaje(7)} </span> }
                            </div>
                        </div>
                        
                        </>
                    }
                
                        
                </div>
                {/* <hr></hr>
                <div className="row">
                    <div className="12">
                        <p className="fw-bold">Imagen para Logo de Cliente</p>
                    </div>
                    <div className="col-5">
                        <input className="form-control" type="file" id="formFileLogo" accept="image/*" onChange={handleFileChange}/>
                    </div>

                    
                    {preview && formData?.ubicacion_logo !== '' ? (
                        <img
                            src={urlIMG + formData.ubicacion_logo}
                            className="d-block w-100 h-50 rounded" style={{ maxWidth: "250px", maxHeight: "250px" }}
                            alt={'img-logo'}
                        />
                    ) : (
                        <div className="d-flex justify-content-center align-items-center rounded" style={{background: 'black', color: 'white', width: '150px', height: '150px'}}>
                            <p className="m-0">SIN IMAGEN</p>
                        </div>
                        
                    )}
                    

                </div> */}

                <hr></hr>
                <div id="editor">
                    <p className="fw-bold">Terminos de encuesta</p>
                    <ReactQuill
                    value={content}
                    onChange={handleChange}
                    modules={modules} // Personalizamos la barra de herramientas
                    theme="snow"
                    />
                    {/* <div style={{ marginTop: '20px' }}>
                        <h3>Contenido actual:</h3>
                        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
                    </div> */}
                </div>
                <hr></hr>

                <div className="row mb-3">
                    <div className="col-12">
                        <p className="fw-bold"> CONTACTO: </p>  
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Nombre 1</label>
                            <input type="text" value={ formData.nombre_uno } className="form-control form-control-sm" name="nombre_uno" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(8) && <span className="error-msg"> {obtenerErrorMensaje(8)} </span> }
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Teléfono 1</label>
                            <input type="text" value={ formData.telefono_uno } className="form-control form-control-sm" name="telefono_uno" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(9) && <span className="error-msg"> {obtenerErrorMensaje(9)} </span> }
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Nombre 2</label>
                            <input type="text" value={ formData.nombre_dos } className="form-control form-control-sm" name="nombre_dos" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(10) && <span className="error-msg"> {obtenerErrorMensaje(10)} </span> }
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Teléfono 2</label>
                            <input type="text" value={ formData.telefono_dos } className="form-control form-control-sm" name="telefono_dos" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(11) && <span className="error-msg"> {obtenerErrorMensaje(11)} </span> }
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Teléfono Móvil</label>
                            <input type="text" value={ formData.telefono_mobil } className="form-control form-control-sm" name="telefono_mobil" onChange={(e)=> formInputChange(e)}/>
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
                            <label className="fw-bold">Calle</label>
                            <input type="text" value={ formData.calle } className="form-control form-control-sm" name="calle" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(13) && <span className="error-msg"> {obtenerErrorMensaje(13)} </span> }
                        </div>  
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Entre Calles</label>
                            <input type="text" value={ formData.entre_cale } className="form-control form-control-sm" name="entre_cale" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(14) && <span className="error-msg"> {obtenerErrorMensaje(14)} </span> }
                        </div>  
                    </div>
                    <div className="col-5">
                        <div className="mb-3">
                            <label className="fw-bold">Colonia</label>
                            <input type="text" value={ formData.colonia } className="form-control form-control-sm" name="colonia" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(15) && <span className="error-msg"> {obtenerErrorMensaje(15)} </span> }
                        </div> 
                    </div>
                    <div className="col-4">
                        <div className="mb-3">
                            <label className="fw-bold">Codigo Postal</label>
                            <input type="text" value={ formData.codigo_postal } className="form-control form-control-sm" name="codigo_postal" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(16) && <span className="error-msg"> {obtenerErrorMensaje(16)} </span> }
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="mb-3">
                            <label className="fw-bold">Ciudad</label>
                            <input type="text" value={ formData.ciudad } className="form-control form-control-sm" name="ciudad" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(17) && <span className="error-msg"> {obtenerErrorMensaje(17)} </span> }
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="mb-3">
                            <label className="fw-bold">Estado</label>
                            <input type="text" value={ formData.estado } className="form-control form-control-sm" name="estado" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(18) && <span className="error-msg"> {obtenerErrorMensaje(18)} </span> }
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="mb-3">
                            <label className="fw-bold">Pais</label>
                            <input type="text" value={ formData.pais } className="form-control form-control-sm" name="pais" onChange={(e)=> formInputChange(e)}/>
                            { contieneErrorInput(19) && <span className="error-msg"> {obtenerErrorMensaje(19)} </span> }
                        </div>
                    </div>
                   
                </div>
                    
                </Tab>
                <Tab eventKey="profile" title="CONFIGURACIONES" style={{ height: '55vh', overflowY: 'scroll', overflowX: 'clip' }}>
                    <div className="row">
                        <div className="col-12 col-md-3 mt-3">
                            <Form.Check className="mx-2" type="switch">
                                <Form.Check.Input name="requiere_facturar" checked={ formData.requiere_facturar } onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Requiere Facturar </span></Form.Check.Label>
                            </Form.Check>
                        </div>
                        <div className="col-12 col-md-3 mt-3">
                            <div className="d-flex">
                                <Form.Check className="mx-2" type="switch">
                                    <Form.Check.Input name="documentacion_digital" checked={formData.documentacion_digital} onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                    <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Documentos Digital </span></Form.Check.Label>
                                </Form.Check>
                                                                
                            </div>
                            
                        </div>
                        <div className="col-12 col-md-3 mt-3">
                            <div className="d-flex">
                                <Form.Check className="mx-2" type="switch">
                                    <Form.Check.Input name="habilitar_resumen" checked={formData.habilitar_resumen ?? false} onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                    <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Resumen </span></Form.Check.Label>
                                </Form.Check>
                                                                
                            </div>
                            
                        </div>
                        <div className="col-8 col-md-5 mt-4">
                            <div className="row">
                                <div className="col-12 mb-2">
                                    <div className="d-flex">
                                        <Form.Check className="mx-2 pt-2" type="switch">
                                            <Form.Check.Input name="habilitar_alta_familias" checked={formData.habilitar_alta_familias ?? false} onChange={(e)=> {formInputChange(e)}}  style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Altas Familias por Link </span></Form.Check.Label>
                                        </Form.Check>
                                        
                                    </div>
                                </div>
                                <div className="col-12" hidden={!formData.habilitar_alta_familias}>
                                    <input class="form-control" type="text" value={ linkRegistro ? linkRegistro.link_registro : 'SIN DATO' } aria-label="readonly input example" />
                                    <span className="fw-bold text-danger">{ errorLink ?? '' }</span>
                                </div>
                            </div>
                            
                            
                        </div>
                        <div className="col-12 mt-5">
                            
                            <div className="row">
                                <div className="12">
                                    <p className="fw-bold fs-6 mb-1">Imagen para Logo de Cliente</p>
                                </div>
                                <div className="col-12 d-flex mb-3">
                                    <Form.Check className="mx-2 pt-2" type="switch">
                                        <Form.Check.Input name="habilitar_logo" checked={formData.habilitar_logo ?? false} onChange={(e)=> {formInputChange(e)}} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                                        <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Habilitar Imagen Logo en Reportes</span></Form.Check.Label>
                                    </Form.Check>
                                                                    
                                </div>
                                <div className="col-12 col-md-5" style={{ display: formData.habilitar_logo ? 'block' : 'none' }}>
                                    <input className="form-control" type="file" id="formFileLogo" accept="image/*" onChange={handleFileChange}/>
                                </div>

                                <div className="col-12 col-md-5">
                                    {formData?.ubicacion_logo && formData?.habilitar_logo ? (
                                        !!preview ? (
                                            <img
                                                src={preview}
                                                className="d-block w-100 h-50 rounded"
                                                style={{ maxWidth: "250px", maxHeight: "250px" }}
                                                alt="img-logo"
                                            />
                                        ) : (
                                            <img
                                                src={urlIMG + formData.ubicacion_logo}
                                                className="d-block w-100 h-50 rounded"
                                                style={{ maxWidth: "250px", maxHeight: "250px" }}
                                                alt="img-logo"
                                            />
                                        )
                                    ) : !!preview ? (
                                        <img
                                            src={preview}
                                            className="d-block w-100 h-50 rounded"
                                            style={{ maxWidth: "250px", maxHeight: "250px" }}
                                            alt="img-logo"
                                        />
                                    ) : (
                                        <div
                                            className="d-flex justify-content-center align-items-center rounded"
                                            style={{
                                                background: 'black',
                                                color: 'white',
                                                width: '150px',
                                                height: '150px',
                                            }}
                                        >
                                            <p className="m-0">SIN IMAGEN</p>
                                        </div>
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
            <div className="row">
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <div className="mb-3">
                        <Link className="btn btn-secondary mx-2" to={PathConstants.CLIENTES}>Cancelar</Link>
                        <button className="btn btn-primary" onClick={ sendUpdateCliente } disabled={ formValid }>GUARDAR DATOS</button>
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