# babel-preset-divi-extension

This package includes the Babel preset used by [Create Divi Extension](https://github.com/elegantthemes/create-divi-extension).<br>
Please refer to its documentation:

* [Getting Started](https://github.com/elegantthemes/create-divi-extension/blob/master/README.md#getting-started) – How to create a new app.
* [User Guide](https://github.com/elegantthemes/create-divi-extension/blob/master/packages/divi-scripts/template/README.md) – How to develop apps bootstrapped with Create Divi Extension.

## Usage in Create Divi Extension Projects

The easiest way to use this configuration is with [Create Divi Extension](https://github.com/elegantthemes/create-divi-extension), which includes it by default. **You don’t need to install it separately in Create Divi Extension projects.**

## Usage Outside of Create Divi Extension

If you want to use this Babel preset in a project not built with Create Divi Extension, you can install it with following steps.

First, [install Babel](https://babeljs.io/docs/setup/).

Then install babel-preset-divi-extension.

```sh
npm install babel-preset-divi-extension --save-dev
```

Then create a file named `.babelrc` with following contents in the root folder of your project:

  ```js
  {
    "presets": ["divi-extension"]
  }
  ```

This preset uses the `useBuiltIns` option with [transform-object-rest-spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/) and [transform-react-jsx](http://babeljs.io/docs/plugins/transform-react-jsx/), which assumes that `Object.assign` is available or polyfilled.
