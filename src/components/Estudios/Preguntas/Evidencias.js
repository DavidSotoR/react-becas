import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ImagenId from "./ImagenId";
import SubirImagenPorTipoDocumento from "./SubirImagenPorTipoDocumento";

export default  function Evidencias({idEstudio, columnRow}) {
    const { logout } = useContext(AuthContext);

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [documentosLista,setDocumentosLista] = useState([]);
    
    const [colClass,setColClass] = useState('col-8');

    const vista = () => {
        switch(columnRow){
            //Vista Larga
            case 'length':
                setColClass('col-md-12');
            break;
            //Vista Corta
            //short
            default:
                setColClass('col-md-8');
            break;
        }
    }

    const getFilesDeFamilia = () => { 
        axios.get(APIURL+"/estudio/"+ idEstudio +"/documentos",config).then((resp)=>{
            //setFilesDeFamilia(resp.data)
            setDocumentosLista(resp.data);
            console.log('setDocumentosLista');
            console.log(resp.data);
            
        }).catch((err)=>{
            if (err.response.status === 401) {
                logout()
            }            
        })
    }
    





    useEffect(()=>{
        getFilesDeFamilia()
    },[])

    useEffect(() => {
        vista();
    },[columnRow]);
 

    return (
        <div className="container mt-3 mb-3">
            {Array.isArray(documentosLista) && documentosLista.map((seccion, index) => (
                <div key={'si'+index}>
                    <div className="row">
                        <div className="col" />
                        <div className={colClass}>
                            <h4>{seccion.nombre}</h4>
                            <hr/>
                        </div>
                        <div className="col" />
                    </div>
                    <div>                        
                    <div className="ms-2 pt-2 me-auto">
                            <div className="row pb-2">
                                <div className="col"></div>
                                <div className={colClass}>
                                    <div className="row">
                                        {seccion.documentos.length !== 0 && seccion.documentos.map((doc,imgKey)=> {
                                            return(
                                                <div
                                                    key={'ei-img'+index+'-'+imgKey}
                                                    className="col-6 p-1"
                                                    style={{backgroundColor: '#e9e9e9'}}
                                                >
                                                    <ImagenId id={doc.id}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="col"></div>
                            </div>
                            <div className="mb-3">
                                <div className="row">
                                    <div className="col" />
                                    <div className={colClass}>
                                        <SubirImagenPorTipoDocumento idEstudio={idEstudio} idDocTipo={seccion.id}  getFilesDeFamilia={getFilesDeFamilia}/>
                                    </div>
                                    <div className="col" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
    
}




 