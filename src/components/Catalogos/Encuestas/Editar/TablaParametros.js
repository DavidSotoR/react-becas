
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "./../../../../context/AuthContext";
import ModalNuevoParametro from "./ModalNuevoParametro";

function TablaParametros() {
    const { ID } = useParams();
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

    const data = [
        {text:"Enim adipisicing quis sunt culpa mollit eu nostrud officia amet veniam commodo nisi. Fugiat qui enim mollit qui voluptate magna laborum aliqua in ea commodo exercitation. Duis nulla Lorem deserunt proident nostrud aute. Cupidatat nulla consectetur veniam tempor Lorem nostrud. Dolore adipisicing id id sit ad culpa dolor ipsum velit pariatur sit tempor exercitation. Excepteur excepteur enim amet aute dolore ea non nostrud. Anim fugiat excepteur consectetur dolore id elit exercitation."},
        {text:"Enim adipisicing quis sunt culpa mollit eu nostrud officia amet veniam commodo nisi. Fugiat qui enim mollit qui voluptate magna laborum aliqua in ea commodo exercitation. Duis nulla Lorem deserunt proident nostrud aute. Cupidatat nulla consectetur veniam tempor Lorem nostrud. Dolore adipisicing id id sit ad culpa dolor ipsum velit pariatur sit tempor exercitation. Excepteur excepteur enim amet aute dolore ea non nostrud. Anim fugiat excepteur consectetur dolore id elit exercitation."},
        {text:"Enim adipisicing quis sunt culpa mollit eu nostrud officia amet veniam commodo nisi. Fugiat qui enim mollit qui voluptate magna laborum aliqua in ea commodo exercitation. Duis nulla Lorem deserunt proident nostrud aute. Cupidatat nulla consectetur veniam tempor Lorem nostrud. Dolore adipisicing id id sit ad culpa dolor ipsum velit pariatur sit tempor exercitation. Excepteur excepteur enim amet aute dolore ea non nostrud. Anim fugiat excepteur consectetur dolore id elit exercitation."}
    ];
    
    const [ showModalNuevoParametro, setShowModalNUevoParametro ] = useState(false)
    const handleCloseMNuevoParametro = () => setShowModalNUevoParametro(false);
    const handleShowMNuevoParametro = () => setShowModalNUevoParametro(true);

    return(
        <div>
            <div className="d-flex justify-content-between mb-3">
                <div className="">
                <h3>Lista de parametros</h3>
                </div>
                <div className="">
                <button className="btn btn-primary btn-sm fw-bold" onClick={handleShowMNuevoParametro}>Agregar Parametros</button>
                </div>
            </div>
            <div className='tab-content'>
                {data.map((a,i) =>(
                    <div key={'pg-'+i} className="mb-3 p-3 border rounded border-opacity-75"> 
                    <h4>Titulo</h4>
                    <hr/>
                    <p><b>Tipo de clasificacion:</b> Lista de rangos</p>
                    <hr/>
                    {a.text}
                    </div>
                )
                )}
            </div>
            <ModalNuevoParametro show={showModalNuevoParametro} handleClose={handleCloseMNuevoParametro}></ModalNuevoParametro>
        </div>
    )
}

export default TablaParametros