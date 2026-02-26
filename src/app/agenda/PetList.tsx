'use client';
import { useState } from "react"

type Mascota = {
  id: string
  cliente_id: string
  nombre?: string
  raza?: string
  edad?: number | null
  tamano?: string | null
  sexo?: string | null
}

interface MascotaCardProps {
  mascotas: Mascota[]
  onMascotaCreaada: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PetList({ mascotas, onMascotaCreaada }: MascotaCardProps) {
  const [confirm, setConfirm] = useState<string | null>(null)
  const [ verMascotas, setMascotas] = useState(true)
  const handleDelete = async (id: string) => {
    const res = await fetch(`./api/mascotas?id=${id}`, { method: 'DELETE' })
    if (!res.ok) return console.log('Error en la eliminación de la mascota')

    setConfirm(null)
    onMascotaCreaada(prev => !prev)
  }
  function ViewMascotas(value:boolean){
    setMascotas(!value)
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div 
        className="bg-gray-100 border border-gray-200 rounded-xl p-6 hover:bg-gray-200"
        onClick={() => ViewMascotas(verMascotas)}
      >
        <h2 className="text-xl font-semibold text-gray-800 ">
          {verMascotas ? 'Ver Mascotas':'Ocultar Mascotas'}
        </h2>
      </div>

      {/* Grid */}
      {verMascotas && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
            >
              {/* Nombre */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {mascota.nombre || 'Sin nombre'}
                </h3>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-gray-500">Raza</p>
                  <p className="font-medium text-gray-800">
                    {mascota.raza || 'No especificada'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Edad</p>
                  <p className="font-medium text-gray-800">
                    {mascota.edad ?? 'No registrada'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Tamaño</p>
                  <p className="font-medium text-gray-800">
                    {mascota.tamano || 'No especificado'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Sexo</p>
                  <p className="font-medium text-gray-800">
                    {mascota.sexo || 'No especificado'}
                  </p>
                </div>
              </div>

              {/* Acción */}
              {confirm === mascota.id ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(mascota.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-md transition"
                  >
                    Confirmar eliminación
                  </button>
                  <button
                    onClick={() => setConfirm(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-md transition"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirm(mascota.id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-md transition"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}