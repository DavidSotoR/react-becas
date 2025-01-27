
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import {getPuntosParametros, getTotalPuntosParametros, getPorcentajeSugerido} from "lib/estudios-functions";
import ModalPorcentajeOtorgado from "./ModalPorcentajeOtorgado";
import ModalNumeroFamiliaColegio from "./ModalNumeroFamiliaColegio";
import ExcelTablaEncuestas from "./ExcelTablaEncuestas";
import { useState,useMemo } from "react";
import PDFSelection from "./PDFSelection";

export default function TablaEncuestas({
        listaParametros = [],
        listaEstudios = [],
        callBackPorcentajeOtorgado
      }){
      
    const [idEstudio, setIdEstudio] = useState(null);
    const [idEstudioHijo, setIdEstudioHijo] = useState(null);
    
    const [ show, setShow] = useState(false);
    const handleClose = () => {
      setShow(false)
      setIdEstudio(null)
      callBackPorcentajeOtorgado()
    };
    const handleShow = (id,no_hijo) =>{
      setShow(true)
      setIdEstudio(id)
      setIdEstudioHijo(no_hijo)
    };
    
    const [ showClaveFamilia, setShowClaveFamilia] = useState(false);
    const [claveFamiliaColegio, setClaveFamiliaColegio] = useState(null);

    const handleCloseClaveFamilia = () => {
      setShowClaveFamilia(false)
      setIdEstudio(null)
      setClaveFamiliaColegio(null)
      callBackPorcentajeOtorgado()
    };

    const handleShowClaveFamilia = (id,clave_familia) =>{
      setShowClaveFamilia(true)
      setIdEstudio(id)
      setClaveFamiliaColegio(clave_familia)
    };
    
    const [rowSelect,setRowSelect] = useState([])
    const handleChange = ({ selectedRows }) => {
      console.log('Selected Rows: ', selectedRows);
      setRowSelect(selectedRows)
    };

    const mostrarColumnaHijo = () => {
      return listaEstudios.some(row => row.hasOwnProperty('hijo'));
    };

    const columns = [
        {
          name: "No Estudio",
          selector: (row) => (
            <span>{row.id}{row?.no_hijo && ' - '+row.no_hijo}</span>
          ),
          sortable: true,
          width: "110px",
          cellClassName: 'fixed-column',
        },
        {
          name: "Acciones",
          cell: (row) => (
            <Link
              className="btn btn-link btn-sm text-dark"
              to={`/estudios/${row.id}${(row?.hijo?.id  && row.hijo?.id)  ? '?id_hijo='+row.hijo.id : ''}`}
            >
              Ver
            </Link>
          ),
          width: "90px",
          ignoreRowClick: true,
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
          width: "200px",
        },

        mostrarColumnaHijo() && {
          name: "Hijo",
          selector: (row) => ( 
                <span>{row.nombre_hijo}</span> 
          ),
          sortable: true,
          width: "200px",
        },
        ,
        ...listaParametros.map((parametro) => ({
          name: (
            <div style={{ whiteSpace: "pre-wrap", textTransform: "uppercase" }}>
              {parametro.nombre}
            </div>
          ),
          selector: (row) => getPuntosParametros(row.parametros, parametro.id) || "-",
          sortable: true,
        })),
        {
          name: "Total",
          selector: (row) => getTotalPuntosParametros(row.parametros),
          sortable: true,
          width: "90px",
        },
        {
          name: (
            <div style={{ whiteSpace: "pre-wrap" }}>
              Porcentaje Sugerido
            </div>
          ),
          selector: (row) => `${getPorcentajeSugerido(row.parametros)}%`,
          sortable: true,
          style: { textAling: "100px" },
        },
        {
          name: (
            <div style={{ whiteSpace: "pre-wrap" }}>
              Porcentaje Otorgado
            </div>
          ),
          cell: (row) =>
            row.porcentaje_otorgado ? (
              <button
                className="btn btn-link btn-sm text-dark"
                onClick={() => handleShow(row.id,(row?.hijo?.id  ? row.hijo.id : null))}
              >
                {row?.hijo ? row.hijo.porcentaje_otorgado : row.porcentaje_otorgado}% 
              </button>
            ) : (
              <button
                className="btn btn-link btn-sm text-dark"
                onClick={() => handleShow(row.id,(row?.hijo?.id  ? row.hijo.id : null))}
              >
                Añadir
              </button>
            ),
          ignoreRowClick: true,
        },
        {
          name: (
            <div style={{ whiteSpace: "pre-wrap" }}>
              No. Familia Colegio
            </div>
          ),
          cell: (row) =>
            row.clave_familia_colegio ? (
              <button
                className="btn btn-link btn-sm text-dark"
                onClick={() => handleShowClaveFamilia(row.id,row.clave_familia_colegio)}
              >
                {row.clave_familia_colegio}
              </button>
            ) : (
              <button
                className="btn btn-link btn-sm text-dark"
                onClick={() => handleShowClaveFamilia(row.id,row.clave_familia_colegio)}
              >
                Añadir
              </button>
            ),
          ignoreRowClick: true,
        },
      ];
    
  const dataWithUniqueKeys = listaEstudios.map((row, index) => ({
    ...row,
    uniqueKey: `${row.id}-${(index+1)}`, // Combina `id` y `index`
  }));

    return(   <>
      <div className="d-flex justify-content-between">
      <div className="d-flex justify-content-start">
        {rowSelect.length !== 0 && (<div className="btn btn-light btn-sm">Columnas: {rowSelect.length} seleccionada(s)</div>)}
        {rowSelect.length !== 0 && (<PDFSelection seleccionRow={rowSelect} />)}
      </div>
      <div className="d-flex justify-content-end">
        <ExcelTablaEncuestas parametros={listaParametros} data={listaEstudios} fileName={"Lista Edtidios"}/>
      </div>
        
        
      </div>

      <DataTable 
        columns={columns} 
        data={dataWithUniqueKeys} 
        pagination 
        dense 
        selectableRows
        keyField="uniqueKey"
        fixedHeader
        fixedHeaderScrollHeight="400px"
        onSelectedRowsChange={handleChange} 
      />

      <ModalPorcentajeOtorgado show={show} handleClose={handleClose} idEstudio={idEstudio} idEstudioHijo={idEstudioHijo}/>
      <ModalNumeroFamiliaColegio show={showClaveFamilia} handleClose={handleCloseClaveFamilia} idEstudio={idEstudio} claveFamiliaColegio={claveFamiliaColegio}/>
    </>)
}