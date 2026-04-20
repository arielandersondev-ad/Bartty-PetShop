import { useEffect, useState } from "react";

export default function Sucursales () {
  //ESTADOS
  const [sucursales, setSucursales] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
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

  const handleSelectSucursal = (s: any) => {
    setIsEditing(true)
    setFormSucursal({
      id: s.id,
      nombre: s.nombre,
      coords: `${s.lat}, ${s.lng}`
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormSucursal({
      nombre: "",
      coords: "",
      id: "",
    })
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
      if (isEditing) {
        // ACTUALIZAR
        fetch('/api/configuracion/sucursal', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: formSucursal.id,
            nombre: formSucursal.nombre,
            lat,
            lng,
          })
        }).then(() => {
          loadSucursales()
          handleCancelEdit()
        })
      } else {
        // AGREGAR
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
          setFormSucursal({
            nombre: "",
            coords: "",
            id: "",
          })
        })
      }
    } catch (error) {
      console.error('Error al procesar la sucursal:', error);
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
                  onClick={() => handleSelectSucursal(s)}
                  className={`
                    px-3 py-2 rounded-lg cursor-pointer hover:shadow-md transition-all ${s.activo ? 'bg-orange-50 border-orange-100' : 'bg-red-50 text-red-700 border-red-100'} border flex items-center justify-between
                  `}
                >
                  <span className="flex-1">
                    📍 {s.nombre} <span className="text-gray-400 text-xs ml-2">ID: {s.id}</span>
                  </span>
                  <div className="flex gap-2">
                    {s.activo? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInactivarSucursal(s.id, false);
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                        title="Desactivar"
                      >
                        ✕
                      </button>
                    ):(
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInactivarSucursal(s.id, true);
                        }}
                        className="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full hover:bg-green-600 transition-colors"
                      >
                        Activar
                      </button>
                    )}
                  </div>
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

          <div className="flex gap-2 mt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all w-auto px-2"
              >
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmitAgregarSucursal}
              className={`flex-[2] py-2 rounded-lg text-sm font-medium ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D2691E] hover:bg-[#b85c1a]'} text-white transition-all shadow-md hover:shadow-lg w-full`}
            >
              {isEditing ? '💾 Guardar cambios' : '+ Agregar sucursal'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
