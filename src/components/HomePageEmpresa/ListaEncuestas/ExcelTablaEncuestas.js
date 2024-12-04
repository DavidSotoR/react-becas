import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";


export default function ExcelTablaEncuestas({parametros, data,fileName}){
    /*const columns = [
        {
            header: "No Estudio",
            key:"id",
        },
        {
          name: "Familia",
          key:"candidato",
        },
        ...listaParametros.map((parametro) => ({
            header: parametro.nombre,
          selector: (row) => getPuntosParametros(row.parametros, parametro.id) || "-",
          sortable: true,
        })),
        {
          name: "Total",
          selector: (row) => getTotalPuntosParametros(row.parametros),
          sortable: true,
        },
        {
          name: "Porcentaje Sugerido",
          selector: (row) => `${getPorcentajeSugerido(row.parametros)}%`,
          sortable: true,
          style: { textAling: "250px" },
        },
        {
          name: "Porcentaje Otorgado",
          cell: "porcentaje_otorgado",
        },
        {
          name: "No. Familia Colegio",
          cell: "clave_familia_colegio"
        },
      ];*/
      
    const transformDataForExcel = () => {
        return data.map((row) => {
            const transformedRow = {};
            parametros.forEach((col) => {
                if (col.selector) {
                    // Si el selector es una función, evaluarlo
                    transformedRow[col.name] = typeof col.selector === "function" 
                    ? col.selector(row) 
                    : row[col.selector];
                }
            });

            return transformedRow;
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja 1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        saveAs(blob, `${fileName}.xlsx`);
    }

    return ( <button onClick={exportToExcel}>Export to Excel</button> )
}
