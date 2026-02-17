import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Registrar fuentes (opcional, si quieres fuentes personalizadas)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#D2691E',
    paddingBottom: 15
  },
  
  logo: {
    width: 60,
    height: 60,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center'
  },
  
  headerDate: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right'
  },
  
  // Summary Cards
  summarySection: {
    marginBottom: 25
  },
  
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D2691E',
    paddingBottom: 5
  },
  
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  
  summaryCard: {
    width: '48%',
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#D2691E',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  
  summaryCardTitle: {
    fontSize: 12,
    color: '#8B4513',
    marginBottom: 5
  },
  
  summaryCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E'
  },
  
  // Table
  tableSection: {
    marginBottom: 25
  },
  
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D2691E',
    paddingBottom: 5
  },
  
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D2691E',
    marginBottom: 10
  },
  
  tableRow: {
    flexDirection: 'row'
  },
  
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#D2691E',
    padding: 5
  },
  
  tableColHeader: {
    backgroundColor: '#8B4513',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  
  tableCell: {
    fontSize: 9,
    color: '#333333'
  },
  
  tableCellEven: {
    backgroundColor: '#FFF8E1'
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    color: '#666666',
    borderTopWidth: 1,
    borderTopColor: '#D2691E',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#666666'
  }
});

interface IncomeReportPDFProps {
  data: any;
  dateRange: any;
}

export function IncomeReportPDF({ data, dateRange }: IncomeReportPDFProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/image/bartty-logo.jpg" />
          <View>
            <Text style={styles.headerTitle}>Reporte de Ingresos</Text>
            <Text style={styles.headerDate}>
              {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
            </Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen Ejecutivo</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Total Ingresos</Text>
              <Text style={styles.summaryCardValue}>
                Bs {data.resumen.total_ingresos.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Promedio</Text>
              <Text style={styles.summaryCardValue}>
                Bs {data.resumen.promedio.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Transacciones</Text>
              <Text style={styles.summaryCardValue}>
                {data.resumen.cantidad_transacciones}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>Rango Pagos</Text>
              <Text style={styles.summaryCardValue}>
                Bs {data.resumen.pago_minimo} - {data.resumen.pago_maximo}
              </Text>
            </View>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>Detalles de Transacciones</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, styles.tableColHeader]}>
                <Text style={styles.tableCell}>Fecha</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColHeader]}>
                <Text style={styles.tableCell}>Cliente</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColHeader]}>
                <Text style={styles.tableCell}>Mascota</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColHeader]}>
                <Text style={styles.tableCell}>Servicio</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColHeader]}>
                <Text style={styles.tableCell}>Monto</Text>
              </View>
              <View style={[styles.tableCol, styles.tableColHeader]}>
                <Text style={styles.tableCell}>Pago</Text>
              </View>
            </View>
            
            {/* Table Rows */}
            {data.detalles.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {formatDate(new Date(item.fecha))}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.cliente}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.mascota}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.servicio}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    Bs {item.monto.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.tipo_pago === 'qr' ? '📱 QR' : '💵 Efectivo'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Bartty - Peluquería Canina</Text>
          <Text>Generado: {formatDate(new Date())}</Text>
        </View>
        
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}