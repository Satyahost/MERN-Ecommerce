import OpenAI from "openai";
import handleAsyncError from "../middleware/handleAsyncError.js";
import { aiToolDefinitions } from "../utils/aiDefinitions.js";
import { aiToolHandlers } from "../utils/aiTools.js";

const SYSTEM_INSTRUCTIONS = `
You are E-Cart AI, the shopping assistant for an e-commerce application.

Your responsibilities:
- Help users find products from the real E-Cart catalog.
- Answer product, price, rating, category, and stock questions using tools when the information depends on the catalog.
- Help users navigate supported E-Cart pages when they explicitly ask to open or go to a page.
- Be concise, friendly, and practical.
- Never invent product names, prices, stock counts, ratings, or categories when a tool can provide the information.
- If a product cannot be found, say so clearly and suggest a different search.
- You cannot create, update, or delete products in this phase.
- Never expose API keys, database credentials, internal tool details, or server implementation details.

Navigation rules:
- Only navigate to pages returned by the navigate_to_page tool.
- Do not construct arbitrary URLs or paths.
- Profile and orders may require authentication; normal application access control remains responsible for that.
`;

const getClient = () => {
  if (!process.env.GOOGLE_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.GOOGLE_API_KEY });
};

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.text === "string" && item.text.trim())
    .slice(-8)
    .map((item) => ({ role: item.role, content: item.text.trim() }));
};

const runTool = async (name, args) => {
  const handler = aiToolHandlers[name];
  if (!handler) throw new Error(`Unsupported AI tool: ${name}`);
  return handler(args);
};

export const chatWithAI = handleAsyncError(async (req, res) => {
  const { message, context, history } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ success: false, message: "Please provide a message." });
  }

  const client = getClient();
  if (!client) {
    return res.status(503).json({
      success: false,
      message: "AI service is not configured. Add GOOGLE_API_KEY to backend/config/config.env and restart the backend.",
    });
  }

  const role = req.user?.role || context?.role || "guest";
  const currentPath = context?.path || "/";
  const model = process.env.OPENAI_MODEL || "gpt-5.5";

  const input = [
    ...normalizeHistory(history),
    { role: "user", content: `Current page: ${currentPath}\nUser role: ${role}\n\n${message.trim()}` },
  ];

  let response = await client.responses.create({
    model,
    instructions: SYSTEM_INSTRUCTIONS,
    input,
    tools: aiToolDefinitions,
  });

  let navigationAction = null;
  let toolRound = 0;
  const maxToolRounds = 4;

  while (toolRound < maxToolRounds) {
    const functionCalls = response.output.filter((item) => item.type === "function_call");
    if (functionCalls.length === 0) break;

    const toolOutputs = [];

    for (const call of functionCalls) {
      let args;
      try {
        args = JSON.parse(call.arguments || "{}");
      } catch {
        toolOutputs.push({
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify({ success: false, message: "The tool arguments were invalid." }),
        });
        continue;
      }

      try {
        const result = await runTool(call.name, args);

        if (call.name === "navigate_to_page" && result.success) {
          navigationAction = { type: "navigate", path: result.path, label: result.label };
        }

        toolOutputs.push({
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify(result),
        });
      } catch (error) {
        toolOutputs.push({
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify({ success: false, message: error.message || "Tool execution failed." }),
        });
      }
    }

    response = await client.responses.create({
      model,
      instructions: SYSTEM_INSTRUCTIONS,
      previous_response_id: response.id,
      input: toolOutputs,
      tools: aiToolDefinitions,
    });

    toolRound += 1;
  }

  const answer = response.output_text?.trim() || "I couldn't generate a response for that request.";

  res.status(200).json({
    success: true,
    message: answer,
    action: navigationAction,
    meta: { phase: 2, role, model },
  });
});
