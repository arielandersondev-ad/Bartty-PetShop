import React from 'react';
import { DynamicTable, ColumnConfig, ActionButton } from './DynamicTable';

// ============================================
// EJEMPLO 1: INVENTARIO
// ============================================

interface InventoryItem {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
  imagen?: string;
  fechaIngreso: string;
}

export function InventoryTableExample() {
  const inventoryData: InventoryItem[] = [
    {
      id: 1,
      nombre: 'Laptop Dell XPS 15',
      categoria: 'Electrónica',
      cantidad: 5,
      precio: 1299.99,
      imagen: 'https://picsum.photos/seed/laptop/200',
      fechaIngreso: '2024-01-15',
    },
    {
      id: 2,
      nombre: 'Mouse Logitech MX Master',
      categoria: 'Accesorios',
      cantidad: 15,
      precio: 89.99,
      imagen: 'https://picsum.photos/seed/mouse/200',
      fechaIngreso: '2024-02-10',
    },
    {
      id: 3,
      nombre: 'Teclado Mecánico',
      categoria: 'Accesorios',
      cantidad: 8,
      precio: 149.99,
      fechaIngreso: '2024-03-05',
    },
    {
      id: 4,
      nombre: 'Monitor Samsung 27"',
      categoria: 'Electrónica',
      cantidad: 3,
      precio: 299.99,
      imagen: 'https://picsum.photos/seed/monitor/200',
      fechaIngreso: '2024-01-20',
    },
  ];

  const inventoryColumns: ColumnConfig<InventoryItem>[] = [
    {
      key: 'imagen',
      label: 'Imagen',
      type: 'image',
      sortable: false,
      searchable: false,
      width: '100px',
    },
    {
      key: 'nombre',
      label: 'Producto',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'cantidad',
      label: 'Stock',
      type: 'number',
      sortable: true,
      render: (value) => (
        <span
          className={`font-semibold ${
            value < 5 ? 'text-red-600' : value < 10 ? 'text-yellow-600' : 'text-green-600'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'precio',
      label: 'Precio',
      type: 'number',
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'fechaIngreso',
      label: 'Fecha Ingreso',
      type: 'date',
      sortable: true,
    },
  ];

  const inventoryActions: ActionButton<InventoryItem>[] = [
    {
      label: 'Editar',
      icon: '✏️',
      variant: 'primary',
      onClick: (row) => {
        console.log('Editando producto:', row);
        alert(`Editando: ${row.nombre}`);
      },
    },
    {
      label: 'Eliminar',
      icon: '🗑️',
      variant: 'danger',
      onClick: (row) => {
        if (confirm(`¿Eliminar ${row.nombre}?`)) {
          console.log('Eliminando producto:', row);
        }
      },
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventario de Productos</h2>
      <DynamicTable
        data={inventoryData}
        columns={inventoryColumns}
        actions={inventoryActions}
        pageSize={5}
        showPagination={true}
        showSearch={true}
        emptyMessage="No hay productos en el inventario"
      />
    </div>
  );
}

// ============================================
// EJEMPLO 2: CITAS MÉDICAS
// ============================================

interface Appointment {
  id: number;
  paciente: string;
  doctor: string;
  fecha: string;
  hora: string;
  tipo: string;
  estado: 'activo' | 'terminado' | 'observacion';
  notas?: string;
}

export function AppointmentsTableExample() {
  const appointmentsData: Appointment[] = [
    {
      id: 1,
      paciente: 'Juan Pérez',
      doctor: 'Dra. María González',
      fecha: '2024-04-15',
      hora: '09:00',
      tipo: 'Consulta General',
      estado: 'activo',
      notas: 'Primera consulta',
    },
    {
      id: 2,
      paciente: 'Ana Martínez',
      doctor: 'Dr. Carlos Ruiz',
      fecha: '2024-04-15',
      hora: '10:30',
      tipo: 'Control',
      estado: 'terminado',
    },
    {
      id: 3,
      paciente: 'Pedro López',
      doctor: 'Dra. María González',
      fecha: '2024-04-16',
      hora: '11:00',
      tipo: 'Emergencia',
      estado: 'observacion',
      notas: 'Requiere seguimiento',
    },
    {
      id: 4,
      paciente: 'Laura Sánchez',
      doctor: 'Dr. José Morales',
      fecha: '2024-04-16',
      hora: '14:00',
      tipo: 'Especialidad',
      estado: 'activo',
    },
    {
      id: 5,
      paciente: 'Miguel Torres',
      doctor: 'Dra. María González',
      fecha: '2024-04-17',
      hora: '09:30',
      tipo: 'Consulta General',
      estado: 'terminado',
    },
  ];

  const appointmentColumns: ColumnConfig<Appointment>[] = [
    {
      key: 'paciente',
      label: 'Paciente',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'doctor',
      label: 'Doctor',
      type: 'text',
      sortable: true,
      searchable: true,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      type: 'date',
      sortable: true,
    },
    {
      key: 'hora',
      label: 'Hora',
      type: 'text',
      sortable: true,
      width: '100px',
    },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'text',
      sortable: true,
    },
    {
      key: 'estado',
      label: 'Estado',
      type: 'status',
      sortable: true,
      statusOptions: [
        { value: 'activo', label: 'Activo', color: '#10b981' },
        { value: 'terminado', label: 'Terminado', color: '#6b7280' },
        { value: 'observacion', label: 'En Observación', color: '#f59e0b' },
      ],
    },
    {
      key: 'notas',
      label: 'Notas',
      type: 'text',
      sortable: false,
      render: (value) => (
        <span className="text-gray-600 italic text-sm">
          {value || 'Sin notas'}
        </span>
      ),
    },
  ];

  const appointmentActions: ActionButton<Appointment>[] = [
    {
      label: 'Ver',
      icon: '👁️',
      variant: 'secondary',
      onClick: (row) => {
        console.log('Viendo cita:', row);
        alert(`Cita de ${row.paciente} - ${row.estado}`);
      },
    },
    {
      label: 'Editar',
      icon: '✏️',
      variant: 'primary',
      onClick: (row) => {
        console.log('Editando cita:', row);
        alert(`Editando cita de ${row.paciente}`);
      },
      show: (row) => row.estado !== 'terminado', // Solo mostrar si no está terminada
    },
    {
      label: 'Cancelar',
      icon: '❌',
      variant: 'danger',
      onClick: (row) => {
        if (confirm(`¿Cancelar cita de ${row.paciente}?`)) {
          console.log('Cancelando cita:', row);
        }
      },
      show: (row) => row.estado === 'activo', // Solo mostrar para citas activas
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Citas Médicas</h2>
      <DynamicTable
        data={appointmentsData}
        columns={appointmentColumns}
        actions={appointmentActions}
        pageSize={10}
        showPagination={true}
        showSearch={true}
        onRowClick={(row) => console.log('Click en cita:', row)}
        emptyMessage="No hay citas programadas"
      />
    </div>
  );
}

// ============================================
// EJEMPLO 3: SIN IMÁGENES (Solo datos)
// ============================================

interface Product {
  codigo: string;
  descripcion: string;
  stock: number;
  precioCompra: number;
  precioVenta: number;
  proveedor: string;
}

export function SimpleProductTable() {
  const products: Product[] = [
    {
      codigo: 'P001',
      descripcion: 'Producto A',
      stock: 100,
      precioCompra: 10.5,
      precioVenta: 15.99,
      proveedor: 'Proveedor ABC',
    },
    {
      codigo: 'P002',
      descripcion: 'Producto B',
      stock: 50,
      precioCompra: 20.0,
      precioVenta: 29.99,
      proveedor: 'Proveedor XYZ',
    },
  ];

  const columns: ColumnConfig<Product>[] = [
    { key: 'codigo', label: 'Código', sortable: true },
    { key: 'descripcion', label: 'Descripción', sortable: true, searchable: true },
    { key: 'stock', label: 'Stock', type: 'number', sortable: true },
    {
      key: 'precioCompra',
      label: 'P. Compra',
      type: 'number',
      render: (val) => `$${val.toFixed(2)}`,
    },
    {
      key: 'precioVenta',
      label: 'P. Venta',
      type: 'number',
      render: (val) => `$${val.toFixed(2)}`,
    },
    { key: 'proveedor', label: 'Proveedor', sortable: true },
  ];

  const actions: ActionButton<Product>[] = [
    {
      label: 'Editar',
      onClick: (row) => alert(`Editar: ${row.codigo}`),
    },
    {
      label: 'Eliminar',
      variant: 'danger',
      onClick: (row) => confirm(`¿Eliminar ${row.codigo}?`),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Productos (Sin Imágenes)</h2>
      <DynamicTable data={products} columns={columns} actions={actions} />
    </div>
  );
}

// ============================================
// COMPONENTE DEMO CON TODOS LOS EJEMPLOS
// ============================================

export default function DemoApp() {
  const [currentExample, setCurrentExample] = React.useState<
    'inventory' | 'appointments' | 'simple'
  >('inventory');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Componente de Tabla Dinámica - Ejemplos
        </h1>

        {/* Selector de ejemplos */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentExample('inventory')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentExample === 'inventory'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setCurrentExample('appointments')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentExample === 'appointments'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Citas Médicas
          </button>
          <button
            onClick={() => setCurrentExample('simple')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentExample === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Tabla Simple
          </button>
        </div>

        {/* Renderizar ejemplo seleccionado */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentExample === 'inventory' && <InventoryTableExample />}
          {currentExample === 'appointments' && <AppointmentsTableExample />}
          {currentExample === 'simple' && <SimpleProductTable />}
        </div>
      </div>
    </div>
  );
}
