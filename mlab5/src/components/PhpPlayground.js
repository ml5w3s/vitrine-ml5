export class PhpPlayground {
    constructor(container, initialCode = '') {
        this.container = container;
        this.initialCode = initialCode || "<?php\necho 'Olá, Vitrine ML5! ' . PHP_VERSION;\n\n$arr = [1, 2, 3];\nprint_r($arr);";
        this.php = null;
        this.isLoading = false;

        this.render();
        this.initPhp();
    }

    render() {
        this.container.innerHTML = '';
        this.container.className = 'php-playground-container';
        
        // Estilos Inline para garantir isolamento e rapidez (pode mover para CSS depois)
        const style = document.createElement('style');
        style.textContent = `
            .php-playground-container {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                height: 500px;
                background-color: #f5f5f5;
            }
            .php-toolbar {
                padding: 10px;
                background-color: #e0e0e0;
                border-bottom: 1px solid #ccc;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .php-title {
                font-weight: bold;
                color: #5a67d8; /* Cor meio PHP */
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .php-editor-area {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            #php-code-input {
                flex: 1;
                width: 100%;
                background-color: #282c34;
                color: #abb2bf;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 14px;
                border: none;
                padding: 15px;
                resize: none;
                outline: none;
            }
            #php-output {
                height: 150px;
                background-color: #fff;
                color: #333;
                border-top: 1px solid #ddd;
                padding: 15px;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 13px;
                overflow-y: auto;
                white-space: pre-wrap;
            }
            .btn-run {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: background 0.2s;
            }
            .btn-run:hover {
                background-color: #45a049;
            }
            .btn-run:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            .status-indicator {
                font-size: 0.8em;
                color: #666;
            }
        `;
        this.container.appendChild(style);

        // Estrutura HTML
        const toolbar = document.createElement('div');
        toolbar.className = 'php-toolbar';
        toolbar.innerHTML = `
            <div class="php-title">
                <span>🐘</span> PHP Playground (WASM)
                <span id="php-status" class="status-indicator">Carregando engine...</span>
            </div>
            <button id="php-run-btn" class="btn-run" disabled>
                ▶ Executar
            </button>
        `;

        const editorArea = document.createElement('div');
        editorArea.className = 'php-editor-area';
        
        const textarea = document.createElement('textarea');
        textarea.id = 'php-code-input';
        textarea.value = this.initialCode;
        textarea.spellcheck = false;

        const output = document.createElement('div');
        output.id = 'php-output';
        output.textContent = '// A saída do script aparecerá aqui...';

        editorArea.appendChild(textarea);
        editorArea.appendChild(output);

        this.container.appendChild(toolbar);
        this.container.appendChild(editorArea);

        // Event Listeners
        this.runBtn = toolbar.querySelector('#php-run-btn');
        this.statusLabel = toolbar.querySelector('#php-status');
        this.outputDiv = output;
        this.inputArea = textarea;

        this.runBtn.addEventListener('click', () => this.runCode());
    }

    async initPhp() {
        try {
            this.updateStatus('Baixando PHP WebAssembly...', true);
            
            // Verifica se está rodando localmente sem servidor
            if (window.location.protocol === 'file:') {
                throw new Error('CORS Error: Módulos ES6 e WebAssembly não funcionam via protocolo "file://". Por favor, use um servidor local.');
            }

            // Importa as funções necessárias do CDN esm.sh
            const { getPHPLoaderModule, loadPHPRuntime } = await import('https://esm.sh/@php-wasm/web@3.0.35');
            
            this.updateStatus('Carregando runtime PHP 8.2...', true);
            
            // Obtém o módulo carregador para a versão específica do PHP (8.2 é uma boa escolha padrão)
            const loaderModule = await getPHPLoaderModule("8.2");
            
            // Inicializa o runtime
            this.php = await loadPHPRuntime(loaderModule);
            
            // Adiciona listener para capturar STDOUT e STDERR
            this.php.addEventListener('output', (event) => {
                let text = '';
                if (typeof event.detail === 'string') {
                    text = event.detail;
                } else if (event.detail instanceof Uint8Array) {
                    text = new TextDecoder().decode(event.detail);
                } else {
                    text = String(event.detail); // Fallback
                }
                this.appendOutput(text);
            });

            this.updateStatus('Pronto (PHP 8.2)', false);
            this.runBtn.disabled = false;

        } catch (error) {
            console.error("Erro ao carregar PHP WASM:", error);
            this.updateStatus('Erro ao carregar PHP.', false);
            this.appendOutput(`Erro crítico: Não foi possível carregar o motor PHP.\n${error.message}\nVerifique o console para mais detalhes.`);
        }
    }

    async runCode() {
        if (!this.php) return;

        this.outputDiv.textContent = ''; // Limpa saída anterior
        this.runBtn.disabled = true;
        this.runBtn.textContent = 'Executando...';

        const code = this.inputArea.value;

        try {
            // Executa o código
            // A API run do PhpWeb retorna o exit code
            const exitCode = await this.php.run(code);
            
            if (exitCode !== 0) {
                this.appendOutput(`\n\n[Processo finalizado com código ${exitCode}]`);
            }
        } catch (error) {
            this.appendOutput(`\nErro de Execução: ${error.message}`);
        } finally {
            this.runBtn.disabled = false;
            this.runBtn.textContent = '▶ Executar';
        }
    }

    updateStatus(text, isLoading) {
        this.statusLabel.textContent = text;
        this.isLoading = isLoading;
        if (isLoading) {
            this.statusLabel.style.color = '#e67e22';
        } else {
            this.statusLabel.style.color = '#27ae60';
        }
    }

    appendOutput(text) {
        this.outputDiv.textContent += text;
        this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
    }
}
