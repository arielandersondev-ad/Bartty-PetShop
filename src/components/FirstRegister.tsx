'use client';
import { useState } from "react"
import { useRouter } from 'next/navigation';
export default function FirstRegister() {

  const router = useRouter();
  const dataExample = {
    id: '',
    ci: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    numero_referido: '',
    activo: 'true',
    password:'',
    rol: '',
  }
  const [form, setForm] = useState(dataExample)

  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    const payload = {
      ...form,
      action: 'register'
    };
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      const res = await fetch('/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error al crear usuario')
      } else {
        setMensaje('✅')
        setForm(dataExample)
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.')
      console.error('Error:', error)
    }

    setLoading(false)
  }

  
return (
    <div className="bg-[#fff8e1] min-h-screen flex flex-col md:flex-row gap-8 overflow-x-hidden">
      <div className="md:w-1/3 border-2 border-[#D2691E] rounded-lg p-4">
        <h1 className="text-[#D2691E] text-center">Registro de Usuario</h1>

        <form onSubmit={handleSubmit} className="flex flex-col text-black gap-2 text-center">
          <div>
            <label className="block text-sm font-medium text-black">CI</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2 ">
              <input 
                name="ci" 
                placeholder="CI" 
                value={form.ci} 
                onChange={handleChange} 
                required 
                className="outline-none w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Nombre</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2">
              <input 
              name="nombre" 
              placeholder="Nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              required
              className="outline-none w-full"
              />
            </div>
          </div>
          <div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Apellido</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2">
              <input 
              name="apellido" 
              placeholder="Apellido"
              value={form.apellido} 
              onChange={handleChange} 
              required
              className="outline-none w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2">
              <input 
              name="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
              className="outline-none w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Contraseña</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2">
              <input
              type="password" 
              name="password" 
              placeholder="Contraseña" 
              value={form.password} 
              onChange={handleChange} 
              className="outline-none w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Número Telefono</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2">
              <input 
              name="telefono" 
              placeholder="Teléfono" 
              value={form.telefono} 
              onChange={handleChange} 
              className="outline-none w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Número Referido</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2">
              <input 
              name="numero_referido" 
              placeholder="Referido" 
              value={form.numero_referido} 
              onChange={handleChange} 
              className="outline-none w-full"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Rol</label>
            <div className="rounded-2xl border-2 border-[#D2691E] p-2">
              <select 
                name="rol" 
                id="rol" 
                className="outline-none w-full"
                onChange={handleChange}
                value={form.rol}
              >
                <option className="text-black" value="admin">Admin</option>
                <option className="text-black" value="emp_recepcion">Recepcionista</option>
                <option className="text-black" value="emp_servicio">Servicio</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Estado</label>
            <div className={`rounded-2xl border-2 border-[#D2691E] p-2 ${form.activo === "true" ? "bg-green-500" : "bg-red-500 text-white"}`}>
              <select 
                name="activo" 
                id="activo" 
                className="outline-none w-full"
                onChange={handleChange}
                value={form.activo}
              >
                <option className="text-black" value="true">Activo</option>
                <option className="text-black" value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row justify-evenly gap-4 mt-4">
            <button 
              type="button" 
              disabled={loading}
              className="bg-[#1e84d2] text-white px-4 py-2 rounded-lg hover:bg-[#0068b8] transition-colors"
              onClick={() => {setForm(dataExample)}}
            >
              limpiar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#D2691E] text-white px-4 py-2 rounded-lg hover:bg-[#B85C00] transition-colors"
            >
              {loading ? 'Guardando...' :  'Guardar'}
            </button>
          </div>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  )
}