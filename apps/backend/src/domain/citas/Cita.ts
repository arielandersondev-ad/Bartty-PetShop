export interface Cita {
  id: string;
  clienteId: string;
  mascotaId: string;
  fecha: Date;
  horaInicio?: Date | null;
  horaFin?: Date | null;
  estado: string;
  observaciones?: string | null;
  estiloCorte?: string | null;
  createdAt: Date;
}

export interface CitaWithRelations extends Cita {
  cliente?: { nombre: string; apellidoPaterno: string | null; ci: string; telefono: string };
  mascota?: { nombre: string };
  servicios?: { nombre: string | null; precio: number | null }[];
}
