/**
 * Óleo Padrão - Simulador de Campo
 */

const API_URL = 'http://localhost:3001/v1/coletas';

const form = document.getElementById('coleta-form');
const opIdDisplay = document.getElementById('op-id-display');
const logList = document.getElementById('log-list');

// Gera um ID de operação único (Idempotência)
function generateOpId() {
    return 'OP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

let currentOpId = generateOpId();
opIdDisplay.textContent = currentOpId;

function addLog(message, type = '') {
    const emptyMsg = logList.querySelector('.empty');
    if (emptyMsg) emptyMsg.remove();

    const li = document.createElement('li');
    li.innerHTML = `<span>${new Date().toLocaleTimeString()}</span> <span>${message}</span>`;
    if (type) li.classList.add(type);
    
    logList.prepend(li);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const payload = {
        id_operacao: currentOpId,
        cliente_id: formData.get('cliente_id'),
        volume_estimado: parseFloat(formData.get('volume_estimado'))
    };

    try {
        const btn = document.getElementById('btn-enviar');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            addLog(`Sucesso: Coleta ${data.id.substr(0,8)}`, 'status-success');
            form.reset();
            // Gera novo ID para a próxima operação
            currentOpId = generateOpId();
            opIdDisplay.textContent = currentOpId;
        } else {
            addLog(`Erro: ${data.error || 'Falha na API'}`, 'status-error');
        }
    } catch (error) {
        addLog('Erro de conexão com a API', 'status-error');
        console.error(error);
    } finally {
        const btn = document.getElementById('btn-enviar');
        btn.disabled = false;
        btn.textContent = 'Finalizar Registro';
    }
});
