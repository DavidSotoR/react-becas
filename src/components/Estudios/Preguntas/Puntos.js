import { useEffect, useState } from "react";

export default function Puntos({parametros,calsificacion,colClass,verPuntos}) {

    const [paraetro,setParametro] = useState(null)

    const getParametro = () => {
          // Convertir el valor del input a número para buscar por id
            const idToSearch = parseInt(calsificacion, 10);

            // Encontrar el objeto que coincida con el valor de la clave "id"
            const result = parametros.find(item => item.id === calsificacion);

            setParametro(result || null);
    }

    useEffect(()=>{
        getParametro();
    },[])

    return  (
        <div className="row">
            <div className="col"/>
            <div className={colClass}> 
                {paraetro && (<div>
                    <b>{paraetro?.nombre && paraetro.nombre}:</b> {paraetro?.puntos && paraetro.puntos.valor} Puntos
                    <br/>
                    {paraetro?.puntos && paraetro.puntos.limiten_inferior} - {paraetro?.puntos && paraetro.puntos.limite_superior}
   
                </div>
                )}
                <hr/>
            </div>
            <div className="col"/>
        </div> 
    )
}