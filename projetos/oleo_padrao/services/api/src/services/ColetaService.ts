import { ColetaRepository } from '../repositories/ColetaRepository.js';
import { CreateColetaDTO, Coleta } from '@oleo/shared';

export class ColetaService {
  private repository: ColetaRepository;

  constructor() {
    this.repository = new ColetaRepository();
  }

  async registrarColeta(dto: CreateColetaDTO): Promise<Coleta> {
    // 1. Validação de Idempotência
    const coletaExistente = await this.repository.findByIdOperacao(dto.id_operacao);
    
    if (coletaExistente) {
      console.log(`[Idempotency] Coleta já processada: ${dto.id_operacao}`);
      return coletaExistente;
    }

    // 2. Criação da Coleta + Evento Outbox
    return await this.repository.createWithOutbox(dto);
  }
}
