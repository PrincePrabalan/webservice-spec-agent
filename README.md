# WebService Specification Agent

An intelligent agent for Visual Studio Code that generates comprehensive WebService specification documents in OpenAPI 3.0 format.

## 🎯 Features

- 🚀 **Interactive Agent Mode** - Run in VS Code terminal
- 📝 **OpenAPI 3.0 Generation** - Industry-standard API specifications
- 🔄 **Full CRUD Support** - GET, POST, PUT, PATCH, DELETE methods
- 🔐 **Multiple Security Schemes** - API Key, Bearer Token, OAuth2, Basic Auth
- 📊 **Auto-Generated Responses** - Standard HTTP status codes and responses
- 💾 **Multiple Export Formats** - JSON, YAML, and Markdown documentation
- ⚡ **Fast & Lightweight** - Minimal dependencies

## 📦 Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone https://github.com/PrincePrabalan/webservice-spec-agent.git
cd webservice-spec-agent
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Install globally:
```bash
npm install -g .
```

## 🚀 Usage

### In Visual Studio Code

1. Open the integrated terminal (`Ctrl+`` or `Cmd+``)
2. Run the agent:
```bash
npm start
```

3. The agent will guide you through creating your specification with prompts for:
   - API title, version, and description
   - Server configuration
   - API endpoints and HTTP methods
   - Security schemes
   - Data schemas

4. Output files will be generated in `webservice-spec-output/`:
   - `openapi.json` - OpenAPI 3.0 JSON format
   - `openapi.yaml` - OpenAPI 3.0 YAML format
   - `api-docs.md` - Markdown documentation

### Example

```bash
$ npm start

🚀 WebService Specification Agent

Generate OpenAPI 3.0 specifications interactively

📋 Basic Information

? API Title: User Management API
? API Version: 2.0.0
? API Description: Complete user management system
? Contact Name: Support Team
? Contact Email: support@example.com

🌐 Server Configuration

? Server URL: https://api.example.com
? Server Description: Production Server
? Add another server? No

📝 API Endpoints

? Endpoint Path: /users
? HTTP Methods: (Select with arrow keys)
  ⟩ GET
    POST
    PUT
    PATCH
    DELETE
    HEAD
```

## 📁 Project Structure

```
webservice-spec-agent/
├── agent.js              # Main interactive agent
├── generator.js          # Specification generator
├── bin/
│   └── cli.js           # CLI executable
├── package.json          # Project dependencies
├── README.md            # Documentation
└── .gitignore           # Git configuration
```

## 🔧 Configuration

No additional configuration needed! The agent guides you through the entire process interactively.

## 📄 Output Examples

### Generated openapi.json
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "User Management API",
    "version": "1.0.0",
    "description": "Complete user management system",
    "contact": {
      "name": "Support Team",
      "email": "support@example.com"
    }
  },
  "servers": [
    {
      "url": "https://api.example.com",
      "description": "Production Server"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Get all users",
        "tags": ["users"],
        "responses": {
          "200": {
            "description": "Successful response"
          }
        }
      }
    }
  }
}
```

## 🔐 Security Schemes Supported

1. **API Key** - Header-based API key authentication
2. **Bearer Token** - JWT and other bearer tokens
3. **OAuth2** - Full OAuth2 flow support
4. **Basic Auth** - Standard HTTP basic authentication

## 📚 Dependencies

- `inquirer` - Interactive CLI prompts
- `chalk` - Terminal color styling
- `yaml` - YAML parsing and generation
- `fs-extra` - File system utilities
- `validator` - Input validation

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Code Style
```bash
npm run lint
npm run format
```

## 📖 Examples

Check the `webservice-spec-output/` directory after running the agent to see generated specifications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

MIT License - see LICENSE file for details

## 💬 Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## 🎓 Learning Resources

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger Documentation](https://swagger.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Created by:** PrincePrabalan  
**Last Updated:** 2026-05-29  
**Version:** 1.0.0
