import { ReportEmpServDetail } from './types';

interface IncomeTableProps {
  data: ReportEmpServDetail[];
}

export function IncomeTable({ data }: IncomeTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `Bs ${amount.toFixed(2)}`;
  };

  const getPaymentIcon = (type: string) => {
    if (type === 'qr') return '📱'
    if (type === 'efectivo') return '💵'
    return '—'
  }

  const getPaymentColor = (type: string ) => {
    if (type === 'qr') return 'text-blue-600 bg-blue-50'
    if (type === 'efectivo') return 'text-green-600 bg-green-50'
    return 'text-black bg-gray-500'
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-[#D2691E]">
            <th className="text-left py-3 px-4 font-semibold text-[#8B4513]">Fecha</th>
            <th className="text-left py-3 px-4 font-semibold text-[#8B4513]">Cliente</th>
            <th className="text-left py-3 px-4 font-semibold text-[#8B4513]">Mascota</th>
            <th className="text-left py-3 px-4 font-semibold text-[#8B4513]">Servicio</th>
            <th className="text-left py-3 px-4 font-semibold text-[#8B4513]">Monto</th>
            <th className="text-left py-3 px-4 font-semibold text-[#8B4513]">Tipo Pago</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={index}
              className={`
                border-b border-[#D2691E] hover:bg-[#FFF8E1] transition-colors
                ${index % 2 === 0 ? 'bg-white' : 'bg-[#FFF8E1] bg-opacity-30'}
              `}
            >
              <td className="py-3 px-4 text-sm text-gray-700">
                {formatDate(item.fecha)}
              </td>
              <td className="py-3 px-4 font-medium text-gray-900">
                {item.servicio}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {item.monto_servicio}
              </td>
            </tr>
          ))}
        </tbody>
        {data.length > 0 && (
          <tfoot>
            <tr className="bg-[#8B4513] text-white">
              <td colSpan={4} className="py-3 px-4 font-bold text-right">
                Total:
              </td>
              <td className="py-3 px-4 font-bold text-lg">
                {formatCurrency(data.reduce((sum, item) => sum + item.monto_servicio, 0))}
              </td>
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📭</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No hay transacciones en el rango seleccionado
          </h3>
          <p className="text-sm text-gray-500">
            Intenta seleccionando un rango de fechas diferente
          </p>
        </div>
      )}
    </div>
  );
}