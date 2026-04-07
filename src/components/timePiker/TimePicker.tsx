import { useEffect, useState } from 'react'

interface TimePickerProps {
  fecha: string
  selectedHora: string | null
  onChange: (hora: string) => void
  sucursalId?: string
}

export default function TimePicker({ fecha, selectedHora, onChange, sucursalId }: TimePickerProps) {
  const [busyHours, setBusyHours] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])

  async function loadAvailableSlots (){
    if (!sucursalId) return
    try {
      const res = await fetch(`/api/configuracion/slot?sucursalId=${sucursalId}`)
      const data = await res.json()
      if (data) {
        function guardarHoras(data:any, setAvailableSlots:any) {
          const horas = data
            .map((item:any) => item.hora)
            .sort((a:any, b:any) => a.localeCompare(b));
          setAvailableSlots(horas);
        }
        guardarHoras(data, setAvailableSlots)
      }
    } catch (error) {
      
    }
  }
  useEffect(() => {
    if (!fecha) return

    const fetchBusyHours = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/citas?action=HorasNoDisponiblesbyDate&fecha=${fecha}&sucursalId=${sucursalId}`)
        const data = await res.json()
        if (data.success) {
          setBusyHours(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching busy hours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusyHours()
    loadAvailableSlots()
  }, [fecha, sucursalId])

  if (!fecha) {
    return <p className="text-sm text-gray-500 italic">Selecciona una fecha primero</p>
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="font-bold text-sm">Horas disponibles:</div>
      {loading ? (
        <p className="text-sm animate-pulse">Cargando horarios...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {availableSlots.map((hora) => {
            const isBusy = busyHours.includes(hora)
            const isSelected = selectedHora === hora

            return (
              <button
                key={hora}
                type="button"
                disabled={isBusy}
                onClick={() => onChange(hora)}
                className={`
                  px-3 py-2 rounded-xl border text-sm transition-colors
                  ${isBusy 
                    ? 'bg-red-100 border-red-200 text-red-500 cursor-not-allowed line-through' 
                    : isSelected
                      ? 'bg-amber-500 border-amber-600 text-white shadow-inner'
                      : 'bg-white border-amber-600 hover:bg-amber-50 text-black'
                  }
                `}
              >
                {hora}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}