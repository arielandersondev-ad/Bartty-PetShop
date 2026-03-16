export interface Cita {
  id: string
  cliente_id: string
  mascota_id: string
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  estado: string
  estilo_corte?:string
  observaciones: string
  mascota: {nombre: string}
  cliente: {ci:string, telefono:string,nombre: string, apellido_paterno: string}
  servicios: []
  comprobante?: string | null
}