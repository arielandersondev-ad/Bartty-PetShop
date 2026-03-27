'use client'
import { useEffect, useState } from "react";

export default function SucursalSelector({onChange}: {onChange: (value: string) => void}) {
  const [sucursalId, setSucursalId] = useState('');
  const [sucursales, setSucursales] = useState([]);
  useEffect(() => {
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
        {sucursales.length > 0 && sucursales.map((s : any) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
        </select>
      </div>
    );
}
