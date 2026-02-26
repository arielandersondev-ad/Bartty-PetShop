import React from 'react';
import { Cliente } from '@/types';
interface EditClientProps {
  cliente?: Cliente;
}

export default function EditClient( {cliente}: EditClientProps ) {
  const [form, setForm] = React.useState({
    ci: cliente?.ci || '',
    nombre: cliente?.nombre || '',
    apellido_paterno: cliente?.apellido_paterno || '',
    apellido_materno: cliente?.apellido_materno || '',
    email: cliente?.email || '',
    telefono: cliente?.telefono || '',
    numero_referido: cliente?.numero_referido || ''
  });
  const[loading,setLoading]=React.useState(false);
  const[mensaje,setMensaje]=React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    
    try {
      const res = await fetch('/api/clientes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, id: cliente?.id})
      });
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || 'Error al registrar cliente');
      } else {
        setMensaje('Cliente registrado exitosamente');
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.');
      console.error('Error en handleSubmit:', error);
    }
    setLoading(false);
  }
  return (
    <div className="p-2  bg-amber-50 ">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Datos del Cliente
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* CI + Nombre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              CI
            </label>
            <input
              type="text"
              name="ci"
              value={form.ci}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
            />
          </div>

        </div>

        {/* Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido Paterno
            </label>
            <input
              type="text"
              name="apellido_paterno"
              value={form.apellido_paterno}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido Materno
            </label>
            <input
              type="text"
              name="apellido_materno"
              value={form.apellido_materno}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
            />
          </div>

        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
          />
        </div>

        {/* Teléfonos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              N° Contacto
            </label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              N° Referido
            </label>
            <input
              type="tel"
              name="numero_referido"
              value={form.numero_referido}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition"
            />
          </div>

        </div>

        {/* Botón */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-600 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-amber-700 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrar Cliente"}
          </button>

          {mensaje && (
            <p className="mt-3 text-green-600 font-medium text-center">
              {mensaje}
            </p>
          )}
        </div>

      </form>

    </div>

  );
};
