document.addEventListener('DOMContentLoaded', () => {
    const pairs = [
        {
            patterns: [/olá/i, /oi/i, /miau/i],
            responses: ["Miau! Eu sou o assistente felino. Como posso te ajudar hoje?", "Oi humano! Ronronron... o que deseja?"]
        },
        {
            patterns: [/comer/i, /comida/i, /sachê/i, /fome/i],
            responses: ["Eu adoro sachê de salmão e uma ração de boa qualidade!", "Opa, falou em comida? Já verificou se minha tigela está cheia?"]
        },
        {
            patterns: [/feliz/i, /felicidade/i, /alegre/i],
            responses: ["Gatos felizes costumam ronronar, piscar devagar para você e manter o rabo erguido com uma leve curvatura na ponta."]
        },
        {
            patterns: [/caixa/i, /caixas/i, /papelão/i],
            responses: ["Caixas oferecem segurança e um ótimo esconderijo para observar a 'presa' sem ser visto!", "Se cabe, eu entro! Caixas são os melhores móveis da casa."]
        },
        {
            patterns: [/obrigado/i, /valeu/i, /thanks/i],
            responses: ["Ronronron... De nada! Qualquer coisa, é só me chamar.", "Miau! Disponha, humano."]
        },
        {
            patterns: [/tchau/i, /até logo/i, /sair/i],
            responses: ["Miau! Até a próxima soneca!", "Vou ali dormir 18 horas seguidas. Até mais!"]
        },
        {
            patterns: [/nome/i, /quem é você/i],
            responses: ["Eu sou o Bruce Bot, o gato mestre desta Academy!"]
        }
    ];

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    function addMessage(text, side) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', side);
        msgDiv.textContent = text;
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
        return "Miau? Não entendi muito bem. Pode perguntar de outro jeito? (Tente falar sobre comida, caixas ou como saber se estou feliz)";
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
        }, 600);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    console.log("MiauChat carregado com sucesso! 🐾");
});
