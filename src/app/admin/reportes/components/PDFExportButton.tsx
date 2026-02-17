"use client";
import { useState } from 'react';
import { customStyles } from '@/styles/colors';
import { type ReportData, type DateRange } from './types';
import { IncomeReportPDF } from './pdf/IncomeReportPDF';

interface PDFExportButtonProps {
  data: ReportData;
  dateRange: DateRange;
}

export function PDFExportButton({ data, dateRange }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    try {
      // Simulación de generación del PDF
      // En un caso real, aquí se generaría el PDF usando @react-pdf/renderer
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mostrar mensaje de éxito
      alert('PDF generado con éxito (simulación)');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      className={`
        ${customStyles.button.primary}
        ${isGenerating ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'}
        px-6 py-3 rounded-lg font-medium
        flex items-center gap-2 transition-all duration-300
        disabled:opacity-50
      `}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Generando PDF...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Descargar PDF
        </>
      )}
    </button>
  );
}