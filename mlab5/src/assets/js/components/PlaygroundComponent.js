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
        this.setInitialCode(); // Call the new method here
    }

    render() {
        const { articles: rawArticles, exercise, controls, playground } = this.lessonContent;
        const articles = Array.isArray(rawArticles) ? rawArticles : [];

        let articlesHtml = '';
        if (articles.length) {
            articles.forEach(article => {
                // Skip hidden articles and articles specifically for playground instructions
                if (article.hidden || article.forPlayground) {
                    return;
                }

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
                    const codeText = Array.isArray(article.code) ? article.code.join('\n') : String(article.code);
                    articlesHtml += `<pre><code class="language-${article.programmingLanguage || 'html'}">${codeText}</code></pre>`;
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
        if (controls && Array.isArray(controls.templates)) {
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

        // Use playground.headline and playground.instructions for the main playground instructions
        const playgroundHeadline = playground && playground.headline ? `<h3>${playground.headline}</h3>` : '';
        const playgroundInstructions = playground && playground.instructions ? `<p>${playground.instructions}</p>` : '';


        this.containerElement.innerHTML = `
            <div class="playground-wrapper">
            <section class="container">
                <article class="item">
                <picture>
                    <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_play_desktop.png">
                    <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/src/assets/images/banner_play_tablet.png">
                    <img src="/vitrine-ml5/mlab5/src/assets/images/banner_play_mobile.png" alt="Playground Banner" style="width:100%;">
                </picture>
                </article>
            </section>
                <div class="playground-instructions">
                    ${playgroundHeadline}
                    ${playgroundInstructions}
                    <section class="container">
                        <article class="item">
                            <h3 id="link_instrucoes" style="cursor:pointer">Instruções</h3>
                            <div id="texto" style="display:none;">
                                <p id="instrucoes"></p>
                            </div>
                        </article>
                    </section>
                </div>
                <div class="playground-editor">
                    <!-- controlsHtml removido daqui conforme solicitado -->
                    <h4>Seu Código:</h4>
                    <textarea id="code-input" class="code-input" rows="15" cols="80"></textarea>
                    <button id="run-code-button">Executar Código</button>
                    <h4>Preview:</h4>
                    <iframe id="code-output" class="code-output" sandbox="allow-scripts allow-same-origin"></iframe>
                </div>
            </div>
            <section class="container">
                <article class="item">
                    <h3 id="link_ajustes" style="cursor:pointer">Ajustes</h3>
                    <div id="ajustes" style="display:none;"></div>
                </article>
            </section>
        `;
    }

    setInitialCode() {
        const { articles } = this.lessonContent;
        const codeInput = this.containerElement.querySelector('#code-input');
        if (!codeInput) {
            console.error("Elemento #code-input não encontrado no PlaygroundComponent.");
            return;
        }

        // O code-input agora inicia vazio por padrão, conforme solicitado.

        // Popular instruções
        const instrucoesEl = this.containerElement.querySelector('#instrucoes');
        if (instrucoesEl) {
            let instructionsText = '';
            const instrArticle = Array.isArray(articles) ? articles.find(a => a.forPlayground && (a.text || a.list)) : null;
            if (instrArticle) {
                if (instrArticle.text) instructionsText += instrArticle.text + '\n';
                if (instrArticle.list) instructionsText += instrArticle.list.map(i => `• ${i}`).join('\n');
            }
            const stored = localStorage.getItem('instrucoes');
            if (stored) {
                instructionsText += (instructionsText ? '\n\n' : '') + stored;
            }
            instrucoesEl.textContent = instructionsText.trim();
        }

        // Popular ajustes com os templates
        const ajustesDiv = this.containerElement.querySelector('#ajustes');
        if (ajustesDiv) {
            const templates = ['classico.html', 'dark_mode.html', 'moderno.html'];
            let templatesHtml = '<h4>Templates</h4>';
            templates.forEach(template => {
                const templateName = template.replace('.html', '');
                templatesHtml += `
                    <div>
                        <input type="radio" id="${templateName}" name="template" value="/vitrine-ml5/mlab5/src/assets/js/components/templates/${template}">
                        <label for="${templateName}">${templateName}</label>
                    </div>
                `;
            });
            templatesHtml += '<button id="apply-customization-button">Aplicar</button>';
            ajustesDiv.innerHTML = templatesHtml;
        }
    }

    addEventListeners() {
        const runButton = this.containerElement.querySelector('#run-code-button');
        if (runButton) {
            runButton.addEventListener('click', () => this.runCode());
        }

        const applyCustomizationButton = this.containerElement.querySelector('#apply-customization-button');
        if (applyCustomizationButton) {
            applyCustomizationButton.addEventListener('click', () => this.applyCustomization());
        }

        // Toggle simples para instruções/ajustes
        const linkInstrucoes = this.containerElement.querySelector('#link_instrucoes');
        const texto = this.containerElement.querySelector('#texto');
        if (linkInstrucoes && texto) {
            linkInstrucoes.addEventListener('click', () => {
                texto.style.display = texto.style.display === 'none' ? 'block' : 'none';
            });
        }
        const linkAjustes = this.containerElement.querySelector('#link_ajustes');
        const ajustes = this.containerElement.querySelector('#ajustes');
        if (linkAjustes && ajustes) {
            linkAjustes.addEventListener('click', () => {
                ajustes.style.display = ajustes.style.display === 'none' ? 'block' : 'none';
            });
        }
    }

    runCode() {
        const code = this.containerElement.querySelector('#code-input').value;
        const outputFrame = this.containerElement.querySelector('#code-output');
        outputFrame.srcdoc = code;
    }

    async applyCustomization() {
        const selectedTemplate = this.containerElement.querySelector('input[name="template"]:checked');
        if (selectedTemplate) {
            await this.applyTemplate(selectedTemplate.value);
        } else {
            alert('Por favor, selecione um template.');
        }
    }

    async applyTemplate(templateUrl) {
        try {
            const response = await fetch(templateUrl);
            if (!response.ok) throw new Error(`Erro ao carregar template: ${templateUrl}`);
            const templateHtml = await response.text();

            const codeInput = this.containerElement.querySelector('#code-input');
            const finalHtml = templateHtml.replace('<!-- CODE_PLACEHOLDER -->', codeInput.value);
            this.containerElement.querySelector('#code-output').srcdoc = finalHtml;
        } catch (error) {
            console.error("Erro ao aplicar template:", error);
            this.containerElement.querySelector('#code-output').srcdoc = `<p style="color:red;">Erro ao carregar template: ${error.message}</p>`;
        }
    }
}
