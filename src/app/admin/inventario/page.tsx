"use client";
import { useEffect, useState } from 'react';
import { DynamicTable, ColumnConfig, ActionButton } from '../components/DynamicTable';
import { customStyles } from '@/styles/colors';
import CategoriaModal from './CategoriaModal';
import UnidadMedidaModal from './UnidadMedidaModal';
import ProductoModal from './ProductoModal';
import InventarioModal from './InventarioModal';
import { InventarioProducto } from './type';


export default function InventarioAdmin() {
  const [modal, setModal] = useState<string>("");
  const [productos, setProductos] = useState<InventarioProducto[]>([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const [idInventarioForDetails, setIdInventarioForDetails] = useState<string>("");

  const handleSendDetaills = async (value: string) => {
    console.log("value: ",value)
    setIdInventarioForDetails(value);
    setModal('inventario');
  }
  const handleDelete = async () => {
    console.log('Eliminar producto:', selectedId);
    if (!selectedId) return
    try {
      const res = await fetch(`/api/inventario?id=${selectedId}`, {
        method: 'DELETE',
      })
      console.log("res: ",res)
      if (res.ok) {
        setModal('');
        setSelectedId('');
        refreshProductos();
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const columns: ColumnConfig<InventarioProducto>[] = [
    {
      key: 'producto.nombre',
      label: 'Nombre',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'producto.unidadMedida.nombre',
      label: 'Medida',
      type: 'text',
      sortable: true,
      searchable: true,
      render: (value, row) => row.producto.unidadMedida.nombre +' '+ row.producto.unidadMedida.valor + ' '+ row.producto.unidadMedida.unidad,
    },
    {
      key: 'producto.tipo',
      label: 'Tipo',
      type: 'text',
      searchable: true,
    },
    {
      key: 'producto.categoria.nombre',
      label: 'Categoría',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'producto.precioCompra',
      label: 'Precio Compra',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'producto.precioVenta',
      label: 'Precio Venta',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'producto.unidadMinimaVenta',
      label: 'Unidad Mínima Venta',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'producto.stockMinimo',
      label: 'Stock Mínimo',
      type: 'text',
      sortable: true,
      searchable: true,
    },

        {
      key: 'producto.estado',
      label: 'Estado',
      type: 'status',
      sortable: true,
      statusOptions: [
        { value: 'true', label: 'Activo', color: '#16A34A' },
        { value: 'false', label: 'Inactivo', color: '#DC2626' },
      ],
    },
  ];

  const actions: ActionButton<InventarioProducto>[] = [

    {
      label: 'Eliminar',
      onClick: (row) => {setModal('ConfirmarEliminar'); setSelectedId(row?.id || '')},
      variant: 'rojo',
    },
    {
      label: 'Detalles',
      onClick: (row) => {handleSendDetaills(row.id || '')},
      variant: 'azul',
    },
  ];

  const refreshProductos = async () => {
    const res = await fetch('/api/inventario?action=getAllDataInventario')
    const data = await res.json()
    if (res.ok) setProductos(data.data)
  }
  useEffect(() => {
    refreshProductos()
  }, [])
  const valorTotalInventariadoVenta = productos.reduce((total, producto) => total + producto.producto.precioVenta * producto.cantidad, 0).toFixed(2)
  const valorTotalInventariadoCompra = productos.reduce((total, producto) => total + producto.producto.precioCompra * producto.cantidad, 0).toFixed(2)
  const productosBajoStock = productos.filter(producto => producto.cantidad < producto.producto.stockMinimo)
  const productosActivos = productos.filter(producto => producto.producto.estado)
  const ganancias = (parseFloat(valorTotalInventariadoVenta) - parseFloat(valorTotalInventariadoCompra)).toFixed(2)
  return (
    <div className='text-black min-h-screen bg-[#FFF8E1] mt-10 overflow-x-hidden'>
      <div className='p-6'>
        <div className='mb-8'>
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">Inventario</h1>
          <p className="text-[#D2691E]">Administra los productos y existencias</p>
        </div>

        <div className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-[#8B4513] mb-4 md:mb-0">
              Inventario
            </h2>
            <div className='flex flex-col md:flex-row gap-4'>
              <button
                onClick={() => setModal("categoria")}
                className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                Categoria
              </button>
              <button
                onClick={() => setModal("unidad-medida")}
                className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                Unidad de Medida
              </button>
              <button
                onClick={() => setModal("producto")}
                className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                Producto
              </button>
              <button
                onClick={() => setModal("inventario")}
                className={`${customStyles.button.primary} px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                Inventario
              </button>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Total Productos Inventariados</h3>
            <p className="text-3xl font-bold text-[#D2691E]">{productos.length}</p>
          </div>
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Valor de Compra Total</h3>
            <p className="text-3xl font-bold text-[#D2691E]">
              {valorTotalInventariadoCompra}
            </p>
          </div>
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Valor de Venta Total</h3>
            <p className="text-3xl font-bold text-[#D2691E]">
              {valorTotalInventariadoVenta}
            </p>
          </div>
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Ganancia Total</h3>
            <p className="text-3xl font-bold text-[#D2691E]">
              {ganancias}
            </p>
          </div>
          <div className={`${customStyles.card.base} rounded-lg p-4`}>
            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Productos en Bajo Stock</h3>
            <p className="text-3xl font-bold text-red-600">
              {productos.filter(producto => producto.producto.stockMinimo > producto.cantidad).length}
            </p>
          </div>
        </div>
      </div>
      {modal === "categoria" && (
        <CategoriaModal
          onClose={() => setModal("")}
        />
      )}
      {modal === "unidad-medida" && (
        <UnidadMedidaModal
          onClose={() => setModal("")}
        />
      )}
      {modal === "producto" && (
        <div className=''>
          <ProductoModal
            onClose={() => setModal("")}
          />
        </div>
      )}
      {modal === "inventario" && (
        <InventarioModal
          onClose={() => setModal("")}
          onRefresh={() => refreshProductos()}
          inventario= {idInventarioForDetails}
        />
      )}
      {modal === "ConfirmarEliminar" && (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-auto ">
          <p className="text-lg font-bold">
            ¿Estás seguro de eliminar el inventario seleccionado?
          </p>
          <div className='flex flex-col md:flex-row gap-3 justify-end'>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => handleDelete()}
            >Sí</button>
            <button 
              className="px-4 py-2 bg-green-200 text-green-800 rounded-md hover:bg-green-300"
              onClick={() => setModal("")}
            >Cancelar</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
