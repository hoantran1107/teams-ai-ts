import { App } from "@microsoft/teams.apps";
import { DevtoolsPlugin } from "@microsoft/teams.dev";
import { McpPlugin } from "@microsoft/teams.mcp";
import { z } from "zod";

const mcp = new McpPlugin({
  transport: {
    type: "sse",
    path: "/mcp",
  },
});

// Example tool definition (proxy logic to MCP server can be implemented as needed)
mcp.tool(
  "getJiraIssue",
  "Fetch a Jira issue by its key (e.g., JIRA-123)",
  {
    issueKey: z.string().describe("The Jira issue key"),
  },
  {
    readOnlyHint: true,
    idempotentHint: true,
  },
  async (args: any) => {
    // This is a placeholder. Actual proxy logic to MCP server can be implemented here.
    return {
      content: [
        {
          type: "text",
          text: `Requesting Jira issue: ${args.issueKey} from mcp-atlassian server`,
        },
      ],
    };
  }
);

const app = new App({
  plugins: [new DevtoolsPlugin(), mcp],
});

app.on("message", async ({ send, activity }) => {
  await send({ type: "typing" });
  await send(`you said "${activity.text}"`);
});

app.event("error", (error) => {
  console.error(error);
});

app.event("signin", async ({ activity, send }) => {
  await send(`👋 Hello ${activity.from.name}`);
});

(async () => {
  await app.start(+(process.env.PORT || 3978));
})();
