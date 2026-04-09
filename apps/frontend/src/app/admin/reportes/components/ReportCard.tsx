import { customStyles } from '@/styles/colors';

interface ReportCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ReportCard({ title, description, icon, onClick, disabled = false }: ReportCardProps) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        ${customStyles.card.base} 
        ${!disabled ? customStyles.card.hover : ''} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-lg p-6 transition-all duration-300
      `}
    >
      <div className="flex items-start space-x-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#8B4513] mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {!disabled && (
            <div className="mt-4">
              <span className="text-sm font-medium text-[#D2691E] hover:text-[#8B4513] transition-colors">
                Generar reporte →
              </span>
            </div>
          )}
          {disabled && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-400">
                Próximamente
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}