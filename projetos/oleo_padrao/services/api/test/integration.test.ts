import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = 'http://localhost:3333/v1';

describe('Integração MR. OLUC - Fluxo de Coleta', () => {
  let fornecedorId: string;
  const idOperacao = `MR-TEST-V-${Date.now()}`;

  // Nota: Assume-se que a API e o Docker estão rodando, conforme roadmap
  // Em um ambiente de CI real, poderíamos subir os containers aqui.

  it('deve criar um novo fornecedor', async () => {
    const response = await fetch(`${API_BASE}/fornecedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_razao_social: "Sampaio Vitest",
        cpf_cnpj: `123.${Date.now().toString().slice(-8)}`,
        email: "vitest@sampaio.com"
      })
    });

    const data = await response.json() as any;
    
    if (response.status === 409) {
        // Se já existir, listamos para pegar o ID
        const listRes = await fetch(`${API_BASE}/fornecedores`);
        const listData = await listRes.json() as any[];
        fornecedorId = listData[0].id;
    } else {
        expect(response.status).toBe(201);
        fornecedorId = data.id;
    }
    
    expect(fornecedorId).toBeDefined();
  });

  it('deve registrar uma coleta rica com Outbox Pattern', async () => {
    const payload = {
        id_operacao: idOperacao,
        fornecedor_id: fornecedorId,
        volume_coletado: 120.5,
        valor_a_pagar: 241.0,
        metodo_pagamento: "PIX",
        chave_pix_1: "vitest@pix.com",
        tipo_pix_1: "EMAIL",
        tem_contrato: false,
        cco: "CCO-VITEST"
    };

    const response = await fetch(`${API_BASE}/coletas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json() as any;
    
    expect(response.status).toBe(201);
    expect(data.id_operacao).toBe(idOperacao);
  });

  it('deve garantir idempotência (retornar a mesma coleta se repetido)', async () => {
    const payload = {
        id_operacao: idOperacao, // Mesmo ID da coleta anterior
        fornecedor_id: fornecedorId,
        volume_coletado: 120.5,
        valor_a_pagar: 241.0,
        metodo_pagamento: "PIX",
        chave_pix_1: "vitest@pix.com",
        tipo_pix_1: "EMAIL",
        tem_contrato: false,
        cco: "CCO-VITEST"
    };

    const response = await fetch(`${API_BASE}/coletas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json() as any;
    
    // Na implementação atual, o service retorna a coleta existente (sucesso idempotente)
    expect(response.status).toBeLessThan(300);
    expect(data.id_operacao).toBe(idOperacao);
  });
});
