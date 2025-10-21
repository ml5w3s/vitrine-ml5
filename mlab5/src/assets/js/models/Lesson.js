/**
 * Representa uma única aula dentro de um curso.
 */
class Lesson {
    /**
     * @param {string} id - O identificador único da aula.
     * @param {string} title - O título da aula.
     * @param {string|object} content - O conteúdo da aula (pode ser HTML, Markdown, ou um objeto de configuração).
     * @param {string} type - O tipo de aula (e.g., 'lousa', 'playground', 'video').
     */
    constructor(id, title, content, type = 'default') {
        this.id = id;
        this.title = title;
        this.content = content;
        this.type = type;
    }

    /**
     * Renderiza o conteúdo da aula.
     * @returns {HTMLElement} - O elemento HTML que representa a aula.
     */
    render() {
        const lessonElement = document.createElement('section');
        lessonElement.className = 'lesson-content';
        lessonElement.innerHTML = `
            <h3 class="lesson-title">${this.title}</h3>
        `;

        const contentContainer = document.createElement('div');
        contentContainer.className = 'lesson-dynamic-content';
        lessonElement.appendChild(contentContainer);

        // A lógica de renderização pode variar com base no tipo de aula
        switch (this.type) {
            case 'lousa':
                // Instancia o LousaComponent no contentContainer
                // Verifica se LousaComponent está disponível no escopo global
                if (typeof LousaComponent !== 'undefined') {
                    new LousaComponent(contentContainer, this.content);
                } else {
                    contentContainer.innerHTML = `<div class="lousa-container">Erro: LousaComponent não carregado.</div>`;
                    console.error("LousaComponent não está disponível.");
                }
                break;
            case 'playground':
                // Lógica para carregar o componente Playground
                contentContainer.innerHTML = `<div class="playground-container">Carregando playground...</div>`;
                break;
            default:
                contentContainer.innerHTML = `<div class="content-default">${this.content}</div>`;
                break;
        }

        return lessonElement;
    }
}
