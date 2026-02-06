'use client';
import { useEffect, useState } from "react"
import {  UsuarioForm } from "@/types"
import { ActionButton, ColumnConfig, DynamicTable } from "../components/DynamicTable";
export default function Usuarios() {

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
  const [usuarios, setUsuarios] = useState<UsuarioForm[]>([])
  const [edit, setEdit] = useState(false)

  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const columns: ColumnConfig<UsuarioForm>[] = [
    { key: 'ci', label: 'CI', type: 'text', sortable: true },
    { key: 'nombre', label: 'Nombre', type: 'text', sortable: true, searchable: true },
    { key: 'apellido', label: 'Apellido', type: 'text', sortable: true, searchable: true },
    { key: 'email', label: 'Email', type: 'text', sortable: true, searchable: true },
    { key: 'password', label: 'Contraseña', type: 'text', sortable: false, width: '300px' },
    { key: 'rol', label: 'Rol', type: 'text', sortable: true },
    { key: 'activo', label: 'Estado', type: 'status', sortable: true,
      statusOptions: [
        { value: 'true', label: 'Activo', color: '#10b981' },
        { value: 'false', label: 'Inactivo', color: '#ef4444' }
      ]
     },
    { key: 'telefono', label: 'Teléfono', type: 'text', sortable: true },
    { key: 'numero_referido', label: 'Referido', type: 'text', sortable: true }
  ]
  const actions: ActionButton<UsuarioForm>[] = [
    {
      label: 'Eliminar',
      onClick: async (row) => {handleDelete(row); setEdit(false)},
      variant: 'rojo',
    },
    {
      label: 'Editar',
      onClick: async (row) => {handleEdit(row); setEdit(true)},
      variant: 'azul',
    }
  ]
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  const handleDelete = async (usuario: UsuarioForm) => {
    try {
      const res = await fetch(`/api/usuario?id=${usuario.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje('Usuario eliminado')
        fetchUsuarios()
      } else {
        setMensaje(data.error || 'Error al eliminar usuario')
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.')
      console.error('Error al eliminar usuario:', error)
    }
  }
  const handleEdit = (usuario: UsuarioForm) => {
    setForm({
      id: usuario.id || '',
      ci: usuario.ci || '',
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      email: usuario.email || '',
      password: usuario.password || '',
      rol: usuario.rol || '',
      activo: usuario.activo ? 'true' : 'false',
      telefono: usuario.telefono || '',
      numero_referido: usuario.numero_referido || '',
    })

  }
  const handleSubmit = async (e: React.FormEvent) => {
    const isEdit = edit && form.id 
    const method = isEdit ? 'PATCH' : 'POST'
    const payload = {
      ...form,
      activo: form.activo === 'true' ? true : false,
      action: isEdit ? 'update' : 'register'
    };
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      const res = await fetch('/api/usuario', {
        method: method,
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
        setEdit(false)
        fetchUsuarios()
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.')
      console.error('Error:', error)
    }

    setLoading(false)
  }
  async function fetchUsuarios() {
    try {
      const res = await fetch('/api/usuario')
      const data = await res.json()
      setUsuarios(data)
    } catch (error) {
      console.error('Error fetching usuarios:', error)
    }
  }

  useEffect(() => {
    const loadUsuarios = async () => {await fetchUsuarios();}
    loadUsuarios();
  },[])
  
  return (
    <div className="bg-[#fff8e1] flex flex-col md:flex-row gap-8 mt-20">
      <div className="w-1/3 border-2 border-[#D2691E] rounded-lg p-4">
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
              onClick={() => {setForm(dataExample); setEdit(false)}}
            >
              limpiar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#D2691E] text-white px-4 py-2 rounded-lg hover:bg-[#B85C00] transition-colors"
            >
              {loading ? 'Guardando...' : (edit ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
      <div className="w-3/3 border-2 border-[#D2691E] rounded-lg p-4">
        <div className= "my-2 flex flex-row justify-between">
          <h1 className="text-black">Lista de Usuarios</h1>
          <button className="bg-[#D2691E] text-white px-4 py-2 rounded-lg hover:bg-[#B85C00] transition-colors" onClick={() => fetchUsuarios()}>refrescar</button>
        </div>
        <DynamicTable
          data={usuarios}
          columns={columns}
          actions={actions}
          pageSize={10}
          showSearch={true}
          showPagination={true}
          emptyMessage="No hay usuarios registrados"
          className="w-full text-black"
        />
      </div>
    </div>
  )
}