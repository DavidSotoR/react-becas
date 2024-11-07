import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export default function Estudio(){

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const { idEstudio } = useParams();

    const [encuesta,setEncuesta] = useState(null)

    const getEsrudioSocioeconomico = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}/encuesta`,config).then((resp)=>{
            setEncuesta(resp.data);
            console.log(resp.data);
        }).catch((resp)=>{
            if (resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    useEffect(() => {
        getEsrudioSocioeconomico();
    })
    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-2"/>
                <div className="col-md-8">
                    <h5>SINERGIA EN ESTUDIOS SOCIOECONÓMICOS</h5>
                    <hr/>
                    {JSON.stringify(encuesta)}
                    {encuesta!==null && (
                        <div>
                            <div className="row">
                                <div className="col-12"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}