export interface DateRange {
  startDate: Date;
  endDate: Date;
  agrupacion: 'dia' | 'mes' | 'anio';
}

export type ReportDetail = {
  fecha: string
  cliente: string
  mascota: string
  servicios: string
  monto_total: number
  total_pagado: number
  saldo: number
  tipo_pago: string
}

export interface ReportSummary {
  total_ingresos: number;
  promedio: number;
  cantidad_transacciones: number;
  pago_maximo: number;
  pago_minimo: number;
}

export interface ReportData {
  resumen: ReportSummary;
  detalles: ReportDetail[];
}