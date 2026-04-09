'use client'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type DateRange, type ReportDataEmpServ, type ReportEmpServDetail } from '../types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#D2691E',
    paddingBottom: 10
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513'
  },

  headerDate: {
    fontSize: 10,
    color: '#666'
  },

  summarySection: {
    marginBottom: 20
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B4513'
  },

  summaryRow: {
    marginBottom: 5
  },

  tableSection: {
    marginTop: 10
  },

  tableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B4513'
  },

  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D2691E'
  },

  tableRow: {
    flexDirection: 'row'
  },

  tableColHeader: {
    width: '33.33%',
    borderWidth: 1,
    borderColor: '#D2691E',
    padding: 5,
    backgroundColor: '#8B4513'
  },

  tableCol: {
    width: '33.33%',
    borderWidth: 1,
    borderColor: '#D2691E',
    padding: 5
  },

  headerText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },

  cellText: {
    fontSize: 9,
    color: '#333'
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#D2691E',
    paddingTop: 5
  }
});

interface IncomeReportPDFProps {
  data: ReportDataEmpServ;
  dateRange: DateRange;
}

export function IncomeReportPDF({ data, dateRange }: IncomeReportPDFProps) {

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES');
  };
  const {empleado} = data
  const resumen = data?.resumen ?? {
    total_ingresos: 0,
    total_servicios: 0,
    promedio: 0,
    servicio_mas_caro: 0,
    servicio_mas_barato: 0
  };

  const detalles = data?.detalles ?? [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Reporte de Ingresos por Empleado</Text>
          </View>
        </View>

        {/* RESUMEN */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Resumen de Ingresos del Empleado {empleado} en fechas {formatDate(dateRange?.startDate)} - {formatDate(dateRange?.endDate)}</Text>

          <Text style={styles.summaryRow}>
            Total Ingresos: Bs {(resumen.total_ingresos ?? 0).toFixed(2)}
          </Text>

          <Text style={styles.summaryRow}>
            Promedio por Servicio: Bs {(resumen.promedio ?? 0).toFixed(2)}
          </Text>

          <Text style={styles.summaryRow}>
            Total de Servicios: {resumen.total_servicios ?? 0}
          </Text>

          <Text style={styles.summaryRow}>
            Servicio más barato: Bs {(resumen.servicio_mas_barato ?? 0).toFixed(2)}
          </Text>

          <Text style={styles.summaryRow}>
            Servicio más caro: Bs {(resumen.servicio_mas_caro ?? 0).toFixed(2)}
          </Text>
        </View>

        {/* TABLA */}
        <View style={styles.tableSection}>
          <Text style={styles.tableTitle}>Detalle de Servicios</Text>

          <View style={styles.table}>

            {/* HEADER */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Fecha</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Servicio</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Monto</Text>
              </View>
            </View>

            {/* FILAS */}
            {detalles.length > 0 ? (
              detalles.map((item: ReportEmpServDetail, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.cellText}>
                      {formatDate(item.fecha)}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.cellText}>
                      {item.servicio ?? ''}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.cellText}>
                      Bs {(item.monto ?? 0).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={{ padding: 10 }}>
                  <Text>No existen registros en el rango seleccionado.</Text>
                </View>
              </View>
            )}

          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>Barbty - Peluquería Canina</Text>
          <Text>Generado: {formatDate(new Date())}</Text>
        </View>

      </Page>
    </Document>
  );
}
