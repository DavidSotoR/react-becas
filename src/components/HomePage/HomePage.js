import { useEffect, useState } from "react";
import TablaFolios from "../HomePageAdmin/TablesClientes";
import HomePageAdmin from "../HomePageAdmin/HomePageAdmin";
import HomePageFamilia from "../HomePageFamilia/HomePageFamilia";

function HomePage() {
  const [roleUsuario, setRolUsuario] = useState('postulante')

  const renderHomePage = () => {
    switch (roleUsuario) {
      case 'admin':
        return <HomePageAdmin />;
      case 'postulante':
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