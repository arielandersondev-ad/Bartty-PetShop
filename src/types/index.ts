export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'admin' | 'empleado'
  activo: boolean
  created_at?: string
}

export interface Cliente {
  id: string
  ci: string
  nombre: string
  apellido_paterno: string
  apellido_materno?: string
  email?: string
  telefono: string
  numero_referido?: string
  created_at?: string
}

export interface Mascota {
  id: string
  cliente_id: string
  nombre: string
  raza?: string
  fecha_nacimiento?: string
  edad?: number
  color?: string
  tamano?: string
  vacuna_antirrabica?: boolean
  sexo?: 'M' | 'F'
  observaciones?: string
  created_at?: string
}



export interface Cita {
  id: string
  cliente_id: string
  mascota_id: string
  fecha: string
  hora_inicio: string
  hora_fin?: string
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'atendido' | 'concluido'
  observaciones?: string
  created_at?: string
}

export interface Pago {
  id: string;
  cita_id: string;
  monto: number;
  tipo_pago: 'qr' | 'efectivo';
  tipo_pago_cita: 'adelanto' | 'total';
  confirmado?: boolean;
  created_at?: string;
}

export interface Inventario {
  id: string
  nombre_producto: string
  categoria?: string
  stock_actual: number
  stock_minimo: number
  precio_venta?: number
  created_at?: string
}

export interface MovimientoInventario {
  id: string
  inventario_id: string
  tipo: 'entrada' | 'salida'
  cantidad: number
  motivo?: string
  created_at?: string
}

export interface DatabaseRow<T> {
  id: string
  created_at?: string
  [key: string]: T[keyof T] | string | number | boolean | undefined
}

export interface ApiResponse<T> {
  success: boolean
  data?: T[]
  data_single?: T
  error?: string
  message?: string
  count?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface FilterParams {
  search?: string
  fecha_inicio?: string
  fecha_fin?: string
  estado?: string
  categoria?: string
  cliente_id?: string
  mascota_id?: string
}

export interface UsuarioForm {
  id?: string
  ci: string
  apellido: string
  telefono: string
  numero_referido: string
  nombre: string
  email: string
  password?: string
  rol: 'admin' | 'emp_recepcion' | 'emp_servicio'
  activo: boolean
  created_at?: string
}