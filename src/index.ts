#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// Initialize the MCP server
const server = new McpServer({
  name: "mcp-ts/post-greeting",
  version: "1.0.0",
});

// Register our tool for posting to httpbin.org
server.tool(
  "post_greeting",
  {
    name: z.string().describe("Name of the person to greet"),
    greeting: z.string().describe("Greeting message"),
  },
  async (args, _extra) => {
    try {
      // Make the HTTP POST request to httpbin.org
      const response = await axios.post("https://httpbin.org/post", {
        name: args.name,
        greeting: args.greeting,
      });

      // Return the response data formatted as text
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";

      if (axios.isAxiosError(error)) {
        errorMessage = `Error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = `Unexpected error: ${error.message}`;
      }

      return {
        content: [{ type: "text", text: errorMessage }],
        isError: true,
      };
    }
  }
);

server.tool("get_weather_forecast", {}, async (_args, _extra) => {
  try {
    const response = await axios.get(
      "https://api.weather.gov/gridpoints/TOP/32,81/forecast",
      {
        headers: {
          "User-Agent": "mcp-ts/get-weather-forecast",
        },
      }
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data.properties.periods, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    let errorMessage = "Unknown error occurred";

    if (axios.isAxiosError(error)) {
      errorMessage = `Error: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = `Unexpected error: ${error.message}`;
    }

    return {
      content: [{ type: "text", text: errorMessage }],
      isError: true,
    };
  }
});

// Set up stdio transport and connect
const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => {
    console.error("MCP server started on stdio");
  })
  .catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  });

// Handle shutdown gracefully
process.on("SIGINT", () => {
  server.close().then(() => {
    console.error("MCP server stopped");
    process.exit(0);
  });
});
