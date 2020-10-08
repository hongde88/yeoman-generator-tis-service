'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the peachy ${chalk.red('generator-tis-service')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the module\'s name?'
      },
      {
        type: 'input',
        name: 'version',
        message: 'What is the module\'s version?',
        default: '1.0.0'
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is the module\'s description'
      },
      {
        type: 'input',
        name: 'repositoryType',
        message: 'What is the repository type',
        default: 'git'
      },
      {
        type: 'input',
        name: 'repositoryUrl',
        message: 'What is the repository url?'
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'Keywords - comma separated'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author'
      },
      {
        type: 'input',
        name: 'license',
        message: 'License',
        default: 'ISC'
      },
      {
        type: 'input',
        name: 'dockerfileName',
        message: 'Dockerfile LABEL name',
        default: 'isc-tis-template-service-name'
      },
      {
        type: 'input',
        name: 'dockerfileVersion',
        message: 'Dockerfile LABEL version',
        default: '1.5.0.0'
      },
      {
        type: 'input',
        name: 'dockerfileSummary',
        message: 'Dockerfile LABEL summary',
        default: 'TIS template service summary'
      },
      {
        type: 'input',
        name: 'dockerfileDescription',
        message: 'Dockerfile LABEL description',
        default: 'TIS template service description'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    mkdirp.sync(`${this.destinationRoot()}/${this.props.name}`);

    this.destinationRoot(this.props.name);

    this.fs.copy(
      this.sourceRoot(),
      this.destinationRoot(), 
      {
        globOptions: {
          ignore: [
            'package.json',
            'Dockerfile'
          ],
          dot: true
        }
      }
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        name: this.props.name,
        version: this.props.version,
        description: this.props.description,
        repositoryType: this.props.repositoryType,
        repositoryUrl: this.props.repositoryUrl,
        keywords: this.props.keywords.split(',').map((kw) => `"${kw.trim()}"`),
        author: this.props.author,
        license: this.props.license
      }
    );

    this.fs.copyTpl(
      this.templatePath('Dockerfile'),
      this.destinationPath('Dockerfile'), {
        name: this.props.dockerfileName,
        version: this.props.dockerfileVersion,
        summary: this.props.dockerfileSummary,
        description: this.props.dockerfileDescription
      }
    );
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    }).then(() => this.log(yosay(`${chalk.blue('Everything is ready for development! Have fun!')}`)));
  }
};
