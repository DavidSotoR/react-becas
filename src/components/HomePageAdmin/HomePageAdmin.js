import { useEffect, useState } from "react";
import TablaFolios from "./TablesClientes";

const ESCUELAS = [
  { id: 1, nombre: "Colegio Oxford", tipo:"Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]},
  { id: 2, nombre: "Colegio Internacional",tipo: "Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]},
  { id: 3, nombre: "Colegio San Pablo", tipo: "Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]},
  {id: 4, nombre: "Colegio Santa Maria", tipo: "Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]}
]

const EMPRESAS = [
  { id: 1, nombre: "GETIC", tipo:"Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]},
  { id: 2, nombre: "CASTELEC",tipo: "Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]},
  { id: 3, nombre: "OXXO", tipo: "Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]},
  {id: 4, nombre: "GRUPO SORAH", tipo: "Escuela", folios: [
    {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
    {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
    {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
    {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
  ]}
]

function HomePageAdmin() {
  const [activeTab, setActiveTab] = useState('escuelas');
  const [catalogFolios, setCatalogFolios] = useState([
    { id: 1, nombre: "Colegio Oxford", tipo:"Escuela", folios: [
      {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
      {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
      {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
      {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
    ]},
    { id: 2, nombre: "Colegio Internacional",tipo: "Escuela", folios: [
      {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
      {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
      {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
      {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
    ]},
    { id: 3, nombre: "Colegio San Pablo", tipo: "Escuela", folios: [
      {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
      {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
      {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
      {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
    ]},
    {id: 4, nombre: "Colegio Santa Maria", tipo: "Escuela", folios: [
      {folio: "0001", familia: "Perez Garcia", asignado: "Colaborador 1" },
      {folio: "0002", familia: "Gonzalez Martinez", asignado: "Colaborador 2"},
      {folio: "0003", familia: "Lopez Fernandez", asignado: "Colaborador 3"},
      {folio: "0004", familia: "Ramirez Sanchez", asignado: "Colaborador 4" }
    ]}
  ])
  
  console.log('Cargo HOME');

  const changeTab = () =>{
    if (activeTab === 'escuelas') {
      setActiveTab(ESCUELAS)
    } else {
      setActiveTab(EMPRESAS)
    }
  }

  const listaFolios = () => {
    return (
          <div className="accordion" id="accordionExample">
            {
              catalogFolios.map(school => {
                return (
                  <div className="accordion-item" key={"key"+school.id}>
                    <h2 className="accordion-header">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${school.id}`} aria-expanded="false" aria-controls={`collapse-${school.id}`}>
                        {school.nombre}
                      </button>
                    </h2>
                    <div id={`collapse-${school.id}`} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                      <div className="accordion-body pt-0">
                        <TablaFolios folios={school.folios  } />
                      </div>
                    </div>
                  </div>
                );
              }) 
            }
          </div>
      )
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab); 
  };
  

  useEffect(() => {
    if (activeTab === 'escuelas') {
      setCatalogFolios(ESCUELAS);
    } else {
      setCatalogFolios(EMPRESAS);
    }
  }, [activeTab]);


  return (
    <div className="container">
        <h5 className="m-2" style={{ fontWeight:'bold' }}>Seguimiento de Folios</h5>
        <div className="container">
          <p className="fw-bold mb-1">Filtros:</p>
          <div className="row align-items-center mb-3"> 
              <div className="col-4 col-md-3 mb-1">
                  <input className="form-control  form-control-sm" placeholder="Buscar: "/>
              </div>
              <div className="col-4 col-md-3 mb-1">
                  <select className="form-select form-select-sm" aria-label="Default select example">
                      <option selected>Escuelas y Empresas</option>
                      <option value="1">Escuelas</option>
                      <option value="2">Empresas</option>
                  </select>
              </div>
              <div className="col-4 col-md-3 mb-1">
                  <select className="form-select form-select-sm" aria-label="Default select example">
                      <option selected>Cliente:</option>
                  </select>
              </div>
              <div className="col-4 col-md-3 mb-1">
                  <select className="form-select form-select-sm" aria-label="Default select example">
                      <option selected>Asignado a:</option>
                  </select>
              </div>
          </div>
        </div>
        
        <div className="container">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Familia</th>
                  <th>Cliente</th>
                  <th>Asignado</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

export default HomePageAdmin;