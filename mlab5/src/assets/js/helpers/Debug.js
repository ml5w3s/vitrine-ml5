/**
 * Debug.js - Módulo centralizado para logging estratégico.
 */
export class Debug {
    static enabled = true; // Flag para ligar/desligar todos os logs
    static view = null; // Referência para a instância de DebugView

    /**
     * Registra a instância da view de debug para atualizações de UI.
     * @param {DebugView} viewInstance 
     */
    static registerView(viewInstance) {
        this.view = viewInstance;
    }

    /**
     * Loga uma mensagem agrupada no console.
     * @param {string} group - O nome do grupo (ex: 'Router', 'ApiService').
     * @param  {...any} args - As mensagens a serem logadas.
     */
    static log(group, ...args) {
        if (!this.enabled) return;

        console.groupCollapsed(`[${group}] - ${args[0]}`);
        args.slice(1).forEach(arg => console.log(arg));
        console.groupEnd();

        if (this.view) {
            this.view.addLog(`[${group}] ${args[0]}`);
        }
    }

    /**
     * Loga um erro agrupado no console e na view.
     * @param {string} group - O nome do grupo.
     * @param {...any} args - As mensagens de erro.
     */
    static error(group, ...args) {
        if (!this.enabled) return;

        console.group(`[${group}] - ERRO`);
        args.forEach(arg => console.error(arg));
        console.groupEnd();

        if (this.view) {
            const errorMessage = args.map(arg => arg.message || String(arg)).join(' ');
            this.view.addError(`[${group}] ${errorMessage}`);
        }
    }

    /**
     * Loga dados em formato de tabela no console.
     * @param {string} group - O nome do grupo.
     * @param {string} title - Um título para a tabela.
     * @param {object|Array} data - Os dados a serem exibidos.
     */
    static table(group, title, data) {
        if (!this.enabled) return;

        console.groupCollapsed(`[${group}] - Tabela: ${title}`);
        console.table(data);
        console.groupEnd();
    }

    /**
     * Atualiza uma informação específica na view de debug.
     * @param {string} key - A chave da informação (ex: 'route', 'course').
     * @param {string} value - O valor a ser exibido.
     */
    static updateView(key, value) {
        if (this.view) {
            this.view.updateInfo(key, value);
        }
    }
}
