const Console = require('./Console');
const Permissions = require('./Permissions');
const GLOBAL_VAR = '@otchy/chrome-extension-utils';

const background = () => {
    Console.log('Init.background');
    const extensionId = chrome.runtime.id;
    (async () => {
        const isTabsPermitted = await Permissions.contains('tabs');
        if (!isTabsPermitted) {
            Console.warn('You need "tabs" permission to initialize the extension');
            return;
        }
        const putExtensionIdInPage = (tab) => {
            if (tab.url && tab.url.startsWith('chrome://')) {
                return;
            }
            const scriptBody = `window['${GLOBAL_VAR}'] = '${extensionId}';`;
            const base64ScriptBody = btoa(scriptBody);
            const dataUri = `data:text/javascript;base64,${base64ScriptBody}`;
            chrome.tabs.executeScript(tab.id, {code: `
                (function(d, s) {
                    s = d.createElement('script');
                    s.src = '${dataUri}';
                    d.head.appendChild(s);
                })(document);
            `});
        };
        chrome.tabs.onCreated.addListener(putExtensionIdInPage);
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (!changeInfo.status || changeInfo.status !== 'complete') {
                return;
            }
            putExtensionIdInPage(tab);
        });

    })();
};
exports.background = background;

const page = () => {
    Console.log('Init.page');
};
exports.page = page;
