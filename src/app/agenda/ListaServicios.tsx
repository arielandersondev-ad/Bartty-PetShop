import { useEffect, useState } from "react";

export default function ListaServicios({cita_id}: {cita_id?: string}) {

  const [servicios, setServicios] = useState<Array<{id: string, servicio: string, valor: number}>>([]);

  async function listarServicios(cita_id: string) {
    try {
      const res = await fetch(`/api/servicios?cita_id=${cita_id}`);
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error('Error en el listado de servicios: ', error)
    }
  }
  useEffect(() => {
    const loadServicios = async () => await listarServicios(cita_id || '');
    loadServicios()
  }, [cita_id])
  
  return (
    <div className=" p-4 bg-white shadow-sm space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-[#8B4513]">
          Servicios
        </h2>
        <span className="text-xs text-gray-500">
          {servicios.length} registrados
        </span>
      </div>


      {/* Lista */}
      <div className="border-t pt-3 space-y-2">

        {servicios.length === 0 ? (
          <div className="text-sm text-gray-500 text-center">
            No hay servicios registrados.
          </div>
        ) : (
          <ul className="space-y-2 mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
            {servicios.map(s => (
              <li
                key={s.id}
                className="flex justify-between items-center bg-[#fff8e1] border border-[#D2691E] rounded-lg px-3 py-2 m-0"
              >
                <div>
                  <div className="text-sm font-medium text-[#8B4513]">
                    {s.servicio}
                  </div>
                  <div className="text-xs text-gray-600">
                    Bs {Number(s.valor).toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
