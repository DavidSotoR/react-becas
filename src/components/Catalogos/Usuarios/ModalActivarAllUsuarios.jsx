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

    const EnableOrDisable = () => {
        //activar_desactivar(nuevoValor)

        axios.delete(APIURL+'/usuarios/'+usuario.id,config).then((resp)=>{
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
                {usuario.email}
            </li>
        ));
    }

    useEffect(()=>{
            setUsuario(list_usuario)
    },[])

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header className="fw-bold"> { activar_desactivar ? 'Inacticos' : 'Activar' } lista usuarios </Modal.Header>
            <Modal.Body>
                La siguiente lista de usuarios pasaran a ser { activar_desactivar ? 'Inacticos' : 'Activos' }:
                <ul>
                    { renderListaUsuarios() }
                </ul>
            </Modal.Body>

            {
                usuario && 
                <Modal.Footer>
                    <Button variant="secondary" onClick={CancelProcessActivarDesactivar}>
                        Cancelar
                    </Button>
                    <Button onClick={ EnableOrDisable } variant={ usuario.active ? "danger" : "success"}>
                        { usuario.active ? "Desactivar" : "Activar"}
                    </Button>
                </Modal.Footer>
            }
            
        </Modal>
    )

}