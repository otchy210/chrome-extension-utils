# Chrome Extension Utils

## Get started
```
$ npm init
(Enter whatever you want)
$ npm install --save-dev @otchy/chrome-extension-utils
```

This command installs cli tools `init-chrome-extension`, `build-chrome-extension` and `dist-chrome-extension`.

## Initialize your extension directory
```
$ init-chrome-extension
```
This command will setup your directory for brand new chrome extension.

## Build your extension
```
$ npm run build
```
This command is alias of `build-chrome-extension`. It will build your extension under `build` directory. So that you can load the directory as Chrome Extension from `chrome://extensions` page.

## Distribute your extension
```
$ npm run dist
```
This command is alias of `dist-chrome-extension`. It will package your `build` directory and save it under `dist` directory as zip file. You can upload the zip file via [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/developer/dashboard) as a public Chrome extension.

## Modules

### Background

Background utilities. It's highly recommended to call `Background.init()` in `background.js` to use powerful features this npm library provides.

```js
// background.js
const {Background} = require('@otchy/chrome-extension-utils');
Background.init();
```

### Message

Wrapper of messaging framework of Chrome extension.

```js
// background.js
const {Background} = require('@otchy/chrome-extension-utils');

// Lisnters have to be in background.js
// That's why listenMessage is in Background module not Message module.
Background.listenMessage('GREETING', params => {
    const {greeting, name} = params;
    console.log(greeting); // "I'm options.js"
    return {greeting: `Hello, ${name}!`};
});
```

```js
// options.js -- you can do same thing in popup.js and page.js
const {Message} = require('@otchy/chrome-extension-utils');

(async () => {
    const name = 'options.js';
    const {greeting} = await Message.send('GREETING', {greeting: `I'm ${name}`, name});
    console.log(greeting); // "Hello, options.js!"
})();
```

### SyncStorage

Wrapper of `chrome.storage.sync`. The storage is synced among multiple Chrome browsers when you login as same user. This is good for sharing common configuration of your extension.

```js
const {SyncStorage} = require('@otchy/chrome-extension-utils');

(async () => {
    const count = await SyncStorage.get('counter', 1);
    // How many times you call this logic among all Chrome browsers with your extension
    console.log(count);
    SyncStorage.set('counter', count + 1);
})();
```

### LocalStorage

Wrapper of `chrome.storage.local`. The storage is stored in your local machine, but it's not synced via network. This is permanent, so you can keep it even you close all Chrome sessions.

```js
const {LocalStorage} = require('@otchy/chrome-extension-utils');

(async () => {
    const count = await LocalStorage.get('counter', 1);
    // How many times you call this logic on your local Chrome browser with your extension
    console.log(count);
    LocalStorage.set('counter', count + 1);
})();
```

### SessionStorage
The storage is stored in your local memory (technically in background page). So it will be removed when you close all Chrome sessions. This is good for caching.

```js
const {SessionStorage} = require('@otchy/chrome-extension-utils');

(async () => {
    const count = await SessionStorage.get('counter', 1);
    // How many times you call this logic after you open current Chrome session
    console.log(count);
    SessionStorage.set('counter', count + 1);
})();
```

### Tabs
Wrapper of `chrome.tabs.*`. It also has some handy utilities.

```js
(async () => {
    // get current active tab
    const tab = await Tabs.getCurrent();

    // open new tab
    const newTab = await Tabs.openNew('https://www.google.com');
    const newTabButInactive = await Tabs.openNew('https://www.google.com', false);

    // activate existing tab
    Tabs.activate(tab.id).then(tab => {
        // do something
    });

    // close existing tab
    Tabs.close(tab.id).then(() => {
        // do something
    });

    // capture visible area of active tab as dataUrl of png
    const dataUrl = await Tabs.captureVisibleTab();

    // capture visible area of active tab as canvas
    const canvas = await Tabs.captureVisibleTabAsCanvas();
})
```