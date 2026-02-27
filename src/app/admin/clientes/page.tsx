"use client";
import { useState, useEffect } from 'react';
import { DynamicTable, ColumnConfig, ActionButton } from '../components/DynamicTable';
import { customStyles } from '@/styles/colors';
import { Cliente } from '@/types';
import DetailClient from './DetailClient';

export default function ClientesAdmin() {
  const [ clientes, setClientes ] = useState<Cliente[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ clienteID, setClienteId ] = useState<string>('')

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

  const handleDetallesCliente = (cliente: Cliente) => {
    if (!cliente.id) return
    setClienteId(cliente.id)
    console.log(cliente.id)
    console.log('el estado anterior es: ',clienteID)
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
    </div>
  );
}