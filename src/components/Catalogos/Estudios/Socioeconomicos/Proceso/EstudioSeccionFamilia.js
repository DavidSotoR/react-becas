import Select from "react-select";
import makeAnimated from 'react-select/animated';

function EstudioSeccionFamilia ({
    fromData,
    setFormData,
    fromDataError,
    editarSeccion,
    setEditarSeccion,
    clientesComunes,
    clientesComunesDefault,
}) {
    
    const animatedComponents = makeAnimated;

    const listaColegiosComunes = (colegios_comunes) => {
        return colegios_comunes.map((colegio,index) => (<div key={'lcc-'+index} className="border p-1 mb-1 me-1">{colegio.nombre}</div>))
    }
    
    const formInputChange =(e) => {
        var {name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        
        setFormData(prevState => ({
            ...prevState,
            [name]: updatedValue
        }));
    }
    
    const handlerChangeSelectClientes = (e) =>{
        if(e && e.length){
            const allValues = e.map(e => e.value);
            setFormData(prevState => ({
                ...prevState,
                colegios_comunes: allValues
            }));
        }else{
                
            setFormData(prevState => ({
                ...prevState,
                colegios_comunes: []
            }));
        }
    }

    return(
        <div className="row">
            <div className="col-md-2"/>
                <div className="col-md-8">
                    <div className="d-flex">
                        <div className="bd-highlight">
                            <h4>Familia:</h4>
                        </div>
                        <div className="ms-auto bd-highlight">

                            {editarSeccion === 'familia' ? (<>
                            <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('')}><ion-icon name="trash-bin-outline"></ion-icon></button>
                            <button className="btn btn-sm btn-light ml-2" onClick={() => alert('Guardar')}><ion-icon name="save-outline"></ion-icon></button>
                            </>
                            ) : (
                                <button className="btn btn-sm btn-light ml-2" onClick={() => setEditarSeccion('familia')}><ion-icon name="create-outline"></ion-icon></button>
                            )}

                        </div>
                    </div>
                    <hr/>
                    <div className="mb-3 row">
                        <label htmlFor="candidato" className="col-sm-2 col-form-label">Nombre de Familia:</label>
                        {editarSeccion === 'familia' ? (<>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="candidato" name="candidato" value={fromData.candidato} onChange={(e)=> formInputChange(e)}/>
                            </div>
                            {fromDataError?.candidato && (
                            <div>
                                {fromDataError.candidato.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                            </div>
                            )}
                        </>) : (<>
                            <div className="col-sm-10 align-self-center">
                                <p className="m-0">{fromData.candidato}</p>
                            </div>
                        </>)}
                    </div>

                    <div className="mb-3 row">
                        <label htmlFor="situacion" className="col-sm-2 col-form-label">Situacion:</label>
                        
                        {editarSeccion === 'familia' ? (<>
                            <div className="col-sm-10">
                                <textarea
                                    id="situacion"
                                    name="situacion"
                                    value={fromData.situacion}
                                    onChange={(e)=> formInputChange(e)}
                                    placeholder="situacion..."
                                    rows="4"
                                    cols="50"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            {fromDataError?.situacion && (
                            <div>
                                {fromDataError.situacion.map((message => (<p><span className="error-msg"> {message} </span></p>)))}
                            </div>
                            )}
                        </>) : (<>
                            <div className="col-sm-10 align-self-center">
                                <p className="m-0">{fromData.situacion}</p>
                            </div>
                        </>)}
                    </div>
                    
                    <div className="mb-3 row">
                        <p className="col-sm-2 col-form-label">Familia con colegios comunes</p>
                        {editarSeccion === 'familia' ? (<>
                            <div className="col-sm-10 pt-1">
                                <div className="form-switch">
                                    <input 
                                        className="form-check-input" 
                                        name="es_cliente_comun" 
                                        type="checkbox" 
                                        checked={fromData.es_cliente_comun}
                                        role="switch" id="es_cliente_comun" 
                                        onChange={(e) => {formInputChange(e)}}
                                        />
                                    <label className="form-check-label">{(fromData.es_cliente_comun) ? 'Si' : 'No'}</label>
                                </div>
                            </div>
                                    
                            {fromData.es_cliente_comun && (
                                <div className="mb-3 row">
                                    <label htmlFor="colegios_comunes" className="col-sm-2 col-form-label">Familia colegios relacionados:</label>
                                    <div className="col-sm-10">
                                        <Select 
                                        options={ clientesComunes }
                                        defaultValue={clientesComunesDefault}
                                        onChange={(e)=>handlerChangeSelectClientes(e)}
                                        components={animatedComponents}
                                        closeMenuOnSelect={false}
                                        isMulti
                                        ></Select>
                                    </div>
                                </div>
                            )}
                        </>) : (<>
                            <div className="col-sm-10">
                                <div className="d-flex flex-nowrap rounded">
                                    {(fromData.es_cliente_comun) ? (listaColegiosComunes(fromData.colegios_comunes)) : (<><p className="m-0">No</p></>)}
                                </div>
                            </div>
                        </>)}
                    </div>

                    
                    
            </div>
        </div>)
}

export default EstudioSeccionFamilia