import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import ImagenId from "./ImagenId";
import SubirImagenPorTipoDocumento from "./SubirImagenPorTipoDocumento";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ImagenIdShow from "./ImgenIdShow";
import Toast from 'react-bootstrap/Toast';


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

    const deleteFileFamilia = () => {
        axios
          .delete(
            APIURL + "/familias/documentos/file/" + dataImgShow.id,
            config
          )
          .then((resp) => {
            console.log(resp);
            setLgShow(false)
            setShowToastSuccess(true)
            setFileDeleteShow(false)
          })
          .catch((err) => {
            console.log(err);
          }).then(()=>{
            console.log('termino');            
          });
      };

    return (
        <div className="container mt-3 mb-3">
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Body>
                    
                   { dataImgShow !== null ? (
                    <ImagenIdShow id={dataImgShow.id}/>
                   ) : ( <p>No cuenta con img</p> ) }
                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setLgShow(false)}>
                    Cerrar
                    </Button>
                    <Button variant="danger" onClick={() => deleteFileFamilia(dataImgShow)}>
                    Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={fileDeleteShow}
                onHide={() => setFileDeleteShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Body>
                    
                   { dataImgShow !== null ? (
                    <ImagenIdShow id={dataImgShow.id} name={ fileName }/>
                   ) : ( <p>No cuenta con Archivo para eliminar.</p> ) }
                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setFileDeleteShow(false)}>
                    Cerrar
                    </Button>
                    <Button variant="danger" onClick={() => deleteFileFamilia(dataImgShow)}>
                    Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Toast onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={6000} autohide
                className="d-inline-block m-1 alert-position" 
                bg="success"
                key="1"
            >
                <Toast.Header>
                <strong className="me-auto">Completado</strong>
                </Toast.Header>
                <Toast.Body className="text-white">
                    Se Elimino correctamente el archivo.
                </Toast.Body>
            </Toast>
            
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
                            <div className="mb-3">
                                <div className="row">
                                    <div className="col" />
                                    <div className={colClass}>
                                        <SubirImagenPorTipoDocumento idEstudio={idEstudio} idDocTipo={seccion.id}  getFilesDeFamilia={getFilesDeFamilia} seccion={seccion.nombre}/>
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




 