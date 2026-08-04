document.addEventListener('DOMContentLoaded', () => {
  type Pair = { patterns: RegExp[]; responses: string[] };

  const pairs: Pair[] = [];
  let fallbackResponses: string[] = [
    "Não encontrei exatamente o que você deseja.\n\nVocê pode escolher:\n\n1 - Acessar central de custódia\n2 - Ver vencimento de boletos\n3 - Sair",
  ];

  function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async function loadResponses() {
    try {
      const res = await fetch('chatbot_responses.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
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
            const rx = new RegExp(escapeRegex(String(p)), 'i');
            pairs.push({ patterns: [rx], responses });
          } catch (e) {
            console.warn('Erro criando regex para pattern', p, e);
          }
        }
      }
      console.log('chatbot_responses.json carregado. Intents:', pairs.length);
    } catch (err) {
      console.warn('Não foi possível carregar chatbot_responses.json, usando fallback estático:', err);
    }
  }

  loadResponses();

  const chatMessages = document.getElementById('chat-messages') as HTMLElement;
  const chatInput = document.getElementById('chat-input') as HTMLInputElement;
  const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;

  function addMessage(text: string, side: 'bot' | 'user') {
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

  function getResponse(input: string) {
    for (const pair of pairs) {
      for (const pattern of pair.patterns) {
        if (pattern.test(input)) {
          if (!pair.responses || !pair.responses.length) continue;
          const idx = Math.floor(Math.random() * pair.responses.length);
          return pair.responses[idx];
        }
      }
    }
    // fallback aleatório
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    setTimeout(() => {
      const response = getResponse(text);
      addMessage(response, 'bot');

      // Mantém redirecionamento se a resposta contiver o link de custódia
      if (response && response.includes('https://fascinating-guardian-fleet-flow.base44.app/')) {
        setTimeout(() => {
          window.top.location.href = 'https://fascinating-guardian-fleet-flow.base44.app/';
        }, 1500);
      }
    }, 600);
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  console.log('AmyChat (TS) carregado com suporte a chatbot_responses.json 🐾');
});
