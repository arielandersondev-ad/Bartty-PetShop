"use client";
import { useState, useEffect } from "react"

export default function Testing() {
  const [handler, setHandler] = useState()
  useEffect(() => {
    fetch('/api/clientes')
      .then(response => response.json())
      .then(data => setHandler(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [])


  return (
    <div className="flex flex-col">
      <div>
        Testing Component
        <button 
          className="border border-amber-600 bg-amber-950 text-white p-2 rounded-lg m-2"
          onClick={() => console.log(handler)}
        >CONSULTA</button>
      </div>

      <div>
        <NuevoClientePage ></NuevoClientePage>
      </div>
      <div>
        <LoginPage ></LoginPage>
      </div>
    </div>
  )
}

//________________________________

export function NuevoClientePage() {
  const [form, setForm] = useState({
    ci: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    telefono: '',
    numero_referido: ''
  })

  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error al crear cliente')
      } else {
        setMensaje('✅ Cliente creado correctamente')
        setForm({
          ci: '',
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          email: '',
          telefono: '',
          numero_referido: ''
        })
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.')
      console.error('Error:', error)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Registrar Cliente</h1>

      <form onSubmit={handleSubmit}>
        <input name="ci" placeholder="CI" value={form.ci} onChange={handleChange} required />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellido_paterno" placeholder="Apellido Paterno" value={form.apellido_paterno} onChange={handleChange} required />
        <input name="apellido_materno" placeholder="Apellido Materno" value={form.apellido_materno} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="numero_referido" placeholder="Referido" value={form.numero_referido} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: 'empleado'
  })

  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      const res = await fetch('/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          action: isRegister ? 'register' : 'login'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error')
      } else {
        setMensaje(data.message)

        // Guardar token (login)
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.')
      console.error('Error:', error)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <h1>{isRegister ? 'Registrar Usuario' : 'Iniciar Sesión'}</h1>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        {isRegister && (
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="empleado">Empleado</option>
            <option value="admin">Administrador</option>
          </select>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : isRegister ? 'Registrar' : 'Entrar'}
        </button>
      </form>

      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Ya tengo cuenta' : 'Crear cuenta'}
      </button>

      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}