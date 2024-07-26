import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModalNuevoParametro from "./ModalNuevoParametro";
import ModalNuevaPregunta from "./ModalNuevaPregunta";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function CreacionEncuesta() {
    const { ID } = useParams();
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const [ showModalNuevoParametro, setShowModalNUevoParametro ] = useState(false)
    const handleCloseMNuevoParametro = () => setShowModalNUevoParametro(false);
    const handleShowMNuevoParametro = () => setShowModalNUevoParametro(true);

    const [ showModalNuevaPregunta, setShowModalNuevaPregunta ] = useState(false)
    const handleCloseMNuevaPregunta = () => setShowModalNuevaPregunta(false);
    const handleShowMNuevaPregunta = () => setShowModalNuevaPregunta(true);

    const [ allPreguntas, setAllPreguntas ] = useState([])
    const [ allPreguntasTipo, setAllPreguntasTipo ] = useState([])
    const [ postDataPregunta,setPostDataPregunta ] = useState({
        id_catalogo_encuesta: '',
        id_catalogo_encuestas_preguntas_tipo: '',
        id_catalogo_encuestas_preguntas_parametro_clasificacion: '',
        pregunta: '',
        puntos_maximos: 0
    })

    const getListaPreguntasEncuensta = () => {
        axios.get(APIURL+'/catalogos/encuestas/'+ID+'/preguntas',config).then((resp)=>{
            console.log(resp.data);
            setAllPreguntas(resp.data)
        }).catch((error)=>{
            console.log(error.response);
        })
    }

    const renderBodyTablaPreguntas = () => {
        return allPreguntas.map((preguntas, index) => (
            <tr key={'tr-'+index}>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.id}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.tipo_preguntas.nombre}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.parametro_de_clasificacion.nombre}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.pregunta}</p>
                </td>
                <td>
                    <p style={{ fontWeight: "bold" }}>{preguntas.puntos_maximos}</p>
                </td>
                <td>
                    <div className="d-flex">
                        <Link className="btn btn-primary btn-sm">Editar</Link>
                        <button className="btn btn-danger btn-sm mx-1">Borrar</button>
                    </div>
                </td>
            </tr>
        ));
    };

    useEffect(()=>{
        getListaPreguntasEncuensta()
    },[])

    return (
        <div className="container">
            <div>
                <p className="fw-bold">Edicion de Encuesta</p>
            </div>
            <div className="row">
                <div className="col-3">
                    <button className="btn btn-primary" onClick={handleShowMNuevoParametro}>Agregar Parametros</button>
                </div>
                <div className="col-3">
                    <button className="btn btn-primary" onClick={handleShowMNuevaPregunta}>Agregar Pregunta</button>
                </div>
            </div>
            
            <br/>
			<Tabs>
				<TabList>
					<Tab>Preguntas</Tab>
					<Tab>Parametros</Tab>
				</TabList>
 
				<TabPanel>
                    <div className="row">
                        <div className="col">
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-id">ID</th>
                                        <th scope="col">Tipo Pregunta</th>
                                        <th scope="col">Parametro</th>
                                        <th scope="col">Pregunta</th>
                                        <th scope="col">Puntaje maximo</th>
                                        <th scope="col">Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { renderBodyTablaPreguntas() }
                                </tbody>
                            </table>
                        </div>
                            
                        </div>
                    </div>
				</TabPanel>
				<TabPanel>
					<div className='tab-content'>
						<h2>Tab content 2</h2>
						<p>Here is your tab content. You can separate this as a component.</p>
						<p>Lorem ipsum dolor sit amet ...</p>
					</div>
				</TabPanel>
			</Tabs>
            <ModalNuevoParametro show={showModalNuevoParametro} handleClose={handleCloseMNuevoParametro}></ModalNuevoParametro>
            <ModalNuevaPregunta show={showModalNuevaPregunta} handleClose={handleCloseMNuevaPregunta}></ModalNuevaPregunta>
        </div>
    )
}


export default CreacionEncuesta;