import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useEffect, useState,useContext } from "react";

export default function SeccionNombreCliente({}){
    
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);

    const [cliente,setCliente] = useState(null);
    //const [user,setUser] = useState(null);

    
    const getClienteUsuario = () => {
        axios.get(`${APIURL}/usuario/cliente`,config).then((resp)=>{
            setCliente(resp.data);
        }).catch((resp)=>{
            console.log(resp);
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
        })
    }
    
    /*const getUsuario = () => {
        axios.post(`${APIURL}/me`,{},config).then((resp)=>{
            setUser(resp.data);
        }).catch((resp)=>{
            console.log(resp);
            if ( resp?.response?.status && resp.response.status === 401) {
                logout()
            }
        })
    }*/
    
    useEffect(() => {
        getClienteUsuario();
        //getUsuario();
    },[])

    return (
    <>
        <h3>{cliente && cliente.nombre}</h3>
    </>
    )
}