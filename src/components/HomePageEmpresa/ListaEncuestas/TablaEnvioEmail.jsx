import DataTable from "react-data-table-component";
import {
  getPuntosParametros,
  getTotalPuntosParametros,
  getPorcentajeSugerido,
} from "lib/estudios-functions";

import { useState, useMemo } from "react";
import {Modal, Button} from "react-bootstrap"

export default function TablaEnvioEmail({
  listaParametros = [],
  listaEstudios = [], 
  callBackPorcentajeOtorgado,
}) {
  const [idEstudio, setIdEstudio] = useState(null);
  const [idEstudioHijo, setIdEstudioHijo] = useState(null);

    const [ estudioSelectedData, setEstudioSelectedData ] = useState(null);
    const [showSendEmailPorcentaje, setShowSendEmailPorcentaje] = useState(false);
    const handleCloseSendEmailPorcentaje = () => setShowSendEmailPorcentaje(false);
    const handleShowSendEmailPorcentaje = () => setShowSendEmailPorcentaje(true);

  const [filterText, setFilterText] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setIdEstudio(null);
    callBackPorcentajeOtorgado();
  };
  const handleShow = (id, no_hijo) => {
    setShow(true);
    setIdEstudio(id);
    setIdEstudioHijo(no_hijo);
  };

  const [showClaveFamilia, setShowClaveFamilia] = useState(false);
  const [claveFamiliaColegio, setClaveFamiliaColegio] = useState(null);

  const handleCloseClaveFamilia = () => {
    setShowClaveFamilia(false);
    setIdEstudio(null);
    setClaveFamiliaColegio(null);
    callBackPorcentajeOtorgado();
  };

  const handleShowClaveFamilia = (id, clave_familia) => {
    setShowClaveFamilia(true);
    setIdEstudio(id);
    setClaveFamiliaColegio(clave_familia);
  };

  const [rowSelect, setRowSelect] = useState([]);
  const handleChange = ({ selectedRows }) => {
    console.log("Selected Rows: ", selectedRows);
    setRowSelect(selectedRows);
  };

  const mostrarColumnaHijo = () => {
    return listaEstudios.some((row) => row.hasOwnProperty("hijo"));
  };

  const seccionPordentajeOtorgado = (row) => {

    if(row?.hijo?.id){
      return row.hijo.porcentaje_otorgado ? (
        <div className="d-flex justify-content-center align-item-center">
            <p className="text-black text-center"> {row.hijo.porcentaje_otorgado} %</p>
        </div>
        
      ) : (
        <div className="d-flex justify-content-center align-item-center">
            <i className="bi bi-percent"></i>
        </div>
      )
    }else{
      return  row.porcentaje_otorgado ? (
        <div className="d-flex justify-content-start ms-5 mt-3">
            <p className="text-black text-center"> {row.porcentaje_otorgado} %</p>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-item-center">
            <i className="bi bi-percent"></i>
        </div>
      )
    }
  }

  const getValuesToSendData = (data = null) => {
    if (data) {
        setEstudioSelectedData(data)
    }
    handleShowSendEmailPorcentaje();
}
  
  const columns = [
    {
      name: "No Estudio",
      selector: (row) => (
        <span>
          {row.id}
          {row?.no_hijo && " - " + row.no_hijo}
        </span>
      ),
      sortable: true,
      width: "110px",
      cellClassName: "fixed-column",
    },
    {
      name: <div className="d-flex justify-content-center align-item-center" style={{ whiteSpace: "pre-wrap" }}>Porcentaje Otorgado</div>,
      cell: (row) => seccionPordentajeOtorgado(row),
      ignoreRowClick: true,
    },
    {
      name: <div className="d-flex justify-content-center align-item-center" style={{ whiteSpace: "pre-wrap" }}>No. Familia Colegio</div>,
      cell: (row) =>
        row.clave_familia_colegio ? (
          <button title="Añadir Clave Familia"
            className="btn btn-link btn-sm text-dark"
            onClick={() =>
              handleShowClaveFamilia(row.id, row.clave_familia_colegio)
            }
          >
            {row.clave_familia_colegio}
          </button>
        ) : (
          <button
            className="btn btn-link btn-sm text-dark" title="Añadir Clave Familia"
            onClick={() =>
              handleShowClaveFamilia(row.id, row.clave_familia_colegio)
            }
          >
            <i className="bi bi-plus-circle" style={{fontSize: '1.2rem'}}></i>
          </button>
        ),
      ignoreRowClick: true,
    },
    {
      name: "Familia",
      selector: (row) => (
        <div className="d-inline-flex">
          <div>
            {/* <Avatar src="/img/user.jpg" size="30" round={true} /> */}
            <i className="bi bi-person-fill text-gray" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div className="ps-1 align-self-center">
            <HighlightedText text={row.candidato} highlight={filterText} />
          </div>
        </div>
      ),
      sortable: true,
      width: "200px",
    },

    mostrarColumnaHijo() && {
      name: "Hijo",
      selector: (row) => <span>{row.nombre_hijo}</span>,
      sortable: true,
      width: "200px",
    },
    {
        name: "Acciones",
        cell: (row) => (
          <button
            className="btn btn-sm text-dark"
            onClick={()=>{ getValuesToSendData(row)}}
          >
            Enviar Correo
          </button>
        ),
        ignoreRowClick: true,
      },
  ];

  const dataWithUniqueKeys = listaEstudios.map((row, index) => ({
    ...row,
    uniqueKey: `${row.id}-${index + 1}`, // Combina `id` y `index`
  }));

  const customStyles = {
    headCells: {
      style: {
        zIndex: 'unset',                // Ajustar el z-index (aunque no siempre aplica para tablas estáticas)
      },
    },
  }

  const filteredData = dataWithUniqueKeys.filter(row =>
    row.candidato.toLowerCase().includes(filterText.toLowerCase())
  );
  
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">
            {rowSelect.length !== 0 && (
              <div className="btn btn-light btn-sm d-flex align-items-center">
                {rowSelect.length} seleccionada(s)
              </div>
            )}
            {rowSelect.length !== 0 && (
              <div className="d-flex align-items-center">
                <button className="btn btn-sm btn-primary">Enviar Correos a seleccionados</button>
              </div>
            )}
          <div>

          </div>
        </div>
          <div >
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar familia..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        dense
        selectableRows
        keyField="uniqueKey"
        fixedHeader
        fixedHeaderScrollHeight="400px"
        customStyles={customStyles}
        defaultSortFieldId={6}
        onSelectedRowsChange={handleChange}
      />

        <Modal
        show={showSendEmailPorcentaje}
        onHide={handleCloseSendEmailPorcentaje}
        backdrop="static"
        keyboard={false}
        >
        <Modal.Header closeButton>
            <Modal.Title>FAMILIA: {estudioSelectedData ? estudioSelectedData.candidato : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Enviar correo a contacto principal</p>
            <p>Padre:</p>
            <p>Email:</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSendEmailPorcentaje}>
                Cancelar
            </Button>
            <Button variant="primary">Enviar</Button>
        </Modal.Footer>
        </Modal>
    </>
  );
}

const HighlightedText = ({ text, highlight }) => {
  if (!highlight) return text;
  
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  
  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <span key={index} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};