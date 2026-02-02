import React, { useEffect, useState } from 'react';

type TipoPago = 'qr' | 'efectivo';
type TipoPagoCita = 'adelanto' | 'total';

interface PagoFormProps {
  citaId: string;
  saldo: number; // saldo restante a pagar (total_cita - pagado_confirmado)
  onCreated?: () => void;
}

export default function PagoForm({ citaId, saldo, onCreated }: PagoFormProps) {
  const [monto, setMonto] = useState<string>('');
  const [tipoPago, setTipoPago] = useState<TipoPago>('qr');
  const [tipoPagoCita, setTipoPagoCita] = useState<TipoPagoCita>('adelanto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Si el usuario elige "total", prefill el monto con el saldo y bloquea edición
  useEffect(() => {
    if (tipoPagoCita === 'total') {
      if (typeof saldo === 'number') {
        setMonto(Number(saldo).toFixed(2));
      } else {
        setMonto('');
      }
    } else {
      setMonto(''); // limpiar para adelanto
    }
  }, [tipoPagoCita, saldo]);

  const validate = () => {
    setError(null);
    const parsed = parseFloat(monto);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Monto inválido (debe ser mayor a 0).');
      return false;
    }
    if (tipoPagoCita === 'adelanto' && typeof saldo === 'number' && parsed > saldo) {
      setError('El adelanto no puede ser mayor al saldo.');
      return false;
    }
    if (tipoPagoCita === 'total' && typeof saldo === 'number' && Math.abs(parsed - saldo) > 0.009) {
      setError('Para "Total" el monto debe coincidir con el saldo.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        cita_id: citaId,
        monto: Number(parseFloat(monto).toFixed(2)),
        tipo_pago: tipoPago,
        tipo_pago_cita: tipoPagoCita
      };

      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await (res.headers.get('content-length') === '0' ? Promise.resolve(null) : res.json().catch(() => null));

      if (!res.ok) {
        setError(data?.error || 'Error al crear el pago.');
      } else {
        setSuccess('Pago registrado correctamente.');
        setMonto(tipoPagoCita === 'total' ? Number(saldo).toFixed(2) : '');
        if (onCreated) onCreated();
      }
    } catch (err) {
      setError('Error de red al crear el pago.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fff8e1] border-2 border-[#D2691E] rounded-lg p-4">
      <h3 className="text-lg font-semibold text-[#8B4513] mb-3">Registrar Pago</h3>

      <div className="mb-2 text-sm text-gray-700">
        <div>Total restante: <span className="font-medium">{typeof saldo === 'number' ? saldo.toFixed(2) : 'N/D'}</span></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
          <div>
            <label className="block text-sm font-medium text-black">Tipo de pago</label>
            <select
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value as TipoPago)}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md"
            >
              <option value="qr">QR</option>
              <option value="efectivo">Efectivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Tipo de pago en la cita</label>
            <select
              value={tipoPagoCita}
              onChange={(e) => setTipoPagoCita(e.target.value as TipoPagoCita)}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md"
            >
              <option value="adelanto">Adelanto</option>
              <option value="total">Total</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Monto</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              disabled={tipoPagoCita === 'total' && typeof saldo === 'number'}
              className="mt-1 block w-full px-3 py-2 bg-amber-500 border border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-[#8B4513] hover:bg-[#824124]'}`}
          >
            {loading ? 'Guardando...' : 'Registrar Pago'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMonto('');
              setTipoPago('qr');
              setTipoPagoCita('adelanto');
              setError(null);
              setSuccess(null);
            }}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}