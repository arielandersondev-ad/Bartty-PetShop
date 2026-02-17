"use client";
import { useState, useEffect } from 'react';
import { customStyles } from '@/styles/colors';
import { DateRangePicker } from './components/DateRangePicker';
import { IncomeTable } from './components/IncomeTable';
import { type DateRange, type ReportDataEmpServ } from './components/types';
import { Empleado } from './components/types';
import { SummaryCards } from './components/SummaryCards';

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
  const [loading, setLoading] = useState(false);
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
  }


  useEffect(() => {
    fetcthEmp('emp_servicio')
    console.log(dataReport)
  }, [dataReport])
  
  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] p-6 mt-10'>
      <div className='mb-8'>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Reporte de Ingresos</h1>
            <p className="text-[#D2691E]">Análisis detallado de ingresos por rango de fechas</p>
          </div>
          {/*dataReport && (
            <PDFExportButton 
              data={dataReport} 
              dateRange={dateRange}
            />
          )*/}
        </div>
      </div>

      <div className="mb-6">
        <div className='flex flex-col md:flex-row justify-evenly'>
          <div>
            <select 
              className='border-2 rounded-lg border-[#8B4513] p-2'
              value= {empleadoSeleccionado}
              onChange={(e) => {setEmpleadoSeleccionado(e.target.value)}}
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
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <div>
            <button 
              className={`p-2 border-2 border-[#8B4513] rounded-lg 
                ${isFormValid 
                  ? "hover:bg-gray-100 cursor-pointer" 
                  : "opacity-50 cursor-not-allowed"}
              `}
              onClick={handleReport}
            >
            Generar Reporte</button>
          </div>
      </div>
      </div>
      {loading && <p className="text-[#8B4513]">Cargando reporte...</p>}
      {!loading && (
        <>
          <div className='flex flex-col gap-2'>
            <h1 className='text-shadow-md text-amber-800'>
              {dataReport.empleado}
            </h1>
            <h2 className='text-sm text-amber-600'>
              { dataReport.rol}
            </h2>
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