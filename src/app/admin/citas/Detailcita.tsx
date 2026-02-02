import { Cita } from '@/types/citas';
import { useState } from 'react';
import { Pago } from '@/types';
import Servicio from '../servicio/page';
import Cookies from 'js-cookie';

export default function Detailcita({ citaDetail, onRefresh }: { citaDetail: Cita, onRefresh: () => void }) {
  const [citaUpdate, setCitaUpdate] = useState<Cita>(citaDetail);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loadingPagos, setLoadingPagos] = useState<boolean>(false);

  const sessionCookie = Cookies.get('session');
  const sesion = JSON.parse(sessionCookie || '{}');
  const {rol, nombre, id} = sesion;
  
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCitaUpdate({
      ...citaUpdate,
      [name]: value
    })
  }
  async function fetchpagos() {
    if(!citaDetail.id){return}
    setLoadingPagos(true);
    try {
      const res = await fetch(`/api/pagos?cita_id=${citaDetail.id}`);
      const data = await res.json();
      setPagos(data.pagos);
    } catch (error) {
      setPagos([]);
      console.error('Error fetching pagos:', error);
    } finally {
      setLoadingPagos(false);
    }
  }
  async function confirmarPago(id : string) {
    try {
      const res = await fetch(`/api/pagos/${id}/confirmar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchpagos();
      } else {
        console.error('Error al confirmar pago:', data.error);
      }
    } catch (error) {
      console.error('Error al confirmar pago:', error);
    }
  }
    // calcular total pagado confirmado y saldo
  const totalPagadoConfirmado = pagos
    .filter(p => p.confirmado)
    .reduce((s, p) => s + Number(p.monto || 0), 0);

  // Si tu `Cita` tiene un campo con el total, úsalo aquí; si no, pon 0 o adapta:
  const totalCita = (citaDetail as any).total ?? 0;
  const saldo = Number((totalCita - totalPagadoConfirmado) || 0);


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
  
  if (!citaDetail || !citaDetail.cliente || !citaDetail.mascota) {
    return <div className="p-4 text-center text-[#8B4513]">Cargando detalles...</div>;
  }

  return (
    <div className="flex flex-col bg-[#fff8e1] border-[#D2691E] border-2 rounded-lg p-4 gap-4">
      <form className='m-4' onSubmit={handlerSubmit}>
        <div className='flex flex-row gap-4'>
          <div className='flex flex-col'>
            <label>Dueño</label>
            <input
              className='rounded-lg border border-gray-300 p-2 mb-4'
              type="text"
              value={citaDetail.cliente.nombre + ' ' + citaDetail.cliente.apellido_paterno}
              readOnly
            />
          </div>
          <div className='flex flex-col'>
            <label>Mascota</label>
            <input 
              className='rounded-lg border border-gray-300 p-2 mb-4'
              type="text" 
              value={citaDetail.mascota.nombre || ''}
              readOnly
            />
          </div>
        </div>

        <div className='flex flex-row gap-4'>
          <div className='flex flex-col'>
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
          <div className='flex flex-col'>
            <label>Estado</label>
            <select
              className='rounded-lg border border-gray-300 p-2 mb-4' 
              name='estado'
              value={citaUpdate.estado}
              onChange={handlerChange}
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="atendido">Atendido</option>
              <option value="cancelado">Cancelado</option>
              <option value="concluido">Concluido</option>
            </select>
          </div>
        </div>

        <div className='flex flex-row gap-4 justify-between'>
          <div className='flex flex-col'>
            <label>Fecha</label>
            <input
              className='rounded-lg border border-gray-300 p-2 mb-4' 
              type="date" 
              value={citaDetail.fecha}
              readOnly
            />
          </div>
          <div className='flex flex-col'>
            <label>Hora Inicio</label>
            <input
              className='rounded-lg border border-gray-300 p-2 mb-4' 
              type="time" 
              name='hora_inicio'
              value={citaUpdate.hora_inicio || ''}
              onChange={handlerChange}
            />
          </div>
          <div className='flex flex-col'>
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

        <div className='flex flex-col'>
          <label>Observaciones</label>
          <textarea
            className='rounded-lg border border-gray-300 p-2 mb-4'
            name='observaciones'
            value={citaUpdate.observaciones}
            onChange={handlerChange}
            rows={4}
          />
        </div>

        <button type="submit" className="bg-[#8B4513] text-white p-2 rounded-lg hover:bg-[#824124]">Actualizar</button>
      </form>
      <div className='flex justify-center'>
        <Servicio
          usuario_id={id}
          cita_id={citaDetail.id}
        />
      </div>

        <div className="mb-4">
          {loadingPagos ? (
            <div>Cargando pagos...</div>
          ) : pagos.length === 0 ? (
            <div className="text-sm text-gray-600">No hay pagos registrados</div>
          ) : (
            <ul className="space-y-2">
              {pagos.map(p => (
                <li key={p.id} className="flex justify-between items-center border p-2 rounded">
                  <div>
                    <div className="text-sm">{p.tipo_pago_cita} — {p.tipo_pago}</div>
                    <div className="font-medium">{p.monto.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{p.created_at}</div>
                  </div>
                  <div>
                    {!p.confirmado && (
                      <button onClick={() => confirmarPago(p.id)} className="bg-green-600 text-white px-3 py-1 rounded">Confirmar</button>
                    )}
                    {p.confirmado && <span className="text-sm text-green-600">Confirmado</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {
          /*
        <PagoForm
          citaId={citaDetail.id}
          saldo={saldo}
          onCreated={async () => { await fetchpagos(); onRefresh && onRefresh(); }}
        />
        */  
        }
    </div>
  )
}
