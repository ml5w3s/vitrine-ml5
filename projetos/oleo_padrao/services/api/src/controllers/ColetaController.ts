import { FastifyRequest, FastifyReply } from 'fastify';
import { ColetaService } from '../services/ColetaService.js';
import { CreateColetaDTO } from '@oleo/shared';

export class ColetaController {
  private service: ColetaService;

  constructor() {
    this.service = new ColetaService();
  }

  async handleCreate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const dto = request.body as CreateColetaDTO;
      
      if (!dto.id_operacao || !dto.cliente_id || !dto.volume_estimado) {
        return reply.status(400).send({ error: 'Campos obrigatórios ausentes' });
      }

      const coleta = await this.service.registrarColeta(dto);
      return reply.status(201).send(coleta);
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Erro interno ao processar coleta' });
    }
  }
}
