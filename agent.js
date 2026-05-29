#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const Generator = require('./generator');
const fs = require('fs-extra');
const path = require('path');

class SpecificationAgent {
  constructor() {
    this.spec = {
      openapi: '3.0.0',
      info: {},
      servers: [],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {}
      },
      tags: []
    };
    this.generator = new Generator();
  }

  async start() {
    console.clear();
    console.log(chalk.cyan.bold('\n🚀 WebService Specification Agent\n'));
    console.log(chalk.gray('Generate OpenAPI 3.0 specifications interactively\n'));

    await this.collectBasicInfo();
    await this.collectServers();
    await this.collectEndpoints();
    await this.collectSecuritySchemes();
    await this.collectSchemas();
    await this.generateOutput();
  }

  async collectBasicInfo() {
    console.log(chalk.bold.yellow('\n📋 Basic Information\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'API Title:',
        default: 'My WebService API'
      },
      {
        type: 'input',
        name: 'version',
        message: 'API Version:',
        default: '1.0.0'
      },
      {
        type: 'input',
        name: 'description',
        message: 'API Description:',
        default: 'A comprehensive WebService API'
      },
      {
        type: 'input',
        name: 'contact_name',
        message: 'Contact Name (optional):',
        default: 'Support Team'
      },
      {
        type: 'input',
        name: 'contact_email',
        message: 'Contact Email (optional):',
        default: 'support@example.com'
      }
    ]);

    this.spec.info = {
      title: answers.title,
      version: answers.version,
      description: answers.description,
      contact: {
        name: answers.contact_name,
        email: answers.contact_email
      }
    };
  }

  async collectServers() {
    console.log(chalk.bold.yellow('\n🌐 Server Configuration\n'));

    let addMore = true;
    while (addMore) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'url',
          message: 'Server URL:',
          default: 'https://api.example.com'
        },
        {
          type: 'input',
          name: 'description',
          message: 'Server Description:',
          default: 'Production Server'
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another server?',
          default: false
        }
      ]);

      this.spec.servers.push({
        url: answers.url,
        description: answers.description
      });

      addMore = answers.addMore;
    }
  }

  async collectEndpoints() {
    console.log(chalk.bold.yellow('\n📝 API Endpoints\n'));

    let addMore = true;
    while (addMore) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'path',
          message: 'Endpoint Path (e.g., /users):',
          default: '/users'
        },
        {
          type: 'checkbox',
          name: 'methods',
          message: 'HTTP Methods:',
          choices: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
          default: ['GET']
        },
        {
          type: 'input',
          name: 'description',
          message: 'Endpoint Description:',
          default: 'User management endpoint'
        },
        {
          type: 'input',
          name: 'tags',
          message: 'Tags (comma-separated):',
          default: 'users'
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another endpoint?',
          default: false
        }
      ]);

      const pathObj = {};
      answers.methods.forEach(method => {
        pathObj[method.toLowerCase()] = {
          summary: answers.description,
          tags: answers.tags.split(',').map(t => t.trim()),
          responses: {
            '200': {
              description: 'Successful response'
            },
            '400': {
              description: 'Bad request'
            },
            '500': {
              description: 'Server error'
            }
          }
        };
      });

      this.spec.paths[answers.path] = pathObj;
      addMore = answers.addMore;
    }
  }

  async collectSecuritySchemes() {
    console.log(chalk.bold.yellow('\n🔐 Security Schemes\n'));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'schemes',
        message: 'Select Security Schemes:',
        choices: [
          'API Key',
          'Bearer Token',
          'OAuth2',
          'Basic Auth',
          'None'
        ],
        default: ['Bearer Token']
      }
    ]);

    if (answers.schemes.includes('API Key')) {
      this.spec.components.securitySchemes.ApiKeyAuth = {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      };
    }

    if (answers.schemes.includes('Bearer Token')) {
      this.spec.components.securitySchemes.BearerAuth = {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      };
    }

    if (answers.schemes.includes('OAuth2')) {
      this.spec.components.securitySchemes.OAuth2 = {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://example.com/oauth/authorize',
            tokenUrl: 'https://example.com/oauth/token',
            scopes: {
              'read:users': 'Read user data',
              'write:users': 'Write user data'
            }
          }
        }
      };
    }

    if (answers.schemes.includes('Basic Auth')) {
      this.spec.components.securitySchemes.BasicAuth = {
        type: 'http',
        scheme: 'basic'
      };
    }
  }

  async collectSchemas() {
    console.log(chalk.bold.yellow('\n📦 Data Schemas\n'));

    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addSchemas',
        message: 'Add data schemas?',
        default: true
      }
    ]);

    if (answers.addSchemas) {
      let addMore = true;
      while (addMore) {
        const schemaAnswers = await inquirer.prompt([
          {
            type: 'input',
            name: 'schemaName',
            message: 'Schema Name (e.g., User):',
            default: 'User'
          },
          {
            type: 'input',
            name: 'properties',
            message: 'Properties (comma-separated with types, e.g., id:integer,name:string):',
            default: 'id:integer,name:string,email:string'
          },
          {
            type: 'confirm',
            name: 'addMore',
            message: 'Add another schema?',
            default: false
          }
        ]);

        const schema = {
          type: 'object',
          properties: {},
          required: []
        };

        schemaAnswers.properties.split(',').forEach(prop => {
          const [key, type] = prop.split(':').map(p => p.trim());
          schema.properties[key] = { type: type || 'string' };
          schema.required.push(key);
        });

        this.spec.components.schemas[schemaAnswers.schemaName] = schema;
        addMore = schemaAnswers.addMore;
      }
    }
  }

  async generateOutput() {
    console.log(chalk.bold.yellow('\n💾 Generating Specification\n'));

    try {
      const outputDir = path.join(process.cwd(), 'webservice-spec-output');
      await fs.ensureDir(outputDir);

      // Generate JSON
      const jsonPath = path.join(outputDir, 'openapi.json');
      await fs.writeJSON(jsonPath, this.spec, { spaces: 2 });
      console.log(chalk.green(`✓ Generated: ${jsonPath}`));

      // Generate YAML
      const YAML = require('yaml');
      const yamlPath = path.join(outputDir, 'openapi.yaml');
      await fs.writeFile(yamlPath, YAML.stringify(this.spec));
      console.log(chalk.green(`✓ Generated: ${yamlPath}`));

      // Generate Markdown
      const mdPath = path.join(outputDir, 'api-docs.md');
      const markdown = this.generator.generateMarkdown(this.spec);
      await fs.writeFile(mdPath, markdown);
      console.log(chalk.green(`✓ Generated: ${mdPath}`));

      console.log(chalk.cyan.bold(`\n✨ Specification generated successfully!`));
      console.log(chalk.gray(`Output directory: ${outputDir}\n`));
    } catch (error) {
      console.error(chalk.red(`Error generating specification: ${error.message}`));
    }
  }
}

const agent = new SpecificationAgent();
agent.start().catch(console.error);

module.exports = SpecificationAgent;
