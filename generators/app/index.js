'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the sweet ${chalk.magenta('Vapor')} generator!`)
    );
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name:',
        default: path.basename(process.cwd())
      },
      {
        type: 'confirm',
        name: 'fluent',
        message: 'Would you like to include Fluent?',
        default: false
      },
      {
        when: props => props.fluent,
        type: 'list',
        name: 'fluentdb',
        message: 'Which database for Fluent?',
        choices: ['PostgreSQL', 'MySQL', 'SQLite'],
        default: 'PostgreSQL'
      }
    ]).then(props => {
      this.props = props
      if (this.props.fluent) {
        if (this.props.fluentdb == 'PostgreSQL') {
          this.props.fluentdbversion = '1.0.0';
          this.props.fluentdbshort = 'psql'
        } else {
          this.props.fluentdbversion = '3.0.0';
          this.props.fluentdbshort = this.props.fluentdb.toLowerCase()
        }
      }
    });
  }

  writing() {
    this._copy('Package.swift');
    this._copy('Sources/Run/main.swift');
    this._copy('Sources/App/app.swift');
    this._copy('Sources/App/boot.swift');
    this._copy('Sources/App/configure.swift');
    this._copy('Sources/App/routes.swift');
    if (this.props.fluent) {
      this._copy('Sources/App/Models/Todo.swift');
      this._copy('Sources/App/Controllers/TodoController.swift');
    }
    this._copy('Tests/AppTests/AppTests.swift');
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_dockerignore'), this.destinationPath('.dockerignore'));
  }

  _copy(file) {
    this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), this.props);
  }

  install () {
    this.log();
    this.log(`New Vapor project ${chalk.magenta(this.props.name)} created!`);
    this.log();
    this.log(`Run ${chalk.cyan('vapor xcode')} to open the project in Xcode`);
    this.log(`    To boot server, select ${chalk.cyan('Run')} scheme and use ${chalk.cyan('CMD+R')}`);
    this.log(`    To run tests, select ${chalk.cyan(this.props.name + '-Package')} scheme and use ${chalk.cyan('CMD+U')}`);
  }
};
