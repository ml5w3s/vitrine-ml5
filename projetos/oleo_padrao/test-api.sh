#!/bin/bash

# Configurações
API_BASE="http://localhost:3001/v1"
DB_EXEC="docker exec -t oleo_postgres psql -U user_oleo -d oleo_db"

echo "🚀 Iniciando teste da API Óleo Padrão (MR. OLUC)..."
echo "------------------------------------------"

# 1. Criar Fornecedor
echo "👤 1. Criando Fornecedor..."
FORNECEDOR_JSON=$(curl -s -X POST "$API_BASE/fornecedores" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_razao_social": "Sampaio Fornecedor Teste",
    "cpf_cnpj": "12.345.678/0001-99",
    "email": "teste@sampaio.com"
  }')

# Extrair ID usando grep/sed (caso jq não esteja disponível)
FORNECEDOR_ID=$(echo $FORNECEDOR_JSON | grep -oP '"id":"\K[^"]+')

if [ -z "$FORNECEDOR_ID" ]; then
    # Tentar buscar se já existe (409)
    echo "⚠️ Fornecedor já existe ou erro, buscando ID..."
    FORNECEDOR_ID=$(curl -s "$API_BASE/fornecedores" | grep -oP '"id":"\K[^"]+' | head -n 1)
fi

echo "ID do Fornecedor: $FORNECEDOR_ID"
echo ""

# 2. Registrar Coleta
ID_OPERACAO="MR-TEST-$(date +%s)"
echo "📝 2. Enviando nova coleta (ID Operação: $ID_OPERACAO)..."

COLETA_PAYLOAD=$(cat <<EOF
{
    "id_operacao": "$ID_OPERACAO",
    "fornecedor_id": "$FORNECEDOR_ID",
    "volume_coletado": 250.5,
    "valor_a_pagar": 500.0,
    "metodo_pagamento": "PIX",
    "chave_pix_1": "teste@pix.com",
    "tipo_pix_1": "EMAIL",
    "tem_contrato": false,
    "cco": "CCO-XYZ"
}
EOF
)

RESPONSE=$(curl -s -X POST "$API_BASE/coletas" \
  -H "Content-Type: application/json" \
  -d "$COLETA_PAYLOAD")

echo "Response: $RESPONSE"
echo ""

# 3. Verificar no Banco de Dados
echo "🔍 3. Verificando persistência na tabela 'coletas'..."
$DB_EXEC -c "SELECT id, volume_coletado, valor_a_pagar, metodo_pagamento FROM coletas WHERE id_operacao = '$ID_OPERACAO';"

# 4. Verificar no Banco de Dados (Outbox)
echo ""
echo "📦 4. Verificando persistência na tabela 'outbox'..."
$DB_EXEC -c "SELECT event_type, payload FROM outbox WHERE payload->>'id_operacao' = '$ID_OPERACAO';"

echo "------------------------------------------"
echo "✅ Teste finalizado!"
