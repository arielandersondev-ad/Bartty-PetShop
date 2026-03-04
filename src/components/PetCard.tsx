import React, { useState } from 'react';
interface PetForm {
  cliente_id: string;
  disabled?: boolean;
  onMascotaCreada?: () => void;
}
export default function PetCard ({cliente_id, onMascotaCreada,disabled}: PetForm) {
  const [form ,setForm] = useState({
    nombre:'',
    raza:'',
    color:'',
    edad:0,
    tamano:'',
    vacuna_antirrabica:false,
    sexo:'',
    observaciones:''
  })
  const [loading,setLoading]=useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name } = target;
    const value = (target as HTMLInputElement).type === 'number'
      ? (target.value === '' ? 0 : Number(target.value))
      : target.value;
    setForm(prev => ({ ...prev, [name]: value }));
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
          cliente_id: cliente_id,
          vacuna_antirrabica: String(form.vacuna_antirrabica)
        })
      })
      
      if(!res.ok) {
        console.log('Error en el registro')
        setLoading(false)
        return
      }
      
      const data = await res.json()
      onMascotaCreada?.()
      console.log('datos registrados de la mascota: ',data)
    } catch (error) {
      console.error('Error en handleSubmit:', error)
    }
    setLoading(false)
  }

  return (
    <div className="p-2 bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl">
      <h2 className="text-xl font-semibold text-black mb-4">Datos de la Mascota</h2>
      <fieldset disabled={disabled} className={disabled ? 'opacity-50 pointer-events-none' : ''}>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Mascota
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="text-black mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Raza
              </label>
              <input
                type="text"
                name="raza"
                value={form.raza}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Edad (años)
              </label>
              <input
                type="number"
                name="edad"
                min="0"
                value={form.edad}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
              />
            </div>

          </div>

          {/* Tamaño */}
          <div className='text-black'>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Tamaño
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["pequeño", "mediano", "grande"].map((size) => (
                <label
                  key={size}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition
                  ${form.tamano === size
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-300 hover:border-amber-400"}`}
                >
                  <input
                    type="radio"
                    name="tamano"
                    value={size}
                    checked={form.tamano === size}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="capitalize">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vacuna */}
          <div className='text-black'>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ¿Vacuna Antirrábica?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`cursor-pointer rounded-lg border p-3 text-center transition
                ${form.vacuna_antirrabica === true
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-300 hover:border-amber-400"}`}
              >
                <input
                  type="radio"
                  name="vacuna_antirrabica"
                  checked={form.vacuna_antirrabica === true}
                  onChange={() =>
                    setForm({ ...form, vacuna_antirrabica: true })
                  }
                  className="hidden"
                />
                Sí
              </label>

              <label
                className={`cursor-pointer rounded-lg border p-3 text-center transition
                ${form.vacuna_antirrabica === false
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-300 hover:border-amber-400"}`}
              >
                <input
                  type="radio"
                  name="vacuna_antirrabica"
                  checked={form.vacuna_antirrabica === false}
                  onChange={() =>
                    setForm({ ...form, vacuna_antirrabica: false })
                  }
                  className="hidden"
                />
                No
              </label>
            </div>
          </div>

          {/* Sexo */}
          <div className='text-black'>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Sexo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Hembra", value: "H" },
                { label: "Macho", value: "M" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-lg border p-3 text-center transition
                  ${form.sexo === option.value
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-300 hover:border-amber-400"}`}
                >
                  <input
                    type="radio"
                    name="sexo"
                    value={option.value}
                    checked={form.sexo === option.value}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div className='text-black'>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Notas Especiales
            </label>
            <textarea
              name="observaciones"
              rows={3}
              value={form.observaciones}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition resize-none"
              placeholder="Comportamiento, alergias, etc."
            />
          </div>

          {/* Botón */}
          {cliente_id?.length !== 0 && (
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-600 py-3 font-semibold text-white shadow-md transition hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Registrando..." : "Registrar Mascota"}
            </button>
          )}

        </form>

      </fieldset>

    </div>
  );
};
