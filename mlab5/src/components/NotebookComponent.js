export class NotebookComponent {
    constructor(containerElement) {
        if (!containerElement) {
            throw new Error("O elemento container para o NotebookComponent é obrigatório.");
        }
        this.containerElement = containerElement;
        this.pyodide = null;
        this.render();
        this.addEventListeners();
    }

    render() {
        this.containerElement.innerHTML = `
            <div class="notebook-container">
                <picture>
                    <source media="(min-width: 1024px)" srcset="/vitrine-ml5/mlab5/assets/images/banner_play_desktop.png">
                    <source media="(min-width: 600px)" srcset="/vitrine-ml5/mlab5/assets/images/banner_play_tablet.png">
                    <img src="/vitrine-ml5/mlab5/assets/images/banner_play_mobile.png" alt="Playground Banner" style="width:100%;">
                </picture>
                <h2>Célula Python</h2>
                <textarea id="editor">import sys
print("Olá do Python!")
print(sys.version)

import numpy as np
print(np.array([1,2,3]) ** 2)</textarea>
                <button id="run">Executar</button>
                <pre id="output"></pre>
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
        await this.initPyodide();
        const code = this.containerElement.querySelector('#editor').value;
        const output = this.containerElement.querySelector('#output');
        output.innerHTML = ''; // Clear previous output

        try {
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
        }
    }
}
