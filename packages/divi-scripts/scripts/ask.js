// External Dependencies
const _ = require('lodash');
const inquirer = require('divi-dev-utils/inquirer');

module.exports = (appName, skip) => {
  const questions = [
    ...pluginMetaDataQuestions(appName),
    pluginPrefixQuestion(appName),
  ];

  if (skip) {
    return Promise.resolve(
      _.transform(questions, (res, obj) => (res[obj.name] = obj.default), {})
    );
  }

  return inquirer.prompt(questions);
};

function pluginPrefixQuestion(appName) {
  let suggestedPrefix = '';
  let parts = appName.split('-');

  if (1 === parts.length) {
    suggestedPrefix = appName.slice(0, 4);
  } else if (2 === parts.length) {
    suggestedPrefix = `${parts[0].slice(0, 2)}${parts[1].slice(0, 2)}`;
  } else if (3 === parts.length) {
    suggestedPrefix = `${parts[0].slice(0, 2)}${parts[1].slice(
      0,
      1
    )}${parts[2].slice(0, 1)}`;
  } else {
    _.forEach(_.take(parts, 4), part => (suggestedPrefix += part[0]));
  }

  return {
    type: 'input',
    name: 'pluginPrefix',
    message:
      'Prefix? (Unique identifier for variables, functions, and classes)',
    default: suggestedPrefix,
    validate: value =>
      /^[a-zA-Z][a-zA-Z0-9]{2,}$/.test(value)
        ? true
        : 'Invalid value! Only letters and numbers are allowed. Must be at least three characters.',
  };
}

function pluginMetaDataQuestions(appName) {
  return [
    {
      type: 'input',
      name: 'pluginName',
      message: 'Extension Name? (Shown in the WP Dashboard).',
      default: _.startCase(appName),
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
