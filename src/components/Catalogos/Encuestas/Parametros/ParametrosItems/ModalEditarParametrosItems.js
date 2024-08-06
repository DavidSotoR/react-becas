import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../context/AuthContext";

function ModalEditarParametrosItems({idParametro}){
    const { logout } = useContext(AuthContext);
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }

}
export default ModalEditarParametrosItems