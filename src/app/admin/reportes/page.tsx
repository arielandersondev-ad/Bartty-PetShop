"use client";
import { useRouter } from 'next/navigation';
import { ReportCard } from './components/ReportCard';

export default function ReportesPage() {
  const router = useRouter();

  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] p-6 mt-10 overflow-x-hidden'>
      <div className='mb-8'>
        <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Reportes</h1>
        <p className="text-[#D2691E]">Genera y descarga reportes detallados de la peluquería</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        
        <ReportCard
          title="Reporte de Servicios"
          description="Análisis de servicios más solicitados"
          icon="✂️"
          onClick={() => router.push('/admin/reportes/ingresosEmpleado')}
          
        />

      </div>
    </div>
  );
}