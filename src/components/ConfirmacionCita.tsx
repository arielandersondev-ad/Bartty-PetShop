
export default function ConfirmacionCita() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
      <h2 className="text-xl font-semibold text-center mb-4">Confirmación de Cita</h2>
      <p className="text-gray-700 mb-4 text-center">
        La cita requiere un adelanto de 10 Bs. Escanea el código QR para realizar el pago.
      </p>
      <div className="flex justify-center mb-4">
        <img src="/image/qr.png" alt="Código QR para pago" className="w-32 h-32" />
      </div>
      <div className="flex justify-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Cerrar
        </button>
      </div>
      </div>
  );
}
