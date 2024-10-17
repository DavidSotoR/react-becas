

export default function Puntos({idEstudio,preguntas,colClass,verPuntos}) {
    return  (
        <div className="row">
            <div className="col"/>
            <div className={colClass}>
                Mostrar Puntos {verPuntos ? 'true' : 'false'}
            </div>
            <div className="col"/>
        </div> 
    )
}