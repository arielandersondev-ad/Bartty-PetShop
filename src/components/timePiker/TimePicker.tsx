import { useEffect, useState } from 'react'

interface TimePickerProps {
  fecha: string
  selectedHora: string | null
  onChange: (hora: string) => void
}

export default function TimePicker({ fecha, selectedHora, onChange }: TimePickerProps) {
  const [busyHours, setBusyHours] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const availableSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  useEffect(() => {
    if (!fecha) return

    const fetchBusyHours = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/citas?action=citasConfirmadasporFecha&fecha=${fecha}`)
        const data = await res.json()
        if (data.success) {
          // Guardamos las horas de inicio ocupadas
          setBusyHours(data.hora_inicio || [])
        }
      } catch (error) {
        console.error('Error fetching busy hours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusyHours()
  }, [fecha])

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