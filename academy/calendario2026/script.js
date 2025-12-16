document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado. Iniciando o script do calendário.");

    // --- ELEMENTOS DO DOM ---
    const monthYearTitle = document.getElementById('month-year-title');
    const daysHeader = document.getElementById('days-header');
    const daysGrid = document.getElementById('days-grid');
    const monthImage = document.getElementById('month-image');
    const notesTextarea = document.getElementById('notes-textarea');
    const notesList = document.getElementById('notes-list');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');

    // Verificação dos elementos do DOM
    console.log({
        monthYearTitle, daysHeader, daysGrid, monthImage, 
        notesTextarea, notesList, prevMonthBtn, nextMonthBtn
    });


    // --- ESTADO DO CALENDÁRIO ---
    let currentDate; // Será definido pelo servidor
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // --- FUNÇÕES ---

    /**
     * Busca a data inicial do servidor.
     */
    async function fetchInitialDate() {
        console.log("Buscando data inicial do servidor...");
        try {
            const response = await fetch('http://localhost:3000');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            currentDate = new Date(data.date);
            // Força o ano para 2026 conforme o objetivo do calendário
            currentDate.setFullYear(2026);
            console.log("Data recebida do servidor e definida para:", currentDate);
        } catch (error) {
            console.error("Não foi possível buscar a data do servidor. Usando data local como fallback.", error);
            // Fallback para a data do cliente se o servidor não responder
            currentDate = new Date();
            currentDate.setFullYear(2026);
            console.log("Data de fallback definida para:", currentDate);
        }
    }

    /**
     * Renderiza tudo na tela: calendário, título, imagem e anotações.
     */
    function render() {
        console.log("Iniciando a função render()...");
        if (!currentDate) {
            console.error("A data atual (currentDate) não está definida. Abortando renderização.");
            return;
        }

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // 1. Renderizar Título
        monthYearTitle.textContent = `${monthNames[month]} de ${year}`;
        console.log(`Título definido para: ${monthYearTitle.textContent}`);

        // 2. Renderizar Cabeçalho dos Dias
        daysHeader.innerHTML = '';
        dayNames.forEach(name => {
            const dayNameEl = document.createElement('div');
            dayNameEl.className = 'day-name';
            dayNameEl.textContent = name;
            daysHeader.appendChild(dayNameEl);
        });
        console.log("Cabeçalho dos dias da semana renderizado.");

        // 3. Renderizar Grade de Dias
        daysGrid.innerHTML = '';
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        console.log(`Renderizando grade para ${monthNames[month]} de ${year}. Dias no mês: ${daysInMonth}. Primeiro dia da semana: ${firstDayOfMonth}`);

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            daysGrid.appendChild(emptyDay);
        }

        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            dayEl.textContent = i;
            if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                dayEl.classList.add('today');
            }
            daysGrid.appendChild(dayEl);
        }
        console.log(`${daysInMonth} dias renderizados na grade.`);
        
        // 4. Atualizar Imagem do Mês
        monthImage.src = `placeholder-mes-${month + 1}.jpg`;
        monthImage.alt = `Imagem de ${monthNames[month]}`;
        console.log(`Imagem do mês definida para: ${monthImage.src}`);

        // 5. Carregar Anotações
        loadNotes();
        console.log("Função render() concluída.");
    }
    
    /**
     * Carrega e exibe as anotações do mês atual do localStorage.
     */
    function loadNotes() {
        const key = `notes-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        const notes = JSON.parse(localStorage.getItem(key)) || [];
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = note;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.onclick = () => deleteNote(index);
            
            li.appendChild(deleteBtn);
            notesList.appendChild(li);
        });
        // Carrega o texto da área de texto também
        notesTextarea.value = localStorage.getItem(`${key}-textarea`) || '';
        console.log(`Anotações carregadas para a chave: ${key}`);
    }

    /**
     * Salva a anotação da textarea no localStorage.
     */
    function saveNote() {
        const key = `notes-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        localStorage.setItem(`${key}-textarea`, notesTextarea.value);
    }
    
    /**
     * Deleta uma anotação da lista.
     */
    function deleteNote(index) {
        const key = `notes-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
        const notes = JSON.parse(localStorage.getItem(key)) || [];
        notes.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(notes));
        loadNotes(); // Re-renderiza a lista
    }

    // --- EVENT LISTENERS ---
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        render();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        render();
    });
    
    // Salva anotações conforme o usuário digita
    notesTextarea.addEventListener('input', saveNote);

    // --- INICIALIZAÇÃO ---
    async function init() {
        console.log("Iniciando a função init()...");
        await fetchInitialDate();
        render();
        console.log("Inicialização completa.");
    }

    init();
});