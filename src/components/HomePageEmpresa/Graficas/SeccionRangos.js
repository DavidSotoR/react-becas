import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

export default function SeccionRangos({idProyecto,idOrdenServicio}){

    const APIURL = process.env.REACT_APP_API_URL;
    const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
    const { logout } = useContext(AuthContext);
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
      };

    const [data,setData] = useState([]);

    const [dataSelected,setDataSelected] = useState({});
    const [itemSeleccionado,setItemSeleccionado] = useState('');
    const [dataEstudios,setDataEstudios] = useState([]);
 
    const labels = () => {
        return dataSelected?.items ? dataSelected.items.map(item => `${item.limiten_inferior < 1 ? 'O MENOS' : formatNumber(item.limiten_inferior)} - ${item.limite_superior === '0' ? 'O MAS' : formatNumber(item.limite_superior)}`) : [] ;
    }
    const labelsData = () => {
        return dataSelected?.items ? dataSelected.items.map(item => item.total_estudios) : [] ;

    }
    const dataChart = () => {
        return {
        labels:labels(),
        datasets: [
          {
            label: dataSelected?.nombre ? dataSelected.nombre : '',
            data: labelsData(),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      }
    };

    const formSelectionChange = (e) => {
        const value = e.target.value; 
        const newDataSelected = data.find((item) => String(item.id) === String(value));
        setDataSelected(newDataSelected);
    };
    
    const opcionesSelect = () => {
        return [<option key='sapoc-default' value="">{convertirAMayusculas('Seleccione una Metrica')}</option>,...data.map((select,index) => (
            <option key={'sapoci-'+index} value={`${select.id}`} >
                { convertirAMayusculas(select.nombre) }
            </option>
        ))]
    }

    const convertirAMayusculas = (texto) => {
        return texto.toUpperCase();
    }

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    const getRangosMensuales = () => {
        let conf = config;

        if(!idOrdenServicio){
            conf.params = {
                id_orden_servicio: idOrdenServicio
            };
        }

        axios.get(`${APIURL}/estudios/socioeconomico/proyectos/${idProyecto}/rango-ingreso-mensual`,config).then((resp)=>{
            setData(resp.data);
        }).catch((resp)=>{
            if (resp?.response?.status && resp.response.status === 401) {
                logout()
            }
            console.log(resp);
        })
    }

    useEffect(() =>{
        getRangosMensuales();
    },[idProyecto,idOrdenServicio])

    const tableBody = () => {
        return dataSelected?.items && dataSelected.items.map((item, index) =>(
            <tr key={'igbsr'-index}
            onClick={() => { setItemSeleccionado((dataSelected?.id ? dataSelected.id : '')+''+item.id); setDataEstudios(item.estudios)}}
            >
                <td className="text-end"
                    style={{backgroundColor: `${dataSelected?.id || ''}${item.id}` === itemSeleccionado ? 'aliceblue' : 'var(--bs-table-bg)'}}
                >
                    {item.limiten_inferior < 1 ? 'O MENOS' : formatNumber(item.limiten_inferior)}
                </td>
                <td className="text-end"
                    style={{backgroundColor: `${dataSelected?.id || ''}${item.id}` === itemSeleccionado ? 'aliceblue' : 'var(--bs-table-bg)'}}
                >
                    {String(item.limite_superior) === String(0) ? 'O MAS' : formatNumber(item.limite_superior)}
                </td>
                <td className="text-end"
                    style={{backgroundColor: `${dataSelected?.id || ''}${item.id}` === itemSeleccionado ? 'aliceblue' : 'var(--bs-table-bg)'}}
                >
                    {formatNumber(item.total_estudios)}
                </td>
            </tr>
        ))
    }
    return(
        <div className="row mb-3">
            <div className="col-12">
                
            <div className="mb-3 row">
                        <label htmlFor="id" className="col-sm-2 col-form-label"><h5>Reporte de:</h5></label>
                        <div className="col-sm-10">
                            <select
                                className="form-select form-control-sm" 
                                name="id"
                                value={dataSelected?.id ? dataSelected.id : ''}
                                onChange={(e) => {formSelectionChange(e)}}
                            >
                                {opcionesSelect()}
                            </select>
                        </div>
                    </div>
            </div>
            {/* 
            <div className="col-12">
                <h4>{dataSelected?.nombre && dataSelected.nombre}</h4>
            </div>
            */}
            {dataSelected?.id && (<>
            <div className="col-sm-6">
                <div className="card m-1 shadow-sm">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="text-center">Limite inferiro</th>
                                <th className="text-center">Limite Superor</th>
                                <th className="text-center">No. Familias</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableBody()}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="card m-1 shadow-sm">
                <div className="card-body">
                    {<Bar options={options} data={dataChart()} />}
                </div>
                </div>
            </div>
            
            {dataEstudios.length > 0 && (
                <div className="col-sm-6">
                    <div className="card m-1 shadow-sm">
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Estudio</th>
                                    <th>Familia</th>
                                    <th className="text-center">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {dataEstudios.length > 0 && dataEstudios.map( (estudio ,index) => (
                                        <tr key={'esfil'-index}>
                                            <td>
                                            {estudio.id}
                                            </td>
                                            <td>
                                                {estudio.candidato}
                                            </td>
                                            <td className="text-end">
                                                { estudio?.parametros && estudio?.parametros.map((item, index) => {
                                                    return item.id === dataSelected.id && formatNumber(item.puntos.sumatoria)
                                                }) }
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>
            )}
            <div className="col-12">
            </div>
            </>)}
        </div>
    )
}