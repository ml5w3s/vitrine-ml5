-- Extensão para UUIDs (opcional, mas recomendado para sistemas distribuídos)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Coletas (Estado Atual)
CREATE TABLE IF NOT EXISTS coletas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_operacao VARCHAR(255) UNIQUE NOT NULL, -- Chave de Idempotência
    cliente_id UUID NOT NULL,
    volume_estimado DECIMAL(10,2),
    volume_coletado DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, finalizada, cancelada
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela Outbox (Eventos para serem publicados)
CREATE TABLE IF NOT EXISTS outbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, processado, falha
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processado_at TIMESTAMP WITH TIME ZONE
);

-- 3. Tabela de Pagamentos (Simulação de Pix)
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coleta_id UUID REFERENCES coletas(id),
    valor DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) DEFAULT 'pix',
    comprovante_url TEXT,
    status VARCHAR(50) DEFAULT 'confirmado',
    confirmado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status) WHERE status = 'pendente';
CREATE INDEX IF NOT EXISTS idx_coletas_id_operacao ON coletas(id_operacao);
