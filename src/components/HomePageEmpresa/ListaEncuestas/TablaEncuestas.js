
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import {getPuntosParametros, getTotalPuntosParametros, getPorcentajeSugerido} from "lib/estudios-functions"
import ModalPorcentajeOtorgado from "./ModalPorcentajeOtorgado";
import { useState } from "react";

export default function TablaEncuestas({
        listaParametors = [],
        listaEstudios = [],
      }){
      
    const [idEstudio, setIdEstudio] = useState(null);
    const [ show, setShow] = useState(false);
    const handleClose = () => {
      setShow(false)
      setIdEstudio(null)
    };
    const handleShow = (id) =>{
      setShow(true)
      setIdEstudio(id)
    };
    


    const columns = [
        {
          name: "No Estudio",
          selector: (row) => row.id,
          sortable: true,
          width: "120px",
        },
        {
          name: "Familia",
          selector: (row) => (
            <div className="d-inline-flex">
              <div>
                <Avatar src="/img/user.jpg" size="30" round={true} />
              </div>
              <div className="ps-1 align-self-center">
                <span>{row.candidato}</span>
              </div>
            </div>
          ),
          sortable: true,
          style: { width: "850px" },
          headerStyle: { width: "850px" },
        },
        ...listaParametors.map((parametro) => ({
          name: parametro.nombre,
          selector: (row) => getPuntosParametros(row.parametros, parametro.id) || "-",
          sortable: true,
        })),
        {
          name: "Total",
          selector: (row) => getTotalPuntosParametros(row.parametros),
          sortable: true,
        },
        {
          name: "Porcentaje Sugerido",
          selector: (row) => `${getPorcentajeSugerido(row.parametros)}%`,
          sortable: true,
          style: { textAling: "250px" },
        },
        {
          name: "Porcentaje Otorgado",
          cell: (row) =>
            row.porcentaje_otorgado ? (
              `${row.porcentaje_otorgado}%`
            ) : (
              <button
                className="btn btn-link btn-sm text-dark"
                onClick={() => handleShow(row.id)} // Llama a handleShow con el ID
              >
                Añadir
              </button>
            ),
          ignoreRowClick: true,
        },
        {
          name: "Acciones",
          cell: (row) => (
            <Link
              className="btn btn-link btn-sm text-dark"
              to={`/estudios/${row.id}`}
            >
              Ver
            </Link>
          ),
          ignoreRowClick: true,
        },
      ];

    return(   <>
    <DataTable columns={columns} data={listaEstudios} pagination  />
    <ModalPorcentajeOtorgado show={show} handleClose={handleClose} idEstudio={idEstudio}/>
    </>)
}