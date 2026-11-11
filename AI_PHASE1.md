# E-Cart AI Assistant — Phase 1

Phase 1 adds the AI assistant shell and the frontend/backend contract. The actual AI model, MongoDB product tools, web research, and admin write tools will be added in later phases.

## What was added

### Frontend
- `frontend/src/ai/AIAssistant.jsx`
- `frontend/src/ai/AIAssistant.css`
- Mounted globally in `frontend/src/App.jsx`
- Floating assistant in the bottom-right corner
- Chat window with responsive layout
- Guest/customer/admin-aware title
- Quick navigation buttons for Products, Cart, and Profile
- Sends chat requests to the backend

### Backend
- `backend/routes/aiRoutes.js`
- `backend/controller/aiController.js`
- Mounted as `/api/v1/ai/chat`
- Accepts JSON `{ message, context }`
- Returns a Phase 1 acknowledgement and user role

## Setup

1. Copy `backend/config/config.env.example` to `backend/config/config.env` and add your own backend secrets.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Install dependencies:
   - From the project root: `npm install`
   - Then: `cd frontend && npm install`
4. Start backend: `npm run dev` from the project root.
5. Start frontend: `npm run dev` from `frontend`.

## Important

The ZIP intentionally does not include `node_modules`, `.git`, backend secrets, or the local frontend `.env` file.

Do not commit database, JWT, Cloudinary, email, Razorpay, or AI provider credentials.

## Phase 2 plan

- Connect an actual AI model through the backend.
- Add controlled tools for product search, product details, and stock lookup.
- Return structured navigation actions.
- Keep MongoDB credentials and tool execution on the server.
