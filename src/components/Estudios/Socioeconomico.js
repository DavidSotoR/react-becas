import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import makeAnimated from 'react-select/animated';
import { useParams,useNavigate } from "react-router-dom";
import EstudioSeccionEstudio from "./Proceso/EstudioSeccionEstudio";
import EstudioSeccionFamilia from "./Proceso/EstudioSeccionFamilia";
import EstudioSeccionPadres from "./Proceso/EstudioSeccionPadres";
import EstudioSeccionUbicacion from "./Proceso/EstudioSeccionUbicacion";
import EstudioSeccionEncuesta from "./Proceso/EstudioSeccionEncuesta";

function Estudio(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { idEstudio } = useParams()
    const navigate = useNavigate();
    const backPage = () => {
      navigate('/');
    };

    const animatedComponents = makeAnimated;


    const [fromData,setFormData] = useState(nuevoUsuario)

    const [fromDataError,setFormDataError] = useState({})
    const [editarSeccion,setEditarSeccion] = useState('')

    
    const sendDataEstudioSocioeconomico = () =>{
        axios.post(`${APIURL}/estudio/socioeconomico`,fromData,config).then((resp)=>{
            const {message,data} = resp.data
            console.log(resp);
            setFormData(nuevoUsuario);

        }).catch((err)=>{
            if(err.code === "ERR_BAD_REQUEST"){
                const data =err.response.data;
                if(data?.errors){
                    setFormDataError(data.errors);
                }
            }
            console.log(err);
        })
    }

    const getEsrudioSocioeconomico = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}`,config).then((resp)=>{
            console.log(resp.data);
            let data =  resp.data;
            if(data?.latitud){
                data.latitud = '';
                data.longitud = '';
            }
            setFormData(data);
        }).catch((resp)=>{
            setClientesComunes([]);
            console.log(resp);
        })
    }
    
    
    
    useEffect(()=>{
        getEsrudioSocioeconomico();
    },[])

    useEffect(() => {
        if(fromData.es_cliente_comun === true){
            getListaClientesHermanos();
            renderOptionClientesComunesDefaultSet(fromData.colegios_comunes);
        }else{
            setClientesComunes([]);
        }
    },[fromData.id_cliente,fromData.es_cliente_comun])
    
    return(<>
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Estudio Socioeconómico: {{idEstudio}}</h6>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-2">
                    <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center" onClick={() => backPage()}>
                        <ion-icon name="chevron-back-outline"></ion-icon>
                        Regresar
                    </Button>
                </div>
            </div>
            <hr/>

            <EstudioSeccionEstudio fromData={fromData}/>

            <EstudioSeccionFamilia 
                fromData={fromData} 
                setFormData={setFormData} 
                fromDataError={fromDataError} 
                editarSeccion={editarSeccion} 
                clientesComunes={clientesComunes}
                clientesComunesDefault={clientesComunesDefault}
                setEditarSeccion={setEditarSeccion} />

            {fromData['padre'] !== null &&(
                <EstudioSeccionPadres 
                familiar={'padre'}
                fromData={fromData} 
                setFormData={setFormData}
                fromDataError={fromDataError}
                editarSeccion={editarSeccion}
                setEditarSeccion={setEditarSeccion}
                />
            )}
            {fromData['madre'] !== null &&(
                <EstudioSeccionPadres 
                familiar={'madre'}
                fromData={fromData} 
                setFormData={setFormData}
                fromDataError={fromDataError}
                editarSeccion={editarSeccion}
                setEditarSeccion={setEditarSeccion}
                />
            )}

            <EstudioSeccionUbicacion
                fromData={fromData} 
                setFormData={setFormData}
                fromDataError={fromDataError}
                editarSeccion={editarSeccion}
                setEditarSeccion={setEditarSeccion}
                />
            <EstudioSeccionEncuesta 
                idEstudio={idEstudio}
                />

       </div> 
    </>)
}

export default Estudio