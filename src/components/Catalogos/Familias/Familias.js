import { Link } from "react-router-dom";
import PathConstants from "../../../routes/pathsConstants";

function CatalogoFamilias() {
    
    return (
       <div>
            Catalogo Familias
            <Link className="btn btn-primary" to={PathConstants.FAMILIASALTA}>Agregar Familia</Link>
       </div> 
    )
}

export default CatalogoFamilias;