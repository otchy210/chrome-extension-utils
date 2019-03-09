# Chrome Excention Utilities

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
This command is basically alias of `build-chrome-extension` and will build your extension under `build` directory. So that you can load the directory as Chrome Extension from `chrome://extensions` page.
