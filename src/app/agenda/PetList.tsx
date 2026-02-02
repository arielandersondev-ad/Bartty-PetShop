'useClient';
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
export default function PetList({mascotas, onMascotaCreaada} : MascotaCardProps) {
  const [confirm, setConfirm] = useState<string>()

  const handleDelete = async (id: string) => {
    const res = await fetch(`./api/mascotas?id=${id}`,{method:'DELETE'})
    if (!res.ok) {return console.log('Error en la eliminacion de la mascota')}
    setConfirm('')//observacion
    onMascotaCreaada(prev => !prev)
  }

  if (!mascotas || mascotas.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No hay mascotas registradas
      </p>
    )
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mascotas.map((mascota) => (
        <div
          key={mascota.id}
          className="flex flex-col bg-[#ffffff] border border-[#d2691e] p-5 rounded-lg shadow-md items-center gap-2"
          onClick={() => setConfirm('')}
        >
          <div className="font-extrabold w-full text-center text-lg">
            {mascota.nombre || 'Sin nombre'}
          </div>

          <div className="w-full text-sm space-y-1">
            <p><strong>Raza:</strong> {mascota.raza || 'No especificada'}</p>
            <p><strong>Edad:</strong> {mascota.edad ?? 'No registrada'}</p>
            <p><strong>Tamaño:</strong> {mascota.tamano || 'No especificado'}</p>
            <p><strong>Sexo:</strong> {mascota.sexo || 'No especificado'}</p>
          </div>
          {confirm === mascota.id ?
            <button onClick={ () => handleDelete(mascota.id)} className="mb-4 hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">🪣Confirmar</button>
          :
            <button onClick={ (e) => {setConfirm(mascota.id); e.stopPropagation()}} className="mb-4 hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">♦️Eliminar</button>
          }
        </div>
      ))}
    </div>
  )
}
