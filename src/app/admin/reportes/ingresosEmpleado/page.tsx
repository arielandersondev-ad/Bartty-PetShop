"use client";
import { useState, useEffect } from 'react';
import { customStyles } from '@/styles/colors';
import { DateRangePicker } from './components/DateRangePicker';
import { IncomeTable } from './components/IncomeTable';
import { type DateRange, type ReportDataEmpServ } from './components/types';
import { Empleado } from './components/types';
import { SummaryCards } from './components/SummaryCards';
import { PDFExportButton } from './components/PDFExportButton';

export default function IngresosReportePage() {
  const [dataReport, setDataReport] = useState<ReportDataEmpServ>({
    empleado:'',
    rol:'',
    resumen: {
      total_ingresos: 0,
      total_servicios: 0,
      promedio: 0,
      servicio_mas_caro: 0,
      servicio_mas_barato: 0,
    },
    detalles: []
  });
  const [ empleados, setEmpleados ] = useState<Empleado[]>([])
  const [ empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true);
  const [ generado, setGenerado ] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    agrupacion: 'dia'
  });
  const isFormValid = empleadoSeleccionado !== "" && !!dateRange.startDate && !!dateRange.endDate
  function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }
  async function fetcthEmp(rol: string) {
    const res = await fetch(`/api/empleados?rol=${rol}`)
    const data = await res.json()
    setEmpleados(data)
  }
  async function fetchReport(start: string, end: string, id_empleado: string) {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/reportes/empleado?fecha_inicio=${start}&fecha_fin=${end}&empleado_id=${id_empleado}`
      );
      const data = await res.json();
      setDataReport(data)
      
    } catch (error) {
      console.error('error en fetchReport: ', error);
    } finally {
      setLoading(false);
    }
  }


  const handleReport =() => {
    if (!empleadoSeleccionado) {
      alert("Selecciona un empleado")
      return
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Selecciona un rango de fechas")
      return
    }

    fetchReport(
      formatDate(dateRange.startDate),
      formatDate(dateRange.endDate),
      empleadoSeleccionado
    )
    setGenerado(true)
  }


  useEffect(() => {
    fetcthEmp('emp_servicio')
  }, [dataReport])
  
return (
    <div className='text-black min-h-screen bg-[#FFF8E1] p-6 mt-10 overflow-x-hidden'>
      <div className='mb-8'>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Reporte de Ingresos</h1>
            <p className="text-[#D2691E]">Análisis detallado de ingresos por rango de fechas</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className='flex flex-col md:flex-row md:flex-wrap gap-4'>
          <div className='flex flex-row gap-2'>
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <select 
              className='border-2 rounded-lg border-[#8B4513] p-2'
              value= {empleadoSeleccionado}
              onChange={(e) => {setEmpleadoSeleccionado(e.target.value);setGenerado(false)}}
            >
              <option value="">empleado</option>
              {empleados.map((empleado) => (
                <option 
                key={empleado.id} 
                value={empleado.id}
                >{empleado.nombre}</option>
              ))}
            </select>
          
          
          </div>
          {generado===false &&(
            <button 
              className={`p-2 border-2 border-[#8B4513] rounded-lg bg-[#8B4513] text-white 
                ${isFormValid 
                  ? "hover:bg-[#6f3308] cursor-pointer" 
                  : "opacity-50 cursor-not-allowed"}
                  `}
              onClick={handleReport}
            >
            Generar Reporte</button>
          )}
          {generado && (
            <PDFExportButton
              data={dataReport} 
              dateRange={dateRange}
            />
          )}
      </div>
      </div>
      {loading && <p className="text-[#8B4513]">Selecciona un Rango y un Empleado para la previsualizacion</p>}
      {(loading === false) && (
        <>
          <div className='flex flex-row gap-2'>
            <h2 className='text-sm md:text-2xl text-amber-600 mb-0'>
              { dataReport.rol}
            </h2>
            <h1 className='md:text-3xl text-shadow-md text-amber-800'>
              {dataReport.empleado}
            </h1>
          </div>
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