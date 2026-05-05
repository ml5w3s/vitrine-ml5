import { db } from '../infra/database.js';
import { CreateColetaDTO, Coleta } from '@oleo/shared';

export class ColetaRepository {
  async findByIdOperacao(idOperacao: string): Promise<Coleta | null> {
    const result = await db.query(
      'SELECT * FROM coletas WHERE id_operacao = $1',
      [idOperacao]
    );
    return result.rows[0] || null;
  }

  async createWithOutbox(dto: CreateColetaDTO): Promise<Coleta> {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 1. Inserir a Coleta com todos os novos campos
      const query = `
        INSERT INTO coletas (
          id_operacao, fornecedor_id, volume_coletado, valor_a_pagar, metodo_pagamento,
          chave_pix_1, tipo_pix_1, chave_pix_2, tipo_pix_2,
          numero_inicio, numero_fim, data_devolucao, observacoes, cco, tem_contrato, status
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING *
      `;

      const values = [
        dto.id_operacao,
        dto.fornecedor_id,
        dto.volume_coletado,
        dto.valor_a_pagar,
        dto.metodo_pagamento,
        dto.chave_pix_1 || null,
        dto.tipo_pix_1 || null,
        dto.chave_pix_2 || null,
        dto.tipo_pix_2 || null,
        dto.numero_inicio || null,
        dto.numero_fim || null,
        dto.data_devolucao || null,
        dto.observacoes || null,
        dto.cco || null,
        dto.tem_contrato,
        'pendente'
      ];

      const coletaResult = await client.query(query, values);
      const newColeta = coletaResult.rows[0];

      // 2. Inserir no Outbox (Mesma Transação) - Payload enriquecido
      const eventPayload = {
        coleta_id: newColeta.id,
        id_operacao: newColeta.id_operacao,
        fornecedor_id: newColeta.fornecedor_id,
        volume_coletado: newColeta.volume_coletado,
        valor_a_pagar: newColeta.valor_a_pagar,
        metodo_pagamento: newColeta.metodo_pagamento
      };

      await client.query(
        `INSERT INTO outbox (event_type, payload) 
         VALUES ($1, $2)`,
        ['coleta_criada', JSON.stringify(eventPayload)]
      );

      await client.query('COMMIT');
      return newColeta;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
