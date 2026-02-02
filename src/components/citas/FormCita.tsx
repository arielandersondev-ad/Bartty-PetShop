import { useState } from 'react'

const estados = ['pendiente', 'confirmado', 'cancelado', 'atendido'] as const
type CitaForm = {
  cliente_id: string
  mascota_id: string
  fecha: string
  hora_inicio: string
  hora_fin?: string
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'atendido'
  observaciones?: string
}

export default function FormCita({clienteId,mascotas}: {
  clienteId: string
  mascotas: { id: string; nombre: string }[]
}) {
  const [form, setForm] = useState<CitaForm>({
    cliente_id: clienteId,
    mascota_id: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    estado: 'pendiente',
    observaciones: '',
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

    alert('Cita registrada')
  }

  return (
    <div className='bg-[#fff8e1] border-2 border-[#d2691e] rounded-lg'>
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-white p-4 rounded shadow space-y-3 text-black"
      >
        <div className='flex flex-col gap-4'>
          {/* Mascota */}
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

          {/* Fecha */}
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          {/* Hora inicio */}
          <input
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
            required
          />

          {/* Hora fin */}
          <input
            type="time"
            name="hora_fin"
            value={form.hora_fin}
            onChange={handleChange}
          />

          {/* Estado */}
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >
            {estados.map(e => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          {/* Observaciones */}
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Observaciones"
          />

          <button
            className="bg-[#d2691e] text-white px-4 py-2 rounded"
          >
            Agendar cita
          </button>
        </div>
      </form>
    </div>
  )
}
