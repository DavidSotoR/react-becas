import { useEffect, useState } from "react";
import HomePageAdmin from "../HomePageAdmin/HomePageAdmin";
import HomePageFamilia from "../HomePageFamilia/HomePageFamilia";
import HomePageColaborador from "../HomePageColaborador/HomePageColaborador";
import {HomePageCalidad} from "../HomePageCalidad/HomePageCalidad"
import {HomePageEmpresa} from "../HomePageEmpresa/HomePageEmpresa"
import {HomePageGerencia} from "../HomePageGerencia/HomePageGerencia"

function HomePage() {
  const [roleUsuario, setRolUsuario] = useState('')
  
  const renderHomePage = () => {
    console.log(roleUsuario);
    switch (roleUsuario) {
      case 'Administrador':
        return <HomePageAdmin key="hpa" />;
      case 'Familias':
        return <HomePageFamilia key="hpf" />;
      case 'Colaboradores':
        return <HomePageColaborador key="hpc"/>
      case 'Calidad':
        return <HomePageCalidad key="hpcd"></HomePageCalidad>
      case 'Empresas':
        return <HomePageEmpresa key="hpe"></HomePageEmpresa>
      case 'Gerencia':
      return <HomePageGerencia key="hpg"></HomePageGerencia>
      default:
        return <div className="d-flex justify-content-center align-items-center">Cargando HOME...</div>; // Caso por defecto si el rol no coincide
    }
  };

  useEffect(()=>{
    setRolUsuario(localStorage.getItem('role') ?? '');
  },[]);

  return (
    <div>
      {renderHomePage()}
    </div>
  );
}

export default HomePage;