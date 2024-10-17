import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import makeAnimated from 'react-select/animated';
import { useParams,useNavigate } from "react-router-dom";
import Preguntas from "./Preguntas/Preguntas";
import Evidencias from "./Preguntas/Evidencias";


function Socioeconomico(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { idEstudio } = useParams();
    const navigate = useNavigate();
    const backPage = () => {
      navigate('/');
    };

    const animatedComponents = makeAnimated;


    const [fromData,setFormData] = useState(null);
    const [encuesta,setEncuesta] = useState(null);
    const [verPuntos,setVerPuntos] = useState(false);
    const cambiarVerPuntos = () => {
        setVerPuntos(!verPuntos);
    }

    const [columnRow,setColumnRow] = useState('short');
    const [fromDataError,setFormDataError] = useState({});
    const [editarSeccion,setEditarSeccion] = useState('');

    const getEsrudioSocioeconomico = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}/encuesta`,config).then((resp)=>{
            setEncuesta(resp.data);
            console.log(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }
    
    const listaPreguntas = () => {
        return encuesta?.preguntas ? encuesta.preguntas : null
    }
    
    useEffect(()=>{
        getEsrudioSocioeconomico();
    },[])

    const headerPage = () => {
        return <>
            <div className="mb-3">
                <div className="row">
                    <div className="col-sm-6">
                        <h6 style={{ fontWeight:'bold' }}>Estudio:  { idEstudio } </h6>
                        <p><b>Estudio:</b> {encuesta?.nombre && encuesta.nombre}</p>
                        <p><b>Familia:</b> {encuesta?.estudio && encuesta.estudio.candidato}</p>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-4">
                    <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center" onClick={() => backPage()}>
                        <ion-icon name="chevron-back-outline"></ion-icon>
                        Regresar
                    </Button>
                </div>
                
                <div className="col"></div>
                
                <div className="col-md-4 d-flex flex-row-reverse align-items-center" >
                    <Form.Select 
                        className="form-select form-select-sm"
                        style={{maxWidth:'150px'}}
                        name="vista" 
                        id="vista" 
                        value={columnRow}
                        onChange={(e)=> {setColumnRow(e.target.value)}}>
                        <option value='short'>Vista Corta</option>
                        <option value='length'>Vista Larga</option>
                    </Form.Select>
                    <div className="mt-1 me-1">
                        <input type="checkbox" className="btn-check" id="verpuntos" onChange={cambiarVerPuntos} value={verPuntos} checked={verPuntos} autoComplete="off"/>
                        <label className="btn btn-secondary pt-2" htmlFor="verpuntos">
                            { verPuntos ? (<ion-icon name="eye-outline"></ion-icon>) : (<ion-icon name="eye-off-outline"></ion-icon>) }
                        </label>
                    </div>
                </div>
            </div>
            <hr/>
        </>
    }
    
    return (<>
        <div className="container mt-3">
            
            {headerPage()}
            
            <Preguntas 
                idEstudio={idEstudio}
                preguntas={listaPreguntas()}
                columnRow={columnRow}
                verPuntos={verPuntos}
            />

            <Evidencias
                idEstudio={idEstudio}
                columnRow={columnRow}
            />

       </div> 
    </>)
}

export default Socioeconomico