import { useState } from "react";
import HomePageAdmin from "../HomePageAdmin/HomePageAdmin";
import HomePageFamilia from "../HomePageFamilia/HomePageFamilia";
import HomePageColaborador from "../HomePageColaborador/HomePageColaborador";

function HomePage() {
  const [roleUsuario, setRolUsuario] = useState(localStorage.getItem('role') ?? '')

  const renderHomePage = () => {
    switch (roleUsuario) {
      case 'Administrador':
        return <HomePageAdmin />;
      case 'Familias':
        return <HomePageFamilia />;
      case 'Colaboradores':
        return <HomePageColaborador/>
      default:
        return <div className="d-flex justify-content-center align-items-center">Usuario no válido</div>; // Caso por defecto si el rol no coincide
    }
  };

  return (
    <div>
      {renderHomePage()}
    </div>
  );
}

export default HomePage;