import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos para las filas y celdas de la tabla
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    padding: 8,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  lastColumn: {
    borderRightWidth: 0, // Sin borde derecho en la última columna
  },
  lastRow: {
    borderBottomWidth: 0, // Sin borde inferior en la última fila
  },
});

const MyDocument = () => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>Ejemplo de Tabla en PDF</Text>

      {/* Tabla */}
      <View style={styles.table}>
        {/* Cabecera */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellHeader, styles.lastColumn]}>Columna 1</Text>
          <Text style={[styles.tableCellHeader, styles.lastColumn]}>Columna 2</Text>
          <Text style={[styles.tableCellHeader]}>Columna 3</Text>
        </View>

        {/* Filas de datos */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.lastColumn]}>Dato 1</Text>
          <Text style={[styles.tableCell, styles.lastColumn]}>Dato 2</Text>
          <Text style={styles.tableCell}>Dato 3</Text>
        </View>
        <View style={[styles.tableRow, styles.lastRow]}>
          <Text style={[styles.tableCell, styles.lastColumn]}>Dato 4</Text>
          <Text style={[styles.tableCell, styles.lastColumn]}>Dato 5</Text>
          <Text style={styles.tableCell}>Dato 6</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;