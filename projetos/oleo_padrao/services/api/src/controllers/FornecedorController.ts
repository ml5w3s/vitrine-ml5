import { FastifyRequest, FastifyReply } from 'fastify';
import { FornecedorRepository } from '../repositories/FornecedorRepository.js';
import { CreateFornecedorDTO } from '@oleo/shared';

export class FornecedorController {
  private repository: FornecedorRepository;

  constructor() {
    this.repository = new FornecedorRepository();
  }

  async handleList(request: FastifyRequest, reply: FastifyReply) {
    try {
      const fornecedores = await this.repository.listAll();
      return reply.send(fornecedores);
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Erro ao listar fornecedores' });
    }
  }

  async handleCreate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const dto = request.body as CreateFornecedorDTO;

      if (!dto.nome_razao_social || !dto.cpf_cnpj) {
        return reply.status(400).send({ error: 'Nome e CPF/CNPJ são obrigatórios' });
      }

      // Verificar duplicidade
      const existente = await this.repository.findByCpfCnpj(dto.cpf_cnpj);
      if (existente) {
        return reply.status(409).send({ error: 'Fornecedor já cadastrado com este CPF/CNPJ' });
      }

      const fornecedor = await this.repository.create(dto);
      return reply.status(201).send(fornecedor);
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Erro ao criar fornecedor' });
    }
  }
}
