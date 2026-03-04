import { useState } from 'react';
import ClientCard from './ClientCard';
import PetCard from './PetCard';

export default function AgendaContent({onFinish}: {onFinish: () => void}) {
  const [clienteId, setClienteId] = useState<string>("");
  const [clienteCreado, setClienteCreado] = useState(false);
  const redirectCliente= () => {
    onFinish()
  }
  return (
    <div className="max-w-6xl mx-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 bg-[#fff8e1] border-2 border-[#d2691e] rounded-3xl p-3" >
        Agenda tu Cita
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientCard
          onCLienteCreado={(id:string, ci: string) => {
            setClienteId(id);
            setClienteCreado(true);
          }}
        />
        <PetCard 
          cliente_id={clienteId}
          disabled={!clienteCreado}
          onMascotaCreada={redirectCliente}
        />
      </div>
    </div>
  );
};
