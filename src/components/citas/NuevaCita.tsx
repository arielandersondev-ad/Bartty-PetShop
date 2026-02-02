import Image from 'next/image'
import { useState } from 'react'

type CitaForm = {
  cliente_id: string
  mascota_id: string
  fecha: string
  hora_inicio: null
  hora_fin?: null
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'atendido'
  observaciones?: string
  estilo_corte?: string
}
type TNuevaCita = {
  clienteId: string,
  mascotas: {
    id: string,
    nombre: string
  }[]
}

export default function NuevaCita({clienteId, mascotas}: TNuevaCita) {
  const [form, setForm] = useState<CitaForm>({
    cliente_id: clienteId,
    mascota_id: '',
    fecha: '',
    hora_inicio: null,
    hora_fin: null,
    estado: 'pendiente',
    observaciones: '',
    estilo_corte:''
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      console.error('Error al crear la cita')
      return
    }
    console.log('registro exitoso')
  }

  return (
    <div className='bg-[#fff8e1] border-2 border-[#d2691e] rounded-lg'>
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-white p-4 rounded shadow space-y-3 text-black"
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row rounded-2xl border border-amber-600 px-2 py-2 gap-2'>
            <div>
              Cita Para
            </div>
            <select
              name="mascota_id"
              value={form.mascota_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una mascota</option>
              {mascotas.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-row rounded-2xl border border-amber-600 px-2 py-2 gap-2'>
            <div>
              Para el 
            </div>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className='flex flex-row rounded-2xl border border-amber-600 px-2 py-2 gap-2'>
            <div>
              Estilo:  
            </div>
            <input
              type="text"
              name="estilo_corte"
              value={form.estilo_corte}
              onChange={handleChange}
              required
            />
          </div>
          <div
            className='flex flex-row rounded-2xl border border-amber-600 hover:bg-amber-500 px-2 py-2 justify-center'
            onClick={()=> console.log("confirmar")}
          >
            Confirmar Cita
          </div>
          <div>
            <Image 
              src="/image/QR_anticipo.jpeg" 
              alt="QR"
              width={200}
              height={200}
              className='mx-auto rounded-lg'
            />
          </div>
          <button
            type='submit'
            className="bg-[#d2691e] text-white px-4 py-2 rounded"
          >
            Agendar cita
          </button>
        </div>
      </form>
    </div>
  )
}
