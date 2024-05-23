import { useEffect, useState } from "react";
import TablaFolios from "../HomePageAdmin/TablesClientes";
import HomePageAdmin from "../HomePageAdmin/HomePageAdmin";
import HomePageFamilia from "../HomePageFamilia/HomePageFamilia";

function HomePage() {
  const [roleUsuario, setRolUsuario] = useState(localStorage.getItem('role') ?? '')

  const renderHomePage = () => {
    switch (roleUsuario) {
      case 'admin':
        return <HomePageAdmin />;
      case 'familia':
        return <HomePageFamilia />;
      default:
        return <div>Usuario no válido</div>; // Caso por defecto si el rol no coincide
    }
  };

  return (
    <div>
      {renderHomePage()}
    </div>
  );
}

export default HomePage;