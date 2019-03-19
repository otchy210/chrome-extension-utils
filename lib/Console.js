const PREFIX_ARR = ['[@otchy/chrome-extension-utils]'];

['debug', 'info', 'log', 'warn', 'error'].forEach(type => {
    exports[type] = (...params) => {
        console[type].apply(null, PREFIX_ARR.concat(params));
    };
});
