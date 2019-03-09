#!/usr/bin/env node

const fs = require('fs');
const ncp = require('ncp').ncp;

['img', 'css', 'js'].forEach(dir => fs.mkdirSync(`build/${dir}`));

ncp('src/img', 'build/img', err => err && console.error(err));
ncp('src/css', 'build/css', err => err && console.error(err));

['manifest.json', 'popup.html', 'options.html', 'cropper.html', 'results.html'].forEach(file => {
    fs.copyFileSync('src/' + file, 'build/' + file, err => err && console.error(err));
});

fs.copyFileSync(
    'node_modules/milligram/dist/milligram.min.css',
    'build/css/milligram.min.css',
    err => err && console.error(err)
);
