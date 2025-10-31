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
        lessonElement.innerHTML = `<h3 class="lesson-title">${this.title}</h3>`;

        const contentContainer = document.createElement('div');
        contentContainer.className = 'lesson-dynamic-content';
        lessonElement.appendChild(contentContainer);

        // Helper function to create an article element from article data
        const createArticleElement = (article) => {
            const articleElement = document.createElement('article');
            articleElement.className = 'item';

            if (article.headline) {
                const headline = document.createElement('h4');
                headline.textContent = article.headline;
                articleElement.appendChild(headline);
            }
            if (article.alternativeHeadline) {
                const altHeadline = document.createElement('h5');
                altHeadline.textContent = article.alternativeHeadline;
                articleElement.appendChild(altHeadline);
            }
            if (article.text) {
                const text = document.createElement('p');
                text.innerHTML = article.text; // Use innerHTML to allow for simple HTML tags in text
                articleElement.appendChild(text);
            }
            if (article.list) {
                const list = document.createElement('ul');
                article.list.forEach(itemText => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = itemText; // Use innerHTML for lists too
                    list.appendChild(listItem);
                });
                articleElement.appendChild(list);
            }
            if (article.image && (article.image.desktop || article.image.src)) {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = article.image.desktop || article.image.src;
                img.alt = article.image.caption || this.title;
                figure.appendChild(img);
                if (article.image.caption) {
                    const figcaption = document.createElement('figcaption');
                    figcaption.className = 'caption';
                    figcaption.textContent = article.image.caption;
                    figure.appendChild(figcaption);
                }
                articleElement.appendChild(figure);
            }
            if (article.code) {
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                const codeContent = Array.isArray(article.code) ? article.code.join('\n') : article.code;
                code.textContent = codeContent;
                if (article.programmingLanguage) {
                    code.className = `language-${article.programmingLanguage.toLowerCase()}`;
                }
                pre.appendChild(code);
                articleElement.appendChild(pre);
            }

            return articleElement;
        };

        const lessonData = this.content.course;

        if (lessonData && lessonData.articles) {
            const sortedArticles = lessonData.articles.sort((a, b) => a.position - b.position);

            const generalArticlesSection = document.createElement('section');
            generalArticlesSection.className = 'container general-articles-section';
            let hasGeneralArticles = false;

            sortedArticles.forEach(article => {
                if (article.hidden) {
                    // Skip hidden articles like playground instructions
                    return;
                }

                switch (article.type) {
                    case 'banner':
                        const bannerSection = document.createElement('section');
                        bannerSection.className = 'container banner-section';
                        if (article.image) {
                            const figure = document.createElement('figure');
                            const img = document.createElement('img');
                            img.src = article.image.desktop || article.image.src;
                            img.alt = article.image.caption || this.title;
                            figure.appendChild(img);
                            bannerSection.appendChild(figure);
                        }
                        contentContainer.appendChild(bannerSection);
                        break;
                    case 'exercise':
                        const exerciseSection = document.createElement('section');
                        exerciseSection.className = 'container exercise-section';
                        const exerciseArticle = document.createElement('article');
                        exerciseArticle.className = 'item';
                        if (article.headline) {
                            const headline = document.createElement('h4');
                            headline.textContent = article.headline;
                            exerciseArticle.appendChild(headline);
                        }
                        if (article.text) {
                            const text = document.createElement('p');
                            text.textContent = article.text;
                            exerciseArticle.appendChild(text);
                        }
                        if (article.steps) {
                            const stepsList = document.createElement('ol');
                            article.steps.forEach(stepText => {
                                const stepItem = document.createElement('li');
                                stepItem.textContent = stepText;
                                stepsList.appendChild(stepItem);
                            });
                            exerciseArticle.appendChild(stepsList);
                        }
                        exerciseSection.appendChild(exerciseArticle);
                        contentContainer.appendChild(exerciseSection);
                        break;
                    default:
                        // All other articles go into the general articles section
                        generalArticlesSection.appendChild(createArticleElement(article));
                        hasGeneralArticles = true;
                        break;
                }
            });

            if (hasGeneralArticles) {
                contentContainer.appendChild(generalArticlesSection);
            }
            
            // Handle Playground separately
            const playgroundData = lessonData.playground;
            if (playgroundData) {
                const playgroundSection = document.createElement('section');
                playgroundSection.className = 'container playground-section';
                
                const playgroundArticle = document.createElement('article');
                playgroundArticle.className = 'item';

                if(playgroundData.headline) {
                    const headline = document.createElement('h4');
                    headline.textContent = playgroundData.headline;
                    playgroundArticle.appendChild(headline);
                }
                if (playgroundData.instructions) {
                    const instructions = document.createElement('p');
                    instructions.textContent = playgroundData.instructions;
                    playgroundArticle.appendChild(instructions);
                }

                const playgroundButton = document.createElement('button');
                playgroundButton.className = 'open-playground-button';
                playgroundButton.textContent = 'Abrir Playground';
                playgroundButton.addEventListener('click', () => {
                    const hashParts = window.location.hash.slice(1).split('/');
                    const courseId = hashParts[2];
                    const lessonId = hashParts[4];
                    window.location.hash = `#/course/${courseId}/lesson/${lessonId}/playground`;
                });

                playgroundArticle.appendChild(playgroundButton);
                playgroundSection.appendChild(playgroundArticle);
                contentContainer.appendChild(playgroundSection);
            }


        } else {
            contentContainer.innerHTML = `<div class="content-default">Conteúdo da aula mal formatado ou ausente.</div>`;
        }

        return lessonElement;
    }
}
