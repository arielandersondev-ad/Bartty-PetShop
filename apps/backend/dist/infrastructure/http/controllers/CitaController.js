"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitaController = void 0;
const GetCitasUseCase_1 = require("../../../application/citas/GetCitasUseCase");
const PrismaCitaRepository_1 = require("../../database/PrismaCitaRepository");
const citaRepository = new PrismaCitaRepository_1.PrismaCitaRepository();
const getCitasUseCase = new GetCitasUseCase_1.GetCitasUseCase(citaRepository);
class CitaController {
    async getAll(req, res) {
        try {
            const citas = await getCitasUseCase.execute();
            // Mapeo a snake_case para mantener compatibilidad con el frontend actual
            const response = citas.map(c => ({
                id: c.id,
                cliente_id: c.clienteId,
                mascota_id: c.mascotaId,
                fecha: c.fecha.toISOString().split('T')[0],
                hora_inicio: c.horaInicio?.toISOString().split('T')[1].split('.')[0] ?? null,
                hora_fin: c.horaFin?.toISOString().split('T')[1].split('.')[0] ?? null,
                estado: c.estado,
                observaciones: c.observaciones ?? null,
                estilo_corte: c.estiloCorte ?? null,
                created_at: c.createdAt,
                mascota: c.mascota ? { nombre: c.mascota.nombre } : undefined,
                cliente: c.cliente ? {
                    nombre: c.cliente.nombre,
                    apellido_paterno: c.cliente.apellidoPaterno ?? null,
                    ci: c.cliente.ci,
                    telefono: c.cliente.telefono
                } : undefined,
                servicios: c.servicios
            }));
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.CitaController = CitaController;
