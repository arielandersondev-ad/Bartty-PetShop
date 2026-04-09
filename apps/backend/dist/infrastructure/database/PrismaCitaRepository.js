"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCitaRepository = void 0;
const db_1 = require("@peluqueria/db");
class PrismaCitaRepository {
    async findAll() {
        const citas = await db_1.prisma.cita.findMany({
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
    async findById(id) {
        const cita = await db_1.prisma.cita.findUnique({
            where: { id },
            include: {
                mascota: { select: { nombre: true } },
                cliente: { select: { nombre: true, apellidoPaterno: true, ci: true, telefono: true } },
                servicios: { select: { servicio: true, valor: true } },
            }
        });
        if (!cita)
            return null;
        return {
            ...cita,
            servicios: cita.servicios.map(s => ({
                nombre: s.servicio,
                precio: s.valor ? Number(s.valor) : null
            }))
        };
    }
}
exports.PrismaCitaRepository = PrismaCitaRepository;
