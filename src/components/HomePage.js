import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import TablaFolios from "./HomePage/TablesClientes";

function HomePage() {
  const [activeTab, setActiveTab] = useState('escuelas');

  const handleTabClick = (tab) => {
    setActiveTab(tab); 
  };
  var catalogoInicio = [
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


  return (
    <div className="">
        <Navbar></Navbar>
        <h3 className="m-3">Seguimiento de Folios</h3>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'escuelas' ? 'active' : ''}`}
              onClick={() => handleTabClick('escuelas')}
            >
              Escuelas
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === 'empresas' ? 'active' : ''}`}
              onClick={() => handleTabClick('empresas')}
            >
              Empresas
            </a>
          </li>
        </ul>
        <div className="m-2"> 
          <div className="accordion" id="accordionExample">
          {catalogoInicio.map(school => {
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
          })}
            
          </div>
        </div>
    </div>
  );
}

export default HomePage;