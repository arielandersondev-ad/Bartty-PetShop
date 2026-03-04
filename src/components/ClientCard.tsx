import React from 'react';
type ClientForm = {
  onCLienteCreado: (clienteId: string, ci: string) => void;
};
export default function ClientCard({ onCLienteCreado }: ClientForm) {
  const [form, setForm] = React.useState({
    ci: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    telefono: '',
    numero_referido: ''
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || 'Error al registrar cliente');
      } else {
        onCLienteCreado(data.data_single.id, data.data_single.ci);
        setMensaje('Cliente registrado exitosamente');
      }
    } catch (error) {
      setMensaje('Error de conexión. Intenta de nuevo.');
      console.error('Error en handleSubmit:', error);
    }
    setLoading(false);
  }
  return (
    <div className=" p-2 bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl" >
      <h2 className="text-xl font-semibold text-black  mb-4">Datos del Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div className='flex flex-col md:flex-row gap-2'>
          <div>
            <label className="block text-sm font-medium text-black ">CI</label>
            <input
              type="text"
              id="ci"
              name="ci"
              value={form.ci}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black ">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
              required
            />
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-2'>
          <div>
            <label className="block text-sm font-medium text-black">Apellido Paterno</label>
            <input
              type="text"
              id="apellido_paterno"
              name="apellido_paterno"
              value={form.apellido_paterno}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Apellido Materno</label>
            <input
              type="text"
              id="apellido_materno"
              name="apellido_materno"
              value={form.apellido_materno}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
              required
            />
          </div>
        </div>
        <div >
          <label className="block text-sm font-medium text-black">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
              value={form.email}
              onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
            required
          />
        </div>
        <div className='flex flex-col md:flex-row gap-2'>
          <div>
            <label className="block text-sm font-medium text-black">N° Contacto</label>
            <input
              type="phone"
              id="telefono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">N° Referido</label>
            <input
              type="phone"
              id="numero_referido"
              name="numero_referido"
              value={form.numero_referido}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white"
            />
          </div>
        </div>
        <div>
          <button
            disabled={loading}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrar Cliente'}
          </button>
          {mensaje && <p className="mt-2 text-green-600 font-medium">{mensaje}</p>} 
        </div>
      </form>
    </div>
  );
};
