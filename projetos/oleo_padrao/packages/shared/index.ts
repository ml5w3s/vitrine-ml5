/**
 * Definições compartilhadas para o ecossistema Óleo Padrão
 */

// --- Domínio de Coletas ---

export type ColetaStatus = 'pendente' | 'finalizada' | 'cancelada';

export interface Coleta {
  id: string;
  id_operacao: string; // Chave de idempotência
  cliente_id: string;
  volume_estimado: number;
  volume_coletado?: number;
  status: ColetaStatus;
  criado_at: Date;
  atualizado_at: Date;
}

export interface CreateColetaDTO {
  id_operacao: string;
  cliente_id: string;
  volume_estimado: number;
}

// --- Domínio de Pagamentos ---

export type PagamentoStatus = 'pendente' | 'confirmado' | 'falha';
export type PagamentoMetodo = 'pix';

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
