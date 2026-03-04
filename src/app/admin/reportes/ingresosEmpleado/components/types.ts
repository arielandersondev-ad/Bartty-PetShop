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
  fecha: string
  fecha_cita:string
  servicio: string
  monto: number
}


export interface ReportSummary {
  total_ingresos: number
  total_servicios: number
  promedio: number
  servicio_mas_caro: number
  servicio_mas_barato: number
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
  empleado:string
  rol:string
  resumen: ReportEmpServSummary;
  detalles: ReportEmpServDetail[];
}
export interface Empleado{
  id: string
  nombre: string
  email: string
  password: string
  rol: string
  activo: string
  created_at: string
  ci: string
  telefono: number
  numero_referido: number
  apellido: string
}
export interface EmpleadoData {
  empleados: Empleado[]
}