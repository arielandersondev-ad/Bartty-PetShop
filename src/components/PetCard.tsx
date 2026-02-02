import React, { useState } from 'react';
import NuevaCita from './citas/NuevaCita';
interface PetForm {
  cliente_id: string;
  disabled?: boolean;
  onMascotaCreada?: React.Dispatch<React.SetStateAction<boolean>>
}
export default function PetCard ({cliente_id, onMascotaCreada,disabled}: PetForm) {
  const [abrirCita, setAbrirCita] = useState(false)
  const [mascotas, setMascotas] = useState([])
  const [form ,setForm] = useState({
    nombre:'',
    raza:'',
    color:'',
    edad:'',
    tamano:'',
    vacuna_antirrabica:false,
    sexo:'',
    observaciones:''
  })
  const [loading,setLoading]=useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    try {
      const res = await fetch('/api/mascotas',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...form,
          'cliente_id':cliente_id 
        })
      })
      
      if(!res.ok) {
        console.log('Error en el registro')
        setLoading(false)
        return
      }
      
      const data = await res.json()
      setMascotas(data)
      onMascotaCreada?.(prev => !prev)
      setAbrirCita(true)
      console.log('datos registrados de la mascota: ',data)
    } catch (error) {
      console.error('Error en handleSubmit:', error)
    }
    setLoading(false)
  }

  return (
    <div className= "p-6 rounded-lg shadow-md bg-[#fff8e1] border-2 border-[#d2691e]">
      <h2 className="text-xl font-semibold text-black mb-4">Datos de la Mascota</h2>
      <fieldset disabled={disabled} className={disabled ? 'opacity-50 pointer-events-none' : ''}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='flex flex-col md:flex-row gap-2'>
            <div>
              <label className="block text-sm font-medium text-black">Nombre de la Mascota</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Raza</label>
              <input
                type="text"
                id="raza"
                name="raza"
                value={form.raza}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-2'>
            <div>
              <label className="block text-sm font-medium text-black">color</label>
              <input
                type="text"
                id="color"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Edad (años)</label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">tamano</label>
            <div className="flex -flex-col md:flex-row mt-1 space-y-2 text-amber-600 font-bold">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tamano"
                  value="pequeño"
                  onChange={handleChange}
                  className="mr-2"
                />
                Pequeño
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tamano"
                  value="mediano"
                  onChange={handleChange}
                  className="mr-2"
                />
                Mediano
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tamano"
                  value="grande"
                  onChange={handleChange}
                  className="mr-2"
                />
                Grande
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Cuenta con Vacuna Antirabica?</label>
            <div className="flex flex-col md:flex-row gap-3 mt-1 space-y-2 text-amber-600 font-bold">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vacuna_antirrabica"
                  value='si'
                  onChange={handleChange}
                  className="mr-2"
                />
                SI
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vacuna_antirrabica"
                  value='no'
                  onChange={handleChange}
                  className="mr-2"
                />
                NO
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Sexo</label>
            <div className="flex flex-col md:flex-row gap-3 mt-1 space-y-2 text-amber-600 font-bold">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sexo"
                  value="H"
                  onChange={handleChange}
                  className="mr-2"
                />
                Hembra
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sexo"
                  value="M"
                  onChange={handleChange}
                  className="mr-2"
                />
                Macho
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Notas Especiales</label>
            <textarea
              id="observaciones"
              name="observaciones"
              rows={2}
              value={form.observaciones}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Comportamiento, alergias, etc."
            />
          </div>
          {cliente_id?.length != 0 && (
            <button
              disabled={loading}
              className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Registro de mascota
            </button>
          )}
        </form>
      </fieldset>
      {abrirCita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setAbrirCita(false)}
          />

          {/* Modal */}
          <div className="relative z-10">
            <NuevaCita
              clienteId={cliente_id}
              mascotas={mascotas}
            />
          </div>
        </div>
      )}
    </div>
  );
};
