const Console = require('./Console');
const Message = require('./Message');

class Storage {
    constructor(type) {
        if (!chrome.storage) {
            Console.warn(`You need "storage" permission to use ${type} storage`);
            return;
        }
        this.storage = chrome.storage[type];
    }
    set(key, value) {
        if (!this.storage) {
            return;
        }
        const map = {};
        map[key] = value;
        return new Promise((resolve) => {
            this.storage.set(map, resolve);
        });
    }
    get(key, defaultValue) {
        if (!this.storage) {
            return;
        }
        const storage = this.storage
        return new Promise((resolve) => {
            storage.get(key, (items) => {
                resolve(items[key] === undefined ? defaultValue : items[key]);
            });
        })
    }
    remove(key) {
        if (!this.storage) {
            return;
        }
        const storage = this.storage
        return new Promise((resolve) => {
            storage.remove(key, () => {
                resolve();
            });
        })
    }
}

export const LocalStorage = new Storage('local');
export const SyncStorage = new Storage('sync');

export const SessionStorage = {
    set: async (key, value) => {
        return await Message.send('_SET_SESSION_STORAGE', {key, value})
    },
    get: async (key, defaultValue) => {
        return await Message.send('_GET_SESSION_STORAGE', {key, defaultValue});
    },
    remove: async (key) => {
        return await Message.send('_REMOVE_SESSION_STORAGE', {key});
    },
}
