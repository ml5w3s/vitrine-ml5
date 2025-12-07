class LessonComponent {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }

    render() {
        const lessonElement = document.createElement('section');
        lessonElement.className = 'lesson-content';
        lessonElement.innerHTML = `<h3 class="lesson-title">${this.title}</h3>`;

        const contentContainer = document.createElement('div');
        contentContainer.className = 'lesson-dynamic-content';
        lessonElement.appendChild(contentContainer);

        // ...existing code that fills contentContainer...

        // === ADDED: Tabs para Conteúdo / Lousa ===
        const tabsBar = document.createElement('div');
        tabsBar.className = 'lesson-tabs';

        const btnContent = document.createElement('button');
        btnContent.type = 'button';
        btnContent.textContent = 'Conteúdo';
        btnContent.className = 'active';

        const btnLousa = document.createElement('button');
        btnLousa.type = 'button';
        btnLousa.textContent = 'Lousa';

        tabsBar.appendChild(btnContent);
        tabsBar.appendChild(btnLousa);

        // Insere as tabs antes do conteúdo dinâmico
        lessonElement.insertBefore(tabsBar, contentContainer);

        const lousaContainer = document.createElement('div');
        lousaContainer.className = 'lousa-container';
        lousaContainer.style.display = 'none';
        lessonElement.appendChild(lousaContainer);

        let lousaInstance = null;

        btnContent.addEventListener('click', () => {
            contentContainer.style.display = '';
            lousaContainer.style.display = 'none';
            btnContent.classList.add('active');
            btnLousa.classList.remove('active');
        });

        btnLousa.addEventListener('click', () => {
            contentContainer.style.display = 'none';
            lousaContainer.style.display = '';
            btnLousa.classList.add('active');
            btnContent.classList.remove('active');

            if (!lousaInstance) {
                if (typeof LousaComponent !== 'undefined') {
                    // Instancia LousaComponent dentro do container (passa título como conteúdo inicial opcional)
                    lousaInstance = new LousaComponent(lousaContainer, this.title || '');
                } else {
                    lousaContainer.innerHTML = '<p>Componente Lousa não disponível.</p>';
                    console.error('LousaComponent não encontrado.');
                }
            }
        });
        // === END ADDED ===

        return lessonElement;
    }
}
