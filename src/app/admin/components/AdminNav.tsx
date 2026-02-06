"use client";

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AdminNavProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  handleCurrentContent: () => void;
}

export default function AdminNav({ isSidebarOpen, setIsSidebarOpen, handleCurrentContent }: AdminNavProps) {
  const router = useRouter();
  const sessionCookie = Cookies.get('session');
  const sesion = JSON.parse(sessionCookie || '{}');
  const {rol, nombre} = sesion;

  return (
    <>
      <nav className='w-full bg-[#8B4513] shadow-lg p-5 flex justify-between fixed top-0 z-10 border-b-2 border-[#D2691E]'>
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
          <button onClick={() => handleCurrentContent()}>
            <h1 className='font-bold text-white text-xl'>BARTTY</h1>
          </button>
        </div>
        <div>
          <button 
            onClick={() => { Cookies.remove('session'); router.push('/'); }}
            className="text-white hover:text-[#FF8C00] transition-colors font-medium"
          >
            CERRAR SESIÓN
          </button>
        </div>
      </nav>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 md:w-80 bg-gradient-to-this.first = this.first.bind(this) from-[#8B4513] to-[#D2691E] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-2xl pt-5`}>
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
              <li>
                <button
                  onClick={() => { router.push(''); setIsSidebarOpen(false); }}
                  className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                >
                  📄 Reportes
                </button>
              </li>
              <li>
                <button
                  onClick={() => { router.push('/admin/usuarios'); setIsSidebarOpen(false); }}
                  className="w-full text-left bg-white bg-opacity-20 hover:bg-opacity-30 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md backdrop-blur-sm border border-white border-opacity-20"
                >
                  😶‍🌫️ Usuarios
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-10 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}