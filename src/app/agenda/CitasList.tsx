
import {Cita} from '@/types/citas'
export default function CitasList({citas}: {citas:Cita[]}) {
  return (
    <div className="bg-[#FFF8E1] flex flex-col flex-1 gap-5">
      <div className='bg-[#FFFfff] border border-[#d2691e] rounded-lg md:w-auto text-black p-3'>
        <h2 className="text-xl font-bold mb-4">Historial de Citas</h2>
      </div>
      <div className='bg-[#FFFfff] border border-[#d2691e] rounded-lg md:w-auto text-black p-3'>
        {citas.length === 0 ? (
          <p>No hay citas anteriores.</p>
        ) : (
          <ul className="space-y-2">
            {citas.map(cita => (
              <li key={cita.id} className="p-2 rounded-3xl bg-gray-100 hover:bg-gray-200 shadow-md m-5">
                <div className='flex flex-col md:flex-row gap-5 p-3'>
                  <div className='bg-orange-200 p-3 rounded-l-full'>
                    <p><strong>Fecha:</strong> {cita.fecha}</p>
                  </div>
                  <div className='bg-orange-200 p-3 '>
                    <p><strong>Mascota:</strong> {cita.mascota.nombre}</p>
                  </div>
                  <div className='bg-orange-200 p-3 '>
                    <p><strong>De </strong> {cita.hora_inicio || '00:00'}</p>
                  </div>
                  <div className='bg-orange-200 p-3 '>
                    <p><strong>A </strong> {cita.hora_fin || '00:00'}</p>
                  </div>
                  <div className='bg-orange-200 p-3 '>
                    <p><strong>Servicios:</strong> {cita.observaciones}</p>
                  </div>
                  {cita.estado === 'confirmado' && (
                    <div className='bg-green-500 p-3 md:rounded-r-full'>
                      <p><strong>Estado:</strong> {cita.estado}</p>
                    </div>
                  )}
                  {cita.estado === 'cancelado' && (
                    <div className='bg-red-500 p-3 md:rounded-r-full'>
                      <p><strong>Estado:</strong> {cita.estado}</p>
                    </div>
                  )}
                  {cita.estado === 'pendiente' && (
                    <div
                    className='bg-yellow-500 p-3 md:rounded-r-full'>
                      <p><strong>Estado:</strong> {cita.estado}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
