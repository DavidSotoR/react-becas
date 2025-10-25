import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Toast from 'react-bootstrap/Toast';

function FamiliaSubirArchivos() {
  const { logout } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const APIURL = process.env.REACT_APP_API_URL;
  const urlIMG = process.env.SERVER_STORAGE;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const [successIngresos, setSuccessIngresos] = useState(false);
  const [successDesempleo, setSuccessDesempleo] = useState(false);
  const [successAuto, setSuccessAuto] = useState(false);
  const [successCasa, setSuccessCasa] = useState(false);
  const [successComprobante, setSuccessComprobante] = useState(false);

  const [filesDeFamilia, setFilesDeFamilia] = useState([]);
  const [files1DeFamilia, setFiles1DeFamilia] = useState([]);
  const [files2DeFamilia, setFiles2DeFamilia] = useState([]);
  const [files3DeFamilia, setFiles3DeFamilia] = useState([]);
  const [files4DeFamilia, setFiles4DeFamilia] = useState([]);
  const [files5DeFamilia, setFiles5DeFamilia] = useState([]);
  const [files6DeFamilia, setFiles6DeFamilia] = useState([]);

  const [showModalEliminarFile, setShowModalEliminarFile] = useState(false);
  const [dataFamiliaFile, setDataFamiliaFile] = useState(null);
  const handleCloseModalEliminarFile = () => {
    setShowModalEliminarFile(false);
  };
  const handleShowModalEliminarFile = () => {
    setShowModalEliminarFile(true);
  };

  const [file, setFile] = useState(null);
  const [fileD, setFileD] = useState(null);
  const [fileCH, setFileCH] = useState(null);
  const [fileAutos, setFileAutos] = useState(null);
  const [fileDomicilio, setFileDomicilio] = useState(null);
  const [cargandoImgIngreso, setCargandoImgIngreso] = useState(true);

  const [showToastSuccess, setShowToastSuccess] = useState(false);
  

  const dataPOST = {
    id_familia: "",
    id_familias_documentos_tipo: "",
  };

  const getFilesDeFamilia = () => {
    var id = localStorage.getItem("id");
    axios
      .get(APIURL + "/familias/" + id + "/documentos", config)
      .then((resp) => {
        setFilesDeFamilia(resp.data);
        console.log(resp.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          logout();
        }
      });
  };

  const contieneArchivoTipoID = (tipo) => {
    var obj = filesDeFamilia.filter((obj) => {
      for (let key in obj) {
        if (key === "id_familias_documentos_tipo" && obj[key] === tipo) {
          return true;
        }
      }
      return false;
    });
    if (obj.length >= 1) {
      return true;
    } else {
      return false;
    }
  };

  const subirArchivosIngresos = () => {
    var id = localStorage.getItem("id");
    const formData = new FormData();
    if (!file) {
      alert("Seleccione un archivo antes de subir.");
      return;
    }
    formData.append("id_familia", id);
    formData.append("id_familias_documentos_tipo", 1);
    formData.append("id_servicio_estudio", searchParams.get("idse"));
    for (let i = 0; i < file.length; i++) {
      formData.append("files[]", file[i]); // Importante: 'files[]' para múltiples archivos
    }

    axios
      .post(APIURL + "/familias/documentos", formData, config)
      .then((resp) => {
        console.log(resp);
        setSuccessIngresos(true);
        getFilesDeFamilia();
        setShowToastSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          logout();
        }

        setSuccessIngresos(false);
      });
  };

  const subirArchivosDesempleo = () => {
    var id = localStorage.getItem("id");
    const formData = new FormData();
    if (!fileD) {
      alert("Seleccione un archivo antes de subir.");
      return;
    }

    formData.append("id_familia", id);
    formData.append("id_familias_documentos_tipo", 2);
    formData.append("id_servicio_estudio", searchParams.get("idse"));
    for (let i = 0; i < fileD.length; i++) {
      formData.append("files[]", fileD[i]); // Importante: 'files[]' para múltiples archivos
    }

    console.log(formData);

    axios
      .post(APIURL + "/familias/documentos", formData, config)
      .then((resp) => {
        console.log(resp);
        setSuccessDesempleo(true);
        getFilesDeFamilia();
        setShowToastSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          logout();
        }

        setSuccessDesempleo(false);
      });
  };

  const subirArchivosCasaHabitacion = () => {
    var id = localStorage.getItem("id");
    const formData = new FormData();
    if (!fileCH) {
      alert("Seleccione un archivo antes de subir.");
      return;
    }

    formData.append("id_familia", id);
    formData.append("id_familias_documentos_tipo", 3);
    formData.append("id_servicio_estudio", searchParams.get("idse"));
    for (let i = 0; i < fileCH.length; i++) {
      formData.append("files[]", fileCH[i]); // Importante: 'files[]' para múltiples archivos
    }

    axios
      .post(APIURL + "/familias/documentos", formData, config)
      .then((resp) => {
        console.log(resp);
        setSuccessCasa(true);
        getFilesDeFamilia();
        setShowToastSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          logout();
        }

        setSuccessCasa(false);
      });
  };

  const subirArchivosAutomoviles = () => {
    var id = localStorage.getItem("id");
    const formData = new FormData();
    if (!fileAutos) {
      alert("Seleccione un archivo antes de subir.");
      return;
    }

    formData.append("id_familia", id);
    formData.append("id_familias_documentos_tipo", 4);
    formData.append("id_servicio_estudio", searchParams.get("idse"));
    for (let i = 0; i < fileAutos.length; i++) {
      formData.append("files[]", fileAutos[i]); // Importante: 'files[]' para múltiples archivos
    }

    axios
      .post(APIURL + "/familias/documentos", formData, config)
      .then((resp) => {
        console.log(resp);
        setSuccessAuto(true);
        getFilesDeFamilia();
        setShowToastSuccess(true);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          logout();
        }

        setSuccessAuto(false);
      });
  };

  const subirArchivosComprobantes = () => {
    var id = localStorage.getItem("id");
    const formData = new FormData();
    if (!fileDomicilio) {
      alert("Seleccione un archivo antes de subir.");
      return;
    }

    formData.append("id_familia", id);
    formData.append("id_familias_documentos_tipo", 5);
    formData.append("id_servicio_estudio", searchParams.get("idse"));
    for (let i = 0; i < fileDomicilio.length; i++) {
      formData.append("files[]", fileDomicilio[i]); // Importante: 'files[]' para múltiples archivos
    }

    axios
      .post(APIURL + "/familias/documentos", formData, config)
      .then((resp) => {
        console.log(resp);
        setSuccessComprobante(true);
        getFilesDeFamilia();
        setShowToastSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          logout();
        }

        setSuccessComprobante(false);
      });
  };

  const actualizoInputFiles = (e, name) => {
    console.log(name);
    console.log(e);
    if (name === "ingresos") {
      setFile(e.target.files);
    }
    if (name === "desempleo") {
      console.log(e.target.files);

      setFileD(e.target.files);
    }
    if (name === "casahabitacion") {
      setFileCH(e.target.files);
    }
    if (name === "autos") {
      setFileAutos(e.target.files);
    }
    if (name === "comprobantes") {
      setFileDomicilio(e.target.files);
    }
  };

  const addFiles = (id_tipo) => {
    var filtro = [];
    filesDeFamilia.forEach((item) => {
      if (item.id_familias_documentos_tipo === id_tipo) {
        filtro.push(item);
      }
    });

    if (id_tipo === 1) {
      setFiles1DeFamilia(filtro);
    }

    if (id_tipo === 2) {
      setFiles2DeFamilia(filtro);
    }

    if (id_tipo === 3) {
      setFiles3DeFamilia(filtro);
    }

    if (id_tipo === 4) {
      setFiles4DeFamilia(filtro);
    }

    if (id_tipo === 5) {
      setFiles5DeFamilia(filtro);
    }

    if (id_tipo === 6) {
      setFiles6DeFamilia(filtro);
    }

    /* return [...filtro1.map((file) => (
            <li> {file.nombre} </li>
        ))] */
  };

  const deleteFileFamilia = (idtipo) => {
    axios
      .delete(
        APIURL + "/familias/documentos/file/" + dataFamiliaFile.id,
        config
      )
      .then((resp) => {
        console.log(resp);
        setDataFamiliaFile(null);
        handleCloseModalEliminarFile();
        setCargandoImgIngreso(false)
        getFilesDeFamilia()
        /* if (idtipo === 1) {
          setCargandoImgIngreso(false)
          renderImgDeFamilia(1)
        }
        
        renderImgDeFamilia(2)
        renderImgDeFamilia(3)
        renderImgDeFamilia(4)
        renderImgDeFamilia(5) */
      })
      .catch((err) => {
        console.log(err);
      }).then(()=>{
        console.log('termino');
        setCargandoImgIngreso(true)
        
      });
  };

  const openModalEliminarFile = (data) => {
    handleShowModalEliminarFile();
    setDataFamiliaFile(data);
    console.log(data);
  };

  const renderImgDeFamilia = (tipo) => {
    
    
    switch (tipo) {
      case 1:
        return files1DeFamilia
          .filter((ch) => /\.(jpg|jpeg|png)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch, index) => (
            <div
              key={index + "img-ingresos"}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="d-flex justify-content-center p-2">
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-danger mb-3"
                  data-bs-toggle="button"
                > 
                  <span className="fw-bold mx-1">ELIMINAR</span>
                  <i style={{ color: "white" }} className="bi bi-trash-fill"></i>
                </button>
              </div>
              <img
                src={urlIMG + ch.directorio}
                className="d-block w-100 h-50 rounded"
                alt={ch.nombre}
              />
            </div>
          ));
        break;
      
      case 2:
        return files2DeFamilia
          .filter((ch) => /\.(jpg|jpeg|png)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch, index) => (
            <div
              key={index + 'img-desempleo'}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="d-flex justify-content-end p-2">
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-danger mb-3"
                  data-bs-toggle="button"
                > 
                  <span className="fw-bold mx-1">ELIMINAR</span>
                  <i style={{ color: "white" }} className="bi bi-trash-fill"></i>
                </button>
              </div>
              <img
                src={urlIMG + ch.directorio}
                className="d-block w-100 h-50 rounded"
                alt={ch.nombre}
              />
            </div>
          ));
        break;

      case 3:
        return files3DeFamilia
          .filter((ch) => /\.(jpg|jpeg|png)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch, index) => (
            <div
              key={index + 'img-casahab'}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="d-flex justify-content-end p-2">
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-danger mb-3"
                  data-bs-toggle="button"
                > 
                  <span className="fw-bold mx-1">ELIMINAR</span>
                  <i style={{ color: "white" }} className="bi bi-trash-fill"></i>
                </button>
              </div>
              <img
                src={urlIMG + ch.directorio}
                className="d-block w-100 h-50 rounded"
                alt={ch.nombre}
              />
            </div>
          ));
        break;

      case 4:
        return files4DeFamilia
          .filter((ch) => /\.(jpg|jpeg|png)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch, index) => (
            <div
              key={index + 'img-auto'}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="d-flex justify-content-end p-2">
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-danger mb-3"
                  data-bs-toggle="button"
                > 
                  <span className="fw-bold mx-1">ELIMINAR</span>
                  <i style={{ color: "white" }} className="bi bi-trash-fill"></i>
                </button>
              </div>
              <img
                src={urlIMG + ch.directorio}
                className="d-block w-100 h-50 rounded"
                alt={ch.nombre}
              />
            </div>
          ));
        break;

      case 5:
        return files5DeFamilia
          .filter((ch) => /\.(jpg|jpeg|png)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch, index) => (
            <div
              key={index + 'img-compdomc'}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="d-flex justify-content-end p-2">
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-danger mb-3"
                  data-bs-toggle="button"
                > 
                  <span className="fw-bold mx-1">ELIMINAR</span>
                  <i style={{ color: "white" }} className="bi bi-trash-fill"></i>
                </button>
              </div>
              <img
                src={urlIMG + ch.directorio}
                className="d-block w-100 h-50 rounded"
                alt={ch.nombre}
              />
            </div>
          ));
        break;

      case 6:
        return files6DeFamilia
          .filter((ch) => /\.(jpg|jpeg|png)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch, index) => (
            <div
              key={index + 'imgotro'}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="d-flex justify-content-end p-2">
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-danger mb-3"
                  data-bs-toggle="button"
                > 
                  <span className="fw-bold mx-1">ELIMINAR</span>
                  <i style={{ color: "white" }} className="bi bi-trash-fill"></i>
                </button>
              </div>
              <img
                src={urlIMG + ch.directorio}
                className="d-block w-100 h-50 rounded"
                alt={ch.nombre}
              />
            </div>
          ));
        break;
      default:
        break;
    }
  };

  const renderFilesDeFamilia = (tipo) => {
    switch (tipo) {
      case 1:
        return files1DeFamilia
          .filter((ch) =>
            /\.(docx|cbr|pdf|xcel|txt|xlsx)$/i.test(ch.directorio)
          ) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch) => (
            <tr>
              <td style={{ width: "70%", wordBreak:"break-all" }} className="p-1 pt-3 pb-0">
                {FileLink(ch.nombre, ch.directorio)}
              </td>
              <td>
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-icon-danger"
                  data-bs-toggle="button"
                >
                  <i style={{ color: "red" }} className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ));
        break;
      case 2:
        return files2DeFamilia
          .filter((ch) => /\.(docx|cbr|pdf|xcel|txt)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch) => (
            <tr>
              <td style={{ width: "70%", wordBreak:"break-all" }} className="p-1 pt-3 pb-0">
                {FileLink(ch.nombre, ch.directorio)}
              </td>
              <td>
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-icon-danger"
                  data-bs-toggle="button"
                >
                  <i style={{ color: "red" }} className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ));
        break;

      case 3:
        return files3DeFamilia
          .filter((ch) => /\.(docx|cbr|pdf|xcel|txt)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch) => (
            <tr>
              <td style={{ width: "70%", wordBreak:"break-all" }} className="p-1 pt-3 pb-0">
                {FileLink(ch.nombre, ch.directorio)}
              </td>
              <td>
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-icon-danger"
                  data-bs-toggle="button"
                >
                  <i style={{ color: "red" }} className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ));
        break;

      case 4:
        return files4DeFamilia
          .filter((ch) => /\.(docx|cbr|pdf|xcel|txt)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch) => (
            <tr>
              <td style={{ width: "70%", wordBreak:"break-all" }} className="p-1 pt-3 pb-0">
                {FileLink(ch.nombre, ch.directorio)}
              </td>
              <td>
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-icon-danger"
                  data-bs-toggle="button"
                >
                  <i style={{ color: "red" }} className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ));
        break;

      case 5:
        return files5DeFamilia
          .filter((ch) => /\.(docx|cbr|pdf|xcel|txt)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch) => (
            <tr>
              <td style={{ width: "70%", wordBreak:"break-all" }} className="p-1 pt-3 pb-0">
                {FileLink(ch.nombre, ch.directorio)}
              </td>
              <td>
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-icon-danger"
                  data-bs-toggle="button"
                >
                  <i style={{ color: "red" }} className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ));
        break;

      case 6:
        return files6DeFamilia
          .filter((ch) => /\.(docx|cbr|pdf|xcel|txt)$/i.test(ch.directorio)) // Filtrar solo archivos con extensión jpg, jpeg, png
          .map((ch) => (
            <tr>
              <td style={{ width: "70%", wordBreak:"break-all" }} className="p-1 pt-3 pb-0">
                {FileLink(ch.nombre, ch.directorio)}
              </td>
              <td>
                <button
                  onClick={() => openModalEliminarFile(ch)}
                  type="button"
                  className="btn btn-sm btn-icon-danger"
                  data-bs-toggle="button"
                >
                  <i style={{ color: "red" }} className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ));
        break;
      default:
        break;
    }
  };

  const contineImg = () => {
    var tieneImg = false
    var str = ''
    files1DeFamilia.forEach(element => {
      console.log(element);
      str = (element.alias).toLowerCase();
      if (str.endsWith('.png') || str.endsWith('.jpg') || str.endsWith('.jpeg')) {
        tieneImg = true
      }
      
    });
    return tieneImg;
  }

  const FileLink = (nombre, dir) => {
    const fileUrl = urlIMG + dir; // URL del archivo PDF o DOCX

    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        {nombre}
      </a>
    );
  };

  useEffect(() => {
    getFilesDeFamilia();
    //getDataEstudioSocioeconomico()
  }, []);

  useEffect(() => {
    if (filesDeFamilia.length > 0) {
      console.log(contieneArchivoTipoID(1));
    }
    addFiles(1);
    addFiles(2);
    addFiles(3);
    addFiles(4);
    addFiles(5);
    addFiles(6);
  }, [filesDeFamilia]);

  return (
    <div className="container mt-3 mb-3">
      <Toast onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={6000} autohide
          className="d-inline-block m-1 alert-position" 
          bg="success"
          key="1"
        >
          <Toast.Header>
            <strong className="me-auto">Completado</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Se agrego correctamente el archivo.
          </Toast.Body>
        </Toast>
      <div className="row">
        <div className="col-12">
          <ul className="list-group list-group">
            <li className="list-group-item">
              <div className="d-flex align-items-center">
                <p className="mb-0 me-2 pb-1 fw-bold">1. INGRESOS</p>
                <div className="">
                  {contieneArchivoTipoID(1) ? (
                    <ion-icon
                      name="checkmark-circle-outline"
                      style={{ fontSize: "32px", color: "green" }}
                    ></ion-icon>
                  ) : (
                    <ion-icon
                      name="alert-circle-outline"
                      style={{ fontSize: "32px", color: "red" }}
                    ></ion-icon>
                  )}
                </div>
              </div>
              <div className="ms-2 me-auto" id="conteiner-form-ingresos">
                <div className="mb-3">
                  <label
                    htmlFor="formFileMultipleIngresos"
                    className="form-label"
                  >
                    Cargar archivos Ingresos:
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => {
                      actualizoInputFiles(e, "ingresos");
                    }}
                    accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx"
                    type="file"
                    id="formFileMultipleIngresos"
                    multiple
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={subirArchivosIngresos}
                  >
                    {" "}
                    Subir Archivos{" "}
                  </button>
                </div>
                <div
                  className="row"
                  style={{
                    display: files1DeFamilia.length === 0 ? "none" : "",
                  }}
                >
                  <div className="col-12 col-md-12 col-lg-4">
                    <p className="fw-bold"> Archivos: </p>
                    <table className="table">
                      <tbody>{renderFilesDeFamilia(1)}</tbody>
                    </table>
                  </div>
                  {cargandoImgIngreso && contineImg() && (
                    <div className="carousel slide col-12 col-md-12 col-lg-8 sizeimg-evidencias"
                    id="carouselExample"
                    style={{ minWidth: "50vw" }}
                    >
                      <div className="carousel-inner">
                        {renderImgDeFamilia(1)}
                      </div>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          style={{ backgroundColor: "gray", borderRadius: "8px" }}
                          aria-hidden="true"
                        ></span>
                        <span
                          className="visually-hidden"
                          style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        >
                          Previous
                        </span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExample"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          style={{ backgroundColor: "gray", borderRadius: "8px" }}
                          aria-hidden="true"
                        ></span>
                        <span
                          className="visually-hidden"
                          style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        >
                          Next
                        </span>
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div className="d-flex align-items-center">
                <p className="mb-0 me-2 pb-1 fw-bold">2. DESEMPLEO</p>
                <div className="">
                  {contieneArchivoTipoID(2) ? (
                    <ion-icon
                      name="checkmark-circle-outline"
                      style={{ fontSize: "32px", color: "green" }}
                    ></ion-icon>
                  ) : (
                    <ion-icon
                      name="alert-circle-outline"
                      style={{ fontSize: "32px", color: "red" }}
                    ></ion-icon>
                  )}
                </div>
              </div>
              <div className="ms-2 me-auto">
                <div className="mb-3">
                  <label
                    htmlFor="formFileMultipleDesempleo"
                    className="form-label"
                  >
                    Cargar archivos Desempleo:
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => {
                      actualizoInputFiles(e, "desempleo");
                    }}
                    accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx"
                    type="file"
                    id="formFileMultipleDesempleo"
                    multiple
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={subirArchivosDesempleo}
                  >
                    {" "}
                    Subir Archivos{" "}
                  </button>
                </div>
                <div
                  className="row"
                  style={{
                    display: files2DeFamilia.length === 0 ? "none" : "flex",
                  }}
                >
                  <div className="col-12 col-md-12 col-lg-4">
                    <p className="fw-bold"> Archivos: </p>
                    <table className="table">
                      <tbody>{renderFilesDeFamilia(2)}</tbody>
                    </table>
                  </div>
                  <div
                    id="carouselDesempleo"
                    className="carousel slide col-12 col-md-12 col-lg-8 sizeimg-evidencias"
                    
                  >
                    <div className="carousel-inner">
                      {renderImgDeFamilia(2)}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselDesempleo"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Previous
                      </span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselDesempleo"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Next
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div className="d-flex align-items-center">
                <p className="mb-0 me-2 pb-1 fw-bold">3. CASA HABITACION</p>
                <div className="">
                  {contieneArchivoTipoID(3) ? (
                    <ion-icon
                      name="checkmark-circle-outline"
                      style={{ fontSize: "32px", color: "green" }}
                    ></ion-icon>
                  ) : (
                    <ion-icon
                      name="alert-circle-outline"
                      style={{ fontSize: "32px", color: "red" }}
                    ></ion-icon>
                  )}
                </div>
              </div>
              <div className="ms-2 me-auto">
                <div className="mb-3">
                  <label
                    htmlFor="formFileMultipleCasaHabitacion"
                    className="form-label"
                  >
                    Cargar archivos Casa/Habitacion:
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => {
                      actualizoInputFiles(e, "casahabitacion");
                    }}
                    accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx"
                    type="file"
                    id="formFileMultipleCasaHabitacion"
                    multiple
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={subirArchivosCasaHabitacion}
                  >
                    {" "}
                    Subir Archivos{" "}
                  </button>
                </div>
                <div
                  className="row"
                  style={{
                    display: files3DeFamilia.length === 0 ? "none" : "flex",
                  }}
                >
                  <div className="col-12 col-md-12 col-lg-4">
                    <p className="fw-bold"> Archivos: </p>
                    <table className="table">
                      <tbody>{renderFilesDeFamilia(3)}</tbody>
                    </table>
                  </div>
                  <div
                    id="carouselCasa"
                    className="carousel slide col-12 col-md-12 col-lg-8 sizeimg-evidencias"
                    
                  >
                    <div className="carousel-inner">
                      {renderImgDeFamilia(3)}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselCasa"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Previous
                      </span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselCasa"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Next
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div className="d-flex align-items-center">
                <p className="mb-0 me-2 pb-1 fw-bold">4. Automoviles</p>
                <div className="">
                  {contieneArchivoTipoID(4) ? (
                    <ion-icon
                      name="checkmark-circle-outline"
                      style={{ fontSize: "32px", color: "green" }}
                    ></ion-icon>
                  ) : (
                    <ion-icon
                      name="alert-circle-outline"
                      style={{ fontSize: "32px", color: "red" }}
                    ></ion-icon>
                  )}
                </div>
              </div>
              <div className="ms-2 me-auto">
                <div className="mb-3">
                  <label htmlFor="formFileMultipleAutos" className="form-label">
                    Cargar archivos Automóviles:
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => {
                      actualizoInputFiles(e, "autos");
                    }}
                    accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx"
                    type="file"
                    id="formFileMultipleAutos"
                    multiple
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={subirArchivosAutomoviles}
                  >
                    {" "}
                    Subir Archivos{" "}
                  </button>
                </div>
                <div
                  className="row"
                  style={{
                    display: files4DeFamilia.length === 0 ? "none" : "flex",
                  }}
                >
                  <div className="col-12 col-md-12 col-lg-4">
                    <p className="fw-bold"> Archivos: </p>
                    <table className="table">
                      <tbody>
                      {renderFilesDeFamilia(4)}
                      </tbody>
                    </table>
                  </div>
                  <div
                    id="carouselAutos"
                    className="carousel slide col-12 col-md-12 col-lg-8 sizeimg-evidencias"
                  >
                    <div className="carousel-inner">
                      {renderImgDeFamilia(4)}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselAutos"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Previous
                      </span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselAutos"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Next
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div className="d-flex align-items-center">
                <p className="mb-0 me-2 pb-1 fw-bold">
                  5. COMPROBANTES DE DOMICILIO
                </p>
                {contieneArchivoTipoID(5) ? (
                  <ion-icon
                    name="checkmark-circle-outline"
                    style={{ fontSize: "32px", color: "green" }}
                  ></ion-icon>
                ) : (
                  <ion-icon
                    name="alert-circle-outline"
                    style={{ fontSize: "32px", color: "red" }}
                  ></ion-icon>
                )}
              </div>
              <div className="ms-2 me-auto">
                <div className="mb-3">
                  <label
                    htmlFor="formFileMultipleComprobantes"
                    className="form-label"
                  >
                    Cargar archivos Comprobantes:
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => {
                      actualizoInputFiles(e, "comprobantes");
                    }}
                    accept=".pdf, .jpg, .jpeg, .png, .txt, .doc, .docx, .xls, .xlsx"
                    type="file"
                    id="formFileMultipleComprobantes"
                    multiple
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={subirArchivosComprobantes}
                  >
                    {" "}
                    Subir Archivos{" "}
                  </button>
                </div>
                <div
                  className="row"
                  style={{
                    display: files5DeFamilia.length === 0 ? "none" : "flex",
                  }}
                >
                  <div className="col-12 col-md-12 col-lg-4">
                    <p className="fw-bold"> Archivos: </p>
                    <table className="table">
                      <tbody>{renderFilesDeFamilia(5)}</tbody>
                    </table>
                  </div> 
                  <div className="carousel slide col-12 col-md-12 col-lg-8 sizeimg-evidencias"
                    id="carouselComprobantesDomicilio"
                    
                  >
                    <div className="carousel-inner">
                      {renderImgDeFamilia(5)}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselComprobantesDomicilio"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Previous
                      </span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselComprobantesDomicilio"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span
                        className="visually-hidden"
                        style={{ backgroundColor: "gray", borderRadius: "8px" }}
                      >
                        Next
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Modal show={showModalEliminarFile} onHide={handleCloseModalEliminarFile}>
        <Modal.Header closeButton>
          <Modal.Title>
            Archivo Seleccionado:{" "}
            {dataFamiliaFile ? dataFamiliaFile.nombre : "SIN DATO"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold text-danger">
            **El siguiente archivo sera eliminado del almacenamiento.**
          </p>
          <p>
            ¿Quiere continuar con la accion de ELIMINAR el archivo:{" "}
            <span className="fw-bold">
              {dataFamiliaFile ? dataFamiliaFile.nombre : "SIN DATO"}
            </span>{" "}
            ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalEliminarFile}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => deleteFileFamilia(dataFamiliaFile.id_familias_documentos_tipo)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FamiliaSubirArchivos;
