export class NotebookComponent {
    /**
     * @param {HTMLElement} containerElement - O elemento HTML onde o notebook será renderizado.
     * @param {Lesson} [lesson] - O objeto da aula opcional.
     */
    constructor(containerElement, lesson) {
        if (!containerElement) {
            throw new Error("O elemento container para o NotebookComponent é obrigatório.");
        }
        this.containerElement = containerElement;
        
        // Se a lição não for passada, tenta buscar do localStorage
        if (!lesson) {
            const storedLesson = localStorage.getItem('currentLessonData') || 
                                 localStorage.getItem('aula') || 
                                 localStorage.getItem('lessonData');
            if (storedLesson) {
                try {
                    this.lessonData = JSON.parse(storedLesson);
                } catch (e) {
                    console.error("Erro ao parsear lessonData do localStorage:", e);
                }
            }
        } else {
            // Se for uma instância de Lesson, pega o course; senão assume que é o objeto direto
            this.lessonData = lesson.content ? lesson.content.course : lesson;
        }

        this.pyodide = null;
        this.render();
        this.addEventListeners();
    }

    render() {
        let articlesHtml = '';
        if (this.lessonData && Array.isArray(this.lessonData.articles)) {
            this.lessonData.articles.forEach(article => {
                // Pular artigos ocultos ou específicos para playground
                if (article.hidden || article.forPlayground) return;

                articlesHtml += `<article class="item">`;
                if (article.headline) articlesHtml += `<h4>${article.headline}</h4>`;
                if (article.alternativeHeadline) articlesHtml += `<h5>${article.alternativeHeadline}</h5>`;
                if (article.text) articlesHtml += `<p>${article.text}</p>`;
                if (article.list) {
                    articlesHtml += `<ul>`;
                    article.list.forEach(item => articlesHtml += `<li>${item}</li>`);
                    articlesHtml += `</ul>`;
                }
                if (article.image) {
                    const imgSrc = article.image.desktop || article.image.src;
                    if (imgSrc) {
                        articlesHtml += `<img src="/vitrine-ml5/mlab5/${imgSrc}" alt="${article.image.caption || ''}" style="max-width:100%;">`;
                        if (article.image.caption) articlesHtml += `<p class="caption">${article.image.caption}</p>`;
                    }
                }
                if (article.code) {
                    const codeText = Array.isArray(article.code) ? article.code.join('\n') : String(article.code);
                    articlesHtml += `<pre><code class="language-${article.programmingLanguage || 'python'}">${codeText}</code></pre>`;
                }
                articlesHtml += `</article>`;
            });
        }

        const bannerImg = this.lessonData?.banner || "/vitrine-ml5/mlab5/assets/images/banner_play_mobile.png";

        this.containerElement.innerHTML = `
            <div class="notebook-container">
                <style>
                    @keyframes blink-purple {
                        0% { opacity: 1; color: #8e44ad; }
                        50% { opacity: 0.5; color: #9b59b6; }
                        100% { opacity: 1; color: #8e44ad; }
                    }
                    .loading-blink {
                        animation: blink-purple 1s infinite;
                        font-weight: bold;
                        margin-top: 10px;
                    }
                    .notebook-content { margin-bottom: 20px; }
                    .notebook-editor-section { border-top: 2px solid #eee; padding-top: 20px; margin-top: 20px; }
                </style>
                <section class="container">
                    <article class="item">
                        <picture>
                            <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/assets/images/banner_play_desktop.png">
                            <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/assets/images/banner_play_tablet.png">
                            <img src="${bannerImg}" alt="Notebook Banner" style="width:100%;">
                        </picture>
                    </article>
                </section>

                <div class="notebook-content container">
                    ${articlesHtml}
                </div>

                <div class="notebook-editor-section container">
                    <article class="item">
                        <h2>Célula Python</h2>
                        <textarea id="editor" rows="10" style="width: 100%; font-family: monospace;">import sys
print("Olá do Python!")
print(sys.version)

import numpy as np
print(np.array([1,2,3]) ** 2)</textarea>
                        <br>
                        <button id="run" class="btn">Executar</button>
                        <div id="loading" class="loading-blink" style="display:none;">Aguarde, processando...</div>
                        <pre id="output" style="background: #f4f4f4; padding: 10px; margin-top: 10px; min-height: 50px; border-radius: 4px;"></pre>
                    </article>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        const runButton = this.containerElement.querySelector('#run');
        if (runButton) {
            runButton.addEventListener('click', () => this.runCode());
        }
    }

    async initPyodide() {
        if (!this.pyodide) {
            // Assumes pyodide.js is loaded globally
            this.pyodide = await loadPyodide();
            await this.pyodide.loadPackage(['numpy', 'matplotlib']);
        }
    }

    async runCode() {
        const loading = this.containerElement.querySelector('#loading');
        const output = this.containerElement.querySelector('#output');
        
        loading.style.display = 'block';
        output.innerHTML = ''; // Clear previous output

        // Pequeno delay para garantir que a UI atualize e mostre a mensagem antes de travar a thread com o Python
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            await this.initPyodide();
            const code = this.containerElement.querySelector('#editor').value;

            // Pass the output element to the Python scope
            this.pyodide.globals.set('output', output);

            this.pyodide.runPython(`
                import sys
                from js import output
                class Capture:
                    def write(self, text):
                        output.innerHTML += text
                    def flush(self): pass
                sys.stdout = Capture()
                sys.stderr = Capture()
            `);

            let result = this.pyodide.runPython(code);

            if (result !== undefined) {
                output.innerHTML += "\nResultado: " + result.toString();
            }
        } catch (err) {
            output.innerHTML += "\nErro: " + err.message;
        } finally {
            loading.style.display = 'none';
        }
    }
}
