/**
 * Router.js
 * 
 * This is a placeholder for a simple hash-based router.
 * It will handle routing for the application.
 */
import Debug from '../utils/Debug.js';

class Router {
    constructor(eventBus) {
        this.routes = []; // Changed to an array to store route objects
        this.eventBus = eventBus;
        Debug.log('Router', 'Router instantiated.');
    }

    /**
     * Initializes the router, starting to listen for route changes.
     */
    init() {
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        window.addEventListener('load', this.handleRouteChange.bind(this));
        Debug.log('Router', 'Router initialized and listening for changes.');
        // Call handleRouteChange immediately to process the initial URL
        this.handleRouteChange();
    }

    /**
     * Adds a new route to the router.
     * Supports route parameters like ':paramName'.
     * @param {string} path - The path for the route (e.g., '#/home', '#/course/:courseId').
     * @param {function} handler - The function to execute when the route is matched.
     */
    addRoute(path, handler) {
        const paramNames = [];
        // Convert path to a regex, capturing parameter values
        const regexPath = path.replace(/:(\w+)/g, (match, paramName) => {
            paramNames.push(paramName);
            return '([^/]+)'; // Capture group for the parameter value
        });
        const regex = new RegExp(`^${regexPath}$`); // Match from start to end

        this.routes.push({ regex, handler, paramNames });
        Debug.log('Router', `Route added: ${path}`);
    }

    /**
     * Handles the route change event.
     */
    handleRouteChange() {
        const hash = window.location.hash || '#/';
        Debug.log('Router', `Handling route change for: ${hash}`);

        for (const route of this.routes) {
            const match = hash.match(route.regex);
            if (match) {
                const params = {};
                // Populate params object with captured values
                for (let i = 0; i < route.paramNames.length; i++) {
                    params[route.paramNames[i]] = match[i + 1]; // match[0] is the full string
                }
                Debug.log('Router', `Executing handler for route: ${hash} with params:`, params);
                route.handler(params);
                return; // Stop after the first match
            }
        }

        Debug.log('Router', `No handler found for route: ${hash}`);
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
