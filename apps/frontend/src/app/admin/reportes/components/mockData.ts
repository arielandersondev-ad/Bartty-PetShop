import { ReportData, ReportDetail } from './types';

export const mockReportData: ReportData = {
  resumen: {
    total_ingresos: 12500,
    promedio: 250,
    cantidad_transacciones: 50,
    pago_maximo: 800,
    pago_minimo: 50
  },
  detalles: [
    {
      fecha: '2026-01-15',
      cliente: 'Juan Pérez',
      mascota: 'Firulais',
      servicio: 'Corte completo',
      monto: 150,
      tipo_pago: 'qr'
    },
    {
      fecha: '2026-01-16',
      cliente: 'María García',
      mascota: 'Luna',
      servicio: 'Baño y secado',
      monto: 120,
      tipo_pago: 'efectivo'
    },
    {
      fecha: '2026-01-17',
      cliente: 'Carlos López',
      mascota: 'Max',
      servicio: 'Corte + Baño',
      monto: 200,
      tipo_pago: 'qr'
    },
    {
      fecha: '2026-01-18',
      cliente: 'Ana Rodríguez',
      mascota: 'Bella',
      servicio: 'Corte de uñas',
      monto: 50,
      tipo_pago: 'efectivo'
    },
    {
      fecha: '2026-01-19',
      cliente: 'Diego Martínez',
      mascota: 'Rocky',
      servicio: 'Corte completo',
      monto: 180,
      tipo_pago: 'qr'
    },
    {
      fecha: '2026-01-20',
      cliente: 'Laura Sánchez',
      mascota: 'Nina',
      servicio: 'Baño medicinal',
      monto: 250,
      tipo_pago: 'efectivo'
    },
    {
      fecha: '2026-01-21',
      cliente: 'Pedro Torres',
      mascota: 'Thor',
      servicio: 'Corte + Baño + Spa',
      monto: 350,
      tipo_pago: 'qr'
    },
    {
      fecha: '2026-01-22',
      cliente: 'Sofía Castro',
      mascota: 'Coco',
      servicio: 'Corte puppy',
      monto: 100,
      tipo_pago: 'efectivo'
    },
    {
      fecha: '2026-01-23',
      cliente: 'Miguel Ángel',
      mascota: 'Simba',
      servicio: 'Baño y secado',
      monto: 120,
      tipo_pago: 'qr'
    },
    {
      fecha: '2026-01-24',
      cliente: 'Elena Vargas',
      mascota: 'Kiara',
      servicio: 'Corte completo',
      monto: 160,
      tipo_pago: 'efectivo'
    }
  ] as ReportDetail[]
};