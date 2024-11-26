import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { AuthContext } from "../../../context/AuthContext"

export const ModalActivarAllUsuario = ({ show ,onHide ,list_usuario, activar_desactivar}) => {
    const APIURL = process.env.REACT_APP_API_URL
    const { logout } = useContext(AuthContext);
    const [ usuario, setUsuario ] = useState(null)

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const EnableOrDisableList = () => {
        //activar_desactivar(nuevoValor)
        var data = {
            opcion: activar_desactivar,
            lista_usuarios: list_usuario
        }

        axios.put(APIURL+'/usuarios/lista/activar',data,config).then((resp)=>{
            console.log(resp);
            onHide()
        }).catch((err)=>{
            console.log(err);
            onHide()
        })
    }

    const CancelProcessActivarDesactivar = () => {
        onHide()
    }

    const renderListaUsuarios = () => {
        return list_usuario.map((usuario) => (
            <li key={usuario.id}>
                Usuario:{usuario.email}{ usuario.cliente === 'INTERNO' ? ' - INTERNO' : '' }{ usuario.cliente == 'INTERNO' ? '' : ' - Cliente: '+usuario.cliente } 
            </li>
        ));
    }

    useEffect(()=>{
            setUsuario(list_usuario)
    },[])

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header className="fw-bold"> { activar_desactivar ? 'Activar' : 'Desactivar' } lista usuarios </Modal.Header>
            <Modal.Body>
                La siguiente lista de usuarios pasaran a ser { activar_desactivar ? 'Inacticos' : 'Activos' }:
                <div style={{ height: '60%', overflow:'scroll' }}>
                    <ul>
                        { renderListaUsuarios() }
                    </ul>
                </div>
                
            </Modal.Body>


                <Modal.Footer>
                    <Button variant="secondary" onClick={CancelProcessActivarDesactivar}>
                        Cancelar
                    </Button>
                    <Button onClick={ EnableOrDisableList } variant={ activar_desactivar === 0 ? "danger" : "success"}>
                        { activar_desactivar === 0  ? "Desactivar" : "Activar"}
                    </Button>
                </Modal.Footer>
            
        </Modal>
    )

}