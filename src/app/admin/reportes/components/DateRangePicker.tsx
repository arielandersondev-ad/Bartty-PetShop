"use client";
import { useState } from 'react';
import { DateRangePicker as ReactDateRangePicker } from 'react-date-range';
import { customStyles } from '@/styles/colors';
import { type DateRange } from './types';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const ranges = [
    {
      label: 'Últimos 7 días',
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      endDate: new Date()
    },
    {
      label: 'Últimos 30 días',
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date()
    },
    {
      label: 'Este mes',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    },
    {
      label: 'Este año',
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date()
    }
  ];

  const selectionRange = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: 'selection'
  };

  function handleSelect(ranges: any) {
    onDateRangeChange({
      ...dateRange,
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate
    });
    console.log('rango de fechas: ',dateRange)
  }

  function handleQuickSelect(startDate: Date, endDate: Date) {
    onDateRangeChange({
      ...dateRange,
      startDate,
      endDate
    });
    setShowPicker(false);
  }

  return (
    <div className="space-y-4">
      {/* Botones rápidos */}
      <div className="flex flex-wrap gap-2">
        {ranges.map((range, index) => (
          <button
            key={index}
            onClick={() => handleQuickSelect(range.startDate, range.endDate)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange.startDate.toDateString() === range.startDate.toDateString() &&
              dateRange.endDate.toDateString() === range.endDate.toDateString()
                ? `${customStyles.button.primary}`
                : `${customStyles.button.outline}`
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Selector personalizado */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`${customStyles.button.outline} px-4 py-2 rounded-lg font-medium`}
        >
          📅 Rango personalizado
        </button>

        {showPicker && (
          <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-2xl border border-[#D2691E]">
            <ReactDateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
              rangeColors={['#8B4513']}
              className="p-4"
            />
            <div className="p-4 border-t border-[#D2691E] flex justify-end gap-2">
              <button
                onClick={() => setShowPicker(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowPicker(false)}
                className={`${customStyles.button.primary} px-4 py-2 rounded-lg`}
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selección de agrupación */}
      <div className="flex items-center gap-4">
        <span className="text-[#8B4513] font-medium">Agrupar por:</span>
        <div className="flex gap-2">
          {[
            { value: 'dia', label: 'Día' },
            { value: 'mes', label: 'Mes' },
            { value: 'anio', label: 'Año' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onDateRangeChange({ ...dateRange, agrupacion: option.value as any })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                dateRange.agrupacion === option.value
                  ? `${customStyles.button.primary}`
                  : `${customStyles.button.outline}`
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumen del rango seleccionado */}
      <div className={`${customStyles.card.base} p-4 rounded-lg`}>
        <p className="text-sm text-[#D2691E]">
          Rango seleccionado: {dateRange.startDate.toLocaleDateString('es-ES')} - {dateRange.endDate.toLocaleDateString('es-ES')}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Agrupación: {dateRange.agrupacion === 'dia' ? 'Diario' : dateRange.agrupacion === 'mes' ? 'Mensual' : 'Anual'}
        </p>
      </div>
    </div>
  );
}