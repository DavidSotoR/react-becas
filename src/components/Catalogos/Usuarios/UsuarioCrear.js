import axios from "axios";
import { useEffect, useState } from "react";

function UsuarioCrear({ onCreate }) {
    const [ btnEnable, setBtnEnable ] = useState(true)
    const [listaPerfiles, setListaPerfiles] = useState([])
    const [ dataPostUsuario, setDataPostUsuario ] = useState({
        name:"",
        email:"",
        password:"",
        password_confirmation:"",
        id_perfil: "1"
    })

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const getPerfilesList = async () => {
        try {
            const resp = await axios.get('http://localhost:8000/api/auth/perfiles', config);
            setListaPerfiles(resp.data);
        } catch (error) {
            setListaPerfiles([])
            console.error("Error fetching perfiles:", error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        if (value !== '') {
            setBtnEnable(false)    
        } else {
            setBtnEnable(true)
        }
        
        setDataPostUsuario(prevState => ({
            ...prevState,
            [name]: value
        }));

        onCreate(dataPostUsuario, btnEnable)

    };

    const agregarOpcionesSelect = () => {
        return listaPerfiles.map((perfil,index)=>(
            <option key={perfil.id} value={ `${perfil.id}`} selected={index === 0}>
                {perfil.nombre}
            </option>
            
        ))
    }

    useEffect(()=>{
        getPerfilesList()
        console.log('Effect Usuarios Crear');
    }, [])

    return (
            <div className="container">
            <div class="mb-3">
                <label htmlFor="inputName" class="form-label">Nombre:</label>
                <input type="text" class="form-control" id="inputName" name="name"
                        placeholder="Nombre:"
                        value={dataPostUsuario.name}
                        onChange={handleInputChange}/>
            </div>
            <div class="mb-3">
                <label htmlFor="inputEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="inputEmail" name="email"
                        placeholder="name@example.com"
                        value={dataPostUsuario.email}
                        onChange={handleInputChange}/>
            </div>
            <div className="mb-3">
                    <label htmlFor="inputPassword" class="form-label">Password</label>
                    <input type="password" id="inputPassword" class="form-control" 
                    aria-describedby="passwordHelpBlock" name="password" value={dataPostUsuario.password}
                    onChange={handleInputChange}/>
                    <div id="passwordHelpBlock" class="form-text">
                        El password debe contener al menos una letra mayuscula y numeros.
                    </div>
            </div>
            <div className="mb-3">
                <label htmlFor="inputPasswordConfirmar" class="form-label">Confirmar Password</label>
                <input type="password" id="inputPasswordConfirmar" name="password_confirmation"
                        className="form-control" 
                        aria-describedby="passwordHelpBlock"
                        value={dataPostUsuario.password_confirmation}
                        onChange={handleInputChange}/>
            </div>
            <div className="mb-3">
                <label htmlFor="inputPerfil" class="form-label">Perfil</label>
                <select id="inputPerfil" 
                        name="id_perfil"
                        className="form-select" 
                        aria-label="Default select example"
                        value={dataPostUsuario.id_perfil}
                        onChange={handleInputChange}>
                    { agregarOpcionesSelect() }
                </select>
            </div>
        </div>
    )
}

export default UsuarioCrear;