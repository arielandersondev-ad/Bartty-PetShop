import { useEffect, useState } from "react";

export default function Servicio({usuario_id, cita_id, rol}: {usuario_id?: string, cita_id?: string, rol: string}) {
  const [form, setForm] = useState({
    servicio: '',
    valor: 0
  });
  const [servicios, setServicios] = useState<Array<{id: string, servicio: string, valor: number}>>([]);

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      fetch('/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...form, usuario_id, cita_id})
      })      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setTimeout(() => {
        listarServicios(cita_id || '');
      }, 500);
      setForm({
        servicio: '',
        valor: 0
      })
    }
  }
  const handleDelete =(id: string) => {
    try {
      fetch(`/api/servicios/?id=${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    } finally {
      setTimeout(() => {
        listarServicios(cita_id || '');
      }, 500);
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("nombre: ",name, " value: ", value)
    setForm(prev => ({
      ...prev,
      [name]: name === 'valor' ? Number(value) : value
    }))
  }
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
    listarServicios(cita_id || '');
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

      {/* Formulario */}
      {(rol === 'admin' || rol === 'emp_servicio') && (
        <form
          onSubmit={handlerSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
            type="text"
            name="servicio"
            placeholder="Nombre del servicio"
            value={form.servicio}
            onChange={handleChange}
          />

          <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
            type="number"
            name="valor"
            placeholder="Monto en Bs"
            value={form.valor || ''}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            Agregar servicio
          </button>
        </form>
      )}

      {/* Lista */}
      <div className="border-t pt-3 space-y-2">

        {servicios.length === 0 ? (
          <div className="text-sm text-gray-500 text-center">
            No hay servicios registrados.
          </div>
        ) : (
          <ul className="space-y-2 mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
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

                {(rol === 'admin' || rol === 'emp_servicio') && (
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-xs px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-all"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
