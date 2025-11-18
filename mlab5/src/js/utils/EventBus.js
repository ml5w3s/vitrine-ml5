// mlab5/src/js/utils/EventBus.js

/**
 * EventBus.js
 * 
 * A simple pub/sub event bus.
 */
class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event.
     * @param {string} event - The event name.
     * @param {function} callback - The function to execute when the event is published.
     */
    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Publish an event.
     * @param {string} event - The event name.
     * @param {any} data - The data to pass to the subscribers.
     */
    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

export default EventBus;