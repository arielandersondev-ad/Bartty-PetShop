import Image from 'next/image'
import { useState } from 'react'
import DisabledDatePicker from '@/components/DatePicker/DisabledDatePicker'
import TimePicker from '@/components/timePiker/TimePicker'
import LocationPicker from './LocationPicker'
import SucursalSelector from '@/app/admin/components/SucursalSelector'

type CitaForm = {
  cliente_id: string
  mascota_id: string
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'atendido'
  observaciones?: string
  estilo_corte?: string
  comprobante?: string
  sucursalId?: string
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
    estilo_corte:'',
    sucursalId: '',
  })
  const [ confirmar, setConfirmar ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [uploading, setUploading ] = useState(false)
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null)
  const [ map, setMap ] = useState('')
  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null)
  const [sucursalSelect, setSucursalSelect] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setComprobanteFile(file)
  }

  const uploadComprobante = async (): Promise<string | null> => {
    if (!comprobanteFile) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', comprobanteFile);

    try {
      const res = await fetch('/api/citas/comprobante', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();

      if (data.success) {
        return data.url;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error en la petición de subida:', error);
      return null;
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let comprobanteUrl = form.comprobante;
    if (comprobanteFile) {
      const uploadedUrl = await uploadComprobante();
      if (uploadedUrl) {
        comprobanteUrl = uploadedUrl;
      }
    }

    const finalFormData = { ...form, pickupLat: pickupCoords?.lat, pickupLng: pickupCoords?.lng, comprobante: comprobanteUrl };
    if(!finalFormData.sucursalId) return setMessage('Selecciona una sucursal')
    try {
      console.log('data final: ',finalFormData);
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });
      
      if(res.ok) {
        setMessage('Cita Solicitada Exitosamente');
        setSucursalSelect(false)
      }
      onRefresh();
    } catch (error) {
      console.error('Error al registrar la cita: ', error);
    } finally {
      setLoading(false);
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
  const handleSucursal= (value: string) => {
    setMessage('')
    setLoading(false)
    setForm(prev => ({ ...prev, sucursalId: value }))
    setSucursalSelect(true)
  }

  return (
    <div className='bg-white p-4'>
      <form
        onSubmit={handleSubmit}
        className="text-black"
      >
        <div className='flex flex-col gap-4'>
          <div>
            <SucursalSelector 
              onChange={handleSucursal}
            />
          </div>
          <div >
            <select
              name="mascota_id"
              value={form.mascota_id}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-700 border-gray-600 text-white'
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
            {sucursalSelect && (
              <DisabledDatePicker
                value={form.fecha}
                onChange={handleFechaChange}
              />
            )}
          </div>

          {form.fecha && (
            <div>
              {sucursalSelect && (
              <TimePicker 
                fecha={form.fecha} 
                selectedHora={form.hora_inicio} 
                onChange={handleHoraChange} 
              />
              )}
            </div>
          )}
          <div>
            <button
              type="button"
              onClick={() => setMap('map')}
              className="text-sm font-bold text-amber-700 cursor-pointer hover:text-amber-600"
            >
              Recoger mi mascota
            </button>
          </div>
          {map === 'map' && (
            <div>
              {sucursalSelect && (

              <LocationPicker 
                onConfirm={(lat, lng) => {
                  setPickupCoords({lat, lng})
                  console.log("Ubicación confirmada:", {
                    lat,
                    lng,
                  });
                }}
                onClose={() => setMap('')}
              />
              )}
            </div>
          )}
          {sucursalSelect && (
            <>
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
                  <div className="mt-4 p-4 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center gap-2">
                    <label className="text-sm font-bold text-amber-700 cursor-pointer hover:text-amber-600">
                      {comprobanteFile ? '📄 Archivo seleccionado: ' + comprobanteFile.name : '📁 Subir Comprobante (Opcional)'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                      />
                    </label>
                    {uploading && <p className="text-xs text-amber-600 animate-pulse">Subiendo archivo...</p>}
                  </div>
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
              <p className='text-sm font-bold text-red-500'>{message}</p>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
