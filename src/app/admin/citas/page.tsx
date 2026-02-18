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
    <div className='text-black bg-[#FFF8E1] mt-4 md:mt-10 overflow-x-hidden'>
      <div className='px-4 md:px-6 py-4 md:py-6'>

        <div className='mb-8'>
          <h1 className="text-2xl md:text-3xl font-bold text-[#8B4513] mb-1">Gestión de Citas</h1>
          <p className="text-sm md:text-base text-[#D2691E]">Administra las citas de la peluquería canina</p>
        </div>

        <div className={`${customStyles.card.base} rounded-xl p-4 md:p-6`}>
          <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Lista de Citas</h2>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          
          <div className="bg-[#fff8e1] 
                          w-[90vw] 
                          md:w-[34vw] 
                          max-h-[90vh] 
                          overflow-y-auto 
                          rounded-xl 
                          shadow-2xl 
                          border-2 
                          border-[#D2691E] 
                          p-6 
                          relative">

            <button
              className="absolute top-3 right-3 bg-white border border-[#D2691E] px-3 py-1 rounded-lg hover:bg-[#FFD700]"
              onClick={() => setModal('')}
            >
              ✕
            </button>

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