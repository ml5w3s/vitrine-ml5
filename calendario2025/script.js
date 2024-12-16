const images = {
    capa: 'capa.png',
    contracapa: 'contra-capa.png',
    janeiro: 'janeiro_sem.png',
    fevereiro: 'fevereiro_sem.png',
    marco: 'marco_sem.png',
    abril: 'abril_sem.png',
    maio: 'maio_sem.png',
    junho: 'junho_sem.png',
    julho: 'julho_sem.png',
    agosto: 'agosto_sem.png',
    setembro: 'setembro_sem.png',
    outubro: 'outubro_sem.png',
    novembro: 'novembro_sem.png',
    dezembro: 'dezembro_sem.png',
    '2026': '2026.png'
};

let currentMonth = 'capa'; // Define o mês atual para rastrear anotações

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
