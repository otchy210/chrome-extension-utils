const PREFIX_ARR = ['[@otchy/chrome-extension-utils]'];

const warn = (params) => {
    console.warn.apply(null, PREFIX_ARR.concat(params));
};
exports.warn = warn;
