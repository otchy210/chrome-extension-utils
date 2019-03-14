const Console = require('./Console');
const Permissions = require('./Permissions');

const getCurrent = async () => {
    const isTabsPermitted = await Permissions.contains('tabs');
    if (!isTabsPermitted) {
        Console.warn('You need "tabs" permission to get all information about tabs');
    }
    return new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const tab = tabs[0];
            resolve(tab);
        })
    });
};

exports.getCurrent = getCurrent;
