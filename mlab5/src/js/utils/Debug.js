// mlab5/src/js/utils/Debug.js

/**
 * Debug.js
 * 
 * A simple utility for logging debug messages.
 */
class Debug {
    /**
     * Logs a message to the console.
     * @param {string} source - The source of the log message (e.g., 'App', 'Router').
     * @param {string} message - The message to log.
     */
    static log(source, message) {
        console.log(`[${source}] ${message}`);
    }

    /**
     * Logs an error message to the console.
     * @param {string} source - The source of the log message.
     * @param {string} message - The error message to log.
     */
    static error(source, message) {
        console.error(`[${source}] ${message}`);
    }
}

export default Debug;