import React from "react";
import { saveAs } from "file-saver";
import {
  getPuntosParametros,
  getTotalPuntosParametros,
  getPorcentajeSugerido,
} from "lib/estudios-functions";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function PdfTablaEncuestas({ parametros, data, fileName }) {
  const exportToPdf = () => {
    console.log(parametros);
    console.log(data);
    const doc = new jsPDF();

    data.forEach((element, index) => {
      // Configuración inicial
      const startY = 10 + index * 60; // Espacio entre cada elemento
      const marginLeft = 20; // Margen izquierdo para simular un tab

      // PROYECTO (sin margen)
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("PROYECTO: ", 10, startY);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${element.proyecto.nombre}`,
        10 + doc.getTextWidth("PROYECTO: "),
        startY
      );

      // ORDEN DE SERVICIO (con margen)
      doc.setFontSize(10);
      // ORDEN DE SERVICIO (primer renglón)
      doc.setFont("helvetica", "normal");
      doc.text("ORDEN DE SERVICIO: ", marginLeft, startY + 10);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${element.orden_servicio.descripcion}`,
        marginLeft + doc.getTextWidth("ORDEN DE SERVICIO: "),
        startY + 10
      );

      // N° SERVICIO (segundo renglón)
      doc.setFont("helvetica", "normal");
      doc.text("N° SERVICIO: ", marginLeft, startY + 20); // Ajustamos la posición Y
      doc.setFont("helvetica", "bold");
      doc.text(
        `${element.orden_servicio.id}`,
        marginLeft + doc.getTextWidth("N° SERVICIO: "),
        startY + 20
      );

      // FAMILIA (primer renglón)
      doc.setFont("helvetica", "normal");
      doc.text("FAMILIA: ", marginLeft, startY + 30); // Primer renglón
      doc.setFont("helvetica", "bold");
      doc.text(
        `${element.candidato}`,
        marginLeft + doc.getTextWidth("FAMILIA: "),
        startY + 30
      );

      // N° FAMILIA (segundo renglón)
      doc.setFont("helvetica", "normal");
      doc.text("N° FAMILIA: ", marginLeft, startY + 40); // Segundo renglón (posición Y + 10)
      doc.setFont("helvetica", "bold");
      doc.text(
        `${element.id_familia}`,
        marginLeft + doc.getTextWidth("N° FAMILIA: "),
        startY + 40
      );

      // NIVEL DE LIQUIDEZ (con margen)
      doc.setFont("helvetica", "normal");
      doc.text("NIVEL DE LIQUIDEZ: ", marginLeft, startY + 50);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${50} `,
        marginLeft + doc.getTextWidth("NIVEL DE LIQUIDEZ: "),
        startY + 50
      );
      doc.setFont("helvetica", "normal");
      doc.text(
        " - PATRIMONIO REPORTADO: ",
        marginLeft +
          doc.getTextWidth("NIVEL DE LIQUIDEZ: ") +
          doc.getTextWidth(`${50} `),
        startY + 50
      );
      doc.setFont("helvetica", "bold");
      doc.text(
        `${50}`,
        marginLeft +
          doc.getTextWidth("NIVEL DE LIQUIDEZ: ") +
          doc.getTextWidth(`${50}`) +
          doc.getTextWidth(" - PATRIMONIO REPORTADO: "),
        startY + 50
      );
      doc.setFont("helvetica", "normal");
      doc.text(
        " - TOTAL: ",
        marginLeft +
          doc.getTextWidth("NIVEL DE LIQUIDEZ: ") +
          doc.getTextWidth(`${50} `) +
          doc.getTextWidth(" - PATRIMONIO REPORTADO: ") +
          doc.getTextWidth(`${50}`),
        startY + 50
      );
      doc.setFont("helvetica", "bold");
      doc.text(
        `${100}`,
        marginLeft +
          doc.getTextWidth("NIVEL DE LIQUIDEZ: ") +
          doc.getTextWidth(`${50}`) +
          doc.getTextWidth(" - PATRIMONIO REPORTADO: ") +
          doc.getTextWidth(`${50}`) +
          doc.getTextWidth(" - TOTAL: "),
        startY + 50
      );

      // PORCENTAJES (con margen)
      doc.setFont("helvetica", "normal");
      doc.text("PORCENTAJES - SUGERIDO: ", marginLeft, startY + 60);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${25}%`,
        marginLeft + doc.getTextWidth("PORCENTAJES - SUGERIDO: "),
        startY + 60
      );
      doc.setFont("helvetica", "normal");
      doc.text(
        " - OTORGADO: ",
        marginLeft +
          doc.getTextWidth("PORCENTAJES - SUGERIDO: ") +
          doc.getTextWidth(`${25}%`),
        startY + 60
      );
      doc.setFont("helvetica", "bold");
      doc.text(
        `${10}%`,
        marginLeft +
          doc.getTextWidth("PORCENTAJES - SUGERIDO: ") +
          doc.getTextWidth(`${25}%`) +
          doc.getTextWidth(" - OTORGADO: "),
        startY + 60
      );
    });
    doc.save("reporte.pdf");
  };

  const test = () => {
    console.log(parametros);
    
  }
  return (
    <button
      type="button"
      className="btn btn-outline text-danger"
      title="Descargar Tabla en PDF"
      onClick={test}
    >
      <i class="bi bi-filetype-pdf" style={{ fontSize: '1.4rem' }}></i>

    </button>
  );
}
