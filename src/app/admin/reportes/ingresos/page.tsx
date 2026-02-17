"use client";
import { useState, useEffect } from 'react';
import { customStyles } from '@/styles/colors';
import { DateRangePicker } from '../components/DateRangePicker';
import { SummaryCards } from '../components/SummaryCards';
import { IncomeTable } from '../components/IncomeTable';
import { PDFExportButton } from '../components/PDFExportButton';
import { type DateRange, type ReportData } from '../components/types';

export default function IngresosReportePage() {
  const [dataReport, setDataReport] = useState<ReportData>({
    resumen: {
      total_ingresos: 0,
      promedio: 0,
      cantidad_transacciones: 0,
      pago_maximo: 0,
      pago_minimo: 0
    },
    detalles: []
  });

  const [loading, setLoading] = useState(false);
  function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }
  async function fetchReport(start: string, end: string) {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/reportes?fecha_inicio=${start}&fecha_fin=${end}`
      );

      const data = await res.json();
      setDataReport(data)
      console.log(data)
      //setDataReport({resumen: data?.resume ?? emptyReport.resumen,detalles: Array.isArray(data?.detalle) ? data.detalles : []});
    } catch (error) {
      console.error('error en fetchReport: ', error);
    } finally {
      setLoading(false);
    }
  }

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    agrupacion: 'dia'
  });

  useEffect(() => {
    fetchReport(formatDate(dateRange.startDate),formatDate(dateRange.endDate));
  }, [dateRange])
  

  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] p-6 mt-10'>
      <div className='mb-8'>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Reporte de Ingresos</h1>
            <p className="text-[#D2691E]">Análisis detallado de ingresos por rango de fechas</p>
          </div>
          {dataReport && (
            <PDFExportButton 
              data={dataReport} 
              dateRange={dateRange}
            />
          )}
        </div>
      </div>

      <div className="mb-6">
        <DateRangePicker 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      {loading && <p className="text-[#8B4513]">Cargando reporte...</p>}
      {dataReport && (
        <>
          <div className="mb-8">
            <SummaryCards summary={dataReport.resumen} />
          </div>

          <div className={`${customStyles.card.base} rounded-lg p-6`}>
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Detalles de Transacciones</h2>
            <IncomeTable data={dataReport.detalles} />
          </div>
        </>
      )}
    </div>
  );
}