// mlab5/src/js/router/Router.js
class Router {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.routes = {};
        console.log('Router initialized.');
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
        console.log(`Route added: ${path}`);
    }

    init() {
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
        this.handleHashChange(); // Handle initial load
        console.log('Router started listening for hash changes.');
    }

    handleHashChange() {
        const path = window.location.hash.slice(1) || '/';
        console.log(`Hash changed to: ${path}`);
        // Publish a route change event
        this.eventBus.publish('routeChange', { path });

        // For now, just log the route
        if (this.routes[path]) {
            this.routes[path]();
        } else {
            console.warn(`No handler for route: ${path}`);
        }
    }
}
export default Router;