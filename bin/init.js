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

// create webpack.config.js
const webpackConfigJsFile = 'webpack.config.js';
if (!fs.existsSync(`./${webpackConfigJsFile}`)) {
    console.log(`Copying ${webpackConfigJsFile}`);
    const paths = __dirname.split('/');
    paths.pop();
    paths.push('resources');
    const resourcesPath = paths.join('/');
    const webpackConfigJs = fs.readFileSync(`${resourcesPath}/${webpackConfigJsFile}`);
    fs.writeFileSync(`./${webpackConfigJsFile}`, webpackConfigJs);
}

// copy js template
const mkdirp = './node_modules/mkdirp/bin/cmd.js';
const srcJsPath = './src/js';
console.log(exec(`${mkdirp} ${srcJsPath}`));
const jsResourcesPath = (() => {
    const paths = __dirname.split('/');
    paths.pop();
    paths.push('resources');
    paths.push('js');
    return paths.join('/');
})();
['background.js', 'popup.js', 'options.js', 'page.js'].forEach(fileName => {
    const srcFilePath = `${srcJsPath}/${fileName}`;
    if (fs.existsSync(srcFilePath)) {
        return true;
    }
    console.log(`Copying ${fileName}`);
    const fileContent = fs.readFileSync(`${jsResourcesPath}/${fileName}`);
    fs.writeFileSync(srcFilePath, fileContent);
});