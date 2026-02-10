"use client";
import { useEffect, useState } from 'react';
import { DynamicTable, ColumnConfig, ActionButton } from '../components/DynamicTable';
import { customStyles } from '@/styles/colors';
import { Cita } from '@/types/citas';
import Detailcita from './Detailcita';

export default function CitasAdmin() {

  const [allcitas, setAllCitas] = useState<Cita[]>([])
  const [modal, setModal]  = useState("");
  const [detail, setDetail] = useState<Cita>({} as Cita);
  
  const columns: ColumnConfig<Cita>[] = [
    {
      key: 'fecha',
      label: 'Fecha',
      type: 'date',
      sortable: true,
      searchable: true,
    },
    {
      key: 'hora_inicio',
      label: 'Hora_inicio',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'hora_fin',
      label: 'Hora_fin',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'cliente',
      label: 'Cliente',
      type: 'text',
      sortable: true,
      render: (value, row) => `${row.cliente.nombre} ${row.cliente.apellido_paterno}`,
      searchable: true,
    },
    {
      key: 'mascota',
      label: 'Mascota',
      type: 'text',
      sortable: true,
      render: (value, row) => row.mascota.nombre,
      searchable: true,
    },
    {
      key: 'observaciones',
      label: 'Observaciones',
      type: 'text',
      searchable: true,
    },
    {
      key: 'estado',
      label: 'Estado',
      type: 'status',
      sortable: true,
      statusOptions: [
        { value: 'pendiente', label: 'Pendiente', color: '#FACC15' },
        { value: 'confirmado', label: 'Confirmado', color: '#3B82F6 ' },
        { value: 'atendido', label: 'Atendido', color: '#fB923C' },
        { value: 'cancelado', label: 'Cancelado', color: '#DC2626' },
        { value: 'concluido', label: 'Concluido', color: '#16A34A' },
      ],
    },
  ];

  const actions: ActionButton<Cita>[] = [
    {
      label: 'Cancelar',
      onClick: (row) => cambiarEstado(row.id, 'cancelado'),
      variant: 'rojo',
      show: (row) => row.estado === 'confirmado' || row.estado === 'atendido' || row.estado === 'pendiente',
    },
    {
      label: 'Detalles',
      onClick: (row) => detallesEspecificos(row.id),
      variant: 'amarillo',
      show: () => true,
    }
  ];

  async function fetchCitaDetail(id: string) {
    const res = await fetch(`/api/citas/?action=byid&id=${id}`);
    const data = await res.json();
    setDetail(Array.isArray(data) ? data[0] : data);
  }

  async function fetchCitas() {
    try {
      const res = await fetch('/api/citas');
      const data = await res.json();
      console.log('datos detail: ',data)
      setAllCitas(data);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
  }

  const cambiarEstado = async (id: string, nuevoEstado: Cita['estado']) => {
    if (nuevoEstado === 'detalles'){
      setDetail({} as Cita);
      setModal('detalles');
      await fetchCitaDetail(id);
      return;
    }
  };
  const detallesEspecificos = async (id: string) => {
    setDetail({} as Cita);
    await fetchCitaDetail(id);
    setModal('detalles');
  }

  useEffect(() => {
    const loadCitas = async () => {await fetchCitas();}
    loadCitas();
  }, [])

  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] mt-10'>
      <div className='p-6'>
        <div className='mb-8'>
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Gestión de Citas</h1>
          <p className="text-[#D2691E]">Administra las citas de la peluquería canina</p>
        </div>

        <div className={`${customStyles.card.base} rounded-lg p-6`}>
          <div className='flex flex-row justify-between m-2'>
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Lista de Citas</h2>
            <button 
              onClick={fetchCitas} 
              className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
            >
              Refrescar
            </button>

          </div>
          <DynamicTable
            data={allcitas}
            columns={columns}
            actions={actions}
            pageSize={10}
            showSearch={true}
            showPagination={true}
            emptyMessage="No hay citas programadas"
            className="w-full"
          />
        </div>
      </div>
      {modal === 'detalles' && (
        <div className="fixed inset-100 z-50 flex items-center justify-center w-auto">
          <div className= "rounded-lg overflow-y-auto">
            <button className='bg-[#fff8e1] border-2 px-2 border-[#D2691E] rounded-lg hover:bg-[#FFD700]' onClick={() => setModal('')}>X</button>
            <Detailcita
              citaDetail={detail}
              onRefresh={fetchCitas}
            />
          </div>
        </div>
      )}
    </div>
  );
}