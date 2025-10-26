/**
 * PlaygroundComponent - Componente para renderizar um ambiente de codificação interativo.
 */
class PlaygroundComponent {
    /**
     * @param {HTMLElement} containerElement - O elemento HTML onde o playground será renderizado.
     * @param {Lesson} lesson - O objeto da aula contendo instruções, exercícios e configurações do playground.
     */
    constructor(containerElement, lesson) {
        if (!containerElement) {
            throw new Error("O elemento container para o PlaygroundComponent é obrigatório.");
        }
        if (!lesson || !lesson.content || !lesson.content.course) {
            throw new Error("O objeto 'lesson' com conteúdo de curso é obrigatório para o PlaygroundComponent.");
        }
        this.containerElement = containerElement;
        this.lessonContent = lesson.content.course; // Acessa o objeto 'course' dentro do content
        this.render();
        this.addEventListeners();
    }

    render() {
        const { articles, exercise, controls } = this.lessonContent;

        let articlesHtml = '';
        if (articles) {
            articles.forEach(article => {
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
                    // Simplificado para desktop por enquanto
                    articlesHtml += `<img src="${article.image.desktop || article.image.src}" alt="${article.image.caption || ''}">`;
                    if (article.image.caption) articlesHtml += `<p class="caption">${article.image.caption}</p>`;
                }
                if (article.code) {
                    articlesHtml += `<pre><code class="language-${article.programmingLanguage || 'html'}">${article.code.join('\n')}</code></pre>`;
                }
                articlesHtml += `</article>`;
            });
        }

        let exerciseHtml = '';
        if (exercise) {
            exerciseHtml += `<section class="exercise">`;
            exerciseHtml += `<h3>${exercise.headline}</h3>`;
            exerciseHtml += `<p>${exercise.text}</p>`;
            if (exercise.steps) {
                exerciseHtml += `<ol>`;
                exercise.steps.forEach(step => exerciseHtml += `<li>${step}</li>`);
                exerciseHtml += `</ol>`;
            }
            exerciseHtml += `</section>`;
        }

        let controlsHtml = '';
        if (controls && controls.templates) {
            controlsHtml += `<div class="playground-controls">`;
            controlsHtml += `<label for="template-select">Template:</label>`;
            controlsHtml += `<select id="template-select">`;
            controls.templates.forEach(template => {
                const templateName = template.split('/').pop().replace('.html', '');
                controlsHtml += `<option value="${template}">${templateName}</option>`;
            });
            controlsHtml += `</select>`;
            // Adicionar mais controles de estilo aqui no futuro
            controlsHtml += `</div>`;
        }


        this.containerElement.innerHTML = `
            <div class="playground-wrapper">
                <div class="playground-instructions">
                    ${articlesHtml}
                    ${exerciseHtml}
                </div>
                <div class="playground-editor">
                    ${controlsHtml}
                    <h4>Seu Código:</h4>
                    <textarea id="code-input" class="code-input" rows="15" cols="80"></textarea>
                    <button id="run-code-button">Executar Código</button>
                    <h4>Preview:</h4>
                    <iframe id="code-output" class="code-output" sandbox="allow-scripts allow-same-origin"></iframe>
                </div>
            </div>
        `;
        // Preenche o textarea com um código inicial se disponível no lessonContent
        // Por exemplo, o primeiro bloco de código do artigo, se houver
        const initialCodeBlock = articles.find(a => a.code);
        if (initialCodeBlock && initialCodeBlock.code) {
            this.containerElement.querySelector('#code-input').value = initialCodeBlock.code.join('\n');
        }
    }

    addEventListeners() {
        const runButton = this.containerElement.querySelector('#run-code-button');
        if (runButton) {
            runButton.addEventListener('click', () => this.runCode());
        }

        const templateSelect = this.containerElement.querySelector('#template-select');
        if (templateSelect) {
            templateSelect.addEventListener('change', (event) => this.applyTemplate(event.target.value));
        }
    }

    runCode() {
        const code = this.containerElement.querySelector('#code-input').value;
        const outputFrame = this.containerElement.querySelector('#code-output');
        outputFrame.srcdoc = code;
    }

    async applyTemplate(templateUrl) {
        try {
            const response = await fetch(templateUrl);
            if (!response.ok) throw new Error(`Erro ao carregar template: ${templateUrl}`);
            const templateHtml = await response.text();

            const codeInput = this.containerElement.querySelector('#code-input');
            // Injeta o código do usuário no template
            const finalHtml = templateHtml.replace('<!-- CODE_PLACEHOLDER -->', codeInput.value);
            this.containerElement.querySelector('#code-output').srcdoc = finalHtml;

            // Futuramente, aplicar estilos do lesson.controls.styles
        } catch (error) {
            console.error("Erro ao aplicar template:", error);
            this.containerElement.querySelector('#code-output').srcdoc = `<p style="color:red;">Erro ao carregar template: ${error.message}</p>`;
        }
    }
}
