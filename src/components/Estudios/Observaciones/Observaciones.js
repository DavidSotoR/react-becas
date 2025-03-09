import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

export default function Observaciones({idEstudio,encuesta,callback,columnRow}){

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const longitudRespuesta = 900;
    const [colClass,setColClass] = useState('col-8');
    const [observaciones,setObservaciones] = useState('');

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
    
    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }

    const longitudTexto = (text = '',longitud = 0) => {
        const dif = longitud - text.length;
        const porcentaje = longitud ? ((dif / longitud) * 100) : 0;
        let color = '#212529';
        if(porcentaje < 10 ){
            color = '#ffb427';
        }
        if(porcentaje < 5 ){
            color = '#d50000';
        }
        return <span style={{color:color}}>{text.length + '/' + longitud + 'letras'}</span>;
    }

    const textChange = (e,index) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        const texto = convertirAMayusculas(e.target.value);
        
        setObservaciones(texto);

        setTimeout(() => {
            e.target.setSelectionRange(start, end);
        }, 0);
    };

    const save = () => {
        const fromData = {id:idEstudio,observaciones:observaciones};
        axios.post(`${APIURL}/estudio/observaciones`,fromData,config).then((resp)=>{
            callback();
        }).catch((resp)=>{
            console.log(resp);
        })
    }

    useEffect(() => {
        vista();
    },[columnRow]);

    useEffect(() => {
        if(encuesta?.aniadir_observaciones){
            setObservaciones(encuesta.observaciones);
        }
    },[encuesta]);

    return encuesta?.aniadir_observaciones && encuesta.aniadir_observaciones === 1  && (
        <>
        <div className="row">
            <div className="col" />
            <div className={colClass}>
                <h4>Resumen del estudio:</h4>
                <hr/>
            </div>
            <div className="col" />
        </div>
        
        <div className="row">
            <div className="col" />
            <div className={colClass}> 
                <div>
                    {longitudTexto(observaciones ?? '',longitudRespuesta)}
                </div>
                <div>
                    <textarea
                        value={observaciones ?? ''}
                        onChange={(e) => {textChange(e)}}
                        maxLength={longitudRespuesta}
                        style={{
                            width: '100%',
                            height: '200px',
                            padding: '5px',
                            lineHeight: '1.55', // Espacio entre líneas
                            backgroundImage: `linear-gradient(to bottom, transparent 95%, lightgray 5%)`, // Fondo con líneas
                            backgroundSize: '100% 20px', // Tamaño del patrón de líneas
                            resize: 'none', // Evita cambiar el tamaño del textarea
                            border: '1px solid lightgray',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div className={"m-1 "+colClass}>
                    
                    <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center" onClick={() => save()}>
                        Guardar
                    </Button>
                </div>
            </div>
            <div className="col" />
        </div>
        </>
    )
}