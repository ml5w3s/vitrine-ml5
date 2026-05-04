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

      // 1. Inserir a Coleta
      const coletaResult = await client.query(
        `INSERT INTO coletas (cliente_id, volume_estimado, id_operacao) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [dto.cliente_id, dto.volume_estimado, dto.id_operacao]
      );

      const newColeta = coletaResult.rows[0];

      // 2. Inserir no Outbox (Mesma Transação)
      const eventPayload = {
        coleta_id: newColeta.id,
        id_operacao: newColeta.id_operacao,
        volume_estimado: newColeta.volume_estimado,
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
