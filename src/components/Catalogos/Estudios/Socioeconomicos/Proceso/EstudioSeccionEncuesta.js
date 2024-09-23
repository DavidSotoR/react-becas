import axios from "axios"
import { useEffect,useState } from "react"
import { AuthContext } from "../../../../../context/AuthContext";

function EstudioSeccionEncuesta ({idEstudio}) {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [encuesta,setEncuesta] = useState(null)
    const getEncuesta = () => {
        axios.get(`${APIURL}/estudio/${idEstudio}/encuesta`,config).then((resp)=>{
            console.log(resp.data);
            setEncuesta(resp.data);
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    useEffect(()=>{
        getEncuesta();
    },[])
    return(
        <div className="row">
            <div className="col-md-2"/>
            <div className="col-md-8">
                    <div>
                        <div>
                            <h4>Encuesta: {encuesta?.nombre ? encuesta.nombre : ''}</h4>
                        </div>
                        <hr/>

                        <div className="mb-3 pt-2 row border rounded">
                            <p className="col-sm-2">Nombre Encuesta:</p>
                            <div className="col-sm-10">
                                <p>{encuesta?.nombre ? encuesta.nombre : ''}</p>
                            </div>
                            <p className="col-sm-2">Descripcion:</p>
                            <div className="col-sm-10">
                                <p>{encuesta?.descripcion ? encuesta.descripcion : ''}</p>
                            </div>
                        </div>
                        
                    </div>
            </div>
        </div>)
}

export default EstudioSeccionEncuesta