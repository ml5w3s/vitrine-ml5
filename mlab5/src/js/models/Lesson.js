/**
 * Representa uma única aula dentro de um curso.
 */
export class Lesson {
    /**
     * @param {string} id - O identificador único da aula.
     * @param {string} title - O título da aula.
     * @param {string|object} content - O conteúdo da aula (pode ser HTML, Markdown, ou um objeto de configuração).
     * @param {string} type - O tipo de aula (e.g., 'notas', 'playground', 'video').
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
        lessonElement.innerHTML = `<h3 class="lesson-title">${this.title}</h3>`;

        const container = document.createElement('section');
        container.className = 'container';

        const lessonData = this.content.course;

        if (lessonData && lessonData.articles) {
            const sortedArticles = lessonData.articles.sort((a, b) => a.position - b.position);

            sortedArticles.forEach(articleData => {
                if (articleData.hidden) {
                    return; // Pula artigos ocultos
                }

                const articleElement = document.createElement('article');
                articleElement.className = 'item';

                // Tratamento de tipos específicos que se tornam um <article>
                if (articleData.type === 'banner' && articleData.image) {
                    articleElement.classList.add('item-banner');
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    img.src = '/vitrine-ml5/mlab5/' + (articleData.image.desktop || articleData.image.src);
                    img.alt = articleData.image.caption || this.title;
                    figure.appendChild(img);
                    articleElement.appendChild(figure);
                    container.appendChild(articleElement);
                    return; // Próximo artigo
                }

                if (articleData.type === 'exercise') {
                    articleElement.classList.add('item-exercise');
                    if (articleData.headline) {
                        const headline = document.createElement('h4');
                        headline.textContent = articleData.headline;
                        articleElement.appendChild(headline);
                    }
                    if (articleData.text) {
                        const text = document.createElement('p');
                        text.textContent = articleData.text;
                        articleElement.appendChild(text);
                    }
                    if (articleData.steps) {
                        const stepsList = document.createElement('ol');
                        articleData.steps.forEach(stepText => {
                            const stepItem = document.createElement('li');
                            stepItem.textContent = stepText;
                            stepsList.appendChild(stepItem);
                        });
                        articleElement.appendChild(stepsList);
                    }
                    container.appendChild(articleElement);
                    return; // Próximo artigo
                }

                // Lógica para artigos padrão
                if (articleData.headline) {
                    const headline = document.createElement('h4');
                    headline.textContent = articleData.headline;
                    articleElement.appendChild(headline);
                }
                if (articleData.alternativeHeadline) {
                    const altHeadline = document.createElement('h5');
                    altHeadline.textContent = articleData.alternativeHeadline;
                    articleElement.appendChild(altHeadline);
                }
                if (articleData.text) {
                    const text = document.createElement('p');
                    text.innerHTML = articleData.text;
                    articleElement.appendChild(text);
                }
                if (articleData.list) {
                    const list = document.createElement('ul');
                    articleData.list.forEach(itemText => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = itemText;
                        list.appendChild(listItem);
                    });
                    articleElement.appendChild(list);
                }
                if (articleData.image && (articleData.image.desktop || articleData.image.src)) {
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    img.src = '/vitrine-ml5/mlab5/' + (articleData.image.desktop || articleData.image.src);
                    img.alt = articleData.image.caption || this.title;
                    figure.appendChild(img);
                    if (articleData.image.caption) {
                        const figcaption = document.createElement('figcaption');
                        figcaption.className = 'caption';
                        figcaption.textContent = articleData.image.caption;
                        figure.appendChild(figcaption);
                    }
                    articleElement.appendChild(figure);
                }
                if (articleData.code) {
                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    const codeContent = Array.isArray(articleData.code) ? articleData.code.join('\n') : articleData.code;
                    code.textContent = codeContent;
                    if (articleData.programmingLanguage) {
                        code.className = `language-${articleData.programmingLanguage.toLowerCase()}`;
                    }
                    pre.appendChild(code);
                    articleElement.appendChild(pre);
                }
                
                // Apenas adiciona o artigo se ele tiver algum conteúdo
                if (articleElement.hasChildNodes()) {
                    container.appendChild(articleElement);
                }
            });

            lessonElement.appendChild(container);

        } else {
            lessonElement.innerHTML += `<div class="content-default">Conteúdo da aula mal formatado ou ausente.</div>`;
        }

        return lessonElement;
    }
}
 