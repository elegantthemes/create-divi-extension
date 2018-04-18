// @remove-file-on-eject
/**
 * Copyright (c) 2018-present, Elegant Themes, Inc.
 * Copyright (c) 2015-2018, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('divi-dev-utils/crossSpawn');
const _ = require('lodash');
const execSync = require('child_process').execSync;
const { defaultBrowsers } = require('divi-dev-utils/browsersHelper');
const os = require('os');

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit(appPath) {
  let didInit = false;
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Create React App"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // In the future, we might supply our own committer
      // like Ember CLI does, but for now, let's just
      // remove the Git files to avoid a half-done state.
      try {
        // unlinkSync() doesn't work on directories.
        fs.removeSync(path.join(appPath, '.git'));
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false;
  }
}

module.exports = function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  template,
  appInfo
) {
  const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
    .name;
  const ownPath = path.join(appPath, 'node_modules', ownPackageName);
  const appPackage = require(path.join(appPath, 'package.json'));
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  const prefix = appInfo.pluginPrefix.toLowerCase();
  const replace = {
    __prefix: prefix,
    __PREFIX: prefix.toUpperCase(),
    __PluginName: _.startCase(appName).replace(/ /g, ''),
    __plugin_name: appName,
    __URI: appInfo.pluginURL.replace("'", "\\'"),
    __AUTHOR_URI: appInfo.pluginAuthorURL.replace("'", "\\'"),
    __AUTHOR: appInfo.pluginAuthor.replace("'", "\\'"),
    '<NAME>': appInfo.pluginName,
    '<URI>': appInfo.pluginURL,
    '<DESCRIPTION>': appInfo.pluginDescription,
    '<AUTHOR>': appInfo.pluginAuthor,
    '<AUTHOR_URI>': appInfo.pluginAuthorURL,
    '<GETTEXT_DOMAIN>': `${prefix}-${appName}`,
  };

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};

  // Setup the script rules
  appPackage.scripts = {
    start: 'divi-scripts start',
    build: 'divi-scripts build',
    zip: 'divi-scripts build && divi-scripts zip',
    eject: 'divi-scripts eject',
  };

  appPackage.browserslist = defaultBrowsers;

  appPackage.cde = {
    gettext: `${prefix}-${appName}`,
    prefix,
  };

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  // Copy the files for the user
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'));
      fs.appendFileSync(path.join(appPath, '.gitignore'), data);
      fs.unlinkSync(path.join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }

  fs.move(
    path.join(appPath, 'styles', 'gitignore'),
    path.join(appPath, 'styles', '.gitignore')
  );
  fs.move(
    path.join(appPath, 'languages', 'gitignore'),
    path.join(appPath, 'languages', '.gitignore')
  );

  // Rename files that have '__prefix' or '__plugin-name' in their names
  renameFiles(appPath, replace);

  // Rename variables, functions, & classes
  renameCodeSymbols(appPath, replace);

  let command;
  let args;

  if (useYarn) {
    command = 'yarnpkg';
    args = ['add'];
  } else {
    command = 'npm';
    args = ['install', '--save', verbose && '--verbose'].filter(e => e);
  }
  args.push('react', 'react-dom');

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  );
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies;
    args = args.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`;
      })
    );
    fs.unlinkSync(templateDependenciesPath);
  }

  // Install react and react-dom for backward compatibility with old CRA cli
  // which doesn't install react and react-dom along with divi-scripts
  // or template is presetend (via --internal-testing-template)
  if (!isReactInstalled(appPackage) || template) {
    console.log(`Installing react and react-dom using ${command}...`);
    console.log();

    const proc = spawn.sync(command, args, { stdio: 'inherit' });
    if (proc.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`);
      return;
    }
  }

  if (tryGitInit(appPath)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`);
  console.log();
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(
    chalk.magenta(`  ${displayedCommand} ${useYarn ? '' : 'run '}start`)
  );
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.magenta(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the extension into static files for production.');
  console.log();
  console.log(
    chalk.magenta(`  ${displayedCommand} ${useYarn ? '' : 'run '}zip`)
  );
  console.log('    Runs build and then creates a production release zip file.');
  console.log();
  console.log(
    chalk.magenta(`  ${displayedCommand} ${useYarn ? '' : 'run '}eject`)
  );
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  );
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.magenta('  cd'), cdpath);
  console.log(`  ${chalk.magenta(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    );
  }
  console.log();
  console.log();
  console.log(chalk.blue('Happy hacking!'));
  console.log();
};

function isReactInstalled(appPackage) {
  const dependencies = appPackage.dependencies || {};

  return (
    typeof dependencies.react !== 'undefined' &&
    typeof dependencies['react-dom'] !== 'undefined'
  );
}

function renameFiles(directory, replace) {
  const contents = fs.readdirSync(directory);

  _.forEach(contents, item => {
    item = path.join(directory, item);

    if (_.includes(item, 'node_modules')) {
      return; // continue
    }

    if (fs.lstatSync(item).isDirectory()) {
      renameFiles(item, replace);
      return; // continue
    }

    const file = path.basename(item);
    const matches = file.match(/__(\w+|_)/g);

    let newFile = file;

    _.forEach(matches, match => {
      newFile = newFile.replace(match, replace[match]);
    });

    if (newFile !== file) {
      const dest = path.join(directory, newFile);
      fs.move(item, dest);
    }
  });
}

function renameCodeSymbols(directory, replace) {
  const contents = fs.readdirSync(directory);

  _.forEach(contents, item => {
    item = path.join(directory, item);

    if (_.includes(item, 'node_modules')) {
      return; // continue
    }

    if (fs.lstatSync(item).isDirectory()) {
      renameCodeSymbols(item, replace);
      return; // continue
    }

    let contents = fs.readFileSync(item, 'utf-8');
    let newContents = contents;

    _.forEach(replace, (replace_with, search_for) => {
      const regex = new RegExp(search_for, 'g');

      newContents = newContents.replace(regex, replace_with);
    });

    if (newContents !== contents) {
      fs.writeFileSync(item, newContents);
    }
  });
}
