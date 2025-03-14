import DataTable from "react-data-table-component";
import {
  getPuntosParametros,
  getTotalPuntosParametros,
  getPorcentajeSugerido,
} from "lib/estudios-functions";

import { useState, useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "../../../../node_modules/axios/index";

export default function TablaEnvioEmail({
  listaParametros = [],
  listaEstudios = [],
  callBackPorcentajeOtorgado,
}) {

  const APIURL = process.env.REACT_APP_API_URL;
  const config = {
      headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
      }
  }
  const [idEstudio, setIdEstudio] = useState(null);
  const [idEstudioHijo, setIdEstudioHijo] = useState(null);

  const [estudioSelectedData, setEstudioSelectedData] = useState(null);
  const [showSendEmailPorcentaje, setShowSendEmailPorcentaje] = useState(false);
  const handleCloseSendEmailPorcentaje = () =>
    setShowSendEmailPorcentaje(false);
  const handleShowSendEmailPorcentaje = () => setShowSendEmailPorcentaje(true);

  const [showSendMasiveEmailPorcentaje, setShowSendMasiveEmailPorcentaje] =
    useState(false);
  const handleCloseSendMasiveEmailPorcentaje = () =>
    setShowSendMasiveEmailPorcentaje(false);
  const handleShowSendMasiveEmailPorcentaje = () =>
    setShowSendMasiveEmailPorcentaje(true);

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
    if (row?.hijo?.id) {
      return row.hijo.porcentaje_otorgado ? (
        <div className="d-flex justify-content-center align-item-center">
          <p className="text-black text-center">
            {" "}
            {row.hijo.porcentaje_otorgado} %
          </p>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-item-center">
          <i className="bi bi-percent"></i>
        </div>
      );
    } else {
      return row.porcentaje_otorgado ? (
        <div className="d-flex justify-content-start align-item-center">
          <p className="text-black text-center"> {row.porcentaje_otorgado} %</p>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-item-center">
          <i className="bi bi-percent"></i>
        </div>
      );
    }
  };

  const getValuesToSendData = (data = null) => {
    if (data) {
      setEstudioSelectedData(data);
    }
    handleShowSendEmailPorcentaje();
  };

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
      cellClassName: "fixed-column",
    },
    {
      name: "Correo Enviado",
      selector: (row) => (
        <span>
          { row.email_enviado ? (<p className="bg-success p-1 rounded text-white mt-1">Enviado</p>) : (<p className="bg-danger p-1 rounded text-white mt-1">No Enviado</p>) }
        </span>
      ),
      sortable: true,
      cellClassName: "fixed-column",
    },
    {
      name: 'Porcentaje Otorgado',
      cell: (row) => seccionPordentajeOtorgado(row),
      ignoreRowClick: true,
    },
    {
      name: (
        <div
          className="d-flex justify-content-center align-item-center"
          style={{ whiteSpace: "pre-wrap" }}
        >
          No. Familia Colegio
        </div>
      ),
      cell: (row) =>
        row.clave_familia_colegio ? (
          <button
            title="Añadir Clave Familia"
            className="btn btn-link btn-sm text-dark"
            onClick={() =>
              handleShowClaveFamilia(row.id, row.clave_familia_colegio)
            }
          >
            {row.clave_familia_colegio}
          </button>
        ) : (
          <button
            className="btn btn-link btn-sm text-dark"
            title="Añadir Clave Familia"
            onClick={() =>
              handleShowClaveFamilia(row.id, row.clave_familia_colegio)
            }
          >
            <i className="bi bi-plus-circle" style={{ fontSize: "1.2rem" }}></i>
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
            <i
              className="bi bi-person-fill text-gray"
              style={{ fontSize: "1.2rem" }}
            ></i>
          </div>
          <div className="ps-1 align-self-center">
            <HighlightedText text={row.candidato} highlight={filterText} />
          </div>
        </div>
      ),
      sortable: true,
    },

    mostrarColumnaHijo() && {
      name: "Hijo",
      selector: (row) => <span>{row.nombre_hijo}</span>,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <button 
          className="btn btn-sm btn-primary h-75 fw-bold" style={{fontSize: '.7rem', lineHeight: '1rem'}}
          onClick={() => {
            getValuesToSendData(row);
          }}
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
        zIndex: "unset", // Ajustar el z-index (aunque no siempre aplica para tablas estáticas)
      },
    },
  };

  const filteredData = dataWithUniqueKeys.filter((row) =>
    row.candidato.toLowerCase().includes(filterText.toLowerCase())
  );

  const enviarDatasParaCorreos = () => {
    console.log(rowSelect);
    let data = []

    rowSelect.forEach(element => {
      if (element.hijo) {
        data.push({ id: element.hijo.id , hijo: true,
          candidato: element.candidato, 
          cliente: element.cliente.nombre,
          contacto: (element.padre && element.padre.contecto_principal) ? element.padre.email : element.madre.email,
          hijo_dato: element.hijo ? element.hijo.nombre : null,
          porcentaje_otorgado: element.hijo ? element.hijo.porcentaje_otorgado : element.porcentaje_otorgado
        })
      } else {
        data.push({ id: element.id , hijo: false,
          candidato: element.candidato, 
          cliente: element.cliente.nombre,
          contacto: (element.padre && element.padre.contecto_principal) ? element.padre.email : element.madre.email,
          hijo_dato: element.hijo ? element.hijo.nombre : null,
          porcentaje_otorgado: element.hijo ? element.hijo.porcentaje_otorgado : element.porcentaje_otorgado
        })
      }
  
    })
    
    axios.post(APIURL + '/estudio/socioeconomico/enviar/correos', data, config).then((resp)=>{
      console.log(resp);
      handleCloseSendMasiveEmailPorcentaje()
      
    }).catch(err=>{
      console.log(err);
      
    })
    
  }

  const enviarDataParaCorreo = () => {
    let data = []
    if (estudioSelectedData.hijo) {
      console.log('tiene hijo');
      data.push({ 
        id: estudioSelectedData.hijo.id , 
        hijo: true, 
        candidato: estudioSelectedData.candidato, 
        cliente: estudioSelectedData.cliente.nombre,
        contacto: (estudioSelectedData.padre && estudioSelectedData.padre.contecto_principal) ? estudioSelectedData.padre.email : estudioSelectedData.madre.email,
        hijo_dato: estudioSelectedData.hijo ? estudioSelectedData.hijo.nombre : null,
        porcentaje_otorgado: estudioSelectedData.hijo ? estudioSelectedData.hijo.porcentaje_otorgado : estudioSelectedData.porcentaje_otorgado
      })
    } else {
      console.log('no tiene hijo');
      data.push({ id: estudioSelectedData.id , hijo: false,
        candidato: estudioSelectedData.candidato, 
        cliente: estudioSelectedData.cliente.nombre,
        contacto: (estudioSelectedData.padre && estudioSelectedData.padre.contecto_principal) ? estudioSelectedData.padre.email : estudioSelectedData.madre.email,
        hijo_dato: estudioSelectedData.hijo ? estudioSelectedData.hijo.nombre : null,
        porcentaje_otorgado: estudioSelectedData.hijo ? estudioSelectedData.hijo.porcentaje_otorgado : estudioSelectedData.porcentaje_otorgado
      })
    }

    axios.post(APIURL + '/estudio/socioeconomico/enviar/correos', data, config).then((resp)=>{
      console.log(resp);
      handleCloseSendEmailPorcentaje()
      
    }).catch(err=>{
      console.log(err);
      
    })
    
  }

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex justify-content-start">
          {rowSelect.length !== 0 && (
            <div className="btn btn-light btn-sm d-flex align-items-center">
              {rowSelect.length} seleccionada(s)
            </div>
          )}
          {rowSelect.length !== 0 && (
            <div className="d-flex align-items-center">
              <button
                onClick={() => {
                  handleShowSendMasiveEmailPorcentaje();
                }}
                className="btn btn-sm btn-primary"
              >
                Enviar Correos a seleccionados
              </button>
            </div>
          )}
          <div></div>
        </div>
        <div>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar familia..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
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
          <Modal.Title>
            FAMILIA: {estudioSelectedData ? estudioSelectedData.candidato : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { estudioSelectedData && (
            <>
            <p>Enviar correo a contacto principal</p>
            <p>Contacto: { (estudioSelectedData.padre && estudioSelectedData.padre.contecto_principal) ? estudioSelectedData.padre.nombre : estudioSelectedData.madre.nombre  }</p>
            <p>Email: { (estudioSelectedData.padre && estudioSelectedData.padre.contecto_principal) ? estudioSelectedData.padre.email : estudioSelectedData.madre.email  }</p>
            <p>Porcentaje Asignado: {estudioSelectedData.hijo ? estudioSelectedData.hijo.porcentaje_otorgado : estudioSelectedData.porcentaje_otorgado} %</p>
            </>
          ) }
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSendEmailPorcentaje}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={()=>{enviarDataParaCorreo()}}>Enviar</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSendMasiveEmailPorcentaje}
        onHide={handleCloseSendMasiveEmailPorcentaje}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>FAMILIA SELECCIONADAS: {rowSelect.length}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Se enviara correo de notificacion de "Porcentaje Otorgado" a todas las
          familias seleccionadas.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSendMasiveEmailPorcentaje}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={()=>{enviarDatasParaCorreos()}} >Enviar</Button>
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
      <span
        key={index}
        style={{ backgroundColor: "yellow", fontWeight: "bold" }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};
