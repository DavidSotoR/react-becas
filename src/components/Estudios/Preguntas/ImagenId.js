import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const ImagenId = ({ id }) => {
    const { logout } = useContext(AuthContext);

    const APIURL = process.env.REACT_APP_API_URL;
    //'http://127.0.0.1:8000/storage/'
    const SERVER_STORAGE = process.env.SERVER_STORAGE;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [imageSrc, setImageSrc] = useState(null); // Para almacenar la URL de la imagen
    const [docType,setDocType] = useState('');

    const getImagen = (id) => {
        let configImg = config;
        configImg.responseType = 'blob'; // Asegurarse de que la respuesta sea de tipo blob
        axios.get(`${APIURL}/familias/documentos/file/${id}`, configImg)
            .then((response) => {
                const contentType = response.headers['content-type'];
                setDocType(contentType);
                const imageUrl = URL.createObjectURL(response.data); // Crear la URL del blob
                setImageSrc(imageUrl); // Actualizar el estado con la URL de la imagen
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    logout(); // Manejar errores si es necesario
                }
            });
    };

    // Llamar a getImagen cuando el componente se monte
    useEffect(() => {
        getImagen(id); // Llama a la función para obtener la imagen usando el id
    }, [id]); // Solo se ejecuta cuando cambia el id
    const elementoTipo = () => {

        return  docType && docType.startsWith('image/') ? (
                <img 
                    src={imageSrc} 
                    className='w-100'
                    style={{maxHeight:'300px'}}
                    alt={"Documento de la familia "+docType }/>
                ) :(
                <div>
                    <p>Este archivo es un documento.</p>
                    {imageSrc && (
                        <a href={imageSrc} download={`documento_${id}`}>
                            Descargar documento
                        </a>
                    )}
                </div>
                )
    }
    return (
        <div>
            {imageSrc ? elementoTipo() : (
                <p>Cargando imagen...</p>
            )}
        </div>
    );
};

export default ImagenId;