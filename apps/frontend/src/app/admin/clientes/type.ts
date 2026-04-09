export interface ClienteType{
  id:string
  ci:string
  nombre: string
  apellido_paterno:string
  apellido_materno:string
  email:string
  telefono:string
  numero_referido:string
  created_at:string
}
export interface NuevoClienteType{
  ci:string
  nombre: string
  apellido_paterno:string
  apellido_materno:string
  email:string
  telefono:string
  numero_referido:string
}
export interface MascotaType{
  id:string
  cliente_id:string
  nombre:string
  raza:string
  fecha_nacimiento:string
  edad:number
  color:string
  tamano:string
  vacuna_antirrabica:string
  sexo:string
  observaciones:string
  created_at:string
}
export interface NuevaMascotaType{
  cliente_id:string
  nombre:string
  raza:string
  fecha_nacimiento:string
  edad:number
  color:string
  tamano:string
  vacuna_antirrabica:string
  sexo:string
  observaciones:string
}
export interface DetailClientPromp{
  cliente: ClienteType
  mascotas: MascotaType[]
}