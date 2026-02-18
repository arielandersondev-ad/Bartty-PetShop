"use client";

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

interface AdminNavProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function AdminNav({ isSidebarOpen, setIsSidebarOpen,  }: AdminNavProps) {
  const router = useRouter();
  const sessionCookie = Cookies.get('session');
  const sesion = JSON.parse(sessionCookie || '{}');
  const {rol, nombre} = sesion;
  const [mounted, setMounted]=useState(false)
  useEffect(() => {
    const load = async () => setMounted(true)
    load()
  }, [])
  if (!mounted) return null

  return (
    <>
      <nav className='w-full bg-[#8B4513] shadow-lg p-3 md:p-5 flex justify-between fixed top-0 z-10 border-b-2 border-[#D2691E]'>
        <div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-[#FF8C00] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div>
          <button>
            <h1 className='font-bold text-white text-lg md:text-xl'>BARTTY</h1>
          </button>
        </div>
        <div>
          <button 
            onClick={() => { Cookies.remove('session'); router.push('/'); }}
            className="text-white hover:text-[#FF8C00] transition-colors font-medium text-sm md:text-base"
          >
            <span className="hidden md:inline">CERRAR SESIÓN</span>
            <span className="md:hidden text-3xl">⚡</span>
          </button>
        </div>
      </nav>
      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 
          h-[calc(100vh-4rem)] 
          w-72 md:w-80 
          z-40
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          shadow-2xl
        `}
      >

        <div className="p-5 flex h-full">
          <div className="text-center max-w-md w-full">
            <div className="text-2xl md:text-3xl font-bold text-white mb-8 flex flex-col gap-5">
              <div>
                {rol || 'Administracion'}
              </div>
              <div>
                {nombre || 'Usuario'}
              </div>
            </div>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => { router.push('/admin'); setIsSidebarOpen(false); }}
                  className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                >
                  📊 Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => { router.push('/admin/citas'); setIsSidebarOpen(false); }}
                  className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                >
                  📅 Citas
                </button>
              </li>
              <li>
                <button
                  onClick={() => { router.push('/admin/clientes'); setIsSidebarOpen(false); }}
                  className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                >
                  👥 Clientes
                </button>
              </li>
              <li>
                <button
                  onClick={() => { router.push('/admin/inventario'); setIsSidebarOpen(false); }}
                  className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                >
                  📦 Inventario
                </button>
              </li>
              {rol === 'admin' && (
                <li>
                  <button
                    onClick={() => { router.push('/admin/reportes'); setIsSidebarOpen(false); }}
                    className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                  >
                    📄 Reportes
                  </button>
                </li>
              )}
              {rol === 'admin' && (
                <li>
                  <button
                    onClick={() => { router.push('/admin/usuarios'); setIsSidebarOpen(false); }}
                    className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                  >
                    😶‍🌫️ Usuarios
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {}
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-15 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}