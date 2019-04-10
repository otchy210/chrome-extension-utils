export const list = async () => {
    return new Promise(resolve => {
            if (!chrome.permissions) {
                resolve([]);
                return;
            }
            chrome.permissions.getAll(resolve)
        }
    );
};

export const contains = async (permissions) => {
    permissions = Array.isArray(permissions) ? permissions : [permissions];
    return new Promise(resolve => {
            if (!chrome.permissions) {
                resolve(false);
                return;
            }
            chrome.permissions.contains({permissions}, resolve)
        }
    );
}
