import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

function PageNuevoCliente() {
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const [allColegiosHermanos,setAllColegiosHermanos] = useState([]);
    const [esColegioComun, setEsColegioComun] = useState(false)

    const [formValid, setFormValid] = useState(true)
    const [formData, setFormData] = useState({
        id_tipo_cliente: '',
        nombre:'',
        descripcion: '',
        notificaciones_email: '',
        id_clientes_hermanos: null
    })

    const formInputChange =(e) => {
        var name = e.target.name
        var value = (e.target.value === "null") ? null : e.target.value;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

    }

    const changeTipoCliente = (e) =>{
        getAllColegiosHermanos(e.target.value);
    }

    const selectEsColegioComun = (e) => {
        setEsColegioComun(e.target.checked);
        if(!e.target.checked){

            setFormData((prevFormData) => ({
                ...prevFormData,
                id_clientes_hermanos: null
            }));
            //formData.id_tipo_cliente == 1 && esColegioComun == 1
            //formData.id_tipo_cliente == 1 && esColegioComun == 1
            /*
            setFormData(prevState => ({
                ...prevState,
                [id_clientes_hermanos]: null
            }));
            */
        }
    } 

    const validateFields = (from) => {
        var messageError = ''
        if (from.id_tipo_cliente === '') {
            messageError = 'Campo Tipo CLiente es OBLIGATORIO\n'
        }
        if (from.nombre.length <= 3 || from.nombre === '') {
            messageError += 'Campo Nombre es OBLIGATORIO y debe contener mas de 3 caracteres\n'
        }
        if (messageError.length === 0) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }
    
    const renderOptionsColegiosComunes = () =>{
        return [<option value="null">Seleccione una Opción</option>,...allColegiosHermanos.map((ch) => (
            <option key={ch.id} value={ch.id}> {ch.nombre} </option>
        ))]
    }
    
    const getAllColegiosHermanos = async (id_tipo_cliente) => {
        
        setAllColegiosHermanos([]);

        if(id_tipo_cliente !== "1"){
            return true;
        }

        try {
            const resp = await axios.get(APIURL+'/clientes/hermanos', config)
            console.log(resp.data);
            setAllColegiosHermanos(resp.data);
        } catch (resp) {
            console.log(resp);
        }
    }

    const sendDataClienteNuevo = () =>{
        console.log(formData);
        axios.post(APIURL+'/clientes',formData,config).then((resp)=>{
            console.log(resp);
        }).catch((resp)=>{
            if(resp.code === "ERR_BAD_REQUEST" && resp.response.hasOwnProperty('data')){
                console.log(resp.response.data);
            }
            console.log(resp);
        })
        
    }

    useEffect(()=>{
        validateFields(formData);
    }, [formData])

    return (
        <div className="container">
            <p className="fw-bold">CREAR CLIENTE</p>
            <div className="row">
                <div className="col-12">
                    <div className="mb-3">
                    <label>Tipo Cliente</label>
                        <Form.Select aria-label="Default select example" name="id_tipo_cliente" onChange={(e)=> {formInputChange(e); changeTipoCliente(e);}}>
                            <option value="">Seleccione una Opción</option>
                            <option value="1">Escuela</option>
                            <option value="2">Empresa</option>
                        </Form.Select>
                    </div>
                </div>
                <div className="col-3">
                    {formData.id_tipo_cliente === "1" && (
                    <div className="mb-3">
                    <label for="es_colegio_comun">Es colegio Comun</label><br/>
                        <input type="checkbox" id="es_colegio_comun" name="es_colegio_comun" value="1" checked={esColegioComun} onChange={(e)=> selectEsColegioComun(e)}/>
                    </div>
                    )}
                </div>
                <div className="col-5">
                    {formData.id_tipo_cliente === "1" && esColegioComun === true && (
                    <div className="mb-3" >
                        <label>Colegios hermanos</label>
                        <Form.Select name="id_clientes_hermanos" id="id_clientes_hermanos" onChange={(e)=> formInputChange(e)}>
                        {renderOptionsColegiosComunes()}
                        </Form.Select>
                    </div>
                    )}
                </div>
            </div>
            <hr></hr>
            <p className="fw-bold">DATOS DEL CLIENTE:</p>
            <div className="row">
                <div className="mb-3">
                    <label>Nombre</label>
                    <input type="text" className="form-control" name="nombre" onChange={(e)=> formInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <label>Descripción</label>
                    <input type="text" className="form-control" name="descripcion" onChange={(e)=> formInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <label>Notificaciones Email</label>
                    <input type="email" className="form-control" name="notificaciones_email" onChange={(e)=> formInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <label>RSO</label>
                    <input type="text" className="form-control" name="rso" onChange={(e)=> formInputChange(e)}/>
                </div>
                <div className="mb-3">
                    <label>Razón Social</label>
                    <input type="text" className="form-control" name="rason_social" onChange={(e)=> formInputChange(e)}/>
                </div>
            </div>

            <hr></hr>

            <div className="row mb-3">
                <div className="col-12">
                    <p className="fw-bold"> CONTACTO: </p>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Nombre 1</label>
                        <input type="text" className="form-control" name="nombre_uno" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 1</label>
                        <input type="text" className="form-control" name="telefono_uno" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Nombre 2</label>
                        <input type="text" className="form-control" name="nombre_dos" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono 2</label>
                        <input type="text" className="form-control" name="telefono_dos" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Teléfono Móvil</label>
                        <input type="text" className="form-control" name="telefono_mobil" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
            </div>

            <hr></hr>
            
            <div className="row mb-3">
                <div className="col-12">
                    <p className="fw-bold"> DIRECCIÓN: </p>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Calle</label>
                        <input type="text" className="form-control" name="calle" onChange={(e)=> formInputChange(e)}/>
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Entre Calles</label>
                        <input type="text" className="form-control" name="entre_calle" onChange={(e)=> formInputChange(e)}/>
                    </div>  
                </div>
                <div className="col-5">
                    <div className="mb-3">
                        <label>Colonia</label>
                        <input type="text" className="form-control" name="colonia" onChange={(e)=> formInputChange(e)}/>
                    </div> 
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Codigo Postal</label>
                        <input type="text" className="form-control" name="codigo_postal" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Ciudad</label>
                        <input type="text" className="form-control" name="ciudad" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Estado</label>
                        <input type="text" className="form-control" name="estado" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mb-3">
                        <label>Pais</label>
                        <input type="text" className="form-control" name="pais" onChange={(e)=> formInputChange(e)}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageNuevoCliente;