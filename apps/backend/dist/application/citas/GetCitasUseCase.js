"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCitasUseCase = void 0;
class GetCitasUseCase {
    citaRepository;
    constructor(citaRepository) {
        this.citaRepository = citaRepository;
    }
    async execute() {
        return this.citaRepository.findAll();
    }
}
exports.GetCitasUseCase = GetCitasUseCase;
