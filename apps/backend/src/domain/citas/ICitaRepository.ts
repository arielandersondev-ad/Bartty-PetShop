import { CitaWithRelations } from './Cita';

export interface ICitaRepository {
  findAll(): Promise<CitaWithRelations[]>;
  findById(id: string): Promise<CitaWithRelations | null>;
}
