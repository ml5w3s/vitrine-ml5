#!/bin/bash

# Configurações
API_URL="http://localhost:3001/v1/coletas"
DB_EXEC="docker exec -t oleo_postgres psql -U user_oleo -d oleo_db"

echo "🚀 Iniciando teste da API Óleo Padrão..."
echo "------------------------------------------"

# 1. Gerar um ID de operação único para o teste
ID_OPERACAO="test-op-$(date +%s)"
CLIENTE_ID="550e8400-e29b-41d4-a716-446655440000"

echo "📝 1. Enviando nova coleta (ID Operação: $ID_OPERACAO)..."

RESPONSE=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"id_operacao\": \"$ID_OPERACAO\",
    \"cliente_id\": \"$CLIENTE_ID\",
    \"volume_estimado\": 150.5
  }")

echo "Response: $RESPONSE"
echo ""

# 2. Verificar no Banco de Dados (Tabela Coletas)
echo "🔍 2. Verificando persistência na tabela 'coletas'..."
$DB_EXEC -c "SELECT id, id_operacao, volume_estimado, status FROM coletas WHERE id_operacao = '$ID_OPERACAO';"

# 3. Verificar no Banco de Dados (Tabela Outbox)
echo ""
echo "📦 3. Verificando persistência na tabela 'outbox' (Outbox Pattern)..."
$DB_EXEC -c "SELECT event_type, payload FROM outbox WHERE payload->>'id_operacao' = '$ID_OPERACAO';"

# 4. Testar Idempotência
echo ""
echo "🧪 4. Testando Idempotência (Enviando o mesmo ID novamente)..."
RESPONSE_IDEM=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"id_operacao\": \"$ID_OPERACAO\",
    \"cliente_id\": \"$CLIENTE_ID\",
    \"volume_estimado\": 150.5
  }")

echo "Response (deve ser idêntica à anterior): $RESPONSE_IDEM"
echo "------------------------------------------"
echo "✅ Teste finalizado!"
