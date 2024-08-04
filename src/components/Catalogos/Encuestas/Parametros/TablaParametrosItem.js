import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";

function TablaParametrosItem({idParametro,idParametroTipo}) {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const [ allParametrosItem, setAllParametrosItem ] = useState([]);
    const getListaParametrosItem = () => {
        axios.get(APIURL+`/catalogos/encuestas/parametros/${idParametro}/items`,config).then((resp)=>{
            setAllParametrosItem(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }
    const {numberSave, setNumberSave} = useState(0);

    
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
    
    const clearValuesForm = () => {
        setParametroItem({
            id_catalogo_encuestas_preguntas_parametro_clasificacion: idParametro,
            texto: "",
            limite_superior: "",
            limiten_inferior: "",
            valor: ""
        });
        const newNS = numberSave++;
        setNumberSave(newNS);
    }

    const postDataNuevoParametroItem = () =>{
        var data = parametroItem;
        //data.id_catalogo_encuestas_preguntas_parametro_clasificacion = idParametro

        axios.post(APIURL+'/catalogos/encuestas/parametros/items',data,config).then((resp)=>{
            getListaParametrosItem();
            clearValuesForm();
        }).catch((resp)=>{
            if (resp.status === 401) {
                logout()
            }
        })
    }

    useEffect(()=>{
        validateFields();
        getListaParametrosItem();
    },[idParametro,parametroItem,numberSave])


    const tablaNuevoParametrosItem = (next) => {
        return  (
            <tr key={'pietr-'+numberSave}>
                <td>
                    <input 
                        id="limiten_inferior" 
                        type="text" 
                        className="form-control form-control-sm" 
                        placeholder="0" 
                        name="limiten_inferior" 
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
                    value={parametroItem.valor}
                    onChange={(e)=> formInputChange(e)}/>
                </td>
                <td>
                    <Button variant="primary" onClick={postDataNuevoParametroItem} disabled={formValid}>
                        Crear
                    </Button>
                </td>
            </tr>
        );
    };
    const listaTablaParametrosItem = () => {
        return allParametrosItem.map((pregunta_item, index) => (
            <tr key={'pitr-'+index}>
                <td>
                    <span style={{ fontWeight: "bold" }}>{pregunta_item.limiten_inferior}</span>
                </td>
                <td>
                    <span style={{ fontWeight: "bold" }}>-</span>
                </td>
                <td>
                    <span style={{ fontWeight: "bold" }}>{pregunta_item.limite_superior}</span>
                </td>
                <td>
                    <span style={{ fontWeight: "bold" }}>=</span>
                </td>
                <td>
                    <span style={{ fontWeight: "bold" }}>{pregunta_item.valor}</span>
                </td>
                <td>
                </td>
            </tr>
        ));
    };

    return (<> 
    {idParametroTipo === 1 && (
        <div>
            <div className="seccion-table-parametros">
                <table key={'tabpm-'+idParametroTipo} className="table items-parametros">
                    <tbody>
                        {listaTablaParametrosItem()}
                        {tablaNuevoParametrosItem()}
                    </tbody>
                </table>
            </div>

        </div>
    )}
    </>)
}

export default TablaParametrosItem;

//id_catalogo_encuestas_preguntas_parametros_clasificaciones_tipos