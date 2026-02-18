import React, { useEffect, useState } from 'react';
import { Pago } from '@/types';

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
  const [pagos, setPagos] = useState<Pago[]>([])
  const [totalPagado, setTotalPagado] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingPagoId, setPendingPagoId] = useState<string | null>(null)

  useEffect(() => {
    if (tipoPagoCita === 'total') {
      if (typeof saldo === 'number') {
      } else {
        setMonto('');
      }
    } else {
      setMonto('');
    }
    fetchPagosId(citaId)
    fetchTotalPagos(citaId)
  }, [tipoPagoCita, saldo, citaId]);

const validate = () => {
  setError(null)
  const parsed = Number(monto)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    setError('Monto inválido (debe ser mayor a 0).')
    return false
  }
  if (typeof saldo !== 'number') {
    setError('Saldo inválido.')
    return false
  }
  return true
}

  async function fetchPagosId(id:string) {
    try {
      const res = await fetch(`/api/pagos?cita_id=${id}`)
      const data = await res.json()
      // API might return either an array or an object like { pagos: [] }
      setPagos(data?.pagos ?? data ?? [])
    } catch (error) {
      console.error('Error enfetchPagosId: ', error)
      setPagos([])
    }
  }
  async function fetchTotalPagos(id:string){
    try {
      const res = await fetch(`/api/pagos?id_cita_pago=${id}`)
      const data = await res.json()
      setTotalPagado(data.total_pagado)
    } catch (error) {
      console.error('Error fetchTotalPagos: ',error)
    }
  }

  const handlePagoSelected = (pagoId: string) => {
    setPendingPagoId(pagoId)
    setShowConfirmModal(true)
  }

  const handleConfirmPago = async () => {
    if (!pendingPagoId) return
    try {
      await fetch(`/api/pagos?id_pago=${pendingPagoId}`,{
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'}
      })
      setShowConfirmModal(false)
      setPendingPagoId(null)
    } catch (error) {
      console.error('error: ', error)
      setShowConfirmModal(false)
      setPendingPagoId(null)
    } finally {
      fetchPagosId(citaId)
      fetchTotalPagos(citaId)
    }
  }

  const handleCancelModal = () => {
    setShowConfirmModal(false)
    setPendingPagoId(null)
  }

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

      const data = await res.json()

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
      fetchTotalPagos(citaId)
      fetchPagosId(citaId)
    }
  };

  return (
    <>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-[90%] max-w-sm border border-[#D2691E]">
            <h2 className="text-lg font-bold text-[#8B4513] mb-3">
              Confirmar eliminación
            </h2>

            <p className="text-gray-600 mb-6 text-sm">
              ¿Deseas eliminar este pago?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelModal}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmPago}
                className="px-4 py-2 text-sm rounded-lg bg-[#8B4513] text-white hover:bg-[#824124]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#fff8e1] space-y-5">
        <div className="flex justify-between items-center bg-white border border-[#D2691E] rounded-lg px-4 py-3 shadow-sm">
          <div>
            <p className="text-xs text-gray-500">Saldo restante</p>
            <p className="text-lg font-bold text-[#8B4513]">
              Bs {(saldo - totalPagado).toFixed(2)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Pagado</p>
            <p className="font-medium text-gray-700">
              Bs {totalPagado.toFixed(2)}
            </p>
          </div>
        </div>


        <div>
          <div className="my-2">
            {pagos.length === 0 ? (
              <div>No hay pagos</div>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {pagos.map(p => (
                  <li
                    key={p.id}
                    onClick={() => handlePagoSelected(p.id)}
                    className="cursor-pointer px-3 py-2 bg-white border border-[#D2691E] rounded-lg shadow-sm hover:bg-[#FFF3CD] transition-all"
                  >
                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                      {p.tipo_pago}
                    </div>
                    <div className="text-sm font-semibold text-[#8B4513]">
                      Bs {p.monto.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>

            )}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
            <div>
              <label className="block text-sm font-medium text-black">Tipo de pago</label>
              <select
                value={tipoPago}
                onChange={(e) => setTipoPago(e.target.value as TipoPago)}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E] focus:border-[#D2691E]"
              >
                <option value="qr">QR</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Pago como</label>
              <select
                value={tipoPagoCita}
                onChange={(e) => setTipoPagoCita(e.target.value as TipoPagoCita)}
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E] focus:border-[#D2691E]" 
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
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2691E] focus:border-[#D2691E]"
                placeholder="0.00"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <div className="flex gap-2 justify-between mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                loading
                  ? 'bg-gray-400'
                  : 'bg-[#8B4513] hover:bg-[#824124]'
              } text-white`}
            >
              {loading ? 'Guardando...' : 'Registrar Pago'}
            </button>
            <button
              type="button"
              className="w-full py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}