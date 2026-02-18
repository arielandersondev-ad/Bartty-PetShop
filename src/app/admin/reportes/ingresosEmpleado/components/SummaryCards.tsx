import { customStyles } from '@/styles/colors';
import { type ReportSummary } from './types';

interface SummaryCardsProps {
  summary: ReportSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Ingresos',
      value: `Bs ${(summary.total_ingresos ?? 0).toFixed(2)}`,
      icon: '💰',
      color: 'text-green-600'
    },
    {
      title: 'Promedio por Transacción',
      value: `Bs ${(summary.promedio ?? 0).toFixed(2)}`,
      icon: '📊',
      color: 'text-blue-600'
    },
    {
      title: 'Cantidad de Servicios',
      value: summary.total_servicios.toString(),
      icon: '🔢',
      color: 'text-purple-600'
    },
    {
      title: 'Servicio mas Caro',
      value: summary.servicio_mas_caro.toString(),
      icon: '🔢',
      color: 'text-purple-400'
    },
    {
      title: 'Servicio mas Barato',
      value: summary.servicio_mas_barato.toString(),
      icon: '🔢',
      color: 'text-purple-200'
    },
  ];

  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-between gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${customStyles.card.base} ${customStyles.card.hover} rounded-lg p-6 transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#8B4513]">{card.title}</h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className={`text-3xl font-bold ${card.color} mb-2`}>{card.value}</p>
          <div className="h-1 bg-[#8B4513] rounded-full"></div>
        </div>
      ))}
    </div>
  );
}