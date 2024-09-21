
function EstudioSeccionUbicacion ({
        fromData,
        setFormData,
        fromDataError,
        editarSeccion,
        setEditarSeccion,
    }) {

        const formInputChange =(e) => {
            var {name, value, type, checked } = e.target;
            const updatedValue = type === 'checkbox' ? checked : value;
            
            setFormData(prevState => ({
                ...prevState,
                [name]: updatedValue
            }));
        }
        
    return (
        <div className="row">
            <div className="col-md-2"/>
            <div className="col-md-8">

                <div className="d-flex mt-1">
                    <div className="bd-highlight">
                        <h4>Ubicacion:</h4>
                    </div>
                    <div className="ms-auto bd-highlight">

                        {editarSeccion === 'ubicacion' ? (<>
                        <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('')}><ion-icon name="trash-bin-outline"></ion-icon></button>
                        <button className="btn btn-sm btn-light ml-2" onClick={() => alert('Guardar')}><ion-icon name="save-outline"></ion-icon></button>
                        </>
                        ) : (<>
                        <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('ubicacion')}><ion-icon name="create-outline"></ion-icon></button>
                        </>)}

                    </div>
                </div>
                <hr/>

                {editarSeccion === 'ubicacion' ? (<>
                    <div className="mb-3 row">
                        <label htmlFor="latitud" className="col-sm-2 col-form-label">Latitud:</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" id="latitud" name="latitud" value={fromData.latitud} onChange={(e)=> formInputChange(e)}/>
                        </div>
                        {fromDataError?.latitud && (
                        <div>
                            {fromDataError.latitud.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                        </div>
                        )}
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="longitud" className="col-sm-2 col-form-label">Longitud:</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" id="longitud" name="longitud" value={fromData.longitud} onChange={(e)=> formInputChange(e)}/>
                        </div>
                        {fromDataError?.longitud && (
                        <div>
                            {fromDataError.longitud.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                        </div>
                        )}
                    </div>
                </>) : (<>
                    <div className="mb-3 row">
                        <label htmlFor="latitud" className="col-sm-2 col-form-label">Direccion:</label>
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData?.direccion ? fromData.direccion : '' }</p>
                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="latitud" className="col-sm-2 col-form-label">Ubicacion:</label>
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData.latitud},{fromData.longitud}</p>
                        </div>
                    </div>
                </>)}
                
                <br/>
            </div>
        </div>)
}

export default EstudioSeccionUbicacion