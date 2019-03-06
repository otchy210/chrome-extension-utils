#!/usr/bin/env node

const execSync = require('child_process').execSync;
const exec = command => execSync(command).toString();
const fs = require('fs');

// install modules
const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const requiredModules = [
    'json', 'ncp', 'rmdir', 'mkdirp',
    '@babel/core', '@babel/preset-env', 'babel-loader',
    'webpack', 'webpack-cli'
];
const installModules = requiredModules.filter(
    m => !(packageJson.devDependencies && packageJson.devDependencies[m]));
if (installModules.length > 0) {
    console.log(`Installing following modules: ${installModules.join(',')}`);
    console.log(exec(`npm install --save-dev ${installModules.join(' ')}`));
}

// add scripts to package.json
const addScripts = ['build', 'dist'].filter(
    s => !(packageJson.scripts && packageJson.scripts[s])
);
if (addScripts.length > 0) {
    const json = './node_modules/.bin/json';
    console.log(`Adding following scripts: ${addScripts.join(',')}`);
    addScripts.forEach(s => 
        console.log(exec(`${json} -I -f package.json -e 'this.scripts.${s}="${s}-chrome-extension"'`))
    );
}

// copy webpack.config.js
const resourcesDir = (() => {
    const paths = __dirname.split('/');
    paths.pop();
    paths.push('resources');
    return paths.join('/');
})();
(() => {
    const fileName = 'webpack.config.js'
    const destPath = `./${fileName}`;
    if (fs.existsSync(destPath)) {
        return;
    }
    const srcPath = `${resourcesDir}/${fileName}`;
    console.log(`Copying ${fileName}`);
    fs.copyFileSync(srcPath, destPath);
})();

// copy tempalte files
const mkdirp = './node_modules/mkdirp/bin/cmd.js';
exec(`${mkdirp} ./src/js`);
exec(`${mkdirp} ./src/img`);
[
    'manifest.json',
    'js/background.js',
    'js/popup.js',
    'js/options.js',
    'js/page.js',
    'popup.html',
    'options.html',
].forEach(filePath => {
    const destPath = `./src/${filePath}`;
    if (fs.existsSync(destPath)) {
        return true;
    }
    const srcPath = `${resourcesDir}/${filePath}`;
    console.log(`Copying ${filePath}`);
    fs.copyFileSync(srcPath, destPath);
});
