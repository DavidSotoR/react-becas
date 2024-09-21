import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { Button,Form, Modal } from "react-bootstrap";
import makeAnimated from 'react-select/animated';
import { useParams,useNavigate } from "react-router-dom";
import EstudioSeccionEstudio from "./Proceso/EstudioSeccionEstudio";
import EstudioSeccionFamilia from "./Proceso/EstudioSeccionFamilia";
import EstudioSeccionPadres from "./Proceso/EstudioSeccionPadres";
import EstudioSeccionUbicacion from "./Proceso/EstudioSeccionUbicacion";

function Estudio(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { idEstudio } = useParams()
    const navigate = useNavigate();
    const backPage = () => {
      navigate('/estudios', { state: { idProyecto: fromData.id_proyecto,idCliente: fromData.id_cliente,idOrdenServicio: fromData.id_orden_servicio } });
    };

    const [tiposClientes,setTiposClientes] = useState([])

    const [proyectoCliente,setProyectoCliente] = useState({nomre:'',documentacion_digital:false})
    const [tipoClienteSeleccionado] = useState('1')
    
    const animatedComponents = makeAnimated;

    const nuevoUsuario = {
        id_servicio_estado:'1',
        id_proyecto:'',
        id_cliente:'',
        id_orden_servicio:'',
        id_colaborador:'',
        es_cliente_comun:false,
        colegios_comunes:[],
        candidato:'',
        situacion:'',
        email:'',
        estado:{id:'',nombre:''},
        telefono_movil:'',
        telefono_contacto:'',
        generar_usuario_automaticamente: false,
        latitud:25.67507,
        longitud:-100.31847,
        colegios_comunes:[],
        padre:{
            id_familias_padres_tipo:'1',
            nombre:'',
            edad:'',
            vive:false,
            direccion:'',
            ocupacion_actual:'',
            empresa_trabajo:'',
            email:'',
            telefono_casa:'',
            contecto_principal:false,
        },
        madre:{
            id_familias_padres_tipo:'2',
            nombre:'',
            edad:'',
            vive:false,
            direccion:'',
            ocupacion_actual:'',
            empresa_trabajo:'',
            email:'',
            telefono_casa:'',
            contecto_principal:false,
        },
        proyecto:{id:0,nombre:''},
        cliente:{id:0,nombre:''},
        orden_servicio:{id:0,descripcion:''},
        colaborador: {id:0,nombre:''},
        familia: {id:0,nombre:''},
    };

    const [fromData,setFormData] = useState(nuevoUsuario)

    const [fromDataError,setFormDataError] = useState({})
    const [editarSeccion,setEditarSeccion] = useState('')


    const [clientesComunes,setClientesComunes] = useState([])
    const [clientesComunesDefault,clientesComunesDefaultSet]= useState([]);

    
    const sendDataEstudioSocioeconomico = () =>{
        axios.post(`${APIURL}/estudio/socioeconomico`,fromData,config).then((resp)=>{
            const {message,data} = resp.data
            console.log(resp);
            setFormData(nuevoUsuario);

        }).catch((err)=>{
            if(err.code === "ERR_BAD_REQUEST"){
                const data =err.response.data;
                if(data?.errors){
                    setFormDataError(data.errors);
                }
            }
            console.log(err);
        })
    }

    const getEsrudioSocioeconomico = () => {
        axios.get(`${APIURL}/estudio/socioeconomico/${idEstudio}`,config).then((resp)=>{
            console.log(resp.data);
            let data =  resp.data;
            if(data?.latitud){
                data.latitud = '25.67507';
                data.longitud = '-100.31847';
            }
            setFormData(data);
            // setProyectoCliente(resp.data);
        }).catch((resp)=>{
            setClientesComunes([]);
            console.log(resp);
        })
    }
    

    const getListaClientesHermanos= () => {
        axios.get(`${APIURL}/clientes/${fromData.id_cliente}/hermanos`,config).then((resp)=>{
            renderOptionClientesComunes(resp.data);
        }).catch((resp)=>{
            setClientesComunes([]);
            console.log(resp);
        })
    }
    
    const renderOptionClientesComunes  = (opciones) =>{
        var opcionesColegios = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcionesColegios.push(option)
        })
        setClientesComunes (opcionesColegios)
    }

    const renderOptionClientesComunesDefaultSet = (opciones) =>{
        var opcionesColegios = []
        
        opciones.forEach((h)=>{
            var option = { value: '', label:'' }
            option.label = h.nombre
            option.value = h.id
            opcionesColegios.push(option)
        })
        clientesComunesDefaultSet(opcionesColegios)
    }
    
    useEffect(()=>{
        getEsrudioSocioeconomico();
    },[])

    useEffect(() => {
        if(fromData.es_cliente_comun === true){
            getListaClientesHermanos();
            renderOptionClientesComunesDefaultSet(fromData.colegios_comunes);
        }else{
            setClientesComunes([]);
        }
    },[fromData.id_cliente,fromData.es_cliente_comun])
    
    return(<>
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                    <h6 style={{ fontWeight:'bold' }}>Estudio Socioeconómico</h6>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col-md-2">
                    <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center" onClick={() => backPage()}>
                        <ion-icon name="chevron-back-outline"></ion-icon>
                        Regresar
                    </Button>
                </div>
            </div>
            <hr/>

            <EstudioSeccionEstudio fromData={fromData}/>

            <EstudioSeccionFamilia 
                fromData={fromData} 
                setFormData={setFormData} 
                fromDataError={fromDataError} 
                editarSeccion={editarSeccion} 
                clientesComunes={clientesComunes}
                clientesComunesDefault={clientesComunesDefault}
                setEditarSeccion={setEditarSeccion} />

            {fromData['padre'] !== null &&(
                <EstudioSeccionPadres 
                familiar={'padre'}
                fromData={fromData} 
                setFormData={setFormData}
                fromDataError={fromDataError}
                editarSeccion={editarSeccion}
                setEditarSeccion={setEditarSeccion}
                />
            )}
            {fromData['madre'] !== null &&(
                <EstudioSeccionPadres 
                familiar={'madre'}
                fromData={fromData} 
                setFormData={setFormData}
                fromDataError={fromDataError}
                editarSeccion={editarSeccion}
                setEditarSeccion={setEditarSeccion}
                />
            )}

            <EstudioSeccionUbicacion
                fromData={fromData} 
                setFormData={setFormData}
                fromDataError={fromDataError}
                editarSeccion={editarSeccion}
                setEditarSeccion={setEditarSeccion}
                />

       </div> 
    </>)
}

export default Estudio