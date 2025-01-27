import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ImagenId from "./ImagenId";


export default  function EvidenciasVista({idEstudio, columnRow}) {
    const { logout } = useContext(AuthContext);

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [documentosLista,setDocumentosLista] = useState([]);
    
    const [colClass,setColClass] = useState('col-8');
    const [lgShow, setLgShow] = useState(false);
    const [fileDeleteShow, setFileDeleteShow] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [ dataImgShow, setDataImgShow ] = useState(null);
    const [showToastSuccess, setShowToastSuccess] = useState(false);



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

    useEffect(()=>{
        
        if (lgShow === false) {
            getFilesDeFamilia()    
        }
        
    },[lgShow, fileDeleteShow])


    useEffect(() => {
        vista();
    },[columnRow]);
 
    const expandImg = (img) =>{
        console.log(img);
        setLgShow(true)
        setDataImgShow(img)

        
    }

    const expandFile = (file) =>{
        console.log(file);
        setFileName(file.nombre)
        setFileDeleteShow(true)
        setDataImgShow(file)

        
    }


    return (
        <div className="container mt-3 mb-3">

            
            {Array.isArray(documentosLista) && documentosLista.map((seccion, index) => {
                return (seccion.nombre === "CASA HABITACION" || seccion.nombre === "AUTOMOVILES" ) ? 
                (
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
                                            const esImagen = doc.nombre.endsWith('.PNG') || doc.nombre.endsWith('.JPG') || doc.nombre.endsWith('.JEPG');

                                            return( esImagen ? (
                                                <div
                                                    key={'ei-img'+index+'-'+imgKey}
                                                    className="col-6 p-1" onClick={ () => expandImg(doc)}
                                                    style={{backgroundColor: '#e9e9e9'}}
                                                >
                                                    <ImagenId id={doc.id} name={doc.nombre}/>
                                                </div>
                                            ) : (
                                                <div
                                                    key={'ei-img'+index+'-'+imgKey}
                                                    className="col-6 p-1 text-center pt-5"
                                                    style={{backgroundColor: '#e9e9e9'}}
                                                >
                                                    <ImagenId id={doc.id} name={doc.nombre}/>
                                                    <button
                                                        type="button" onClick={()=>expandFile(doc)}
                                                        className="btn btn-sm btn-icon-danger"
                                                        data-bs-toggle="button"
                                                        >
                                                        <i style={{ color: "red" }} className="bi bi-trash-fill"></i>
                                                    </button>
                                                </div>
                                            )
                                                
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="col"></div>
                            </div>
                        </div>
                    </div>
                </div>
                ) : <></>
            })}
        </div>
    )
    
}




 