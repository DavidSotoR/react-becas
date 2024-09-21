
function EstudioSeccionPadres ({
        familiar,
        fromData,
        setFormData,
        fromDataError,
        editarSeccion,
        setEditarSeccion,
    }) {

    const formInputChangeFamiliar = (e,familiar='') => {
        if(familiar ===''){
            return false;
        }

        var {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        
        setFormData(prevState => ({
            ...prevState,
            [familiar]:{
                ...prevState[familiar],
                [name]: updatedValue
            }
        }));
    }

    return (
        <div className="row">
            <div className="col-md-2"/>
            <div className="col-md-8">
                <br/>            
                <div className="d-flex">
                    <div className="bd-highlight">
                        <h4>{familiar.charAt(0).toUpperCase() + familiar.slice(1)}</h4>
                    </div>
                    <div className="ms-auto bd-highlight">

                        {editarSeccion === familiar ? (<>
                        <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('')}><ion-icon name="trash-bin-outline"></ion-icon></button>
                        <button className="btn btn-sm btn-light ml-2" onClick={() => alert('Guardar')}><ion-icon name="save-outline"></ion-icon></button>
                        </>
                        ) : (
                            <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion(familiar)}><ion-icon name="create-outline"></ion-icon></button>
                        )}

                    </div>
                </div>
                <hr/>
                
                <div className="mb-3 row">
                    <label htmlFor="nombre" className="col-sm-2 col-form-label">
                        Nombre
                    </label>
                    {editarSeccion === familiar ? (
                        <div className="col-sm-10">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="nombre" 
                                name="nombre"
                                value={fromData[familiar].nombre}
                                onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            />
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].nombre}</p>
                        </div>
                    )}
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="edad" className="col-sm-2 col-form-label">
                        Edad
                    </label>
                    
                    {editarSeccion === familiar ? (
                        <div className="col-sm-10">
                            <input 
                                type="number" 
                                className="form-control" 
                                id="edad" 
                                name="edad"
                                value={fromData[familiar].edad}
                                onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            />
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].edad}</p>
                        </div>
                    )}
                </div>
                
                <div className="mb-3 row">
                    <p className="col-sm-2 col-form-label">
                        Vivie
                    </p>
                    
                    {editarSeccion === familiar ? (
                        <div className="col-sm-10 pt-1">
                            <div className="form-switch">
                                <input 
                                    className="form-check-input" 
                                    id="vive" 
                                    name="vive" 
                                    type="checkbox" 
                                    checked={fromData[familiar].vive}
                                    role="switch" 
                                    onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                                    />
                                <label className="form-check-label">{(fromData[familiar].vive) ? 'Si' : 'No'}</label>
                            </div>
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].vive ? 'Si' : 'No'}</p>
                        </div>
                    )}
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="direccion" className="col-sm-2 col-form-label">
                        Direccion:
                    </label>

                    {editarSeccion === familiar ? (
                        <div className="col-sm-10">
                            <textarea
                                id="direccion"
                                name="direccion"
                                value={(fromData[familiar].direccion === null) ? '' : fromData[familiar].direccion }
                                onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                                placeholder="Dirección..."
                                rows="4"
                                cols="10"
                                style={{ width: '100%' }}
                            />
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].direccion}</p>
                        </div>
                    )}
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="ocupacion_actual" className="col-sm-2 col-form-label">
                        Ocupacion actual:
                    </label>

                    {editarSeccion === familiar ? (
                        <div className="col-sm-10">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="ocupacion_actual" 
                                name="ocupacion_actual"
                                value={(fromData[familiar].ocupacion_actual === null) ? '' : fromData[familiar].ocupacion_actual }
                                onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            />
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].ocupacion_actual}</p>
                        </div>
                    )}
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="empresa_trabajo" className="col-sm-2 col-form-label">
                        Empresa de trabajo:
                    </label>

                    {editarSeccion === familiar ? (
                        <div className="col-sm-10">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="empresa_trabajo" 
                                name="empresa_trabajo"
                                value={(fromData[familiar].empresa_trabajo === null) ? '' : fromData[familiar].empresa_trabajo }
                                onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            />
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].empresa_trabajo}</p>
                        </div>
                    )}
                </div>

                <div className="mb-3 row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Correo:</label>

                    {editarSeccion === familiar ? (
                        <div className="col-sm-10">
                            <input type="text" className="form-control" value={fromData[familiar].email} id="email" name="email" onChange={(e)=> formInputChangeFamiliar(e,familiar)}/>
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].email}</p>
                        </div>
                    )}
                </div>
                
                <div className="mb-3 row">
                    <label htmlFor="telefono_casa" className="col-sm-2 col-form-label">
                        Telefono de casa:
                    </label>

                    {editarSeccion === familiar ? (
                        <div className="col-sm-10">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="telefono_casa" 
                                name="telefono_casa"
                                value={fromData[familiar].telefono_casa}
                                onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                            />
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].telefono_casa}</p>
                        </div>
                    )}
                </div>
                
                <div className="mb-3 row">
                    <p className="col-sm-2 col-form-label">
                        Contacto Principal:
                    </p>

                    {editarSeccion === familiar ? (
                        <div className="col-sm-10 pt-1 needs-validation">
                            <div className="form-switch">
                                <input 
                                    className="form-check-input" 
                                    id="contecto_principal" 
                                    name="contecto_principal" 
                                    type="checkbox" 
                                    checked={fromData[familiar].contecto_principal}
                                    role="switch" 
                                    onChange={(e)=> formInputChangeFamiliar(e,familiar)}
                                    />
                                <label className="form-check-label">{(fromData[familiar].contecto_principal) ? 'Si' : 'No'}</label>
                            </div>
                        </div>
                    ) : (
                        <div className="col-sm-10 align-self-center">
                            <p className="m-0">{fromData[familiar].contecto_principal ? 'Si' : 'No' }</p>
                        </div>
                    )}
                </div>
                <br/>
            </div>
        </div>)

}

export default EstudioSeccionPadres