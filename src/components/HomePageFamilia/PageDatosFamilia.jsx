import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function  PageDatosFamilia () {
    const DATOSFAMILIA = {
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
    };
    const { logout, userID } = useContext(AuthContext);
    const [datosDeFamilia , setDatosDeFamilia] = useState(DATOSFAMILIA)
    const [datosPadre, setDatosPadre] = useState(DATOSFAMILIA.padre);
    const [datosMadre, setDatosMadre] = useState(DATOSFAMILIA.madre);
    const [pageSelected, setPageSelected] = useState('padre');
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const formChangeDatosPadre = (e) => {
        var { value, name } = e.target
        if (name === 'contecto_principal') {
            value = !datosPadre.contecto_principal
        }

        setDatosPadre(prevState => ({  
            ...prevState,
            [name]: value
        }));
    }

    const saveDataFamilia = () => {
        console.log(datosPadre);
        console.log(datosMadre);
    }

    const formChangeDatosMadre = (e) => {
        var { value, name } = e.target
        //console.log(e);
        if (name === 'contecto_principal') {
            value = !datosMadre.contecto_principal
        }

        setDatosMadre(prevState => ({  
            ...prevState,
            [name]: value
        }));
    }

    const getDataEstudioSocioeconomico = () =>{
        //mandar user ID
        var padersDatos = []
        axios.get(APIURL+'/familias/'+ userID +'/estudio/socioeconomico/padres', config).then((resp)=>{
            padersDatos = resp.data
            padersDatos.forEach(element => {
                if (element.id_familias_padres_tipo == 1) {
                    setDatosPadre(element)
                }
                if (element.id_familias_padres_tipo == 2) {
                    setDatosMadre(element)
                }
            });
        }).catch((err)=>{
            console.log(err);
            //setTieneSE(false)
        })
    }

    useEffect(()=>{
        if (datosPadre.contecto_principal) {
            if (datosMadre.contecto_principal) {
                setDatosMadre(prevState => ({  
                    ...prevState,
                    ['contecto_principal']: false
                }));
            }
        }

    }, [datosPadre.contecto_principal])

    useEffect(()=>{
        if (datosMadre.contecto_principal) {
            if (datosPadre.contecto_principal) {
                setDatosPadre(prevState => ({  
                    ...prevState,
                    ['contecto_principal']: false
                }));   
            }
        }

    }, [datosMadre.contecto_principal])
    

    useEffect(()=>{
        getDataEstudioSocioeconomico()
    },[])

    return (
        <div className="container">
            <p className="fs-5 p-0 m-0 mb-3"> Ingrese los siguientes datos referente a los informacion de los Padres del alumno. </p>
            <ul className="nav nav-tabs mb-2">
                <li className="nav-item fw-bold">
                    <a className={ pageSelected === 'padre' ? "nav-link active" : "nav-link"} onClick={ () => setPageSelected('padre')} aria-current="page">PADRE</a>
                </li>
                <li className="nav-item fw-bold">
                    <a className={ pageSelected === 'madre' ? "nav-link active" : "nav-link"} onClick={ () => setPageSelected('madre')} aria-current="page">MADRE</a>
                </li>
            </ul>
            <div id="form-padre" className="" style={ pageSelected !== 'padre' ? { display: 'none' } : { display: 'block' } }>
                <p className="fw-bold">DATOS PADRE</p>
                <div className="mb-3 row">
                    <label htmlFor="nombre" className="col-sm-2 col-form-label">
                        Nombre
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombre" 
                            name="nombre"
                            value={datosPadre.nombre}
                            onChange={(e)=> formChangeDatosPadre(e)}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="edad" className="col-sm-2 col-form-label">
                        Edad
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="number" 
                            className="form-control" 
                            id="edad" 
                            name="edad"
                            value={datosPadre.edad}
                            onChange={(e)=> formChangeDatosPadre(e)}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <p className="col-sm-2 col-form-label">
                        Vivie
                    </p>
                    <div className="col-sm-10 pt-1">
                        <div className="form-switch">
                            <input 
                                className="form-check-input" 
                                id="vive" 
                                name="vive" 
                                type="checkbox" 
                                checked={datosPadre.vive}
                                role="switch" 
                                onChange={(e)=> formChangeDatosPadre(e)}
                                />
                            <label className="form-check-label">{(datosPadre.vive) ? 'Si' : 'No'}</label>
                        </div>
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="direccion" className="col-sm-2 col-form-label">
                        Direccion:
                    </label>
                    <div className="col-sm-10">
                        <textarea
                            id="direccion"
                            name="direccion"
                            value={datosPadre.direccion}
                            onChange={(e)=> formChangeDatosPadre(e)}
                            placeholder="Dirección..."
                            rows="4"
                            cols="10"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="ocupacion_actual" className="col-sm-2 col-form-label">
                        Ocupacion actual:
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="ocupacion_actual" 
                            name="ocupacion_actual"
                            value={datosPadre.ocupacion_actual}
                            onChange={(e)=> formChangeDatosPadre(e)}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="empresa_trabajo" className="col-sm-2 col-form-label">
                        Empresa de trabajo:
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="empresa_trabajo" 
                            name="empresa_trabajo"
                            value={datosPadre.empresa_trabajo}
                            onChange={(e)=> formChangeDatosPadre(e)}
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Correo:</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={datosPadre.email} id="email" name="email" onChange={(e)=> formChangeDatosPadre(e)}/>
                    </div>
                    
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="telefono_casa" className="col-sm-2 col-form-label">
                        Telefono de casa:
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="telefono_casa" 
                            name="telefono_casa"
                            value={datosPadre.telefono_casa}
                            onChange={(e)=> formChangeDatosPadre(e)}
                        />
                    </div>

                </div>
                
                <div className="mb-3 row">
                    <p className="col-sm-2 col-form-label">
                        Contacto Principal:
                    </p>
                    <div className="col-sm-10 pt-1 needs-validation">
                        <div className="form-switch">
                            <input 
                                className="form-check-input" 
                                id="contecto_principal" 
                                name="contecto_principal" 
                                type="checkbox" 
                                checked={datosPadre.contecto_principal}
                                role="switch" 
                                onChange={(e)=> formChangeDatosPadre(e)}
                                />
                            <label className="form-check-label">{(datosPadre.contecto_principal) ? 'Si' : 'No'}</label>
                        </div>
                    </div>

                </div>
            </div>
            <div id="form-madre" className="" style={ pageSelected !== 'madre' ? { display: 'none' } : { display: 'block' } }>
                <p className="fw-bold">DATOS MADRE</p>
                <div className="mb-3 row">
                    <label htmlFor="nombre" className="col-sm-2 col-form-label">
                        Nombre
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombre" 
                            name="nombre"
                            value={datosMadre.nombre}
                            onChange={(e)=> formChangeDatosMadre(e)}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="edad" className="col-sm-2 col-form-label">
                        Edad
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="number" 
                            className="form-control" 
                            id="edad" 
                            name="edad"
                            value={datosMadre.edad}
                            onChange={(e)=> formChangeDatosMadre(e)}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <p className="col-sm-2 col-form-label">
                        Vivie
                    </p>
                    <div className="col-sm-10 pt-1">
                        <div className="form-switch">
                            <input 
                                className="form-check-input" 
                                id="vive" 
                                name="vive" 
                                type="checkbox" 
                                checked={datosMadre.vive}
                                role="switch" 
                                onChange={(e)=> formChangeDatosMadre(e)}
                                />
                            <label className="form-check-label">{(datosMadre.vive) ? 'Si' : 'No'}</label>
                        </div>
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="direccion" className="col-sm-2 col-form-label">
                        Direccion:
                    </label>
                    <div className="col-sm-10">
                        <textarea
                            id="direccion"
                            name="direccion"
                            value={datosMadre.direccion}
                            onChange={(e)=> formChangeDatosMadre(e)}
                            placeholder="Dirección..."
                            rows="4"
                            cols="10"
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="ocupacion_actual" className="col-sm-2 col-form-label">
                        Ocupacion actual:
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="ocupacion_actual" 
                            name="ocupacion_actual"
                            value={datosMadre.ocupacion_actual}
                            onChange={(e)=> formChangeDatosMadre(e)}
                        />
                    </div>
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="empresa_trabajo" className="col-sm-2 col-form-label">
                        Empresa de trabajo:
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="empresa_trabajo" 
                            name="empresa_trabajo"
                            value={datosMadre.empresa_trabajo}
                            onChange={(e)=> formChangeDatosMadre(e)}
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Correo:</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" value={datosMadre.email} id="email" name="email" onChange={(e)=> formChangeDatosMadre(e)}/>
                    </div>
                    
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="telefono_casa" className="col-sm-2 col-form-label">
                        Telefono de casa:
                    </label>
                    <div className="col-sm-10">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="telefono_casa" 
                            name="telefono_casa"
                            value={datosMadre.telefono_casa}
                            onChange={(e)=> formChangeDatosMadre(e)}
                        />
                    </div>

                </div>
                
                <div className="mb-3 row">
                    <p className="col-sm-2 col-form-label">
                        Contacto Principal:
                    </p>
                    <div className="col-sm-10 pt-1 needs-validation">
                        <div className="form-switch">
                            <input 
                                className="form-check-input" 
                                id="contecto_principal" 
                                name="contecto_principal" 
                                type="checkbox" 
                                checked={datosMadre.contecto_principal}
                                role="switch" 
                                onChange={(e)=> formChangeDatosMadre(e)}
                                />
                            <label className="form-check-label">{(datosMadre.contecto_principal) ? 'Si' : 'No'}</label>
                        </div>
                    </div>

                </div>
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={() => saveDataFamilia()}>GUARDAR</button>
            </div>
        </div>
    )
}