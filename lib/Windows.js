
export const getCurrent = async () => {
    return new Promise(resolve => {
        chrome.windows.getCurrent(resolve);
    });
};
