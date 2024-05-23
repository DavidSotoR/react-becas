

function HomePageFamilia() {
    
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <h5>Debe Ingresar la siguiente lista de archivos para continuar el proceso de becas.</h5>
                    <p>La papeleria solicitada es de ambos Padres o Tutor que se encuentre laborando.</p>
                </div>
                <div className="col-12">
                    <ol className="list-group list-group-numbered">
                        <li className="list-group-item">
                            <span className="fw-bold">INGRESOS</span> (Una de las 3 opciones) 
                            <div className="ms-2 me-auto">
                                <ul>
                                    <li>Recibos de nomina de los ultimos 3 meses.</li>
                                    <li>Carta en Hoja membretada, firmada, con sello que contenga la informacion 
                                        detallada(Ingreso mensual, prestaciones, montos).
                                    </li>
                                    <li>Estados de cuenta bancario.</li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <span className="fw-bold">DESEMPLEO</span> 
                            <div className="ms-2 me-auto">
                                <ul>
                                    <li>Carta del ultimo empleo con fecha de separacion, membretada, firmada y con sello.</li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                        <span className="fw-bold">CASA HABITACION</span> 
                            <div className="ms-2 me-auto">
                                <ul>
                                    <li>
                                        Si la casa es propia o hipotecada comprobante del predial o estado de cuenta
                                        donde venga el monto que pago y debe.
                                    </li>
                                    <li>
                                        Si la casa es de renta comprobante de contrato o recibo de pago mensual.
                                    </li>
                                    <li>
                                        Si la casa es prestada comrobante del predial del dueño de la propiedad.
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <span className="fw-bold">AUTOMÓVILES</span> (propios, de la empresa o prestados) comprobar con:
                            <div className="ms-2 me-auto">
                                <ul>
                                    <li>Tarjeta de circulación</li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <span className="fw-bold">COMPROBANTES DE</span>
                            <div className="ms-2 me-auto">
                                <ul>
                                    <li>RECIBOS DE luz, agua, gas, telefono, celulares (últimos 2 recibos)</li>
                                    <li>DEUDAS (estados de cuenta de tarjetas de crédito, crédito automotriz, crédito hipotecario,
                                        tarjetas departamentales).</li>
                                    <li>DE TODO PAGO REALIZADO seguros de GMM, vida, segubecas, de autos, préstamos bancarios, etc</li>
                                </ul>
                            </div>
                        </li>
                    </ol>
                </div>
                <div className="col-12 mt-5 p-3">
                    <h5>NOTA IMPORTANTE</h5>
                    <p className="fw-bold">SE SUBEN LOS ARCHIVOS EN PDF, AL LINK PROPORCIONADOS POR EL COLEGIO,
                    NO SE ACEPTARAN DOCUMENTOS EN FOTOGRAFIAS.</p>
                    <p className="fw-bold">EN EL CASO QUE LOS DOCUMETNOS LOS SOLICITE EL COLEGIO DE MANERA FISICA,
                    ENTREGAR 1 JUEGO DE COPIAS Y TENER PARA EL MOMENTO DEL ESTUDIO LOS ORIGINALES</p>
                </div>
                <div className="col-12 d-flex justify-content-center">
                    <button className="btn btn-primary">Subir Archivos</button>
                </div>
            </div>
        </div>
    )
}


export default HomePageFamilia;