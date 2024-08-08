import { useEffect, useState } from "react";
import HomePageAdmin from "../HomePageAdmin/HomePageAdmin";
import HomePageFamilia from "../HomePageFamilia/HomePageFamilia";
import HomePageColaborador from "../HomePageColaborador/HomePageColaborador";

function HomePage() {
  const [roleUsuario, setRolUsuario] = useState(null)
  
  const renderHomePage = () => {
    switch (roleUsuario) {
      case 'Administrador':
        return <HomePageAdmin key="hpa" />;
      case 'Familias':
        return <HomePageFamilia key="hpf" />;
      case 'Colaboradores':
        return <HomePageColaborador key="hpc"/>
      default:
        return <div className="d-flex justify-content-center align-items-center">Cargando usuario...</div>; // Caso por defecto si el rol no coincide
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