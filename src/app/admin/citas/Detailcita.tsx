import { Cita } from '@/types/citas';
import { useEffect, useState } from 'react';
import Servicio from '../servicio/page';
import Cookies from 'js-cookie';
import PagoForm from '../components/PagoForm';

export default function Detailcita({ citaDetail, onRefresh }: { citaDetail: Cita, onRefresh: () => void }) {
  const [citaUpdate, setCitaUpdate] = useState<Cita>(citaDetail);

  const sessionCookie = Cookies.get('session');
  const sesion = JSON.parse(sessionCookie || '{}');
  const {rol, nombre, id} = sesion;
  const [totalCita, setTotalCita] = useState(0)
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCitaUpdate({
      ...citaUpdate,
      [name]: value
    })
  }


  async function updateCita(params: Cita) {
    const response = await fetch('/api/citas', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const data = await response.json();
    onRefresh();
    console.log('Respuesta de actualización:', data);
  }

  const handlerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario : ', citaUpdate);
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
    <div className="flex flex-col bg-[#fff8e1] border-[#D2691E] border-2 rounded-lg p-4 gap-4">
      <form className='m-4' onSubmit={handlerSubmit}>
        <div className='flex flex-row gap-3'>
          <div className='flex flex-col w-1/3'>
            <label>Dueño</label>
            <input
              className='rounded-lg border border-gray-300 p-2 mb-4'
              type="text"
              value={citaDetail.cliente.nombre + ' ' + citaDetail.cliente.apellido_paterno}
              readOnly
            />
          </div>
          <div className='flex flex-col w-1/3'>
            <label>Mascota</label>
            <input 
              className='rounded-lg border border-gray-300 p-2 mb-4'
              type="text" 
              value={citaDetail.mascota.nombre || ''}
              readOnly
            />
          </div>
          <div className='flex flex-col w-1/3'>
            <label>Estado</label>
            <select
              className='rounded-lg border border-gray-300 p-2 mb-4' 
              name='estado'
              value={citaUpdate.estado}
              onChange={handlerChange}
            >
              <option value="pendiente">Pendiente</option>
              {rol === 'admin' || rol === 'emp_recepcion' && (
                <option value="confirmado">Confirmado</option>
              )}
              {rol === 'admin' || rol === 'emp_servicio' && (
                <option value="atendido">Atendido</option>
              )}
              {rol === 'admin' || rol === 'emp_recepcion' && (
                <option value="cancelado">Cancelado</option>
              )}
              {rol === 'admin' || rol === 'emp_recepcion' && (
                <option value="concluido">Concluido</option>
              )}
            </select>
          </div>
        </div>
        <div className='flex flex-row gap-4 justify-between'>
          <div className='flex flex-col w-1/4'>
            <label>Corte</label>
            <select
              className='rounded-lg border border-gray-300 p-2 mb-4'
              name='estilo_corte'
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
          <div className='flex flex-col w-1/4'>
            <label>Fecha</label>
            <input
              className='rounded-lg border border-gray-300 p-2 mb-4' 
              type="date" 
              value={citaDetail.fecha}
              readOnly
            />
          </div>
          <div className='flex flex-col w-1/4'>
            <label>Hora Inicio</label>
            <input
              className='rounded-lg border border-gray-300 p-2 mb-4' 
              type="time" 
              name='hora_inicio'
              value={citaUpdate.hora_inicio || ''}
              onChange={handlerChange}
            />
          </div>
          <div className='flex flex-col w-1/4'>
            <label>Hora Fin</label>
            <input
              className='rounded-lg border border-gray-300 p-2 mb-4' 
              type="time" 
              name='hora_fin'
              value={citaUpdate.hora_fin || ''}
              onChange={handlerChange}
            />
          </div>
        </div>

        <div className='flex flex-col w-4/4'>
          <label>Observaciones</label>
          <textarea
            className='rounded-lg border border-gray-300 p-2 mb-4'
            name='observaciones'
            value={citaUpdate.observaciones}
            onChange={handlerChange}
            rows={2}
          />
        </div>

        <button type="submit" className="bg-[#8B4513] text-white p-2 rounded-lg hover:bg-[#824124]">Actualizar</button>
      </form>

      <div className='flex justify-center'>
        <Servicio
          usuario_id={id}
          cita_id={citaDetail.id}
          rol={rol}
        />
      </div>
      {(rol === "admin" || rol === 'emp_recepcion') && (
      <PagoForm
        citaId={citaDetail.id}
        saldo={totalCita}
      />  
      )}
    </div>
  )
}
