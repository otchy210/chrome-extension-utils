const Console = require('./Console');

const messageListeners = {};

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
};

const listenMessage = (action, listener) => {
    messageListeners[action] = listener;
};

export {
    init,
    listenMessage
};
