"use client";
import { useState, useEffect } from 'react';
import { DynamicTable, ColumnConfig, ActionButton } from '../components/DynamicTable';
import { customStyles } from '@/styles/colors';
import { Cliente } from '@/types';
import { apiService } from '@/lib/api';
import ClientCard from '@/components/ClientCard';
import EditClient from './EditClient';

export default function ClientesAdmin() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal]  = useState("");
  const [cliente, setCliente] = useState<Cliente | undefined>();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch ('/api/clientes');
      const data = await response.json();
      if (response.ok) {
        setClientes(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setCliente(cliente);
    setModal("editClient");
  };

  const handleDelete = async (cliente: Cliente) => {
    if (!cliente.id) return;
    
    try {
      await apiService.deleteCliente(cliente.id);
      await fetchClientes();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar cliente');
    }
  };

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
      label: 'Editar',
      onClick: handleEdit,
      variant: 'azul',
    },
    {
      label: 'Eliminar',
      onClick: handleDelete,
      variant: 'rojo',
    },
  ];

  if (loading) {
    return (
      <div className='text-black min-h-screen bg-[#FFF8E1] mt-10 flex items-center justify-center'>
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-black min-h-screen bg-[#FFF8E1] mt-10 flex items-center justify-center'>
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] mt-10'>
      <div className='p-6'>
        <div className='mb-8'>
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Gestión de Clientes</h1>
          <p className="text-[#D2691E]">Administra los clientes y sus mascotas</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4 md:mb-0">Lista de Clientes</h2>

            {modal === 'nuevo' && (
              <button
                onClick={() => setModal("")}
                className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                Cancelar
              </button>
            )}
            {modal=== '' &&(
              <button
                onClick={() => setModal("nuevo")}
                className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                Agregar Cliente
              </button>
            )}
          </div>
          {modal === "nuevo" && (
            <div className="fixed inset-100 z-50 flex items-center justify-center pt-20" >
              <div className= "p-6 rounded-lg mx-4 max-h-[90vh] overflow-y-auto" >
                  <ClientCard
                    onCLienteCreado={async () => {}}
                  />
              </div>
            </div>
          )}
          {modal === "editClient" && (
            <div className="fixed inset-100 z-50 flex items-center justify-center pt-20" >
              <div className= " flex flex-col p-6 rounded-lg mx-4 max-h-[90vh] overflow-y-auto bg-[#fff8e100]" >
                <EditClient
                  cliente={cliente}
                />
                <button onClick={() => setModal('')} className=" bg-red-500 text-white p-2 rounded-md">Cerrar</button>
              </div>
            </div>
          )}
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
  );
}