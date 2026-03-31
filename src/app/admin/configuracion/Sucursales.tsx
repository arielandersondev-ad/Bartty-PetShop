import { useEffect, useState } from "react";

export default function Sucursales () {
  //ESTADOS
  const [sucursales, setSucursales] = useState<any[]>([])
  const [formSucursal, setFormSucursal] = useState({
    nombre: "",
    coords: "",
    id: "",
  })
  //HANDLERS
  const handleInactivarSucursal = async (id : any, activate: boolean) => {
    try {
      await fetch(`/api/configuracion/sucursal`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          activo:activate
        })
      }).then(() => {
        loadSucursales()
      })
    } catch (error) {
      console.error('Error al inactivar la sucursal:', error);
    }
  }
  const handleChangeAgregarSucursal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormSucursal({
      ...formSucursal,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmitAgregarSucursal = () => {
    console.log(formSucursal)
    const [lat, lng] = formSucursal.coords.split(",").map(c => parseFloat(c.trim()));
    if (isNaN(lat) || isNaN(lng)) {
      alert("Coordenadas inválidas")
      return
    }
    if (!formSucursal.nombre) {
      alert("Nombre de la sucursal es obligatorio")
      return
    }
    try {
      fetch('/api/configuracion/sucursal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formSucursal.id,
          nombre: formSucursal.nombre,
          lat,
          lng,
        })
      }).then(() => {
        loadSucursales()
      })
    } catch (error) {
      console.error('Error al agregar la sucursal:', error);
    } finally {
      setTimeout(() => {
        setFormSucursal({
          nombre: "",
          coords: "",
          id: "",
        })
      }, 500);
    }
  }
  //LOADERS
  const loadSucursales = async () => {
    const res = await fetch("/api/sucursal")
    const data = await res.json()
    setSucursales(data.sucursales)
  }
  //EFFECTS
  useEffect(() => {
    loadSucursales()
  }, [])
  return(
    <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mt-4 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          Sucursales
        </h2>
        <span className="text-xs text-gray-400">
          {sucursales.length} registradas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lista */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm max-h-52 overflow-y-auto">
          {sucursales.length > 0 ? (
            <ul className="space-y-2">
              {sucursales.map((s: any) => (
                <li
                  key={s.id}
                  className={`
                    px-3 py-2 rounded-lg ${s.activo ? 'bg-orange-50' : 'bg-red-500  transition-colors text-sm text-gray-700 border border-transparent'}
                  `}
                >
                  📍{s.nombre}-🔑{s.id}
                  {s.activo? (
                    <button
                      type="button"
                      onClick={() => handleInactivarSucursal(s.id, false)}
                      className="text-red-500 hover:text-red-600 text-sm border border-red-500 rounded-full px-2 py-1"
                    >
                      ✕
                    </button>
                  ):(
                    <button
                      type="button"
                      onClick={() => {handleInactivarSucursal(s.id, true);console.log('press???')}}
                      className="bg-green-500 text-white text-sm border border-green-500 rounded-full px-2 py-1"
                    >
                      Activar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-400 text-center py-6">
              No hay sucursales registradas
            </div>
          )}
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-3">
          
          <input
            name="id"
            value={formSucursal.id}
            onChange={handleChangeAgregarSucursal}
            type="text"
            placeholder="🔑 ID: 10000"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            name="coords"
            value={formSucursal.coords}
            onChange={handleChangeAgregarSucursal}
            type="text"
            placeholder="📌 Coord (lat,long): -16.503, -68.163"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            name="nombre"
            value={formSucursal.nombre}
            onChange={handleChangeAgregarSucursal}
            type="text"
            placeholder="🏪 Nombre: LaPaz-Perez"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="button"
            onClick={handleSubmitAgregarSucursal}
            className="mt-2 w-full py-2 rounded-lg text-sm font-medium bg-[#D2691E] text-white hover:bg-[#b85c1a] transition-all shadow-md hover:shadow-lg"
          >
            + Agregar sucursal
          </button>

        </div>
      </div>
    </div>
  )
}
