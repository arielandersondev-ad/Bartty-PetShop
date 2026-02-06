"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { customStyles } from '@/styles/colors';
import Cookies from 'js-cookie';

export default function AdminDashboard() {
  const router = useRouter();
  const sessionCookie = Cookies.get('session');

  useEffect(() => {
    if (!sessionCookie) {
      const session = JSON.parse(sessionCookie || '{}');
      if (session.rol !== 'admin' && session.rol !== 'emp_recepcionista' && session.rol !== 'emp_servicio') {
        router.push('/');
      }
    }
  }, [sessionCookie, router]);

  return <DashboardView />;
}

function DashboardView() {
  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] p-6 mt-10'>
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
          <p className="text-3xl font-bold text-[#D2691E]">5</p>
          <p className="text-sm text-gray-600 mt-2">Programadas para hoy</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#8B4513]">Clientes Activos</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-[#D2691E]">120</p>
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
          <p className="text-3xl font-bold text-[#D2691E]">Bs 2,450</p>
          <p className="text-sm text-gray-600 mt-2">Este mes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${customStyles.card.base} rounded-lg p-6`}>
          <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Próximas Citas</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#FFF8E1] rounded-lg border border-[#D2691E]">
              <div>
                <p className="font-medium text-[#8B4513]">Firulais - Juan Pérez</p>
                <p className="text-sm text-gray-600">10:00 AM - Corte + Baño</p>
              </div>
              <span className="px-2 py-1 bg-[#FF8C00] text-white text-xs rounded-full">Pendiente</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FFF8E1] rounded-lg border border-[#D2691E]">
              <div>
                <p className="font-medium text-[#8B4513]">Luna - María García</p>
                <p className="text-sm text-gray-600">2:00 PM - Corte de uñas</p>
              </div>
              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Confirmada</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#FFF8E1] rounded-lg border border-[#D2691E]">
              <div>
                <p className="font-medium text-[#8B4513]">Max - Carlos López</p>
                <p className="text-sm text-gray-600">4:30 PM - Baño completo</p>
              </div>
              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Completada</span>
            </div>
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