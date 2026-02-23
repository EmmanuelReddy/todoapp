# backend

Minimal backend for the MERN todo app.

Setup

- Copy environment variables into `.env` (example below).
- Install dependencies and run the server.

Environment

Create a `.env` file in `backend/` with at least:

- `MONGO_URI` — your MongoDB connection string
- `PORT` — optional, defaults to `5000`

Running

From workspace root:

```bash
npm run dev
```

Or from the `backend` folder:

```bash
cd backend
npm install
npm run dev
```

Notes

- Server entry: `server.js` (ES modules enabled via `type: \"module\"`).
- Ignore `.env` in version control — see `.gitignore`.
