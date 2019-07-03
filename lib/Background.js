const Console = require('./Console');

const messageListeners = {};
const sessionStorage = {};

export const listenMessage = (action, listener) => {
    messageListeners[action] = listener;
};

export const unlistenMessage = (action) => {
    delete messageListeners[action];
};

export const init = () => {
    Console.log('Background.init');
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const {action, params} = message;
        if (!messageListeners[action]) {
            return;
        }
        (async () => {
            const response = await messageListeners[action](params);
            sendResponse(response);
        })();
        return true;    // https://developer.chrome.com/extensions/runtime#event-onMessage
    });
    listenMessage('_SET_SESSION_STORAGE', params => {
        const {key, value} = params;
        sessionStorage[key] = value;
    });
    listenMessage('_GET_SESSION_STORAGE', params => {
        const {key, defaultValue} = params;
        return sessionStorage[key] || defaultValue;
    });
    listenMessage('_REMOVE_SESSION_STORAGE', params => {
        const {key} = params;
        delete sessionStorage[key];
    });
};
