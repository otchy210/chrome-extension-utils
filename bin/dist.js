#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');

const manifestPath = './src/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath));
const version = manifest.version;
const distPrefix = process.cwd().split('/').pop();
const distName = `${distPrefix}-${version}`;
const distPath = `./dist/${distName}`;
const zipName = `${distName}.zip`;
const zipPath = `./dist/${zipName}`;
const buildPath = `./build`;

if (fs.existsSync(zipPath)) {
    console.error('================================================================================');
    console.error(`Version ${version} is already distributed.`);
    console.error(`Update ${manifestPath} for new version.`);
    console.error(`Or, you need to delete ${zipPath} if you want to redistribute it.`);
    console.error('================================================================================');
    process.exit(1);
}

if (!fs.existsSync('./dist/')) {
    fs.mkdirSync('./dist/');
}

// rm -rf ${distPath}
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
rmrf(distPath);

// cp -r ${buildPath}/* ${distPath}
fs.mkdirSync(distPath);
const cpr = currDir => {
    const srcDir = currDir ? `${buildPath}/${currDir}` : buildPath;
    const destDir = currDir ? `${distPath}/${currDir}`: distPath;
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }
    fs.readdirSync(srcDir).forEach(name => {
        const srcPath = `${srcDir}/${name}`;
        if (fs.statSync(srcPath).isDirectory()) {
            cpr(currDir ? `${currDir}/${name}`: name);
        } else {
            const destPath = `${destDir}/${name}`;
            fs.copyFileSync(srcPath, destPath);
        }
    });
};
cpr();

process.chdir(distPath);
exec(`zip -r ../${zipName} *`, (err, stdout, stderr) => {
    if (err || stderr) {
        if (err) {
            console.error(err);
        }
        if (stderr) {
            console.error(stderr);
        }
        process.exit(1);
    }
    if (stdout) {
        console.log(stdout);
    }
    process.chdir('../../');
    rmrf(distPath);
});
