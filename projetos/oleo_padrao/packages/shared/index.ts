/**
 * Definições compartilhadas para o ecossistema Óleo Padrão
 */

// --- Domínio de Fornecedores ---

export interface Fornecedor {
  id: string;
  nome_razao_social: string;
  cpf_cnpj: string;
  tipo_fornecedor?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  data_cadastro: Date;
}

export interface CreateFornecedorDTO {
  nome_razao_social: string;
  cpf_cnpj: string;
  tipo_fornecedor?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
}

// --- Domínio de Coletas ---

export type ColetaStatus = 'pendente' | 'finalizada' | 'cancelada';
export type MetodoPagamento = 'PIX' | 'DINHEIRO' | 'CONTRATO';

export interface Coleta {
  id: string;
  id_operacao: string; // Chave de idempotência
  fornecedor_id: string;
  volume_coletado: number;
  valor_a_pagar: number;
  metodo_pagamento: MetodoPagamento;
  
  // PIX
  chave_pix_1?: string;
  tipo_pix_1?: string;
  chave_pix_2?: string;
  tipo_pix_2?: string;

  // Logística/Controle
  numero_inicio?: number;
  numero_fim?: number;
  data_devolucao?: string;
  observacoes?: string;
  cco?: string;
  tem_contrato: boolean;

  status: ColetaStatus;
  criado_at: Date;
  atualizado_at: Date;
}

export interface CreateColetaDTO {
  id_operacao: string;
  fornecedor_id: string;
  volume_coletado: number;
  valor_a_pagar: number;
  metodo_pagamento: MetodoPagamento;
  
  chave_pix_1?: string;
  tipo_pix_1?: string;
  chave_pix_2?: string;
  tipo_pix_2?: string;

  numero_inicio?: number;
  numero_fim?: number;
  data_devolucao?: string;
  observacoes?: string;
  cco?: string;
  tem_contrato: boolean;
}

// --- Domínio de Pagamentos ---

export type PagamentoStatus = 'pendente' | 'confirmado' | 'falha';
export type PagamentoMetodo = 'pix' | 'dinheiro' | 'contrato';

export interface Pagamento {
  id: string;
  coleta_id: string;
  valor: number;
  metodo: PagamentoMetodo;
  comprovante_url?: string;
  status: PagamentoStatus;
  confirmado_at?: Date;
}

export interface CreatePagamentoDTO {
  coleta_id: string;
  valor: number;
  id_operacao: string; // Idempotência também para o pagamento
}

// --- Domínio de Eventos (Outbox) ---

export type EventType = 'coleta_criada' | 'coleta_finalizada' | 'pagamento_confirmado';

export interface OutboxEvent {
  id: string;
  event_type: EventType;
  payload: any;
  status: 'pendente' | 'processado' | 'falha';
  criado_at: Date;
}
