const images = {
    capa: '/vitrine-ml5/academy/calendario2025/capa.png',
    contracapa: '/vitrine-ml5/academy/calendario2025/contra-capa.png',
    janeiro: '/vitrine-ml5/academy/calendario2025/janeiro_sem.png',
    fevereiro: '/vitrine-ml5/academy/calendario2025/fevereiro_sem.png',
    marco: '/vitrine-ml5/academy/calendario2025/marco_sem.png',
    abril: '/vitrine-ml5/academy/calendario2025/abril_sem.png',
    maio: '/vitrine-ml5/academy/calendario2025/maio_sem.png',
    junho: '/vitrine-ml5/academy/calendario2025/junho_sem.png',
    julho: '/vitrine-ml5/academy/calendario2025/julho_sem.png',
    agosto: '/vitrine-ml5/academy/calendario2025/agosto_sem.png',
    setembro: '/vitrine-ml5/academy/calendario2025/setembro_sem.png',
    outubro: '/vitrine-ml5/academy/calendario2025/outubro_sem.png',
    novembro: '/vitrine-ml5/academy/calendario2025/novembro_sem.png',
    dezembro: '/vitrine-ml5/academy/calendario2025/dezembro_sem.png',
    '2026': '/vitrine-ml5/academy/calendario2025/2026.png'
};

let currentMonth = '/vitrine-ml5/academy/calendario2025/capa'; // Define o mês atual para rastrear anotações

// Função para trocar o mês
function changeMonth(month) {
    const imgElement = document.getElementById('calendar-img');
    currentMonth = month;

    if (images[month]) {
        imgElement.src = images[month];
        imgElement.alt = `Calendário de ${month}`;
    }

    loadNotes(); // Carrega as anotações do mês ao trocar
}

// Função para adicionar uma anotação
function addNote() {
    const textarea = document.getElementById('memorando');
    const noteText = textarea.value.trim();
    if (!noteText) return;

    const notes = JSON.parse(localStorage.getItem(`notes-${currentMonth}`)) || [];
    notes.push(noteText);
    localStorage.setItem(`notes-${currentMonth}`, JSON.stringify(notes));

    textarea.value = ''; // Limpa o campo de texto
    loadNotes(); // Atualiza a lista
}

// Função para carregar as anotações do mês atual
function loadNotes() {
    const notesList = document.getElementById('notes-list');
    const notes = JSON.parse(localStorage.getItem(`notes-${currentMonth}`)) || [];

    // Limpa a lista antes de renderizar
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${note} 
            <button onclick="deleteNote(${index})">X</button>
        `;
        notesList.appendChild(li);
    });
}

// Função para deletar uma anotação
function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem(`notes-${currentMonth}`)) || [];
    notes.splice(index, 1); // Remove a anotação pelo índice
    localStorage.setItem(`notes-${currentMonth}`, JSON.stringify(notes));
    loadNotes(); // Atualiza a lista
}

function copyPixKey() {
    const pixKey = "61985498185"; // Sua chave PIX

    // Usar a API Clipboard para copiar a chave para a área de transferência
    navigator.clipboard.writeText(pixKey).then(() => {
        // Mostrar mensagem de sucesso
        const message = document.getElementById('copy-message');
        message.style.display = 'block';

        // Ocultar mensagem após 3 segundos
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }).catch(err => {
        console.error('Erro ao copiar a chave PIX:', err);
        alert('Não foi possível copiar a chave PIX. Por favor, tente novamente.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768; // Detecta telas menores
    const styleLink = document.getElementById('style-link');
    styleLink.href = isMobile ? 'mobile.css' : 'desktop.css'; // Carrega o CSS correto
});
