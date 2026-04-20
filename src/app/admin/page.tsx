"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customStyles } from '@/styles/colors';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const router = useRouter();
  const sessionCookie = Cookies.get('session');

  useEffect(() => {
    if (!sessionCookie) {
      const session = JSON.parse(sessionCookie || '{}');
      if (session.rol !== 'admin' && session.rol !== 'emp_recepcion' && session.rol !== 'emp_servicio') {
        router.push('/');
      }
    }
  }, [sessionCookie, router]);

  return (
    <DashboardView />
  );
}
function DashboardView() {
  const [ citasHoyData, setCitasHoyData ] = useState<any>()
  const [ clientesRegistradosData, setClientesRegistradosData ] = useState<any>()
  const [ ingresosMesData, setIngresosMesData ] = useState<any>()
  const [ proximasCitas, setProximasCitas ] = useState<any[]>([])

  async function loadProximasCitas() {
    try {
      const res = await fetch(`/api/dashboard/?action=proxCitas`)
      const data = await res.json()
      setProximasCitas(data.res || [])
    } catch (error) {
      console.log(error)
    }
  }
  async function citasHoy(){
    try {
      const res = await fetch(`/api/dashboard/?action=citasHoy`)
      const data = await res.json()
      setCitasHoyData(data.cantidad)
    } catch (error) {
      console.log(error)
    }
  }
  async function clientesRegistrados(){
    try {
      const res = await fetch(`/api/dashboard/?action=clientesRegistrados`)
      const data = await res.json()
      setClientesRegistradosData(data.cantidad)
    } catch (error) {
      console.log(error)
    }
  }
  async function ingresosMes(){
    try {
      const res = await fetch(`/api/dashboard/?action=ingresosMes`)
      const data = await res.json()
      setIngresosMesData(data.total)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    citasHoy()
    clientesRegistrados()
    ingresosMes()
    loadProximasCitas()
  }, [])
  return (
    <div className='text-black overflow-x-hidden'>
      <div className='mb-8'>
        <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Dashboard</h1>
        <p className="text-[#D2691E]">Resumen de la peluquería canina</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#8B4513]">Citas Hoy</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-[#D2691E]">{citasHoyData}</p>
          <p className="text-sm text-gray-600 mt-2">Programadas para hoy</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#8B4513]">Clientes Activos</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-[#D2691E]">{clientesRegistradosData}</p>
          <p className="text-sm text-gray-600 mt-2">Total registrados</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#8B4513]">Productos en Stock</h3>
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-3xl font-bold text-[#D2691E]">45</p>
          <p className="text-sm text-gray-600 mt-2">Disponibles</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#8B4513]">Ingresos Mes</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-[#D2691E]">Bs {ingresosMesData}</p>
          <p className="text-sm text-gray-600 mt-2">Este mes</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${customStyles.card.base} rounded-lg p-6`}>
          <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Próximas Citas</h2>
          <div className="space-y-3">
            {proximasCitas.length > 0 ? (
              proximasCitas.map((cita) => {
                const hora = new Date(cita.horaInicio).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });
                
                const getStatusColor = (estado: string) => {
                  switch (estado.toLowerCase()) {
                    case 'confirmado': return 'bg-green-500';
                    case 'pendiente': return 'bg-[#FF8C00]';
                    case 'concluido': return 'bg-blue-500';
                    default: return 'bg-gray-500';
                  }
                };

                return (
                  <div key={cita.id} className="flex items-center justify-between p-3 bg-[#FFF8E1] rounded-lg border border-[#D2691E]">
                    <div>
                      <p className="font-medium text-[#8B4513]">
                        {cita.fecha.toString().substring(0, 10)} - {cita.mascota?.nombre} - {cita.cliente?.nombre} {cita.cliente?.apellidoPaterno}
                      </p>
                      <p className="text-sm text-gray-600">
                        {hora} - {cita.servicios?.length > 0 ? cita.servicios.map((s: any) => s.nombre).join(', ') : 'Cita programada'}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {cita.sucursal?.nombre}
                    </span>
                    <span className={`px-2 py-1 text-white text-xs rounded-full capitalize ${getStatusColor(cita.estado)}`}>
                      {cita.estado}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4 italic">No hay citas próximas programadas</p>
            )}
          </div>
        </div>

        <div className={`${customStyles.card.base} rounded-lg p-6`}>
          <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Productos con Stock Bajo</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-red-800">Shampoo para Perros</p>
                <p className="text-sm text-red-600">Higiene</p>
              </div>
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">8 unidades</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-yellow-800">Cortauñas</p>
                <p className="text-sm text-yellow-600">Herramientas</p>
              </div>
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">15 unidades</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}