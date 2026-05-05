-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_razao_social VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
    tipo_fornecedor VARCHAR(50),
    email VARCHAR(255),
    endereco TEXT,
    cidade VARCHAR(100),
    cep VARCHAR(10),
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Coletas (Alinhada com MR. OLUC)
CREATE TABLE IF NOT EXISTS coletas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_operacao VARCHAR(255) UNIQUE NOT NULL, -- Idempotência
    fornecedor_id UUID NOT NULL REFERENCES fornecedores(id),
    volume_coletado DECIMAL(10,2) NOT NULL,
    valor_a_pagar DECIMAL(10,2) NOT NULL,
    metodo_pagamento VARCHAR(20) NOT NULL, -- PIX, DINHEIRO, CONTRATO
    
    -- Dados de PIX
    chave_pix_1 VARCHAR(255),
    tipo_pix_1 VARCHAR(50),
    chave_pix_2 VARCHAR(255),
    tipo_pix_2 VARCHAR(50),

    -- Logística e Controle
    numero_inicio INTEGER,
    numero_fim INTEGER,
    data_devolucao DATE,
    observacoes TEXT,
    cco VARCHAR(100),
    tem_contrato BOOLEAN DEFAULT FALSE,

    status VARCHAR(50) DEFAULT 'pendente', -- pendente, finalizada, cancelada
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    atualizado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela Outbox (Eventos)
CREATE TABLE IF NOT EXISTS outbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(255) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    criado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processado_at TIMESTAMP WITH TIME ZONE
);

-- 4. Tabela de Pagamentos (Registro de liquidação)
CREATE TABLE IF NOT EXISTS pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coleta_id UUID REFERENCES coletas(id),
    valor DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    comprovante_url TEXT,
    status VARCHAR(50) DEFAULT 'confirmado',
    confirmado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox(status) WHERE status = 'pendente';
CREATE INDEX IF NOT EXISTS idx_coletas_id_operacao ON coletas(id_operacao);
CREATE INDEX IF NOT EXISTS idx_coletas_fornecedor ON coletas(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_fornecedores_cpf_cnpj ON fornecedores(cpf_cnpj);
