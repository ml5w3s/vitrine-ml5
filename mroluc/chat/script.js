document.addEventListener('DOMContentLoaded', () => {
    const pairs = [
        {
            patterns: [/olá/i, /oi/i, /dia/i],
            responses: ["Au! Eu sou a assistente Amy. Como posso te ajudar hoje?", "Oi humano! Sou a Amy. O que deseja?"]
        },
        {
            patterns: [/financeiro/i, /finanças/i, /departamento/i, /nalda/i],
            responses: ["Contas a pagar\nRecebimentos\nCategorias\nClientes\nFornecedores!", "classificação automática\ncentro de custo\ncategoria contábil\ntags\ninconsistências."]
        },
        {
            patterns: [/Operações/i, /operacional/i, /felipe/i],
            responses: ["Conciliação diária\nAtualização do Power BI\nAlertas de vencimento\nVerificação de documentos\nGeração de indicadores\nFechamento mensal."]
        },
        {
            patterns: [/objetivo/i, /doretrozes/i, /função/i],
            responses: ["A princípio sou apenas um chat de respostas programadas, depois vou evoluir para um menu inteligente, e no futuro vou receber uma rede neural."]
        },
        {
            patterns: [/obrigado/i, /valeu/i, /thanks/i],
            responses: ["De nada! Qualquer coisa, é só me chamar.", "Disponha, humano."]
        },
        {
            patterns: [/tchau/i, /até logo/i, /sair/i],
            responses: ["Até a próxima!", "Vou ali dormir 18 horas seguidas. Até mais!"]
        },
        {
            patterns: [/nome/i, /quem é você/i],
            responses: ["Eu sou o Amy Bot, a orquestradora de agentes da Mr.Oluc e interface de usuário!"]
        },
        {
            patterns: [/boletos/i, /boleto a vencer/i, /vencimentos/i],
            responses: ["Vou acionar nosso agente financeiro, ele vai fazer uma varredura nos boletos a vencer e te trazer um resumo dos boletos com vencimentos para os próximos 5 dias...Desculpe, nosso agente financeiro retornou que ainda não foi treinado para tratar de contas a pagar"]
        },
        {
            patterns: [/celular/i, /cel/i, /telefone/i, /fone/i],
            responses: ["Transferindo para o <a href=\"https://fascinating-guardian-fleet-flow.base44.app/\" target=\"_blank\">controle de custódia de celulares</a>..."]
        }
    ];

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

    console.log("MiauChat carregado com sucesso! 🐾");
});
