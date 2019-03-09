#!/usr/bin/env node

const fs = require('fs');

// rm -rf ./build
const rmrf = currDir => {
    if (!fs.existsSync(currDir)) {
        return;
    }
    fs.readdirSync(currDir).forEach(name => {
        const path = `${currDir}/${name}`;
        if (fs.statSync(path).isDirectory()) {
            rmrf(path);
        } else {
            fs.unlinkSync(path);
        }
    });
    fs.rmdirSync(currDir);
};
rmrf('./build');

// cp -r src/(img|css)/* build/(img|css)/
fs.mkdirSync('./build');
const cpr = currDir => {
    const srcDir = `./src/${currDir}`;
    const destDir = `./build/${currDir}`;
    fs.mkdirSync(destDir);
    fs.readdirSync(srcDir).forEach(name => {
        const srcPath = `${srcDir}/${name}`;
        if (fs.statSync(srcPath).isDirectory()) {
            cpr(`${currDir}/${name}`);
        } else {
            const destPath = `${destDir}/${name}`;
            fs.copyFileSync(srcPath, destPath);
        }
    });
};
['img', 'css'].forEach(dir => cpr(dir));

// cp src/*.html build/*.html && cp src/manifest.json build/manifest.json
fs.readdirSync('./src')
    .filter(file => file.endsWith('.html') || file == 'manifest.json')
    .forEach(file => {
        fs.copyFileSync(`./src/${file}`, `./build/${file}`);
});

// webpack
console.log('Running webpack')
console.log(require('child_process').execSync('./node_modules/.bin/webpack').toString());
