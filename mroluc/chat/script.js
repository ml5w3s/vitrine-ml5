document.addEventListener('DOMContentLoaded', function() {
  var pairs = [];
  var fallbackResponses = [
    "Não encontrei exatamente o que você deseja.\n\nVocê pode escolher:\n\n1 - Acessar central de custódia\n2 - Ver vencimento de boletos\n\n3 - Sair"
  ];

  function escapeRegex(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function loadResponses() {
    return fetch('chatbot_responses.json')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (!data || !Array.isArray(data.intents)) return;
        data.intents.forEach(function(intent) {
          var tag = intent.tag || '';
          var patterns = intent.patterns || [];
          var responses = intent.responses || [];

          if (tag === 'fallback') {
            if (responses.length) fallbackResponses = responses;
            return;
          }

          if (!patterns.length) return;

          patterns.forEach(function(p) {
            try {
              var rx = new RegExp(escapeRegex(String(p)), 'i');
              pairs.push({ patterns: [rx], responses: responses });
            } catch (e) {
              console.warn('Erro criando regex para pattern', p, e);
            }
          });
        });
        console.log('chatbot_responses.json carregado. Intents:', pairs.length);
      })
      .catch(function(err) {
        console.warn('Não foi possível carregar chatbot_responses.json, usando fallback estático:', err);
      });
  }

  loadResponses();

  var chatMessages = document.getElementById('chat-messages');
  var chatInput = document.getElementById('chat-input');
  var sendBtn = document.getElementById('send-btn');

  function addMessage(text, side) {
    var msgDiv = document.createElement('div');
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
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i];
      for (var j = 0; j < pair.patterns.length; j++) {
        var pattern = pair.patterns[j];
        if (pattern.test(input)) {
          if (!pair.responses || !pair.responses.length) continue;
          var idx = Math.floor(Math.random() * pair.responses.length);
          return pair.responses[idx];
        }
      }
    }
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  function handleSend() {
    var text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    setTimeout(function() {
      var response = getResponse(text);
      addMessage(response, 'bot');

      if (response && response.indexOf('https://fascinating-guardian-fleet-flow.base44.app/') !== -1) {
        setTimeout(function() {
          window.top.location.href = 'https://fascinating-guardian-fleet-flow.base44.app/';
        }, 1500);
      }
    }, 600);
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (chatInput) chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') handleSend(); });

  console.log('AmyChat (JS) carregado com suporte a chatbot_responses.json 🐾');
});
