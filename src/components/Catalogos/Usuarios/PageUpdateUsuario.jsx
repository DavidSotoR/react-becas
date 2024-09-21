import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";

export default function PageUpdateUsuario() {
    const { id } = useParams();
    const { logout } = useContext(AuthContext);
    const [esExterno, setEsExterno] = useState(false);

    const [errors, setErrors] = useState({});
    const [ btnEnable, setBtnEnable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ allClientes, setAllClientes ] = useState([])
    const [ user, setUser ] = useState({})
    const [errorsArray, setErrorsArray] = useState([]);
    const [listExterno, setListExterno] = useState([]);
    const [listInterno, setListInterno] = useState([]);
    const [ btnDisable, setBtnDisable ] = useState(true)

    const [ dataUpdateUsuario, setDataUpdateUsuario ] = useState({
        id: 0,
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "0",
        id_cliente: "0",
        latitud: '',
        longitud: ''
    })


    const [ formValid, setFormValid ] = useState(true)
    //const [ dataUpdateUsuario ,setDataUpdateUsuario ] = useState(undefined)
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getPerfilesList = async () => {
        try {
            const resp = await axios.get(APIURL+'/perfiles', config);
            setListaPerfiles(resp.data);
            var listExt = resp.data;
            var int = []
            var ext = []
            listExt.forEach(element => {
                if (element.interno) {
                    int.push(element)
                } else {
                    ext.push(element)
                }
            });
            setListExterno(ext)
            setListInterno(int)
        } catch (error) {
            setListaPerfiles([])
            console.error("Error fetching perfiles:", error);
        }
    }

    const getAllClientes = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes', config)
            setAllClientes(resp.data)
        } catch (error) {
            if (error.response.status === 401) {
                logout()
            }
        }
    }

    const handleInputChange = (e) => {
        var { name, value } = e.target;
        console.log(name, value);
        if (name === 'id_cliente' || name === 'id_perfil') {
            value = parseInt(value,10)
        }
        setDataUpdateUsuario(prevState => ({  
            ...prevState,
            [name]: value
        }));

        validateField(name,value)

    };

    const contieneError = (idError)=>{
        var exists = errorsArray?.some(function(error) {
            return error.idError === idError;
        });
        return exists;
    }


    const agregarOpcionesSelect = () => {
        return [
            ...listaPerfiles.map((perfil) => (
                <option key={perfil.id} value={`${perfil.id}`}>
                    {perfil.nombre}
                </option>
            ))
        ];
    }

    const renderFiltroClientes = () => {
        
        return [...allClientes.map((cliente) => (
            <option key={cliente.id} value={`${cliente.id}`}>
                { cliente.nombre }
            </option>
        ))]
    }

    const changeIsExterno = ()=> {
        setEsExterno(!esExterno)
    }

    const renderFiltroClientesInt = () => {
        return [<option key="cliente-0" value="0" selected>
            Seleccione uno
        </option>,,...listInterno.map((cliente) => (
            <option key={cliente.id} value={`${cliente.id}`}>
                { cliente.nombre }
            </option>
        ))]
    }
    const renderFiltroClientesExt = () => {
        return [<option key="cliente-0" value="0" selected>
            Seleccione uno
        </option>,,...listExterno.map((cliente) => (
            <option key={cliente.id} value={`${cliente.id}`}>
                { cliente.nombre }
            </option>
        ))]
    }

    const validateDataFormBtn = (obj) => {
        for (let key in obj) {
            // Ignora la validación de 'id_cliente' si 'isExterno' es false
        if ((key === "id_cliente" && !esExterno) || (obj[key] !== "" && obj[key] !== "0")) {
            continue; // Continúa con la siguiente iteración del bucle
        }
        
        // Verifica si alguna propiedad del objeto tiene un valor "" o "0"
        if (obj[key] === "" || obj[key] === "0") {
            return false; // El objeto es inválido
        }
        }
        return true; // El objeto es válido
    }

    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "name":
                if (!value) errorMsg = "El nombre es requerido";
                break;
            case "email":
                if (!value) errorMsg = "El email es requerido";
                else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = "El email no es válido";
                break;
            case "id_perfil":
                if(value === '0') errorMsg = "Debe seleccionar un perfil";
                break
            case "id_cliente":
                if (value === '0') errorMsg = "Debe asignar un cliente al Usuario"
            default:
                break;
        }

        if (errorMsg === "") {
            setFormValid(false)
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: errorMsg
        }));
        
    };

    const sendActualizarUsuario = () => {
        
        var dataUpdate = {
            id: dataUpdateUsuario.id,
            id_perfil: dataUpdateUsuario.id_perfil,
            name: dataUpdateUsuario.name,
            email: dataUpdateUsuario.email,
            id_cliente: dataUpdateUsuario.id_cliente,
            laitud: dataUpdateUsuario.latitud,
            longitud: dataUpdateUsuario.longitud
        }

        console.log(dataUpdate);
        if (dataUpdate.id_cliente === null || dataUpdate.id_cliente === undefined) {
            setFormValid(false)
            alert('Se debe asignar un cliente a Usuario')
        } else {
            axios.put(APIURL+'/usuarios',dataUpdate,config).then((resp)=>{
                console.log(resp);
            }).catch((error)=>{
                console.log(error);
            })
        }
        

    }

    const getErrorMsg = (idError) => {
        var index = errorsArray.findIndex(function(error) {
            return error.idError === idError;
        });

        return errorsArray[index].msg
    }

    const getUsuarioID = () => {
        axios.get(APIURL+"/usuarios/"+id, config).then((resp)=>{
            console.log(resp);
            setDataUpdateUsuario(resp.data)
            
        }).catch((err)=>{
            console.log(err);
            
        })
    }

    /* useEffect(() => {
        getPerfilesList();
        getAllClientes();
    }, [APIURL]); */

    useEffect(()=>{
        console.log(errorsArray);
        if (errorsArray.length === 0 && validateDataFormBtn(dataUpdateUsuario) ) {
            setBtnDisable(false)
        } else {
            setBtnDisable(true)
        }
    }, [errorsArray])

    useEffect(()=>{
        //console.log(user);
        getPerfilesList();
        getAllClientes();
        getUsuarioID()
        /* if (!dataUpdateUsuario) {
            setDataUpdateUsuario(user)
        } */
    },[])
    return(
        <div className="container">
            <div className="">
                <h6 style={{ fontWeight: 'bold' }}>Actualizar Usuario</h6>
            </div>
            <div className="row mb-3">

                    <div className="col-12 mb-3">
                        <Form.Check type="switch" className="mx-2">
                            <Form.Check.Input name="externo" onChange={()=> { changeIsExterno() }} style={{ width:"2rem" }} className="pt-3" type="checkbox" />
                            <Form.Check.Label><span className="fw-bold fs-6 ms-2"> Es externo </span></Form.Check.Label>
                        </Form.Check>
                        
                    </div>

                    <div className="col-5 mb-3">
                        <label htmlFor="inputPerfil" className="form-label">Perfil</label>
                        <select id="inputPerfil" 
                                name="id_perfil"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataUpdateUsuario.id_perfil}
                                onChange={handleInputChange}>
                            { esExterno ? renderFiltroClientesExt() : renderFiltroClientesInt() }
                        </select>
                        {contieneError(1) && <div className="text-danger fw-medium">{getErrorMsg(1)}</div>}
                    </div>
                    <div className="col-5 mb-3" style={ esExterno ? { display: "block" } : { display: "none" } }>
                        <label htmlFor="inputCliente" className="form-label">Cliente</label>
                        <select id="inputCliente" 
                                name="id_cliente"
                                className="form-select mb-2" 
                                aria-label="Default select example"
                                value={dataUpdateUsuario.id_cliente}
                                onChange={handleInputChange}>
                            { renderFiltroClientes() }
                        </select>
                        {contieneError(2) && <div className="text-danger fw-medium">{ getErrorMsg(2) }</div>}
                    </div>
                    <div className="col-5 mb-3">
                        <label htmlFor="inputName" className="form-label">Nombre:</label>
                        <input type="text" className="form-control mb-2" id="inputName" name="name"
                                placeholder="Nombre:"
                                value={dataUpdateUsuario.name}
                                onChange={handleInputChange}/>
                        {contieneError(3) && <div className="text-danger fw-medium">{ getErrorMsg(3) }</div>}
                    </div>

                    <div className="col-5 mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email"
                                placeholder="name@example.com"
                                value={dataUpdateUsuario.email}
                                onChange={handleInputChange}/>
                        {contieneError(4) && <div className="text-danger fw-medium">{ getErrorMsg(4) }</div>}
                    </div>

                    <div className="col-12">
                        <h6 className="fw-bold"> Ubicacion del Usuario </h6>
                        <div className="row">
                            <div className="col-5">
                                <label htmlFor="inputLong" className="form-label">Longitud:</label>
                                <input type="text" className="form-control mb-2" id="inputLong" name="longitud"
                                        placeholder="Longitud:" value={ dataUpdateUsuario.longitud }
                                        onChange={handleInputChange}/>
                            </div>
                            <div className="col-5">
                                <label htmlFor="inputLat" className="form-label">Latitud:</label>
                                <input type="text" className="form-control mb-2" id="inputLat" name="latitud"
                                        placeholder="Latitud:" value={ dataUpdateUsuario.latitud }
                                        onChange={handleInputChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="d-flex">
                <Link className="btn btn-secondary mx-2" to={PathConstants.USUARIOS} variant="secondary" >
                    Cancelar
                </Link>
                <Button className="mx-2" variant="primary" disabled={formValid} onClick={ sendActualizarUsuario }>
                    Actualizar
                </Button>
            </div>
        </div>
            
    )
}