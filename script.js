#!/usr/bin/env node
'use strict';

const fs = require('fs'),
  path = require('path'),
  promisify = require('util').promisify,
  ArgumentParser = require('argparse').ArgumentParser;

const readFileAsync = promisify(fs.readFile),
  readdirAsync = promisify(fs.readdir),
  writeFileAsync = promisify(fs.writeFile);

const parser = new ArgumentParser({
  version: '1.0.0',
  addHelp: true,
  description: 'Patch Plex Media Player arrow left & right keys',
});

parser.addArgument(['-d', '--plex-dir'], {
  action: 'store',
  type: 'string',
  help:
    'Specify the Plex Media Player directory. On OS X, this is usually /Applications/Plex Media Player.app/Contents/Resources. On Windows, this is usually C:\\Program Files\\Plex\\Plex Media Player.',
});

const mainDotJsRegex = /^main-.+\.js$/;

const tryAsync = promise =>
  promise.then(data => data).catch(err => console.error(err));

const readConfig = async () => {
  try {
    const config = await readFileAsync(
      path.resolve(__dirname, './config/config.json')
    );
    return JSON.parse(config);
  } catch {
    return {};
  }
};

const main = () => {
  const args = parser.parseArgs();
  let plexDir = args.plex_dir;
  if (!plexDir) {
    const { plexDirectory } = readConfig();
    if (!plexDirectory)
      console.error('Plex directory not provided! See README.');
    return;
  }

  patchMainDotJs(plexDir);
};

const patchMainDotJs = async plexDir => {
  const pmpDir = `${plexDir}/web-client/desktop/js/`;
  const files = await tryAsync(readdirAsync(pmpDir));

  const mainDotJsFullname = files.find(filename =>
    mainDotJsRegex.test(filename)
  );

  let mainDotJs = await tryAsync(readFileAsync(pmpDir + mainDotJsFullname));

  // first make a backup of main.js
  await tryAsync(
    writeFileAsync(pmpDir + mainDotJsFullname + '.bak', mainDotJs)
  );

  // now perform the replacement
  mainDotJs = mainDotJs
    .toString()
    .replace(
      /keys:\s?\[\s?",",\s?"shift\+left"\s?],\s?fn:\s?"seekBackward"/,
      'keys:[",","left"],fn:"seekBackward"'
    )
    .replace(
      /keys:\s?\[\s?"\.",\s?"shift\+right"\s?],\s?fn:\s?"seekForward"/,
      'keys:[".","right"],fn:"seekForward"'
    )
    .replace(
      /keys:\s?\[\s?"left",\s?"step_backward"\s?],\s?fn:\s?"skipPrevious"/,
      'keys:["shift+left","step_backward"],fn:"skipPrevious"'
    )
    .replace(
      /keys:\s?\[\s?"right",\s?"step_forward"\s?],\s?fn:\s?"skipNext"/,
      'keys:["shift+right","step_forward"],fn:"skipNext"'
    );

  // write the result
  await tryAsync(writeFileAsync(pmpDir + '/' + mainDotJsFullname, mainDotJs));

  console.log(`Successfully patched "${mainDotJsFullname}". Exiting.`);
};

main();
