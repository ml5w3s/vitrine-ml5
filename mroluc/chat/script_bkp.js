document.addEventListener('DOMContentLoaded', () => {
    const pairs = [];
    let fallbackResponses = ["Não encontrei exatamente o que você deseja.\n\nVocê pode escolher:\n\n1 - Acessar central de custódia\n2 - Ver vencimento de boletos\n3 - Sair"];

    // Escape para uso seguro em RegExp
    function escapeRegex(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Carrega o JSON de respostas e converte em pares de regex/respostas
    function loadResponses() {
        fetch('chatbot_responses.json')
            .then((res) => {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data.intents)) return;
                for (const intent of data.intents) {
                    const tag = intent.tag || '';
                    const patterns = intent.patterns || [];
                    const responses = intent.responses || [];
                    if (tag === 'fallback') {
                        if (responses.length) fallbackResponses = responses;
                        continue;
                    }
                    if (!patterns.length) continue;
                    for (const p of patterns) {
                        try {
                            // usa correspondência parcial (case-insensitive)
                            const rx = new RegExp(escapeRegex(p), 'i');
                            pairs.push({ patterns: [rx], responses });
                        } catch (e) {
                            console.warn('Erro criando regex para pattern', p, e);
                        }
                    }
                }
                console.log('chatbot_responses.json carregado. Intents:', pairs.length);
            })
            .catch((err) => {
                console.warn('Não foi possível carregar chatbot_responses.json, usando fallback estático:', err);
            });
    }

    // Inicia carregamento assíncrono
    loadResponses();

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    function addMessage(text, side) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', side);
        if (side === 'bot') {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.textContent = text;
        }
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getResponse(input) {
        for (const pair of pairs) {
            for (const pattern of pair.patterns) {
                if (pattern.test(input)) {
                    const idx = Math.floor(Math.random() * pair.responses.length);
                    return pair.responses[idx];
                }
            }
        }
        return "Não encontrei exatamente o que você deseja.\n\nVocê pode escolher:\n\n1 - Acessar central de custódia\n2 - Ver vencimento de boletos\n3 - Sair";
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // Pequeno atraso para parecer que o "gato" está pensando
        setTimeout(() => {
            const response = getResponse(text);
            addMessage(response, 'bot');

            // Redirecionamento automático se a resposta for sobre custódia de celulares
            if (response.includes("https://fascinating-guardian-fleet-flow.base44.app/")) {
                setTimeout(() => {
                    window.top.location.href = "https://fascinating-guardian-fleet-flow.base44.app/";
                }, 1500);
            }
        }, 600);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    console.log("AuChat carregado com sucesso! 🐾");
});
