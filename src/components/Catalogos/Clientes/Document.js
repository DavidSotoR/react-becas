import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: '2rem',
        textAlign: 'center'
    },
    page: {
      //flexDirection: 'row',
      backgroundColor: 'white'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });

  function DocumentWord() {
    return(
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Titulo principal</Text>
                </View>
                {/* <View style={styles.section}>
                    <Text>Section #2</Text>
                </View> */}
            </Page>
        </Document>
    )
}

export default DocumentWord;