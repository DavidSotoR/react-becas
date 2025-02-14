import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../../context/AuthContext";

export default function ModalNuevoPuntoItems({idEncuesta,numberSave,setNumberSave}){

    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [formValid, setFormValid] = useState(true)
    const [ parametroItem, setParametroItem ] = useState({
        id_catalogo_encuesta: idEncuesta,
        limite_superior: "",
        limite_inferior: "",
        porcentaje_sujerido: "",
    });
    
    const formInputChange =(e) => {
        const { name, value } = e.target;
        if (/^\d*$/.test(value)) {
            setParametroItem(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }
    
    const clearValuesForm = () => {
        setParametroItem({
            id_catalogo_encuesta: idEncuesta,
            limite_superior: "",
            limite_inferior: "",
            porcentaje_sujerido: ""
        });
        setNumberSave(prev => prev + 1)
    }
    const validateFields = ()=>{
        var messageError = []

        if ( parametroItem.limite_superior=== '') {
            messageError.push('Campo Rango inferior es OBLIGATORIO')
        }
        if ( parametroItem.limite_inferior=== '') {
            messageError.push('Campo Rango superior es OBLIGATORIO')
        }
        if (parametroItem.porcentaje_sujerido === '') {
            messageError.push('Campo 	Porcentaje sujerido es OBLIGATORIO')
        }
        console.log(messageError);
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }
    
    const postDataNuevoParametroItem = () =>{
        var data = parametroItem;

        axios.post(`${APIURL}/catalogos/encuestas/rangos`,data,config).then((resp)=>{
            //getListaParametrosItem();
            clearValuesForm();
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
    }
        
    useEffect(()=>{
        validateFields();
    },[parametroItem])

    return  (
                <tr key={'pietr-'+numberSave}>
                    <td>
                    <input 
                        id="limite_inferior" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="0" 
                        name="limite_inferior"
                        autoComplete="off"
                        value={parametroItem.limite_inferior}
                        onChange={(e)=> formInputChange(e)}/>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>-</span>
                    </td>
                    <td>
                    <input 
                        id="limite_superior" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="0" 
                        name="limite_superior"
                        autoComplete="off"
                        value={parametroItem.limite_superior}
                        onChange={(e)=> formInputChange(e)}/>
                    </td>
                    <td>
                        <span style={{ fontWeight: "bold" }}>=</span>
                    </td>
                    <td>
                    <input 
                        id="porcentaje_sujerido" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="0" 
                        name="porcentaje_sujerido"
                        autoComplete="off"
                        value={parametroItem.porcentaje_sujerido}
                        onChange={(e)=> formInputChange(e)}/>
                    </td>
                    <td>
                        <div style={{ display: "flex" }}>
                            <Button variant="light" onClick={postDataNuevoParametroItem} disabled={formValid}>
                                <ion-icon name="save-outline"></ion-icon>
                            </Button>
                            <Button variant="light" style={{ marginLeft: "5px" }} onClick={clearValuesForm}>
                                <ion-icon name="trash-bin-outline"></ion-icon>
                            </Button>
                        </div>
                    </td>
                </tr>
            );
}