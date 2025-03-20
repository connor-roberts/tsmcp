# MCP TypeScript Post Greeting Server

A barebones Model Context Protocol (MCP) server built with TypeScript that makes POST requests to httpbin.org.

## Features

- Exposes a single tool: `post_greeting`
- Sends name and greeting message to httpbin.org
- Returns the JSON response from httpbin.org
- Uses stdio transport for easy integration with Claude for Desktop

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-ts.git
cd mcp-ts

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Run the server directly

```bash
npm start
```

### Development mode

```bash
npm run dev
```

### Integration with Claude for Desktop

To use this server with Claude for Desktop, add the following to your Claude for Desktop configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "post-greeting": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-ts/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to` with the actual path to your project.

## API

The server provides a single tool:

### post_greeting

Sends a name and greeting message to httpbin.org and returns the response.

- **Parameters**:

  - `name` (string): Name of the person to greet
  - `greeting` (string): Greeting message

- **Example**:
  ```
  post_greeting:
    name: "John"
    greeting: "Hello, nice to meet you!"
  ```

## License

ISC
