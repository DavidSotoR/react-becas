import { useEffect, useState } from "react"
import { Button, Modal } from "react-bootstrap"

export const ModalActivarUsuario = ({ show ,onHide ,p_usuario, activar_desactivar}) => {
    const [ usuario, setUsuario ] = useState(null)

    const EnableOrDisable = () => {
        console.log(usuario);
        const nuevoValor = !usuario.active
        activar_desactivar(nuevoValor)
        onHide()
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