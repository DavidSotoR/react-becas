import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { AuthContext } from "../../../context/AuthContext"

export const ModalActivarUsuario = ({ show ,onHide ,p_usuario, activar_desactivar}) => {
    const APIURL = process.env.REACT_APP_API_URL
    const { logout } = useContext(AuthContext);
    const [ usuario, setUsuario ] = useState(null)

    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const EnableOrDisable = () => {
        console.log(usuario);
        const nuevoValor = !usuario.active
        activar_desactivar(nuevoValor)

        axios.delete(APIURL+'/usuarios/'+usuario.id,config).then((resp)=>{
            console.log(resp);
            onHide()
        }).catch((err)=>{
            console.log(err);
            onHide()
        })

        
        /* if (usuario.active) {
            console.log('se dehabilita');
            onHide()
        } else {
            console.log('se habilitara');
            onHide()
        } */
    }

    const CancelProcessActivarDesactivar = () => {
        onHide()
    }

    useEffect(()=>{
            setUsuario(p_usuario)
    },[])
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header className="fw-bold"> { usuario && usuario.active ? 'Desactivar' : 'Activar' } al usuario: </Modal.Header>
            <Modal.Body>
                Se Deshabilitara el usuario: <span className="fw-bold">{ usuario && usuario.email }</span>
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