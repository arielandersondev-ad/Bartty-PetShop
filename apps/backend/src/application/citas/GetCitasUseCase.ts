import { ICitaRepository } from '../../domain/citas/ICitaRepository';

export class GetCitasUseCase {
  constructor(private citaRepository: ICitaRepository) {}

  async execute() {
    return this.citaRepository.findAll();
  }
}
