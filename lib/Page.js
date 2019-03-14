const sendMessage = ((action, params) => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, params}, null, resolve);
    })
});

export {
    sendMessage
}
