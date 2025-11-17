// mlab5/src/js/utils/EventBus.js
class EventBus {
    constructor() {
        this.listeners = {};
        console.log('EventBus initialized.');
    }

    subscribe(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
        console.log(`Subscribed to ${eventType}`);
    }

    publish(eventType, data) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => callback(data));
            console.log(`Published ${eventType} with data:`, data);
        }
    }
}
export default EventBus;
