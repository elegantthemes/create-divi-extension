// External Dependencies
const _ = require('lodash');
const inquirer = require('divi-dev-utils/inquirer');

module.exports = appName => {
  const questions = [
    ...pluginMetaDataQuestions(appName),
    pluginPrefixQuestion(appName),
  ];

  return inquirer.prompt(questions);
};

function pluginPrefixQuestion(appName) {
  let suggestedPrefix = '';
  let parts = appName.split('-');

  if (1 === parts.length) {
    suggestedPrefix = appName.slice(4);
  } else if (2 === parts.length) {
    suggestedPrefix = `${parts[0].slice(2)}${parts[1].slice(2)}`;
  } else if (3 === parts.length) {
    suggestedPrefix = `${parts[0].slice(2)}${parts[1].slice(1)}${parts[2].slice(
      1
    )}`;
  } else {
    _.forEach(_.take(parts, 4), part => (suggestedPrefix += part[0]));
  }

  const msg = [
    'All variables, functions and classes should be prefixed with a unique identifier.',
    'Prefixes prevent other plugins from overwriting your variables and accidentally',
    'calling your functions and classes. What prefix would you like to use?',
  ];

  return {
    type: 'input',
    name: 'pluginPrefix',
    message: msg.join(' '),
    default: suggestedPrefix,
  };
}

function pluginMetaDataQuestions(appName) {
  return [
    {
      type: 'input',
      name: 'pluginName',
      message:
        'Extension Name? (This will be the name that appears in the WP Dashboard).',
      default: appName,
    },
    {
      type: 'input',
      name: 'pluginURL',
      message: 'Extension URL?',
      default: '',
    },
    {
      type: 'input',
      name: 'pluginDescription',
      message: 'Description?',
      default: '',
    },
    {
      type: 'input',
      name: 'pluginAuthor',
      message: 'Author?',
      default: '',
    },
    {
      type: 'input',
      name: 'pluginAuthorURL',
      message: 'Author URL?',
      default: '',
    },
  ];
}
