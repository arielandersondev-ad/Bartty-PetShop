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
  const [mounted, setMounted]=useState(false)
  const [nombre,setNombre] = useState('')
  const [rolSesion,setRolSesion] = useState('')
  const {rol, id} = sesion;
  useEffect(() => {
    if (!['admin','emp_servicio','emp_recepcion'].includes(rol)) {
      router.push('/');
    }

    async function getNombre() {
      const res = await fetch(`/api/usuario/?id=${id}`);
      const data = await res.json();
      setNombre(data.nombre);
      setRolSesion(data.rol);
    }

    if (id) getNombre();

    setMounted(true);
  }, [rol, id]);
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
{/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 
          h-screen
          w-72 md:w-80
          z-40
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
        `}
      >
        <div className="h-full p-6 backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-2xl">

          {/* Usuario */}
          <div className="mb-10">
            <div className="text-black text-xl font-semibold">
              {rolSesion || 'Administración'}
            </div>
            <div className="text-black/70 text-sm">
              {nombre || 'Usuario'}
            </div>

            <div className="mt-4 h-[1px] bg-white/20"/>
          </div>

          {/* Menu */}
          <ul className="space-y-2">

            <SidebarItem
              label="Dashboard"
              icon="📊"
              onClick={() => { router.push('/admin'); setIsSidebarOpen(false); }}
            />

            <SidebarItem
              label="Citas"
              icon="📅"
              onClick={() => { router.push('/admin/citas'); setIsSidebarOpen(false); }}
            />

            <SidebarItem
              label="Clientes"
              icon="👥"
              onClick={() => { router.push('/admin/clientes'); setIsSidebarOpen(false); }}
            />

            <SidebarItem
              label="Inventario"
              icon="📦"
              onClick={() => { router.push('/admin/inventario'); setIsSidebarOpen(false); }}
            />

            {rolSesion === 'admin' && (
              <SidebarItem
                label="Reportes"
                icon="📄"
                onClick={() => { router.push('/admin/reportes'); setIsSidebarOpen(false); }}
              />
            )}

            {rolSesion === 'admin' && (
              <SidebarItem
                label="Usuarios"
                icon="👤"
                onClick={() => { router.push('/admin/usuarios'); setIsSidebarOpen(false); }}
              />
            )}

          </ul>
        </div>
      </div>
      {}
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-15 backdrop-blur-sm " onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}

function SidebarItem({ label, icon, onClick }: any) {
  return (
    <li>
      <button
        onClick={onClick}
        className="
          w-full flex items-center gap-3
          text-left
          px-4 py-3
          rounded-xl
          text-black
          bg-gray-100
          hover:bg-gray-200
          transition-all duration-200
          group
        "
      >
        <span className="text-lg group-hover:scale-110 transition">
          {icon}
        </span>

        <span className="font-medium tracking-wide">
          {label}
        </span>
      </button>
    </li>
  )
}