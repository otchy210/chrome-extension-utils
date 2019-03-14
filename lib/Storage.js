const Console = require('./Console');

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
}

export const LocalStorage = new Storage('local');
export const SyncStorage = new Storage('sync');

// export const SessionStorage