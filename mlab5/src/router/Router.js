/**
 * Router.js
 * 
 * This is a placeholder for a simple hash-based router.
 * It will handle routing for the application.
 */
import { Debug } from '../helpers/Debug.js';

class Router {
    constructor(eventBus) {
        this.routes = [];
        this.eventBus = eventBus;
        this.currentView = null; // Guarda a referência da view atual para limpeza
        this.appRoot = document.getElementById('app-root'); // O elemento raiz da aplicação
        Debug.log('Router', 'Router instantiated.');
    }

    /**
     * Initializes the router, starting to listen for route changes.
     */
    init() {
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        window.addEventListener('load', this.handleRouteChange.bind(this));
        Debug.log('Router', 'Router initialized and listening for changes.');
        this.handleRouteChange();
    }

    /**
     * Adds a new route to the router.
     * Supports route parameters like ':paramName'.
     * @param {string} name - The name of the route (e.g., 'home', 'courseDetail').
     * @param {string} path - The path for the route (e.g., '/', '/course/:courseId').
     * @param {function} handler - The function to execute when the route is matched. It must return an HTMLElement.
     */
    addRoute(name, path, handler) {
        const paramNames = [];
        const regexPath = path.replace(/:(\w+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)';
        });
        const regex = new RegExp(`^${regexPath}$`);

        this.routes.push({ name, path, regex, handler, paramNames });
        Debug.log('Router', `Route added: ${name} -> ${path}`);
    }

    /**
     * Generates a URL for a named route with the given parameters.
     * @param {string} name - The name of the route.
     * @param {object} params - An object with parameter values.
     * @returns {string} The generated URL.
     */
    generateUrl(name, params = {}) {
        const route = this.routes.find(r => r.name === name);
        if (!route) {
            Debug.error('Router', `Route with name '${name}' not found.`);
            return '#/not-found';
        }

        let path = route.path;
        for (const key in params) {
            path = path.replace(`:${key}`, params[key]);
        }
        return `#${path}`;
    }

    /**
     * Handles the route change event.
     */
    async handleRouteChange() {
        const hash = window.location.hash || '#/';
        const path = hash.substring(1); // Remove the '#'
        Debug.log('Router', `Handling route change for: ${path}`);

        for (const route of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                for (let i = 0; i < route.paramNames.length; i++) {
                    params[route.paramNames[i]] = match[i + 1];
                }
                Debug.log('Router', `Executing handler for route: ${path} with params:`, params);

                // 1. Destruir a view antiga
                if (this.currentView && typeof this.currentView.destroy === 'function') {
                    this.currentView.destroy();
                    Debug.log('Router', 'Previous view destroyed.');
                }

                // 2. Obter a nova view do handler (que agora retorna um elemento)
                const newViewElement = await route.handler(params);

                // 3. Limpar o root e adicionar a nova view
                this.appRoot.innerHTML = '';
                this.appRoot.appendChild(newViewElement);
                this.currentView = newViewElement; // Armazena a nova view
                window.scrollTo(0, 0);

                Debug.log('Router', 'New view rendered and attached.');
                this.eventBus.publish('contentRendered');
                return;
            }
        }

        Debug.log('Router', `No handler found for route: ${path}`);
        this.eventBus.publish('routeNotFound', hash);
    }

    /**
     * Navigates to the specified path.
     * @param {string} path - The path to navigate to.
     */
    navigateTo(path) {
        window.location.hash = path;
    }
}

export default Router;
