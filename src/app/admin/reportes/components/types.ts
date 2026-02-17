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
export type ReportEmpServDetail = {
  fecha_servicio: string
  servicio: string
  monto_servicio: number
}


export interface ReportSummary {
  total_ingresos: number;
  promedio: number;
  cantidad_transacciones: number;
  pago_maximo: number;
  pago_minimo: number;
}
export interface ReportEmpServSummary {
  total_ingresos: number;
  total_servicios: number;
  promedio: number;
  servicio_mas_caro: number;
  servicio_mas_barato: number;
}

export interface ReportData {
  resumen: ReportSummary;
  detalles: ReportDetail[];
}
export interface ReportDataEmpServ {
  resumen: ReportEmpServSummary;
  detalles: ReportEmpServDetail[];
}