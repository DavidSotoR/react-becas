import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../context/AuthContext";

export default function ModalNuevoPuntoItems({ item, idEncuesta, onSave, setNumberSave }){
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    };

    const [formValid, setFormValid] = useState(true);
    const [parametroItem, setParametroItem] = useState(item);/* useState({
        id: item.id,
        id_catalogo_encuesta: idEncuesta,
        limite_superior: item.limite_superior || "0",
        limite_inferior: item.limite_inferior || "0",
        porcentaje_sujerido: item.porcentaje_sujerido || "0",
    });*/

    const formInputChange =(e) => {
        const { name, value } = e.target;
        if (/^\d*$/.test(value)) {
            setParametroItem(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
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

    const putDataEditarParametroItem = () =>{
        var data = parametroItem;

        axios.put(`${APIURL}/catalogos/encuestas/rangos`,data,config).then((resp)=>{
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

    return (
        <tr key={`pietr-edit-${item.id}`}>
            <td>
                <input 
                    id="limite_inferior" 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="0" 
                    name="limite_inferior"
                    autoComplete="off"
                    value={parametroItem.limite_inferior}
                    onChange={formInputChange}
                    onBlur={validateFields}
                />
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
                    onChange={formInputChange}
                    onBlur={validateFields}
                />
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
                    onChange={formInputChange}
                    onBlur={validateFields}
                />
            </td>
            <td>
                <div style={{ display: "flex" }}>
                    <Button variant="light" onClick={putDataEditarParametroItem} disabled={formValid}>
                        <ion-icon name="save-outline"></ion-icon>
                    </Button>
                    <Button variant="light" style={{ marginLeft: "5px" }} onClick={()=>onSave()}>
                        <ion-icon name="arrow-undo-circle-outline"></ion-icon>
                    </Button>
                </div>
            </td>
        </tr>
    )
}