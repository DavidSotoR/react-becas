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
import axios from "../../../../node_modules/axios/index";
export default function PdfTablaEncuestas({ parametros, data, tipo_reporte }) {

  const APIURL = process.env.REACT_APP_API_URL;
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  
  const mostrarColumnaHijo = () => {
      return data.some(row => row.hasOwnProperty('hijo'));
    };
  
  const columns = [
    {
      name: "No Estudio",
      selector: (row) => row.id,
    },
    {
      name: "Familia",
      selector: (row) => row.candidato,
      width: "300px",
    },
    
    mostrarColumnaHijo() && {      
      name: "Hijo",
      selector: (row) => row.nombre_hijo,
      width: "300px",
    },

    ...parametros.map((parametro) => ({
      name: parametro.nombre,
      selector: (row) => {
        const param = row.parametros.find((p) => p.id === parametro.id);
        return param ? getPuntosParametros(row.parametros, parametro.id) : "-";
      },
    })),
    {
      name: "Total",
      selector: (row) => getTotalPuntosParametros(row.parametros),
    },
    {
      name: "Porcentaje Sugerido",
      selector: (row) => `${getPorcentajeSugerido(row.parametros)}%`,
    },
    {
      name: "Porcentaje Otorgado",
      cell: (row) =>  {return (row.porcentaje_otorgado !== null )  ?  `${row.porcentaje_otorgado}%` : row.hijo ? row.hijo.porcentaje_otorgado : 'SIN DATO' },
    },
    {
      name: "No. Familia Colegio",
      cell: (row) => {return (row.clave_familia_colegio !==null )  ? row.clave_familia_colegio : "" },
    },

    
    {
      name: "Proyecto",
      cell: (row) => {return (row?.proyecto && row.proyecto?.nombre && row.proyecto.nombre !==null )  ? row.proyecto.nombre : "" },
      width: "300px",
    },
    
    {
      name: "Orden de servicio",
      cell: (row) => {return (row?.orden_servicio && row.orden_servicio?.descripcion &&row.orden_servicio.descripcion !==null )  ?  `#${row.orden_servicio.id} ${row.orden_servicio.descripcion}` : "" },
      width: "300px",
    },
  ];
  
  const transformDataForExcel = () => {
    return data.map((row) => {
      console.log(row);
      
      const transformedRow = {};
      columns.forEach((col) => {        
        if (col.selector) {
          // Si el selector es una función, evaluarlo
          transformedRow[col.name] = typeof col.selector === "function" ? col.selector(row) : row[col.selector];
        } else if (col.cell) {
          // Para celdas con lógica compleja, agregar texto representativo
          transformedRow[col.name] = typeof col.cell === "function"
                    ? col.cell(row)
                    : "null";
        }
      });

      return transformedRow;
    });
  };

  const getHeadersParameters = async () => {
    const renamingMap = {
      "PATRIMONIO REPORTADO": "PATRIMONIO",
      "NUMERO DE HIJOS INSCRITOS EN ESTE COLEGIO": "NUM. HIJOS",
      "ANTIGÜEDAD DE LA FAMILIA EN EL COLEGIO": "ANTIGÜEDAD EN COLEGIO",
    };
  
    let headers = [];
    parametros.forEach((element) => {
      if (renamingMap[element.nombre]) {
        headers.push(renamingMap[element.nombre]);
      } else {
        headers.push(element.nombre);
      }
    });
  
    let headersTable = [
      "FOLIO",
      "FAMILIA",
      "ALUMNO",
      "TOTAL",
      "% RECOMENDADO",
      "% ASIGNADO"
    ];
    
    headersTable.splice(3, 0, ...headers); // Insertar después de "TOTAL"
    
    return headersTable;
  };
  

  const exportToPdf = async () => {
    const doc = new jsPDF();
    const headers = await getHeadersParameters();
    const transformedData = transformDataForExcel();
  
    const proyectosUnicos = [...new Set(transformedData.map(item => item.Proyecto))];
    let proyectos = proyectosUnicos;
    
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(8);
    //console.log(headers);
  
    

    // Mapeo de los headers a los nombres correctos en el objeto de datos
    const headerToKeyMap = {
        "FOLIO": "No Estudio",
        "FAMILIA": "Familia",
        "ALUMNO": "Hijo",
        "TOTAL": "Total",
        "% RECOMENDADO": "Porcentaje Sugerido",
        "% ASIGNADO": "Porcentaje Otorgado",
        "PATRIMONIO": "PATRIMONIO REPORTADO",
        "NIVEL DE LIQUIDES": "NIVEL DE LIQUIDES",
        "CALIDAD DE VIDA": "CALIDAD DE VIDA",
        "NUM. HIJOS": "NUMERO DE HIJOS INSCRITOS EN ESTE COLEGIO",
        "ANTIGÜEDAD EN COLEGIO": "ANTIGÜEDAD DE LA FAMILIA EN EL COLEGIO",
        "PROMEDIO ACADÉMICO": "PROMEDIO ACADÉMICO",
        "CONDUCTA": "CONDUCTA"
    };
    
    console.log(transformedData);
    
    const body = transformedData.map(item =>
        headers.map(header => item[headerToKeyMap[header]] || "") // Si no encuentra el valor, pone ""
    );

    // Título del proyecto
    let titleProyecto = `Proyecto: ${proyectos[0]}`;
    let textWidthProyecto = doc.getTextWidth(titleProyecto);
    let xPosition = (pageWidth - textWidthProyecto) / 2;
    doc.text(titleProyecto, xPosition, 10);

    let ordenServicio = transformedData[0]["Orden de servicio"]
    
    let OS = "Orden Servicio: " + ordenServicio;
    let textWidthOS = doc.getTextWidth(OS);
    let xPositionOS = (pageWidth - textWidthOS) / 2;
    doc.text(OS, xPositionOS, 15);

    console.log(body);
    
    

    if (tipo_reporte === 'completo') {
      doc.autoTable({
        head: [headers], // Encabezados
        body: body,      // Datos
        startY: 20,      // Posición Y donde comienza la tabla
        theme: "grid",   // Estilo de la tabla
        styles: {
          fontSize: 4, // Tamaño de la fuente
          cellPadding: 1, // Espaciado interno de las celdas
        },
        headStyles: {
          fillColor: [71, 209, 214], // Color de fondo del encabezado
          textColor: [255, 255, 255], // Color del texto del encabezado
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
    }

    if (tipo_reporte === 'porcentaje_asignado') {
      let headerPorcentaje = [
        "FOLIO",
        "FAMILIA",
        "ALUMNO",
        "% ASIGNADO"
      ]

      doc.autoTable({
        head: [headerPorcentaje], // Encabezados
        body: body,      // Datos
        startY: 20,      // Posición Y donde comienza la tabla
        theme: "grid",   // Estilo de la tabla
        styles: {
          fontSize: 4, // Tamaño de la fuente
          cellPadding: 1, // Espaciado interno de las celdas
        },
        headStyles: {
          fillColor: [71, 209, 214], // Color de fondo del encabezado
          textColor: [255, 255, 255], // Color del texto del encabezado
          fontStyle: "bold", // Negritas en el encabezado
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: "wrap" },
          2: { cellWidth: "auto" }, 
          3: { cellWidth: "auto" }, 
        },
      });
      
    }
  
    doc.save("reporte.pdf");
  };

  return (
    <button
      type="button"
      className="btn btn-outline text-danger"
      title={ tipo_reporte=== 'completo' ? "Reporte PDF completo" : "Reporte % Asignado" }
      onClick={exportToPdf}
    >
      <i className="bi bi-filetype-pdf" style={{ fontSize: "1.4rem" }}></i>
    </button>
  );
}
