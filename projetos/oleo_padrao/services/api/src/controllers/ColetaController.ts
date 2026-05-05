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
      
      const requiredFields = [
        'id_operacao', 
        'fornecedor_id', 
        'volume_coletado', 
        'valor_a_pagar', 
        'metodo_pagamento'
      ];

      for (const field of requiredFields) {
        if (dto[field as keyof CreateColetaDTO] === undefined || dto[field as keyof CreateColetaDTO] === null) {
          return reply.status(400).send({ error: `Campo obrigatório ausente: ${field}` });
        }
      }

      const coleta = await this.service.registrarColeta(dto);
      return reply.status(201).send(coleta);
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Erro interno ao processar coleta' });
    }
  }
}
