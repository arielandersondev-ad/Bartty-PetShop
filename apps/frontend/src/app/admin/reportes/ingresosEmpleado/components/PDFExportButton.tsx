"use client";
import { customStyles } from '@/styles/colors';
import { type ReportDataEmpServ, type DateRange } from './types';
import { IncomeReportPDF } from './pdf/IncomeReportPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';


interface PDFExportButtonProps {
  data: ReportDataEmpServ;
  dateRange: DateRange;
}

export function PDFExportButton({ data, dateRange }: PDFExportButtonProps) {
  return (
    <PDFDownloadLink
      document={<IncomeReportPDF data={data} dateRange={dateRange} />}
      fileName={`reporte_ingresos_${new Date(dateRange.startDate).toISOString().slice(0,10)}_${new Date(dateRange.endDate).toISOString().slice(0,10)}.pdf`}
      className={`
        ${customStyles.button.primary}
        px-6 py-3 rounded-lg font-medium
        flex items-center gap-2 transition-all duration-300
      `}
    >
      {({ loading }) =>
        loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Generando PDF...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}