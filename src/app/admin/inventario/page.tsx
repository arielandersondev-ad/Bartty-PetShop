"use client";
import { useState } from 'react';
import { DynamicTable, ColumnConfig, ActionButton } from '../components/DynamicTable';
import { customStyles } from '@/styles/colors';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  categoria: string;
}

export default function InventarioAdmin() {
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: 'Shampoo para Perros',
      descripcion: 'Shampoo suave para baño de mascotas',
      stock: 50,
      precio: 25,
      categoria: 'Higiene',
    },
    {
      id: 2,
      nombre: 'Cepillo para Pelo',
      descripcion: 'Cepillo especial para perros',
      stock: 30,
      precio: 15,
      categoria: 'Accesorios',
    },
    {
      id: 3,
      nombre: 'Cortauñas',
      descripcion: 'Cortauñas profesional para mascotas',
      stock: 15,
      precio: 35,
      categoria: 'Herramientas',
    },
    {
      id: 4,
      nombre: 'Juguetes Masticables',
      descripcion: 'Juguetes seguros para morder',
      stock: 100,
      precio: 8,
      categoria: 'Juguetes',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (producto: Producto) => {
    console.log('Editar producto:', producto);
  };

  const handleDelete = (producto: Producto) => {
    setProductos(productos.filter(p => p.id !== producto.id));
  };

  const columns: ColumnConfig<Producto>[] = [
    {
      key: 'id',
      label: 'ID',
      type: 'number',
      sortable: true,
      width: '80px',
    },
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      type: 'text',
      searchable: true,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      type: 'text',
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <span className="px-2 py-1 bg-[#D2691E] text-white text-xs rounded-full">
          {value}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      type: 'number',
      sortable: true,
      render: (value: number) => (
        <span className={`font-medium ${
          value > 20 ? 'text-green-600' : 
          value > 10 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'precio',
      label: 'Precio',
      type: 'number',
      sortable: true,
      render: (value: number) => `Bs ${value.toFixed(2)}`,
    },
  ];

  const actions: ActionButton<Producto>[] = [
    {
      label: 'Editar',
      onClick: handleEdit,
      variant: 'primary',
    },
    {
      label: 'Eliminar',
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] mt-10'>
      <div className='p-6'>
        <div className='mb-8'>
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Inventario</h1>
          <p className="text-[#D2691E]">Administra los productos y existencias</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4 md:mb-0">
              {showAddForm ? 'Agregar Nuevo Producto' : 'Lista de Productos'}
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
            >
              {showAddForm ? 'Ver Lista' : 'Agregar Producto'}
            </button>
          </div>

          {showAddForm ? (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Nombre del producto" 
                className={`px-4 py-2 rounded-lg ${customStyles.input.base}`}
              />
              <input 
                type="text" 
                placeholder="Descripción" 
                className={`px-4 py-2 rounded-lg ${customStyles.input.base}`}
              />
              <select className={`px-4 py-2 rounded-lg ${customStyles.input.base}`}>
                <option value="">Seleccionar categoría</option>
                <option value="Higiene">Higiene</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Juguetes">Juguetes</option>
                <option value="Alimentos">Alimentos</option>
              </select>
              <input 
                type="number" 
                placeholder="Stock" 
                className={`px-4 py-2 rounded-lg ${customStyles.input.base}`}
              />
              <input 
                type="number" 
                placeholder="Precio" 
                step="0.01"
                className={`px-4 py-2 rounded-lg ${customStyles.input.base}`}
              />
              <div className="md:col-span-2 flex gap-3">
                <button 
                  type="submit" 
                  className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
                >
                  Agregar Producto
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`${customStyles.button.outline} px-6 py-2 rounded-lg font-medium transition-colors`}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <DynamicTable
              data={productos}
              columns={columns}
              actions={actions}
              pageSize={10}
              showSearch={true}
              showPagination={true}
              emptyMessage="No hay productos en el inventario"
              className="w-full"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Total Productos</h3>
            <p className="text-3xl font-bold text-[#D2691E]">{productos.length}</p>
          </div>
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Valor Total</h3>
            <p className="text-3xl font-bold text-[#D2691E]">
              Bs {productos.reduce((sum, p) => sum + (p.precio * p.stock), 0).toFixed(2)}
            </p>
          </div>
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Stock Bajo</h3>
            <p className="text-3xl font-bold text-red-600">
              {productos.filter(p => p.stock < 10).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}