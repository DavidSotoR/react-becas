import axios from "axios";
import { useEffect, useState,useContext } from "react";
import ListaProyectos from "./ListaProyectos/ListaProyectos";
import { AuthContext } from "../../context/AuthContext";
import ListaEncuestas from "./ListaEncuestas/ListaEncuestas";
import makeAnimated from 'react-select/animated';
import Select from "react-select";
import SeccionFiltrarProyectos from "./SeccionFiltrarProyectos";
import SeccionNombreCliente from "./SeccionNombreCliente";

export const HomePageEmpresa = () =>{
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [roleSession, setRoleSession] = useState(localStorage.getItem('role') || '')
    const { logout } = useContext(AuthContext);

    const [search,setSearch] = useState({
        id_proyecto:'',
        id_orden_servicio:'',
        id_estado:'',
    })
    
    
    const mostrarSeccion = () => {
        if(roleSession === 'Empresas'){
            return true
        }
        return false
    }

    return (
        <div className="container">
            <SeccionNombreCliente></SeccionNombreCliente>
            <SeccionFiltrarProyectos search={search} setSearch={setSearch}></SeccionFiltrarProyectos>
            <ListaEncuestas idProyecto={search.id_proyecto} idOrdenServicio={search.id_orden_servicio}></ListaEncuestas>
        </div>
    )
}