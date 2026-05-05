/**
 * Sampaio Óleo - MR. OLUC (Simulador)
 */

const API_BASE = 'http://localhost:3001/v1';

const form = document.getElementById('coleta-form');
const opIdDisplay = document.getElementById('op-id-display');
const logList = document.getElementById('log-list');
const metodoPagamento = document.getElementById('metodo_pagamento');
const pixFields = document.getElementById('pix-fields');

// Gera um ID de operação único (Idempotência)
function generateOpId() {
    return 'MR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

let currentOpId = generateOpId();
opIdDisplay.textContent = currentOpId;

// Alterna exibição de campos PIX
metodoPagamento.addEventListener('change', () => {
    pixFields.style.display = metodoPagamento.value === 'PIX' ? 'block' : 'none';
});

function addLog(message, type = '') {
    const emptyMsg = logList.querySelector('.empty');
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    li.innerHTML = `<span>${new Date().toLocaleTimeString()}</span> <span>${message}</span>`;
    if (type) li.classList.add(type);
    
    logList.prepend(li);
}

async function getOrCreateFornecedor(formData) {
    const cpfCnpj = formData.get('cpf_cnpj');
    
    // Tenta encontrar fornecedores existentes (simplificado: pegamos da lista ou tentamos criar)
    // Em um app real, faríamos um GET /fornecedores/:cpf_cnpj
    // Aqui, vamos tentar criar. Se a API der 409 (Conflict), tentaremos buscar o ID.
    
    const fornecedorPayload = {
        nome_razao_social: formData.get('nome_razao_social'),
        cpf_cnpj: cpfCnpj,
        tipo_fornecedor: formData.get('tipo_fornecedor'),
        email: formData.get('email'),
        endereco: formData.get('endereco'),
        cidade: formData.get('cidade'),
        cep: formData.get('cep')
    };

    try {
        const response = await fetch(`${API_BASE}/fornecedores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fornecedorPayload)
        });

        const data = await response.json();

        if (response.status === 201) {
            return data.id;
        } else if (response.status === 409) {
            // Se já existe, buscamos na lista (hack para este simulador sem endpoint de busca por CPF)
            const listResponse = await fetch(`${API_BASE}/fornecedores`);
            const list = await listResponse.json();
            const found = list.find(f => f.cpf_cnpj === cpfCnpj);
            return found ? found.id : null;
        }
        return null;
    } catch (error) {
        console.error('Erro ao processar fornecedor:', error);
        return null;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btn-enviar');
    btn.disabled = true;
    btn.textContent = 'Processando...';

    const formData = new FormData(form);

    // 1. Obter ou Criar Fornecedor
    const fornecedorId = await getOrCreateFornecedor(formData);

    if (!fornecedorId) {
        addLog('Erro ao identificar fornecedor', 'status-error');
        btn.disabled = false;
        btn.textContent = 'Finalizar Coleta';
        return;
    }

    // 2. Preparar Payload da Coleta
    const payload = {
        id_operacao: currentOpId,
        fornecedor_id: fornecedorId,
        volume_coletado: parseFloat(formData.get('volume_coletado')),
        valor_a_pagar: parseFloat(formData.get('valor_a_pagar')),
        metodo_pagamento: formData.get('metodo_pagamento'),
        chave_pix_1: formData.get('chave_pix_1'),
        tipo_pix_1: formData.get('tipo_pix_1'),
        chave_pix_2: formData.get('chave_pix_2'),
        tipo_pix_2: formData.get('tipo_pix_2'),
        numero_inicio: parseInt(formData.get('numero_inicio')) || null,
        numero_fim: parseInt(formData.get('numero_fim')) || null,
        data_devolucao: formData.get('data_devolucao') || null,
        observacoes: formData.get('observacoes'),
        cco: formData.get('cco'),
        tem_contrato: formData.get('tem_contrato') === 'on'
    };

    try {
        const response = await fetch(`${API_BASE}/coletas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            addLog(`Sucesso: Coleta ${data.id.substr(0,8)} | R$ ${data.valor_a_pagar}`, 'status-success');
            form.reset();
            pixFields.style.display = 'block'; // Reset display
            currentOpId = generateOpId();
            opIdDisplay.textContent = currentOpId;
        } else {
            addLog(`Erro: ${data.error || 'Falha na API'}`, 'status-error');
        }
    } catch (error) {
        addLog('Erro de conexão com a API', 'status-error');
        console.error(error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Finalizar Coleta';
    }
});
