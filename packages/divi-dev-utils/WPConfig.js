const fs = require('fs');
const findConfig = require('find-config');

class WPConfig {
  constructor() {
    this.config_path = findConfig('wp-config.php');
    this.config = '';
    this._getRegExp = null;

    if (!this.config_path) {
      throw new Error('Unable to locate wp-config.php!');
    }

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
  }

  get(constant) {
    this.config = fs.readFileSync(this.config_path, 'utf-8');

    if (!this.config.includes(constant)) {
      return 'not_found';
    }

    this._getRegExp = new RegExp(
      `define\\( *["']${constant}["'], *(["'].*["']|[^ )]+)`
    );

    let match = this.config.match(this._getRegExp)[1];

    if (match.test(/["'].*["']/)) {
      match = match.slice(1, -1);
    } else if ('false' === match) {
      match = false;
    } else if ('true' === match) {
      match = true;
    } else if (!isNaN(match)) {
      match = parseInt(match);
    }

    return match;
  }

  set(constant, value) {
    if ('string' === typeof value) {
      value = `'${value}'`;
    } else if (false === value) {
      value = 'false';
    } else if (true === value) {
      value = 'true';
    } else if (!isNaN(value)) {
      value = value.toString();
    }

    const current_value = this.get(constant);
    const config = this.config;

    if ('not_found' === current_value) {
      // Add new definition
      const regex = new RegExp(
        "\n(?=\\/* That's all, stop editing! Happy blogging\\. *\\/)"
      );

      this.config.replace(regex, `\ndefine( '${constant}', ${value} );\n`);
    } else {
      // Replace existing value
      this.config.replace(this._getRegExp, value);
    }

    if (this.config !== config) {
      fs.writeFileSync(this.config_path, this.config);
    }
  }
}

module.exports = new WPConfig();
