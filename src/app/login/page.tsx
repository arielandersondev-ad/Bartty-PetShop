"use client";

import React, { useState } from 'react'
import {useRouter} from 'next/navigation'
import Cookies from 'js-cookie';

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: ''
  })
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
          action:'login'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMensaje(data.error || 'Error')
      } else {
        setMensaje(data.message)
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        if (data.usuario.rol === 'admin' || data.usuario.rol === 'emp_recepcion' || data.usuario.rol === 'emp_servicio') {
          const session = {
            id: data.usuario.id,
            nombre: data.usuario.nombre,
            rol: data.usuario.rol
          }
          Cookies.set('session', JSON.stringify(session), { expires: 1, sameSite: 'strict' })
          router.push('/admin')
        }
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.')
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-6 rounded-lg shadow-md max-w-md mx-auto bg-[#fff8e1] border-2 border-[#d2691e]">
        <h2 className="text-xl font-semibold text-black mb-4 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D2691E] text-white py-2 px-4 rounded-md hover:bg-[#8B4513] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
      {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}
    </div>
  )
}
type LoginClinteType = {
  onCurrentView: (currentViewMain: string) => void
}
export function LoginClinte({onCurrentView}: LoginClinteType){
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    nombre:'',
    ci:''
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }
  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      const res = await fetch('/api/clientes',{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...form,
          action: 'loginCliente'
        }),
      })
      const data = await res.json()
      if (!res.ok){
        setMensaje(data.error || 'Error')
      }else{
        setMensaje(data.message)
        onCurrentView('agenda')
        Cookies.set('session', JSON.stringify({
          type: 'cliente',
          ci: data.cliente.ci
        }), { expires: 1 }) 
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.')
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return(
    <div className="min-h-auto flex items-center justify-center ">
      <div className="p-6 rounded-lg shadow-md max-w-md mx-auto bg-[#fff8e1] border-2 border-[#d2691e]">
        <h2 className="text-xl font-semibold text-black mb-4 text-center">Cuenta de Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-black">Nombre</label>
            <input
              type="nombre"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="ci" className="block text-sm font-medium text-black">CI</label>
            <input
              type="ci"
              id="ci"
              name="ci"
              value={form.ci}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D2691E] text-white py-2 px-4 rounded-md hover:bg-[#8B4513] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        {mensaje && <p className="mt-4 text-center text-green-500">{mensaje}</p>}
      </div>
    </div>
  )
}