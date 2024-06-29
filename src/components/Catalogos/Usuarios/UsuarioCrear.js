import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

function UsuarioCrear({ onCreate, clearForm, clear }) {
    const APIURL = process.env.REACT_APP_API_URL
    const { logout } = useContext(AuthContext);
    const [ btnEnable, setBtnEnable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ allClientes, setAllClientes ] = useState([])
    const [ dataPostUsuario, setDataPostUsuario ] = useState({
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "0"
    })

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [errors, setErrors] = useState({});

    const getPerfilesList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/perfiles', config);
            setListaPerfiles(resp.data);
        } catch (error) {
            setListaPerfiles([])
            console.error("Error fetching perfiles:", error);
        }
    }

    const getAllClientes = async () => {
        try {
            const resp = await axios.get(APIURL+'/clientes', config)
            console.log(resp.data);
            setAllClientes(resp.data)
        } catch (error) {
            if (error.response.status === 401) {
                logout()
            }
        }
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
            case "password":
                if (!value) errorMsg = "La contraseña es requerida";
                else if (!/(?=.*[A-Z])(?=.*\d)/.test(value)) errorMsg = "La contraseña debe contener al menos una letra mayúscula y un número";
                break;
            case "password_confirmation":
                if (value !== dataPostUsuario.password) errorMsg = "Las contraseñas no coinciden";
                break;
            case "id_perfil":
                if(value === '0') errorMsg = "Debe seleccionar un perfil";
                break
            default:
                break;
        }

        console.log(errorMsg);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: errorMsg
        }));
        
        const hasErrors = Object.values(errors).some(err => err !== "") || errorMsg !== "";
        const allFieldsFilled = Object.values(dataPostUsuario).every(val => val !== "");
        console.log('El valor allfieldsfilled: ', allFieldsFilled);
        setBtnEnable(hasErrors, !allFieldsFilled);
    };

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setDataPostUsuario(prevState => ({  
            ...prevState,
            [name]: value
        }));

        validateField(name,value)
        onCreate({ ...dataPostUsuario, [name]: value }, btnEnable)

    };

    const agregarOpcionesSelect = () => {
        return [
            <option key="default" value="0" selected>
                Seleccione uno
            </option>,
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

    useEffect(()=>{
        console.log('este es el dato de clear: '+ clearForm);
        if (clearForm) {
            setBtnEnable(true)
            setDataPostUsuario({
                name:"",
                email:"",
                password:"",
                password_confirmation:"",
                id_perfil: "0"
            })
            setErrors({})
            clear()
            onCreate(dataPostUsuario, btnEnable)
        }
    },[btnEnable, dataPostUsuario, errors])

    useEffect(() => {
        getPerfilesList();
        getAllClientes();
    }, [APIURL]);

    useEffect(()=>{
        const hasErrors = Object.values(errors).some(err => err !== "");
        const allFieldsFilled = Object.values(dataPostUsuario).every(val => val !== "");

        setBtnEnable(hasErrors || !allFieldsFilled);
    }, [errors, dataPostUsuario])

    return (
            <div className="container">
            <div className="mb-3">
            <label htmlFor="inputCliente" className="form-label">Cliente</label>
            <select id="inputCliente" 
                    name="id_cliente"
                    className="form-select mb-2" 
                    aria-label="Default select example"
                    value={dataPostUsuario.id_cliente}
                    onChange={handleInputChange}>
                { renderFiltroClientes() }
            </select>
            {errors.id_perfil && <div className="text-danger fw-medium">{errors.id_perfil}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="inputName" className="form-label">Nombre:</label>
                <input type="text" className="form-control mb-2" id="inputName" name="name"
                        placeholder="Nombre:"
                        value={dataPostUsuario.name}
                        onChange={handleInputChange}/>
                {errors.name && <div className="text-danger fw-medium">{errors.name}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label">Email</label>
                <input type="email" className="form-control" id="inputEmail" name="email"
                        placeholder="name@example.com"
                        value={dataPostUsuario.email}
                        onChange={handleInputChange}/>
                {errors.email && <div className="text-danger fw-medium">{errors.email}</div>}
            </div>
            <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input type="password" id="inputPassword" className="form-control" 
                    aria-describedby="passwordHelpBlock" name="password" value={dataPostUsuario.password}
                    onChange={handleInputChange}/>
                    {errors.password && <div className="text-danger fw-medium">{errors.password}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="inputPasswordConfirmar" className="form-label">Confirmar Password</label>
                <input type="password" id="inputPasswordConfirmar" name="password_confirmation"
                        className="form-control" 
                        aria-describedby="passwordHelpBlock"
                        value={dataPostUsuario.password_confirmation}
                        onChange={handleInputChange}/>
                        {errors.password_confirmation && <div className="text-danger fw-medium">{errors.password_confirmation}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="inputPerfil" className="form-label">Perfil</label>
                <select id="inputPerfil" 
                        name="id_perfil"
                        className="form-select mb-2" 
                        aria-label="Default select example"
                        value={dataPostUsuario.id_perfil}
                        onChange={handleInputChange}>
                    { agregarOpcionesSelect() }
                </select>
                {errors.id_perfil && <div className="text-danger fw-medium">{errors.id_perfil}</div>}
            </div>
        </div>
    )
}

export default UsuarioCrear;