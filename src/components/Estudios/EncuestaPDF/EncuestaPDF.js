import React from 'react';
import { Button,Form, Modal } from "react-bootstrap";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function EncuestaPDF(encuesta){

    const generarPDF = () => {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();

    // Agregar contenido al PDF
    doc.text("Hola, este es un PDF generado en React!", 10, 10);

    // Datos de la tabla
    const columnas = ["ID", "Nombre", "Estado"];
    const filas = [
      [1, "Proyecto A", "Completado"],
      [2, "Proyecto B", "En progreso"],
      [3, "Proyecto C", "Pendiente"],
    ];

    // Agregar la tabla al PDF usando autotable
    doc.autoTable({
      head: [columnas],
      body: filas,
      startY: 20, // Ubicación vertical de la tabla en el PDF
    });
    
    // Descargar el PDF
    doc.save("ejemplo.pdf");
    }
    
    return (
    <div>
        <Button variant="light" style={{ marginLeft: "5px" }} className="d-flex align-items-center pt-2" onClick={() => generarPDF()}>
            PDF
        </Button>
    </div>
    )
    
}