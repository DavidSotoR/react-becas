import axios from "axios";
import { useContext, useEffect, useState, useRef  } from "react";
import { AuthContext } from "../../../context/AuthContext";

function SubirImagenPorTipoDocumento({idEstudio,idDocTipo,getFilesDeFamilia, seccion}){
    const { logout } = useContext(AuthContext);

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [ success, setSuccess ] = useState(false)
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null); 
    
    const subirDocumentacion = () => {

        const formData = new FormData();
        if (!file) {
            alert("Seleccione un archivo antes de subir.");
            return;
        }
        
        formData.append('id_familias_documentos_tipo', idDocTipo)
        formData.append('id_servicio_estudio', idEstudio)
        for (let i = 0; i < file.length; i++) {
            formData.append('files[]', file[i]); // Importante: 'files[]' para múltiples archivos
        }

        axios.post(APIURL+"/familias/documentos",formData,config).then((resp) => {
            console.log(resp);
            setSuccess(true)
            fileInputRef.current.value = null;
            getFilesDeFamilia()
        }).catch((err)=>{
            console.log(err);
            if (err.response.status === 401) {
                logout()
            }
            setSuccess(false)
        })
    }


    const actualizoInputFiles = (e) =>{
        setFile(e.target.files); 
    }
 
    return (
    <div>
        <label htmlFor="formFileMultipleIngresos" className="form-label">Cargar archivos <span className="fw-bold">{ seccion }</span>:</label>

        <input 
            className="form-control"
            onChange={ (e) => { actualizoInputFiles(e) } }
            accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx" 
            type="file" 
            ref={fileInputRef}
            id="formFileMultipleIngresos" 
            multiple />

        <button 
            className="btn btn-primary mt-2 btn-sm" 
            onClick={() => { subirDocumentacion() }}
        > Subir Archivos <span className="fw-bold">{ seccion }</span></button>
    </div>
    )
}

export default SubirImagenPorTipoDocumento;