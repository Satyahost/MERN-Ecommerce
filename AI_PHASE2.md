# E-Cart AI Assistant — Phase 2

Phase 2 upgrades the Phase 1 assistant from a shell/acknowledgement endpoint to a real server-side AI assistant using the OpenAI Responses API and controlled E-Cart tools.

## Added

### Backend
- `backend/utils/aiTools.js`: product search, product details, stock, categories, and allow-listed navigation.
- `backend/utils/aiDefinitions.js`: strict function-tool schemas.
- `backend/controller/aiController.js`: OpenAI Responses API integration and server-side function-call loop.
- `backend/config/config.env.example`: `GOOGLE_API_KEY` and `OPENAI_MODEL`.
- Root `package.json`: `openai` dependency.

### Frontend
- `frontend/src/ai/AIAssistant.jsx`: sends recent chat history and consumes navigation actions returned by the backend.

## Architecture

```text
React AIAssistant
       |
       | POST /api/v1/ai/chat
       v
Express AI Controller
       |
       v
OpenAI Responses API
       |
       | function call
       v
Server-side E-Cart tool
       |
       +--> MongoDB Product model
       +--> Controlled navigation map
       |
       v
Tool result -> OpenAI -> final answer -> React
```

## Setup

1. Copy `backend/config/config.env.example` to `backend/config/config.env`.
2. Add your own `GOOGLE_API_KEY`.
3. Keep the key only in the backend environment file; never put it in React code or the frontend `.env`.
4. The example uses `OPENAI_MODEL=gpt-5.5`; change it if your account/project uses another supported model.
5. From the project root:

```bash
npm install
npm run dev
```

6. In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

## Test Phase 2

Ask the assistant:
- `Hello`
- `Show me laptops`
- `Find products related to headphones`
- `What product categories are available?`
- `Open the products page`
- `Take me to my cart`

The product and stock tools read MongoDB on the server. Navigation is restricted to the allow-list in `aiTools.js`.

## Security

- OpenAI key is backend-only.
- MongoDB access is backend-only.
- Tool definitions are controlled by the server.
- Navigation cannot use an arbitrary URL/path.
- Phase 2 does not include product create/update/delete operations; those belong to a later admin-confirmation phase.
- Never commit `backend/config/config.env` or real credentials.
