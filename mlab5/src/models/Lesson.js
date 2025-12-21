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
        lessonElement.className = 'lesson-content lesson-detail-view';
        lessonElement.innerHTML = `<h3 class="lesson-title">${this.title}</h3>`;

        const lessonData = this.content.course;

        if (lessonData && lessonData.articles) {
            const sortedArticles = lessonData.articles.sort((a, b) => a.position - b.position);

            // 1. Encontra e renderiza o banner em sua própria seção
            const bannerData = sortedArticles.find(article => article.type === 'banner' && article.image && !article.hidden);
            if (bannerData) {
                const bannerSection = document.createElement('section');
                bannerSection.className = 'banner-container';
                
                const articleElement = document.createElement('article');
                articleElement.className = 'item item-banner';
                
                const picture = document.createElement('picture');

                if (bannerData.image.desktop) {
                    const sourceDesktop = document.createElement('source');
                    sourceDesktop.media = '(min-width: 1024px)';
                    sourceDesktop.srcset = '/vitrine-ml5/mlab5/' + bannerData.image.desktop;
                    picture.appendChild(sourceDesktop);
                }
                if (bannerData.image.tablet) {
                    const sourceTablet = document.createElement('source');
                    sourceTablet.media = '(min-width: 600px)';
                    sourceTablet.srcset = '/vitrine-ml5/mlab5/' + bannerData.image.tablet;
                    picture.appendChild(sourceTablet);
                }

                const img = document.createElement('img');
                img.src = '/vitrine-ml5/mlab5/' + (bannerData.image.mobile || bannerData.image.src);
                img.alt = bannerData.image.caption || this.title;
                img.style.width = '100%';
                picture.appendChild(img);
                
                articleElement.appendChild(picture);
                bannerSection.appendChild(articleElement);
                lessonElement.appendChild(bannerSection);
            }

            // 2. Filtra o banner e artigos ocultos, depois renderiza o resto em uma seção separada
            const contentArticles = sortedArticles.filter(article => article.type !== 'banner' && !article.hidden);
            
            if (contentArticles.length > 0) {
                const contentContainer = document.createElement('section');
                contentContainer.className = 'container';

                contentArticles.forEach(articleData => {
                    const articleElement = document.createElement('article');
                    articleElement.className = 'item';

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
                    } else {
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
                    }

                    if (articleElement.hasChildNodes()) {
                        contentContainer.appendChild(articleElement);
                    }
                });
                
                lessonElement.appendChild(contentContainer);
            }

        } else {
            lessonElement.innerHTML += `<div class="content-default">Conteúdo da aula mal formatado ou ausente.</div>`;
        }

        return lessonElement;
    }
}
 