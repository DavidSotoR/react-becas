import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../../../../../context/AuthContext";

function ModalNuevoParametrosItems({idParametro,idPregunta,idClasificacionParametroTipo,numberSave,setNumberSave}){
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    
    const [formValid, setFormValid] = useState(true)
    const [ parametroItem, setParametroItem ] = useState({
        id_catalogo_encuestas_preguntas_parametro_clasificacion: idParametro,
        id_catalogo_encuestas_preguntas:idPregunta,
        id_clasificacion_parametro:idClasificacionParametroTipo,
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
    
    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }

    const textChange = (e,index) => {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;

        const name = e.target.name;

        const texto = convertirAMayusculas(e.target.value);
        setParametroItem(prevState => ({
            ...prevState,
            [name]: texto
        }));

        setTimeout(() => {
            e.target.setSelectionRange(start, end);
        }, 0);
    };
    
    const clearValuesForm = () => {
        setParametroItem({
            id_catalogo_encuestas_preguntas_parametro_clasificacion: idParametro,
            id_catalogo_encuestas_preguntas:idPregunta,
            id_clasificacion_parametro:idClasificacionParametroTipo,
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
        if (idClasificacionParametroTipo !== 4 && idClasificacionParametroTipo !== 5 && parametroItem.limiten_inferior=== '') {
            messageError.push('Campo Nombre es OBLIGATORIO')
        }
        if (idClasificacionParametroTipo !== 5 &&parametroItem.limite_superior=== '') {
            messageError.push('Campo Nombre es OBLIGATORIO')
        }
        if ((idClasificacionParametroTipo === 4 || idClasificacionParametroTipo === 5) && parametroItem.texto=== '') {
            messageError.push('Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres')
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

    // Case Clasificacion Parametro: Coincidencia Acumulativa
    const formularioItemsClasificacionParametro = () => {
        return  (
            <tr key={'pietr-'+numberSave}>
                <td>
                    <input 
                        id="texto" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="" 
                        name="texto"
                        autoComplete="off"
                        value={parametroItem.texto}
                        onChange={(e)=> textChange(e)}/>
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

    // Case Clasificacion Parametro: Rangos Numericos 
    const formularioItemsParametrosSeleccionUnica = () => {
        return  (
            <tr key={'pietr-'+numberSave}>
                <td>
                    <input 
                        id="texto" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="" 
                        name="texto"
                        autoComplete="off"
                        value={parametroItem.texto}
                        onChange={(e)=> textChange(e)}/>
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

    // Case Clasificacion Parametro default 
    const formularioItemsParametrosRangosNumericos = () => {
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

    const caseClasificacionParametroTipo = () => {
        switch(idClasificacionParametroTipo){
            case 4:
                return formularioItemsClasificacionParametro();
            break;
            case 5:
                return formularioItemsParametrosSeleccionUnica();
            break;
            default:
                return formularioItemsParametrosRangosNumericos();
        }
    }
    return caseClasificacionParametroTipo();
}
export default ModalNuevoParametrosItems;
