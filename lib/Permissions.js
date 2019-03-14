const list = async () => {
    return new Promise(resolve => 
        chrome.permissions.getAll(resolve)
    );
};
exports.list = list;

const contains = async (permissions) => {
    permissions = Array.isArray(permissions) ? permissions : [permissions];
    return new Promise(resolve =>
        chrome.permissions.contains({permissions}, resolve)
    );
}
exports.contains = contains;
