const fs = require('fs-extra');
const YAML = require('yaml');

class Generator {
  generateMarkdown(spec) {
    let markdown = '';

    // Title and description
    markdown += `# ${spec.info.title}\n\n`;
    markdown += `**Version:** ${spec.info.version}\n\n`;
    markdown += `${spec.info.description}\n\n`;

    // Contact
    if (spec.info.contact) {
      markdown += `**Contact:** ${spec.info.contact.name}  \n`;
      markdown += `**Email:** ${spec.info.contact.email}\n\n`;
    }

    // Servers
    markdown += `## Servers\n\n`;
    spec.servers.forEach(server => {
      markdown += `- **${server.description}:** \`${server.url}\`\n`;
    });
    markdown += '\n';

    // Security
    if (Object.keys(spec.components.securitySchemes).length > 0) {
      markdown += `## Security\n\n`;
      Object.entries(spec.components.securitySchemes).forEach(([name, scheme]) => {
        markdown += `### ${name}\n`;
        markdown += `- **Type:** ${scheme.type}\n`;
        if (scheme.in) markdown += `- **In:** ${scheme.in}\n`;
        if (scheme.name) markdown += `- **Name:** ${scheme.name}\n`;
        markdown += '\n';
      });
    }

    // Schemas
    if (Object.keys(spec.components.schemas).length > 0) {
      markdown += `## Data Models\n\n`;
      Object.entries(spec.components.schemas).forEach(([name, schema]) => {
        markdown += `### ${name}\n`;
        markdown += `\`\`\`json\n`;
        markdown += JSON.stringify(schema, null, 2);
        markdown += `\n\`\`\`\n\n`;
      });
    }

    // Endpoints
    markdown += `## API Endpoints\n\n`;
    Object.entries(spec.paths).forEach(([path, pathItem]) => {
      markdown += `### ${path}\n\n`;
      Object.entries(pathItem).forEach(([method, operation]) => {
        markdown += `#### ${method.toUpperCase()} ${path}\n`;
        markdown += `${operation.summary}\n\n`;
        if (operation.tags) {
          markdown += `**Tags:** ${operation.tags.join(', ')}\n\n`;
        }
        markdown += `**Responses:**\n`;
        Object.entries(operation.responses).forEach(([code, response]) => {
          markdown += `- \`${code}\` - ${response.description}\n`;
        });
        markdown += '\n';
      });
    });

    return markdown;
  }

  generateJSON(spec) {
    return JSON.stringify(spec, null, 2);
  }

  generateYAML(spec) {
    return YAML.stringify(spec);
  }

  async saveSpecification(spec, outputPath, format = 'json') {
    try {
      if (format === 'json') {
        await fs.writeJSON(outputPath, spec, { spaces: 2 });
      } else if (format === 'yaml') {
        await fs.writeFile(outputPath, this.generateYAML(spec));
      } else if (format === 'markdown') {
        await fs.writeFile(outputPath, this.generateMarkdown(spec));
      }
      return true;
    } catch (error) {
      console.error(`Error saving specification: ${error.message}`);
      return false;
    }
  }
}

module.exports = Generator;
