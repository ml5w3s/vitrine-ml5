import { db } from '../infra/database.js';
import { CreateFornecedorDTO, Fornecedor } from '@oleo/shared';

export class FornecedorRepository {
  async listAll(): Promise<Fornecedor[]> {
    const result = await db.query('SELECT * FROM fornecedores ORDER BY nome_razao_social ASC');
    return result.rows;
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Fornecedor | null> {
    const result = await db.query('SELECT * FROM fornecedores WHERE cpf_cnpj = $1', [cpfCnpj]);
    return result.rows[0] || null;
  }

  async create(dto: CreateFornecedorDTO): Promise<Fornecedor> {
    const query = `
      INSERT INTO fornecedores (
        nome_razao_social, cpf_cnpj, tipo_fornecedor, email, endereco, cidade, cep
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      dto.nome_razao_social,
      dto.cpf_cnpj,
      dto.tipo_fornecedor || null,
      dto.email || null,
      dto.endereco || null,
      dto.cidade || null,
      dto.cep || null
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }
}
