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

        switch (this.type) {
            case 'lousa':
                if (typeof LousaComponent !== 'undefined') {
                    // For 'lousa', we instantiate it directly within the lesson view
                    new LousaComponent(contentContainer, this.content);
                } else {
                    contentContainer.innerHTML = `<div class="lousa-container">Erro: LousaComponent não carregado.</div>`;
                    console.error("LousaComponent não está disponível.");
                }
                break;
            case 'playground':
                // For 'playground', we render articles and a button to a separate playground view
                const lessonData = this.content.course; // Access the 'course' object within the content

                if (lessonData && lessonData.articles) {
                    let articlesHtml = '';
                    let playgroundButton = '';

                    lessonData.articles.forEach(article => {
                        // Heuristic: if it has 'programmingLanguage' and 'code', it's for the playground
                        // and should not be rendered directly in the lesson view.
                        if (article.programmingLanguage && article.code) {
                            // This is the hidden article for playground instructions
                            // We will not render it here, but use it for the playground view
                            playgroundButton = `<button class="open-playground-button" data-course-id="${lessonData.id}" data-lesson-id="${this.id}">Abrir Playground</button>`;
                        } else {
                            // Render other articles
                            articlesHtml += `<article>`;
                            if (article.headline) articlesHtml += `<h4>${article.headline}</h4>`;
                            if (article.alternativeHeadline) articlesHtml += `<h5>${article.alternativeHeadline}</h5>`;
                            if (article.text) articlesHtml += `<p>${article.text}</p>`;
                            if (article.list) {
                                articlesHtml += `<ul>`;
                                article.list.forEach(item => articlesHtml += `<li>${item}</li>`);
                                articlesHtml += `</ul>`;
                            }
                            if (article.image) {
                                articlesHtml += `<img src="${article.image.desktop || article.image.src}" alt="${article.image.caption || ''}">`;
                                if (article.image.caption) articlesHtml += `<p class="caption">${article.image.caption}</p>`;
                            }
                            articlesHtml += `</article>`;
                        }
                    });
                    contentContainer.innerHTML = articlesHtml + playgroundButton;

                    // Add event listener for the playground button
                    const openPlaygroundButton = lessonElement.querySelector('.open-playground-button');
                    if (openPlaygroundButton) {
                        openPlaygroundButton.addEventListener('click', () => {
                            const courseId = openPlaygroundButton.dataset.courseId;
                            const lessonId = openPlaygroundButton.dataset.lessonId;
                            window.location.hash = `#/course/${courseId}/lesson/${lessonId}/playground`;
                        });
                    }
                } else {
                    contentContainer.innerHTML = `<div class="content-default">Conteúdo do Playground mal formatado ou ausente.</div>`;
                }
                break;
            default:
                // For 'default' type, just display the content as is
                contentContainer.innerHTML = `<div class="content-default">${this.content}</div>`;
                break;
        }

        return lessonElement;
    }
}
