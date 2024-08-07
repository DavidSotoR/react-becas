import axios from "axios";
import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../../../../context/AuthContext";

function ModalEditarParametrosItems({ item, idParametro, onSave }) {
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
        texto: item.texto || "",
        limite_superior: item.limite_superior || "",
        limiten_inferior: item.limiten_inferior || "",
        valor: item.valor || "",
    });

    const formInputChange = (e) => {
        const { name, value } = e.target;
        setParametroItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateFields = () => {
        const messageError = [];
        if (parametroItem.limiten_inferior === '') {
            messageError.push('Campo Límite Inferior es OBLIGATORIO');
        }
        if (parametroItem.limite_superior === '') {
            messageError.push('Campo Límite Superior es OBLIGATORIO');
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
            texto: item.texto || "",
            limite_superior: item.limite_superior || "",
            limiten_inferior: item.limiten_inferior || "",
            valor: item.valor || "",
        });
        setFormValid(true);
    };

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
    );
}

export default ModalEditarParametrosItems;
