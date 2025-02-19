import axios from "axios";
import { useEffect, useState,useContext } from "react";
import ListaProyectos from "./ListaProyectos/ListaProyectos";
import { AuthContext } from "../../context/AuthContext";
import ListaEncuestas from "./ListaEncuestas/ListaEncuestas";
import makeAnimated from 'react-select/animated';
import Select from "react-select";

export default function SeccionFiltrarProyectos({search,setSearch}){

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const { logout } = useContext(AuthContext);


    const animatedComponents = makeAnimated;
    const [listaProyecctos, serListaProyectos] = useState([])
    const [opcionesProyectos,setOpcionesProyectos] = useState([])
    const renderOpcionesProyectos  = (opciones) =>{
        const opcioneslista = opciones.map((h) => ({
            value: h.id,
            label: h.nombre,
        }));
        setOpcionesProyectos(opcioneslista);
    }
    const defaultProyectos = opcionesProyectos.find(
        (option) => option.value === search.id_proyecto
    );

    const [opcionesOrdenesServicio,setOpcionesOrdenesServicio] = useState([])
    const renderOpcionesOrdenesServicio = (opciones) =>{
        let opcioneslista = [];
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = '#'+h.id+' '+h.descripcion
            option.value = h.id
            opcioneslista.push(option)
        })
        setOpcionesOrdenesServicio(opcioneslista)
    }
    
    const getProyectos = () => {
        axios.get(`${APIURL}/estudios/proyectos`,config).then((resp)=>{
            const proyectos = resp.data;
            renderOpcionesProyectos(proyectos);
            
            const proyectosActivos = proyectos.filter(proyecto => proyecto.activo === 1);
            const proyectoActivo = proyectosActivos.length > 0 ? proyectosActivos[proyectosActivos.length - 1] : null;

            if(proyectoActivo){
                setSearch(prevState => ({
                    ...prevState,
                    id_proyecto:  proyectoActivo.id
                })); 
            }

            /* console.log("Proyectos ---> ",proyectoActivo);
            console.log("Proyectos ---> ",search);
            console.log(resp.data); */
        }).catch((resp)=>{
            console.log(resp);
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
        })
    }
    const getOrdenesServicio = () => {
        if(search.id_proyecto === ''){
            return true;
        }
        axios.get(`${APIURL}/estudios/proyectos/${search.id_proyecto }/ordenesdeservicio`,config).then((resp)=>{
            renderOpcionesOrdenesServicio(resp.data);
        }).catch((resp)=>{
            console.log(resp);
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
        })
    }
    
    useEffect(() => {
        getProyectos();
    },[])

    useEffect(() => {
        getOrdenesServicio();
    },[search.id_proyecto])

    return (<>
        <hr/>
        <div className="row">
            <div className="col-md-3">
                <label 
                    htmlFor="id_proyecto" 
                    className="form-label"
                    style={{marginBottom: "1px",color: "darkolivegreen"}}
                >Proyecto:
                </label>
                <Select 
                    name="id_proyecto" 
                    id="id_proyecto" 
                    components={animatedComponents}
                    options={ opcionesProyectos }
                    value={defaultProyectos}
                    onChange={
                        (e)=> {
                            setSearch(prevState => ({
                                ...prevState,
                                id_proyecto: e.value
                            })); 
                        }
                    }>
                </Select>
            </div>
            <div className="col-md-3">
                <label 
                    htmlFor="id_orden_servicio" 
                    className="form-label"
                    style={{marginBottom: "1px",color: "darkolivegreen"}}
                >Orden de servicio:
                </label>
                <Select 
                    name="id_orden_servicio" 
                    id="id_orden_servicio" 
                    components={animatedComponents}
                    options={ opcionesOrdenesServicio }
                    onChange={
                        (e)=> {
                            setSearch(prevState => ({
                                ...prevState,
                                id_orden_servicio: e.value
                            })); 
                        }
                    }>
                </Select>
            </div>
        </div>
        <hr/>
    </>)
}