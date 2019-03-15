const Console = require('./Console');

const messageListeners = {};

const listenMessage = (action, listener) => {
    messageListeners[action] = listener;
};

const sessionStorage = {};

const init = () => {
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
    });
    listenMessage('_SET_SESSION_STORAGE', params => {
        const {key, value} = params;
        sessionStorage[key] = value;
    });
    listenMessage('_GET_SESSION_STORAGE', params => {
        const {key, defaultValue} = params;
        return sessionStorage[key] || defaultValue;
    });
};


export {
    init,
    listenMessage
};
