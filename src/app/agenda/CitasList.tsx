import { Cita } from '@/types/citas'
import ListaServicios from './ListaServicios'

export default function CitasList({ citas }: { citas: Cita[] }) {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Historial de Citas
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Consulta tus citas pasadas y futuras
        </p>
      </div>

      {/* Lista */}
      {citas.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
          No tienes citas registradas.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {citas.map((cita) => {
            const estadoStyles =
              cita.estado === 'confirmado'
                ? 'bg-green-50 text-green-700 border-green-200'
                : cita.estado === 'cancelado'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-yellow-50 text-yellow-700 border-yellow-200'

            return (
              <div
                key={cita.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                {/* Top Row */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {cita.fecha}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-md border ${estadoStyles}`}
                  >
                    {cita.estado.toUpperCase()}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Mascota</p>
                    <p className="font-medium text-gray-800">
                      {cita.mascota.nombre}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 mb-1">Horario</p>
                    <p className="font-medium text-gray-800">
                      {cita.hora_inicio || '00:00'} - {cita.hora_fin || '00:00'}
                    </p>
                  </div>

                  <div className='col-span-3 md:col-span-1'>
                    <p className="text-gray-500 mb-1">Observaciones</p>
                    <p className="font-medium text-gray-800">
                      {cita.observaciones}
                    </p>
                  </div>
                  <div className='col-span-3'>
                    <ListaServicios
                      cita_id={cita.id}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}