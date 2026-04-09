import { ICitaRepository } from '../../domain/citas/ICitaRepository';
import { CitaWithRelations } from '../../domain/citas/Cita';
import { prisma } from '@peluqueria/db';

export class PrismaCitaRepository implements ICitaRepository {
  async findAll(): Promise<CitaWithRelations[]> {
    const citas = await prisma.cita.findMany({
      include: {
        mascota: { select: { nombre: true } },
        cliente: { select: { nombre: true, apellidoPaterno: true, ci: true, telefono: true } },
        servicios: { select: { servicio: true, valor: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return citas.map(c => ({
      ...c,
      servicios: c.servicios.map(s => ({
        nombre: s.servicio,
        precio: s.valor ? Number(s.valor) : null
      }))
    }));
  }

  async findById(id: string): Promise<CitaWithRelations | null> {
    const cita = await prisma.cita.findUnique({
      where: { id },
      include: {
        mascota: { select: { nombre: true } },
        cliente: { select: { nombre: true, apellidoPaterno: true, ci: true, telefono: true } },
        servicios: { select: { servicio: true, valor: true } },
      }
    });

    if (!cita) return null;

    return {
      ...cita,
      servicios: cita.servicios.map(s => ({
        nombre: s.servicio,
        precio: s.valor ? Number(s.valor) : null
      }))
    };
  }
}
