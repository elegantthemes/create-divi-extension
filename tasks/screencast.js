#!/usr/bin/env node

/**
 * Copyright (c) 2015-present, Facebook, Inc. 
 * 
 * This source code is licensed under the MIT license found in the 
 * LICENSE file in the root directory of this source tree. 
 */

'use strict';

const fs = require('fs');
const path = require('path');
const execa = require('execa');
const tempy = require('tempy');
const _ = require('lodash');

main();

function main() {
  const previous = process.cwd();
  const cwd = tempy.directory();

  const cast = path.join(cwd, 'screencast.json');
  const script = path.join(__dirname, 'screencast.sh');
  const out = path.join(previous, 'screencast.svg');

  const resolveLine = l => l.indexOf('Resolving packages...') > -1;
  const fetchLine = l => l.indexOf('Fetching packages...') > -1;
  const countLine = l => l.match(/.*Saved [0-9]+ new dependencies.*/);
  const doneLine = l => l.indexOf('└─ yargs@') > -1;
  const firstQuestionLine = l => l.indexOf('Extension Name?') > -1;
  const lastQuestionLine = l => l.indexOf('Prefix?') > -1;

  const linesToRemove = [
    'No lockfile found.',
    'is incompatible with this module',
    'failed compatibility check',
    'has incorrect peer dependency',
    '--scripts-version',
  ];

  try {
    process.chdir(cwd);
    console.log(`Recording screencast ...`);
    execa.sync('asciinema', ['rec', '--command', `sh ${script}`, cast], {
      cwd,
      stdio: 'inherit',
    });

    console.log('Cleaning data ...');
    const data = require(cast);

    removeLines(data.stdout, linesToRemove);
    cut(data.stdout, { start: resolveLine, end: fetchLine });
    cut(data.stdout, { start: countLine, end: doneLine });
    replace(data.stdout, [{ in: cwd, out: '~/wordpress/wp-content/plugins' }]);
    move(data.stdout, {
      start: firstQuestionLine,
      end: lastQuestionLine,
      moveTo: countLine,
    });

    fs.writeFileSync(cast, JSON.stringify(data, null, '  '));

    console.log('Rendering SVG ...');
    execa.sync('svg-term', ['--window', '--in', cast, '--out', out]);

    console.log(`Recorded screencast to ${cast}`);
    console.log(`Rendered SVG to ${out}`);
  } catch (err) {
    throw err;
  } finally {
    process.chdir(previous);
  }
}

function cut(frames, { start, end }) {
  const si = frames.findIndex(([, l]) => start(l));
  const ei = frames.findIndex(([, l]) => end(l));

  if (si === -1 || ei === -1) {
    return;
  }

  frames.splice(si + 1, ei - si - 1);
}

function move(lines, { start, end, moveTo }) {
  const si = lines.findIndex(([, l]) => start(l));
  const ei = lines.findIndex(([, l]) => end(l));
  const mt = lines.findIndex(([, l]) => moveTo(l));

  if (si === -1 || ei === -1) {
    return;
  }

  const linesToMove = lines.slice(si, ei + 2);

  lines.splice(si, ei - si + 1);
  lines.splice(mt + 1, 0, ...linesToMove);
}

function removeLines(lines, linesToRemove) {
  _.remove(lines, ([, line]) => {
    let remove = false;

    _.forEach(linesToRemove, pattern => {
      if (_.includes(line, pattern)) {
        remove = true;
        return false; // break
      }
    });

    return remove;
  });
}

function replace(frames, replacements) {
  frames.forEach(frame => {
    replacements.forEach(r => (frame[1] = frame[1].split(r.in).join(r.out)));
  });
}
