import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";
import {getPuntosParametros, getTotalPuntosParametros, getPorcentajeSugerido} from "lib/estudios-functions"


export default function ExcelTablaEncuestas({parametros, data,fileName}){
   
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
      cell: (row) =>  {return (row.porcentaje_otorgado !==null )  ?  `${row.porcentaje_otorgado}%` : '' },
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
      const transformedRow = {};
      columns.forEach((col) => {
        if (col.selector) {
          // Si el selector es una función, evaluarlo
          transformedRow[col.name] = typeof col.selector === "function" 
            ? col.selector(row) 
            : row[col.selector];
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

    const exportToExcel = () => {
      const transformedData = transformDataForExcel();
  
      // Crear hoja de cálculo y libro
      const worksheet = XLSX.utils.json_to_sheet(transformedData);

      worksheet["!cols"] = columns.map((col) => ({
          width: col.width ? parseInt(col.width.replace("px", "")) / 7 : 10, // Conversión px a "Excel width"
      }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  
      // Descargar archivo
      XLSX.writeFile(workbook, "Datos.xlsx");
    }

    return ( <button type="button" className="btn btn-outline text-success" title='Descargar en Excel' onClick={exportToExcel}>
      <i className="bi bi-filetype-exe" style={{ fontSize: '1.4rem' }}></i>
    </button> )
}
