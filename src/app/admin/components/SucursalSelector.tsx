'use client'
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

interface sucursal {
  id: string;
  nombre: string;
}
export default function SucursalSelector({onChange}: {onChange: (value: string) => void}) {
  const [sucursalId, setSucursalId] = useState('');
  const [sucursales, setSucursales] = useState([]);
  const [currentSucursal, setCurrentSucursal] = useState<sucursal>({nombre:"",id:""});
  const sessionCookie = Cookies.get('session');
  const sesion = JSON.parse(sessionCookie || '{}');

  async function sucursalCurrent () {
    if (sesion.rol){
      const res = await fetch(`/api/usuario?id=${sesion.id}`);
      const data = await res.json();
      console.log('sucursales?: ',data)
      setCurrentSucursal({nombre:data.sucursal,id:data.sucursalId});
    }
  }
  useEffect(() => {
    sucursalCurrent();
    fetch('/api/sucursal')
      .then(res => res.json())
      .then(data => setSucursales(data.sucursales));
  }, []);

  const handleChange = (value: string) => {
    setSucursalId(value);
    onChange(value);
  };
  return (
    
    <div className="text-black">
      <label htmlFor="sucursalId">Sucursal</label>
      <select
        id="sucursalId"
        value={sucursalId}
        onChange={(e) => handleChange(e.target.value)}
        className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-700 border-gray-600 text-white"
      >
        <option value="">Seleccionar</option>
        {
          sesion.rol === 'emp_servicio' || sesion.rol === 'emp_recepcion' ? (
            <option key={currentSucursal.id} value={currentSucursal.id}>
              {currentSucursal.nombre}
            </option>
          )
          :sucursales.length > 0 && sucursales.map((s : sucursal) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))
        }
        </select>
      </div>
    );
}
