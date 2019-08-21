const Console = require('./Console');
const Permissions = require('./Permissions');
const Windows = require('./Windows');
const Background = require('./Background');

const newPromiseIfPermitted = async (resolver) => {
    const isTabsPermitted = await Permissions.contains('tabs');
    if (!isTabsPermitted) {
        Console.warn(
            'You need "tabs" permission to use "chrome.tabs" API.\n' +
            'Also, you can\'t use the API withih page context even if you get "tabs" permission.\n' +
            'Consider sending message from page to background to use the API from page context.\n'
        );
        return Promise.resolve(false);
    }
    return new Promise(resolver);
};

export const getCurrent = async () => {
    return newPromiseIfPermitted(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tab = tabs[0];
            resolve(tab);
        })
    });
};

export const openNew = async (url, active = true) => {
    return newPromiseIfPermitted(resolve => {
        chrome.tabs.create({url, active}, (tab) => {
            const listener = (tabId, info) => {
                if (tabId !== tab.id || info.status !== 'complete') {
                    return;
                }
                chrome.tabs.onUpdated.removeListener(listener);
                resolve(tab);
            };
            chrome.tabs.onUpdated.addListener(listener);
        });
    });
};

export const activate = (tabId) => {
    return newPromiseIfPermitted(resolve => {
        chrome.tabs.update(tabId, {active: true}, resolve);
    });
};

export const close = (tabId) => {
    return newPromiseIfPermitted(resolve => {
        chrome.tabs.remove(tabId, resolve);
    });
};

export const closeCurrent = async () => {
    const tab = await getCurrent();
    return close(tab.id);
};

export const captureVisibleTab = async () => {
    const isActiveTabPermitted = await Permissions.contains('activeTab');
    if (!isActiveTabPermitted) {
        Console.warn('You need "activeTab" permission to capture visible tab.')
        return Promise.resolve(false);
    }
    return newPromiseIfPermitted(async resolve => {
        const win = await Windows.getCurrent();
        chrome.tabs.captureVisibleTab(win.id, {format: 'png'}, resolve);
    });
};

export const captureVisibleTabAsCanvas = () => {
    return captureVisibleTab().then(dataUrl => {
        return newPromiseIfPermitted(resolve => {
            const img = document.createElement('img');
            const canvas = document.createElement('canvas');
            const onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
                img.removeEventListener('load', onload);
            };
            img.addEventListener('load', onload);
            img.setAttribute('src', dataUrl);
        });
    });
};

let getWindowInfoCounter = 0;
export const getWindowInfo = async (tabId, ...properties) => {
    const paramsAccessor = properties.map(property => {
        const parameterChain = property
            .split('.')
            .filter(prop => !(/^[_-a-zA-Z0-9]+$/.test(prop)))
            .map(prop => `['${prop}']`)
            .join('');
        const accessor = `window${parameterChain}`;
        return `'${property}':${accessor}`;
    }).join(',');
    const action = `_GET_WINDOW_INFO_${++getWindowInfoCounter}`;
    const code = `(() => {
        const params = {${paramsAccessor}};
        chrome.runtime.sendMessage(
            '${chrome.runtime.id}',
            {action: '${action}', params},
        )
    })();`;
    return new Promise(resolve => {
        Background.listenMessage(action, params => {
            resolve(params);
            Background.unlistenMessage(action);
        })
        chrome.tabs.executeScript(tabId, {code});
    });
};
