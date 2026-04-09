export interface Cita {
  id: string
  fecha: string
  hora_inicio: string | null
  hora_fin: string | null
  estado: string
  tipo_corte?:string
  observaciones: string
  mascota: {nombre: string}
  cliente: {ci:string, telefono:string,nombre: string, apellido_paterno: string}
  servicios: []
}