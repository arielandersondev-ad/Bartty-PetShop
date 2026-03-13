'use client';
import React, { useState, useMemo } from 'react';

// Tipos base
export interface ColumnConfig<T = any> {
  key: keyof T | string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'image' | 'status' | 'actions';
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  statusOptions?: { value: string; label: string; color: string }[];
}

export interface ActionButton<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'azul' | 'amarillo' | 'rojo' | 'naranja' | 'verde';
  show?: (row: T) => boolean;
}

export interface DynamicTableProps<T = any> {
  data: T[];
  columns: ColumnConfig<T>[];
  actions?: ActionButton<T>[];
  pageSize?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

// Componente principal
export function DynamicTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  pageSize = 10,
  showPagination = true,
  showSearch = true,
  onRowClick,
  emptyMessage = 'No hay datos disponibles',
  className = '',
}: DynamicTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Función para obtener valor anidado
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  // Filtrado de datos
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Búsqueda por texto
      if (searchTerm) {
        const searchableColumns = columns.filter((col) => col.searchable !== false);
        const matchesSearch = searchableColumns.some((col) => {
          const value = getNestedValue(row, col.key as string);
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (!matchesSearch) return false;
      }

      // Filtro por fecha
      if (dateFilter) {
        const dateColumns = columns.filter((col) => col.type === 'date');
        const matchesDate = dateColumns.some((col) => {
          const value = getNestedValue(row, col.key as string);
          if (!value) return false;
          const rowDate = new Date(value).toISOString().split('T')[0];
          return rowDate === dateFilter;
        });
        if (!matchesDate) return false;
      }

      return true;
    });
  }, [data, searchTerm, dateFilter, columns]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      // Encontrar el tipo de columna
      const column = columns.find((col) => col.key === sortConfig.key);
      const type = column?.type || 'text';

      let comparison = 0;

      if (type === 'number') {
        comparison = (Number(aValue) || 0) - (Number(bValue) || 0);
      } else if (type === 'date') {
        const dateA = aValue ? new Date(aValue).getTime() : 0;
        const dateB = bValue ? new Date(bValue).getTime() : 0;
        comparison = dateA - dateB;
      } else {
        comparison = String(aValue || '')
          .toLowerCase()
          .localeCompare(String(bValue || '').toLowerCase());
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, columns]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Renderizar celda
  const renderCell = (column: ColumnConfig<T>, row: T) => {
    const value = getNestedValue(row, column.key as string);

    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'image':
        return value ? (
          <img
            src={value}
            alt=""
            className="h-12 w-12 object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImg%3C/text%3E%3C/svg%3E';
            }}
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            Sin img
          </div>
        );

      case 'date': {
        const str = typeof value === 'string' ? value : String(value || '')
        // Fecha "plana" sin hora: 2026-03-05
        const isPlainDate = /^\d{4}-\d{2}-\d{2}$/.test(str)
        if (isPlainDate) return str

        // ISO con hora: forzar UTC para no mover el día
        const d = new Date(str)
        if (isNaN(d.getTime())) return '-'
        const fmt = new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          timeZone: 'UTC'
        })
        return fmt.format(d)
      }

      case 'status':
        const statusOption = column.statusOptions?.find(
          (opt) => opt.value === String(value)
        );
        return (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: statusOption?.color || '#e5e7eb',
              color: '#fff',
            }}
          >
            {statusOption?.label || value || '-'}
          </span>
        );

      case 'number':
        return typeof value === 'number' ? value.toLocaleString('es-ES') : value;

      default:
        return value || '-';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Barra de búsqueda y filtros */}
      {showSearch && (
        <div className="mb-4 flex flex-col md:flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 min-w-200 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {columns.some((col) => col.type === 'date') && (
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {(searchTerm || dateFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDateFilter('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key as string)
                  }
                >
                  <div className="flex items-center gap-2" >
                    {column.label}
                    {column.sortable !== false && sortConfig?.key === column.key && (
                      <span className="text-blue-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                  } transition-colors`}
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ width: column.width, maxWidth: column.width }}
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        {actions.map((action, actionIndex) => {
                          const shouldShow = action.show ? action.show(row) : true;
                          if (!shouldShow) return null;

                          const variantStyles = {
                            azul: 'bg-blue-600 hover:bg-blue-700 text-white',
                            amarillo: 'bg-yellow-500 hover:bg-yellow-600 text-white',
                            rojo: 'bg-red-600 hover:bg-red-700 text-white',
                            naranja: 'bg-orange-500 hover:bg-orange-600 text-white',
                            verde: 'bg-green-500 hover:bg_green-600 text-black',
                            neutro: 'bg-gray-500 hover:bg-gray-600 text-white',
                          };

                          return (
                            <button
                              key={actionIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                variantStyles[action.variant || 'neutro']
                              }`}
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {showPagination && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} de{' '}
            {sortedData.length} resultados
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
