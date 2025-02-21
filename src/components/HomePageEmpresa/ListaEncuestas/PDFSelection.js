import React,{ useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";

export default function PDFSelection({seleccionRow}){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        responseType: "blob",
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [loading, setLoading] = useState(false);
    /*const getProyectoID = () => { 

        const lista_encuestas = seleccionRow.map((item) => item.id);
        
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }

        axios.get(`${APIURL}/estudios/proyectos/${idProyecto}`,config).then((resp)=>{
            setProyecto(resp.data);
        }).catch((resp)=>{
            if (resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }*/


  const downloadZipEstudiosSeleccionados = async () => {
    setLoading(true);
    const zip = new JSZip();
    const folder = zip.folder("Estudios"); // Carpeta dentro del zip

    try {

        for (const row of seleccionRow) {
            const response = await axios.get(`${APIURL}/estudio/socioeconomico/${row.id}/pdf${row?.hijo ? '?id_hijo='+row.hijo.id : ''}`, config);
            folder.file(`${row.id}_${row.candidato}_${row?.nombre_hijo  && row.nombre_hijo}.pdf`, response.data, { binary: true });
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "archivos.zip");
    } catch (error) {
        console.error(`Error al descargar el PDF`, error);
    } finally {
        setLoading(false); // Ocultar el estado de carga
    }

  };

  return ( 
    <button
      onClick={downloadZipEstudiosSeleccionados} title="Descargar PDFs" style={{ fontSize: loading ? '.9rem' : '1.4rem ' }}
      className={`btn btn-outline text-danger ${loading ? "disabled" : ""}`}
      disabled={loading}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true" style={{ fontSize: '1rem' }}
          ></span>
          Procesando...
        </>
      ) : (
        <i className="bi bi-filetype-pdf"></i>
        
      )}
    </button>
  );
    
}