import { Cita } from '@/types/citas';
import { useEffect, useState } from 'react';
import Servicio from '../servicio/page';
import Cookies from 'js-cookie';
import PagoForm from '../components/PagoForm';
import { WhatsAppButton } from '../whatsappButton/WhatsAppButton';

export default function Detailcita({ citaDetail, onRefresh }: { citaDetail: Cita, onRefresh: () => void }) {
  const [citaUpdate, setCitaUpdate] = useState<Cita>(citaDetail);
  const sessionCookie = Cookies.get('session');
  const sesion = JSON.parse(sessionCookie || '{}');
  const {rol, id} = sesion;
  const [totalCita, setTotalCita] = useState(0)
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCitaUpdate({
      ...citaUpdate,
      [name]: value
    })
  }

  async function updateCita(params: Cita) {
    try {
      await fetch('/api/citas', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });  
      onRefresh();
    } catch (error) {
      console.error('Error en updateCita: ',error)      
    }
  }
  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCita({...citaUpdate, id: citaDetail.id});
  }
  async function TotalCita(id:string){
    try {
      const res = await fetch(`/api/recepcion?id=${id}`)
      const data = await res.json()      
      setTotalCita(data[0].total_cita)
    } catch (error) {
      console.error('Error en TotalCita: ',error)
    }
  } 
  useEffect(() => {
    const loadTotal= async ()=>{TotalCita(citaDetail.id)}
    loadTotal()
  }, [citaDetail.id])
  
  if (!citaDetail || !citaDetail.cliente || !citaDetail.mascota) {
    return <div className="p-4 text-center text-[#8B4513]">Cargando detalles...</div>;
  }

  return (
    <div className="flex flex-col bg-[#fff8e1] gap-4">
      <form
        className="p-5 space-y-6"
        onSubmit={handlerSubmit}
      >
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Dueño */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Dueño
            </label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
              type="text"
              value={citaDetail.cliente.nombre + ' ' + citaDetail.cliente.apellido_paterno}
              readOnly
            />
          </div>

          {/* CI */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              CI
            </label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
              type="text"
              value={citaDetail.cliente.ci}
              readOnly
            />
          </div>

          {/* Mascota */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Mascota
            </label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
              type="text"
              value={citaDetail.mascota.nombre || ''}
              readOnly
            />
          </div>

          {/* Estado */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Estado
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
              name="estado"
              value={citaUpdate.estado}
              onChange={handlerChange}
            >
              <option value="pendiente">Pendiente</option>
              {(rol === 'admin' || rol === 'emp_recepcion') && (
                <option value="confirmado">Confirmado</option>
              )}
              {(rol === 'admin' || rol === 'emp_servicio') && (
                <option value="atendido">Atendido</option>
              )}
              {(rol === 'admin' || rol === 'emp_recepcion') && (
                <option value="cancelado" className='bg-red-500 text-white'>Cancelado</option>
              )}
              {(rol === 'admin' || rol === 'emp_recepcion') && (
                <option value="concluido">Concluido</option>
              )}
            </select>
          </div>
        </div>

        {/* Detalles de cita */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Corte */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Tipo de corte
            </label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
              name="estilo_corte"
              value={citaUpdate.tipo_corte || ''}
              onChange={handlerChange}
            >
              <option value="">Seleccionar corte</option>
              <option value="pelado">Pelado</option>
              <option value="corte_normal">Corte Normal</option>
              <option value="baño">Baño</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Fecha
            </label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
              type="date"
              value={citaDetail.fecha}
              readOnly
            />
          </div>

          {/* Hora Inicio */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Hora inicio
            </label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
              type="time"
              name="hora_inicio"
              value={citaUpdate.hora_inicio || ''}
              onChange={handlerChange}
            />
          </div>

          {/* Hora Fin */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Hora fin
            </label>
            <input
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
              type="time"
              name="hora_fin"
              value={citaUpdate.hora_fin || ''}
              onChange={handlerChange}
            />
          </div>
        </div>

        {/* Observaciones */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500 mb-1">
            Observaciones
          </label>
          <textarea
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E]"
            name="observaciones"
            value={citaUpdate.observaciones}
            onChange={handlerChange}
            rows={1}
          />
        </div>

        {/* Botón */}
        <div className="mt-2">
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-sm font-medium bg-[#8B4513] text-white hover:bg-[#824124] transition-all"
          >
            Actualizar cita
          </button>
        </div>
      </form>

      <div className='border-2 border-[#8B4513]'></div>
      <div className='flex flex-col md:flex-row justify-center gap-3'>
        <Servicio
          usuario_id={id}
          cita_id={citaDetail.id}
          rol={rol}
        />
        <div className='flex flex-row md:flex-col gap-2'>
          <div>
            <WhatsAppButton
              phone={`591${citaDetail.cliente.telefono}`}
              message={`Hola ${citaDetail.cliente.nombre}
              
              Tu cita está confirmada.
              
              - Fecha: ${citaDetail.fecha}
              - Mascota: ${citaDetail.mascota.nombre}
              - Total: Bs 10
              `}
            />
          </div>
        </div>
      </div>
      {(rol === "admin" || rol === 'emp_recepcion') && (
        <>
          <div className='border-2 border-[#8B4513]'></div>
          <PagoForm
            citaId={citaDetail.id}
            saldo={totalCita}
          />  
        </>
      )}
    </div>
  )
}
