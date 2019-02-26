#!/usr/bin/env node

const execSync = require('child_process').execSync;
const exec = command => execSync(command).toString();

// install modules
console.log(exec('npm install --save-dev json'))
const json = './node_modules/.bin/json';

console.log(exec('npm install --save-dev @babel/core @babel/preset-env babel-loader'))
console.log(exec('npm install --save-dev ncp rmdir'))
console.log(exec('npm install --save-dev webpack webpack-cli'))

// add scripts
console.log(exec(`${json} -I -f package.json -e 'this.scripts.build="build-chrome-extension"'`));
console.log(exec(`${json} -I -f package.json -e 'this.scripts.dist="dist-chrome-extension"'`));
