import React from "react";
import { saveAs } from "file-saver";
import {
  getPuntosParametros,
  getTotalPuntosParametros,
  getPorcentajeSugerido,
  getTotalPuntosParametrosPdf,
} from "lib/estudios-functions";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
export default function PdfTablaEncuestas({ parametros, data, fileName }) {
  console.log(parametros);
  
  const getHeadersParameters = async () => {
    let headersTable = [
      "FOLIO",
      "FAMILIA",
      "ESTUDIANTE",
      "TOTAL",
      "% RECOMENDADO",
      "% ASIGNADO",
    ];
    let headers = [];
    parametros.forEach((element) => {
      if (element.nombre === "PATRIMONIO REPORTADO" || element.nombre === "NUMERO DE HIJOS INSCRITOS EN ESTE COLEGIO" || element.nombre === "ANTIGÜEDAD DE LA FAMILIA EN EL COLEGIO" ) {
        if (element.nombre === "PATRIMONIO REPORTADO") {
          headers.push("PATRIMONIO");
        }
  
        if (element.nombre === "NUMERO DE HIJOS INSCRITOS EN ESTE COLEGIO") {
          headers.push("NUM. HIJOS");
        }
  
        if (element.nombre === "ANTIGÜEDAD DE LA FAMILIA EN EL COLEGIO") {
          headers.push("ANTIGÜEDAD EN COLEGIO");
        }
      } else {
        headers.push(element.nombre)
      }
      

      
      
    });

    headersTable.splice(3, 0, ...headers);

    return headersTable;
  };

  const getProyetosTitles = async () => {
    let proyectos = [];
    data.forEach((element) => {
      proyectos.push(element.proyecto.nombre);
    });

    return proyectos;
  };

  const getClientesData = async () => {
    let clientes = [];
    data.forEach((element) => {
      clientes.push(element.cliente.nombre);
    });

    return clientes;
  };

  const exportToPdf = async () => {
    const doc = new jsPDF();
    const headers = await getHeadersParameters(); //["N°", "FAMILIA", "PATRIMONIO", "LIQUIDEZ", "TOTAL"];
    const proyectos = await getProyetosTitles();
    const clientes = await getClientesData();

    const pageWidth = doc.internal.pageSize.getWidth();

    console.log(data);
    
    const tableData = data.map((element, index) => [
      index + 1,
      element.candidato,
    ]);
    doc.setFontSize(8);
    let titleCliente = `Cliente: ${clientes[0]}`;
    let textWidthCliente = doc.getTextWidth(titleCliente); // Obtener el ancho del texto
    let xPosition = (pageWidth - textWidthCliente) / 2;
    doc.text(`${clientes[0]}`, xPosition, 10);

    let tilteProyecto = `Proyecto: ${proyectos[0]}`;
    let textWidthProyecto = doc.getTextWidth(tilteProyecto); // Obtener el ancho del texto
    xPosition = (pageWidth - textWidthProyecto) / 2;

    doc.text(`${proyectos[0]}`, xPosition, 15);

    doc.autoTable({
      head: [headers], // Encabezados
      body: tableData, // Datos
      startY: 20, // Posición Y donde comienza la tabla
      theme: "grid", // Estilo de la tabla (puede ser "striped", "grid", "plain")
      styles: {
        fontSize: 4, // Tamaño de la fuente
        cellPadding: 1, // Espaciado interno de las celdas
      },
      headStyles: {
        fillColor: [71, 209, 214], // Color de fondo del encabezado (azul)
        textColor: [255, 255, 255], // Color del texto del encabezado (blanco)
        fontStyle: "bold", // Negritas en el encabezado
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Ancho de la columna ID
        1: { cellWidth: "wrap" }, // Ancho de la columna Nombre
        2: { cellWidth: "auto" }, // Ancho de la columna Email
        3: { cellWidth: "auto" }, // Ancho de la columna Fecha
        4: { cellWidth: "auto" }, // Ancho de la columna Proyecto
        5: { cellWidth: "auto" }, // Ancho de la columna Orden de Servicio
        6: { cellWidth: "auto" }, // Ancho de la columna Proyecto
        7: { cellWidth: "auto" }, // Ancho de la columna Orden de Servicio
      },
    });
    doc.save("reporte.pdf");
  };

  const test = () => {
    console.log(data);
  };
  return (
    <button
      type="button"
      className="btn btn-outline text-danger"
      title="Descargar Tabla en PDF"
      onClick={exportToPdf}
    >
      <i className="bi bi-filetype-pdf" style={{ fontSize: "1.4rem" }}></i>
    </button>
  );
}
