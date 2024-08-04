import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TablaPreguntas from "./Preguntas/TablaPreguntas";
import TablaParametros from "./Parametros/TablaParametros";
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

    return (
        <div className="container">
            <div>
                <p className="fw-bold">Edicion de Encuesta</p>
            </div>
            <br/>
			<Tabs>
				<TabList>
					<Tab>Preguntas</Tab>
					<Tab>Parametros</Tab>
				</TabList>
 
				<TabPanel>
                    <TablaPreguntas ID={ID} />
				</TabPanel>
				<TabPanel>
                    <TablaParametros ID={ID}/>
				</TabPanel>
			</Tabs>
        </div>
    )
}


export default CreacionEncuesta;