import Image from 'next/image'
import { useState } from 'react'
import DisabledDatePicker from '@/components/DatePicker/DisabledDatePicker'
import TimePicker from '@/components/timePiker/TimePicker'

type CitaForm = {
  cliente_id: string
  mascota_id: string
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'atendido'
  observaciones?: string
  estilo_corte?: string
}
type TNuevaCita = {
  clienteId: string,
  mascotas: {
    id: string,
    nombre: string
  }[],
  onRefresh: ()=>void
}

export default function NuevaCita({clienteId, mascotas, onRefresh}: TNuevaCita) {
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
  const [ confirmar, setConfirmar ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if(res.ok)setMessage('Cita Solicitada Exitosamente')
      onRefresh()
    } catch (error) {
      console.error('Error al registrar la cita: ', error)
    }finally{
      setLoading(false)
    }
  }
  function handleConfirmar (confirmar: boolean){
    setConfirmar(!confirmar)
  }
  const handleFechaChange = (fecha: string) => {
    setForm(prev => ({ ...prev, fecha, hora_inicio: null, hora_fin: null }))
  }

  const handleHoraChange = (hora: string) => {
    // Calcular hora_fin sumando 1 hora
    const [h, m] = hora.split(':').map(Number)
    const finH = (h + 1).toString().padStart(2, '0')
    const horaFin = `${finH}:${m.toString().padStart(2, '0')}`

    setForm(prev => ({ 
      ...prev, 
      hora_inicio: hora,
      hora_fin: horaFin 
    }))
  }

  return (
    <div className='bg-white p-4'>
      <form
        onSubmit={handleSubmit}
        className="text-black"
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row rounded-2xl border border-amber-600 px-2 py-2 gap-2'>
            <div className='font-bold'>
              Cita Para: 
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
          <div>
            <div className='font-bold'>
              Para el:  
            </div>
              <DisabledDatePicker
                value={form.fecha}
                onChange={handleFechaChange}
              />
          </div>

          {form.fecha && (
            <div>
              <TimePicker 
                fecha={form.fecha} 
                selectedHora={form.hora_inicio} 
                onChange={handleHoraChange} 
              />
            </div>
          )}
          <div
            className='flex flex-row rounded-2xl border border-amber-600 hover:bg-amber-500 px-2 py-2 justify-center'
            onClick={()=> handleConfirmar(confirmar)}
          >
            Confirmar Cita
          </div>
          {confirmar && (
            <div >
              <Image 
                src="/image/QR_anticipo.jpeg" 
                alt="QR"
                width={200}
                height={200}
                className='mx-auto rounded-lg'
              /> 
              <p className='text-sm font-bold'>Es necesario que haga un adelanto para confirmar su cita y envie una captura del comprobante al siguiente Nuemero #12435241</p>
            </div>
          )}
          <p className='text-sm font-bold'>{message}</p>
          <div className='border-2 border-amber-500'></div>
          {confirmar && (
            <button
              disabled={loading}
              type='submit'
              className="w-full bg-[#d2691e] text-white px-4 py-2 rounded-2xl"
            >
              {loading ? 'Solicitando cita...':'Agendar cita'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
