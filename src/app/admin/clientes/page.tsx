"use client";
import { useState, useEffect } from 'react';
import { DynamicTable, ColumnConfig, ActionButton } from '../components/DynamicTable';
import { customStyles } from '@/styles/colors';
import { Cliente } from '@/types';
import DetailClient from './DetailClient';
import NuevaCita from '@/components/citas/NuevaCita';
import { Mascota } from '@prisma/client';

export default function ClientesAdmin() {
  const [ clientes, setClientes ] = useState<Cliente[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ clienteID, setClienteId ] = useState<string>('')
  const [ modal, setModal ] = useState<string>('')
  const [ mascotas, setMascotas ] = useState<Mascota[]>([])

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch ('/api/clientes');
      const data = await response.json();
      if (response.ok) {
        console.log("data: ",data)
        console.log("data tratada: ",data.data)
        setClientes(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };
  const fetchMascotas = async (id_cliente: string) => {
    try {
      const response = await fetch (`/api/mascotas?cliente_id=${id_cliente}`);
      const data = await response.json();
      if (response.ok) return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mascotas');
    } finally {
    }
  }
  const handleDetallesCliente = (cliente: Cliente) => {
    if (!cliente.id) return
    setClienteId(cliente.id)
  }
  const handleCitaCliente = async (cliente: Cliente) => {
    if (!cliente.id) return
    const mascotasCliente = await fetchMascotas(cliente.id);
    setMascotas(mascotasCliente)
    setClienteId(cliente.id)
    setModal('cita')
  }

  const columns: ColumnConfig<Cliente>[] = [
    {
      key: 'ci',
      label: 'CI',
      type: 'text',
      sortable: true,
      width: '120px',
    },
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'apellido_paterno',
      label: 'Apellido Paterno',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'apellido_materno',
      label: 'Apellido Materno',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'numero_referido',
      label: 'Referido',
      type: 'text',
      searchable: true,
    },
  ];

  const actions: ActionButton<Cliente>[] = [

    {
      label: 'Detalles',
      onClick: handleDetallesCliente,
      variant: 'amarillo',
    },
    {
      label: 'Cita',
      onClick: handleCitaCliente,
      variant: 'azul',
    },
  ];

  if (loading) {
    return (
      <div className='text-black min-h-screen bg-[#FFF8E1] mt-10 flex items-center justify-center overflow-x-hidden'>
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-black min-h-screen bg-[#FFF8E1] mt-10 flex items-center justify-center overflow-x-hidden'>
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] mt-10 overflow-x-hidden'>
      <div className='p-6'>
        <div className='mb-8'>
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Gestión de Clientes</h1>
          <p className="text-[#D2691E]">Administra los clientes y sus mascotas</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4 md:mb-0">Lista de Clientes</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 '>
            {(clienteID !== '') && (
              <div className=''>
                <DetailClient
                  id_cliente={clienteID}
                  onSuccess={fetchClientes}
                />
              </div>
            )}
            <div className='col-span-3'>
              <DynamicTable
                data={clientes}
                columns={columns}
                actions={actions}
                pageSize={10}
                showSearch={true}
                showPagination={true}
                emptyMessage="No hay clientes registrados"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      {modal === 'cita' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[90vw] md:w-[34vw] max-h-[90vh] overflow-y-auto relative rounded-xl">
            <button
              className="absolute top-2 right-2 text-2xl text-[#D2691E] hover:text-[#8B4513] focus:outline-none"
              onClick={() => setModal('')}
            >
              &times;
            </button>
            <div className='mt-5'>
              <NuevaCita
                clienteId={clienteID}
                mascotas={mascotas}
                onRefresh={() => setModal('')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}