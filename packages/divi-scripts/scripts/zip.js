// @remove-on-eject-begin
/**
 * Copyright (c) 2018-present, Elegant Themes, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const fs = require('fs-extra');
const paths = require('../config/paths');
const spawn = require('divi-dev-utils/crossSpawn');

// Put a symlink to Grunt config in the repo root directory
const grunt_file = path.join(paths.ownPath, 'config', 'Gruntfile.js');
const grunt_file_tmp = path.join(paths.appPath, 'Gruntfile.js');

fs.symlinkSync(grunt_file, grunt_file_tmp);

// Run grunt zip
const child = spawn('grunt', ['zip'], { stdio: 'inherit', cwd: paths.appPath });

child.on('close', code => {
  // Remove symlink to Grunt config from repo root
  fs.unlinkSync(grunt_file_tmp);
  process.exit(code);
});
