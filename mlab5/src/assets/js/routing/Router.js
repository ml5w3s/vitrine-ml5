/**
 * Router - Uma classe simples para gerenciar rotas em uma SPA (Single-Page Application).
 * Lida com URLs baseadas em hash (ex: #/home, #/course/123).
 */
class Router {
    constructor(rootElement) {
        if (!rootElement) {
            throw new Error("O elemento raiz (rootElement) é obrigatório.");
        }
        this.routes = []; // Armazena as rotas como objetos { path, callback }
        this.rootElement = rootElement; // O elemento onde o conteúdo será renderizado

        // Adiciona o listener para o evento de mudança de hash
        window.addEventListener('hashchange', () => this.handleRouteChange());
        // Adiciona um listener para o carregamento inicial da página
        window.addEventListener('load', () => this.handleRouteChange());
    }

    /**
     * Adiciona uma nova rota ao roteador.
     * @param {string} path - O caminho da rota (ex: '/', '/course/:id', '/course/:courseId/lesson/:lessonId').
     * @param {Function} callback - A função a ser executada quando a rota corresponder.
     */
    addRoute(path, callback) {
        this.routes.push({ path, callback });
    }

    /**
     * Lida com a mudança de rota. É chamado quando a hash da URL muda.
     */
    handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        Debug.log('Router', `Navegando para: ${hash}`);
        Debug.updateView('Rota Atual', hash);

        // Itera sobre as rotas registradas para encontrar uma correspondência
        for (const route of this.routes) {
            const paramNames = [];
            // Converte o caminho da rota em uma expressão regular
            const regexPath = route.path.replace(/:(\w+)/g, (match, paramName) => {
                paramNames.push(paramName);
                return '([^\\/]+)';
            }) + '$';
            
            const regex = new RegExp(regexPath);
            const match = hash.match(regex);

            if (match) {
                const params = {};
                paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });

                // Chama o callback com os parâmetros extraídos
                route.callback(params);
                return; // Para a execução após encontrar a primeira rota correspondente
            }
        }

        // Se nenhuma rota for encontrada
        Debug.error('Router', `404 - Rota não encontrada: ${hash}`);
        this.rootElement.innerHTML = '<h2>404 - Página Não Encontrada</h2>';
    }
}
