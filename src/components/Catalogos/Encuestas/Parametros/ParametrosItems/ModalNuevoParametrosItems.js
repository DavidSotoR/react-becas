import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../../../context/AuthContext";

function ModalNuevoParametrosItems({idParametro}){
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [numberSave, setNumberSave] = useState(0);
    const [formValid, setFormValid] = useState(true)
    const [ parametroItem, setParametroItem ] = useState({
        id_catalogo_encuestas_preguntas_parametro_clasificacion: idParametro,
        texto: "",
        limite_superior: "",
        limiten_inferior: "",
        valor: "",
    });

    const formInputChange =(e) => {
        const { name, value } = e.target;
        setParametroItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    
    const clearValuesForm = () => {
        setParametroItem({
            id_catalogo_encuestas_preguntas_parametro_clasificacion: idParametro,
            texto: "",
            limite_superior: "",
            limiten_inferior: "",
            valor: ""
        });
        setNumberSave(prev => prev + 1)
    }
    
    const validateFields = ()=>{
        var messageError = []
        if(parametroItem.id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos === 0){
            messageError.push('Campo paraametro no localizado')
        }
        if (parametroItem.limiten_inferior=== '') {
            messageError.push('Campo Nombre es OBLIGATORIO')
        }
        if (parametroItem.limite_superior=== '') {
            messageError.push('Campo Nombre es OBLIGATORIO')
        }
        if (parametroItem.valor === '') {
            messageError.push('Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres')
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

        axios.post(APIURL+'/catalogos/encuestas/parametros/items',data,config).then((resp)=>{
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
                    id="limiten_inferior" 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="0" 
                    name="limiten_inferior"
                    autoComplete="off"
                    value={parametroItem.limiten_inferior}
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
                id="valor" 
                type="text" 
                className="form-control form-control-sm" 
                placeholder="0" 
                name="valor"
                autoComplete="off"
                value={parametroItem.valor}
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
export default ModalNuevoParametrosItems;
