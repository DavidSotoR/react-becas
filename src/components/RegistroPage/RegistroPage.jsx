import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


function RegistroPage(){
    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);


    return (
        <div className="container">
            <div className="card">

            </div>
        </div>
    )
}

export default RegistroPage;
