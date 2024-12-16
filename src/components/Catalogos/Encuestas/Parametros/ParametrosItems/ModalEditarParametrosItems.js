import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../../../context/AuthContext";

function ModalEditarParametrosItems({ item, idParametro, idClasificacionParametroTipo, onSave }) {
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    };

    const [formValid, setFormValid] = useState(true);
    const [parametroItem, setParametroItem] = useState({
        id: item.id,
        id_catalogo_encuestas_preguntas_parametro_clasificacion: idParametro,
        id_clasificacion_parametro:idClasificacionParametroTipo,
        texto: item.texto || "",
        limite_superior: item.limite_superior || "0",
        limiten_inferior: item.limiten_inferior || "0",
        valor: item.valor || "",
    });

    const formInputChange = (e) => {
        const { name, value } = e.target;
        setParametroItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

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

    const validateFields = () => {
        const messageError = [];
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
            messageError.push('Campo Valor es OBLIGATORIO');
        }
        if (messageError.length === 0) {
            setFormValid(false);
        } else {
            setFormValid(true);
        }
    };

    const putDataParametroItem = () => {
        const data = parametroItem;
        axios.put(`${APIURL}/catalogos/encuestas/parametros/items/${item.id}`, data, config)
            .then(() => {
                onSave();
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    logout();
                }
                console.error(error.response);
            });
    };

    const clearValuesForm = () => {
        setParametroItem({
            id: item.id,
            id_catalogo_encuestas_preguntas_parametro_clasificacion: idParametro,
            id_clasificacion_parametro:idClasificacionParametroTipo,
            texto: item.texto || "",
            limite_superior: item.limite_superior || "",
            limiten_inferior: item.limiten_inferior || "",
            valor: item.valor || "",
        });
        setFormValid(true);
    };
    
    useEffect(()=>{
        validateFields();
    },[parametroItem])
    
    // Case Clasificacion Parametro: Coincidencia Acumulativa
    const formularioItemsClasificacionParametro = () => {
        return  (
            <tr key={`pietr-edit-${item.id}`}>
                <td>
                    <input 
                        id="texto" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="" 
                        name="texto"
                        autoComplete="off"
                        value={parametroItem.texto}
                        onChange={(e)=> textChange(e)}
                        onBlur={validateFields}/>
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
                    onChange={(e)=> formInputChange(e)}
                    onBlur={validateFields}/>
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
                    onChange={(e)=> formInputChange(e)}
                    onBlur={validateFields}/>
                </td>
                <td>
                    <div style={{ display: "flex" }}>
                        <Button variant="light" onClick={putDataParametroItem} disabled={formValid}>
                            <ion-icon name="save-outline"></ion-icon>
                        </Button>
                        <Button variant="light" style={{ marginLeft: "5px" }} onClick={()=>onSave()}>
                            <ion-icon name="arrow-undo-circle-outline"></ion-icon>
                        </Button>
                    </div>
                </td>
            </tr>
        );
    }
    
    // Case Clasificacion Parametro: Rangos Numericos 
    const formularioItemsParametrosSeleccionUnica = () => {
        return  (
            <tr key={`pietr-edit-${item.id}`}>
                <td>
                    <input 
                        id="texto" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="" 
                        name="texto"
                        autoComplete="off"
                        value={parametroItem.texto}
                        onChange={(e)=> textChange(e)}
                        onBlur={validateFields}/>
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
                    onChange={(e)=> formInputChange(e)}
                    onBlur={validateFields}/>
                </td>
                <td>
                    <div style={{ display: "flex" }}>
                        <Button variant="light" onClick={putDataParametroItem} disabled={formValid}>
                            <ion-icon name="save-outline"></ion-icon>
                        </Button>
                        <Button variant="light" style={{ marginLeft: "5px" }} onClick={()=>onSave()}>
                            <ion-icon name="arrow-undo-circle-outline"></ion-icon>
                        </Button>
                    </div>
                </td>
            </tr>
        );
    }

    // Case Clasificacion Parametro default 
    const formularioItemsParametrosRangosNumericos = () => {
        return (
            <tr key={`pietr-edit-${item.id}`}>
                <td>
                    <input 
                        id="limiten_inferior" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="0" 
                        name="limiten_inferior"
                        autoComplete="off"
                        value={parametroItem.limiten_inferior}
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
                        id="valor" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="0" 
                        name="valor"
                        autoComplete="off"
                        value={parametroItem.valor}
                        onChange={formInputChange}
                        onBlur={validateFields}
                    />
                </td>
                <td>
                    <div style={{ display: "flex" }}>
                        <Button variant="light" onClick={putDataParametroItem} disabled={formValid}>
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

export default ModalEditarParametrosItems;
