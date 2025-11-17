// mlab5/src/js/utils/Debug.js
class Debug {
    static log(group, message, data = null) {
        console.log(`[${group}] ${message}`, data);
    }

    static error(group, message, error = null) {
        console.error(`[${group}] ERROR: ${message}`, error);
    }

    static table(group, title, data) {
        console.groupCollapsed(`[${group}] TABLE: ${title}`);
        console.table(data);
        console.groupEnd();
    }
}
export default Debug;
