
import { Debug } from '../helpers/Debug.js';

/**
 * DebugView.js - Componente visual para o painel de depuração.
 */
export class DebugView {
    constructor() {
        this.container = null;
        this.infoPanel = null;
        this.logPanel = null;
        this.errorPanel = null;
        this.visible = false;
        this.info = {};
        this.logs = [];
        this.errors = [];

        this._createPanel();
        this._addEventListeners();
        Debug.registerView(this); // Registra a si mesmo no módulo de Debug
    }

    _createPanel() {
        this.container = document.createElement('div');
        this.container.id = 'debug-panel';
        this.container.style.display = 'none';

        const header = document.createElement('div');
        header.className = 'debug-header';
        header.textContent = 'Painel de Depuração (Ctrl+Shift+D para ocultar)';
        this.container.appendChild(header);

        this.infoPanel = document.createElement('div');
        this.infoPanel.className = 'debug-section';
        this.container.appendChild(this.infoPanel);

        this.logPanel = document.createElement('div');
        this.logPanel.className = 'debug-section';
        this.logPanel.innerHTML = '<h4>Logs Recentes:</h4>';
        this.container.appendChild(this.logPanel);

        this.errorPanel = document.createElement('div');
        this.errorPanel.className = 'debug-section';
        this.errorPanel.innerHTML = '<h4>Erros Recentes:</h4>';
        this.container.appendChild(this.errorPanel);

        document.body.appendChild(this.container);
    }

    _addEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') { // Novo atalho: Ctrl+Shift+D
                this.toggleVisibility();
            }
        });
    }

    toggleVisibility() {
        this.visible = !this.visible;
        this.container.style.display = this.visible ? 'block' : 'none';
    }

    updateInfo(key, value) {
        this.info[key] = value;
        this._renderInfo();
    }

    addLog(message) {
        this.logs.unshift(message); // Adiciona no início
        if (this.logs.length > 10) {
            this.logs.pop(); // Mantém no máximo 10 logs
        }
        this._renderLogs();
    }

    addError(message) {
        this.errors.unshift(message);
        if (this.errors.length > 5) {
            this.errors.pop(); // Mantém no máximo 5 erros
        }
        this._renderErrors();
    }

    _renderInfo() {
        let html = '<h4>Informações:</h4>';
        for (const [key, value] of Object.entries(this.info)) {
            html += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        this.infoPanel.innerHTML = html;
    }

    _renderLogs() {
        let html = '<h4>Logs Recentes:</h4><ul>';
        this.logs.forEach(log => {
            html += `<li>${log}</li>`;
        });
        html += '</ul>';
        this.logPanel.innerHTML = html;
    }

    _renderErrors() {
        let html = '<h4>Erros Recentes:</h4><ul>';
        this.errors.forEach(error => {
            html += `<li class="debug-error">${error}</li>`;
        });
        html += '</ul>';
        this.errorPanel.innerHTML = html;
    }
}

