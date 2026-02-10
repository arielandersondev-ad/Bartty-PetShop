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
    <div>
      {rol === 'admin' || rol === 'emp_servicio' && (
        <>
          <h2 className="text-center mb-3 text-2xl text-[#D2691E]">Servicios</h2>
          <form onSubmit={handlerSubmit} className="flex flex-row gap-4">
            <div className="border border-[#D2691E] rounded-full p-2">
              <input 
                className="border-none outline-none text-center focus:ring-0"
                type="text" 
                name="servicio" 
                id="servicio" 
                placeholder="Nombre del servicio"
                onChange={handleChange}
              />
            </div>
            <div className="border border-[#D2691E] rounded-full p-2">
              <input 
                className="w-20 border-none outline-none text-center focus:ring-0"
                type="number" 
                name="valor" 
                id="valor" 
                placeholder="Bs" 
                onChange={handleChange}
              />
            </div>
            <div className="bg-green-600 rounded-full font-extrabold size-lg text-white hover:bg-green-700 p-2">
              <button 
                
                type="submit"
              >Agregar</button>
            </div>
          </form>
        </>
      )}
      <div className=" text-center font-semibold text-[#8B4513] mb-2">
        Lista de servicios
      </div>
      {servicios.length === 0 ? (
        <div className="m-4 text-sm text-gray-600 text-center">No hay servicios registrados.</div>
      ) : (
        <ul className= "space-y-2 flex flex-wrap gap-2">
          {servicios.map(s => (
            <li key={s.id} className="flex justify-between items-center border p-2 rounded m-0">
              <div className="flex flex-row gap-2 justify-evenly w-full">
                <div className="text-[#8B4513]">{s.servicio}</div>
                <div className=" text-gray-600">Precio: {Number(s.valor).toFixed(2)} Bs</div>
                {rol === 'admin' || rol === 'emp_servicio' && (
                  <button className="bg-red-500 rounded-full p-1 text-white px-2" onClick={() => handleDelete(s.id)}>Eliminar</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
