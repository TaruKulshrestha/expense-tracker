# Expense Tracker

Full-stack app for tracking daily spending. Add expenses by category, filter the list, export to CSV, and use the summary sidebar for monthly totals, a donut chart, and per-category breakdown.

Built for the Studio Graphene Node.js + React take-home (Exercise 2).

## Features

- Add, edit, and delete expenses with client + server validation
- Filter by category and date (presets: all time, this month, last month, or custom range)
- Summary panel for the current month (totals, highest expense, chart)
- CSV export of whatever is currently visible in the list
- Dark UI with gradient accents, card layout, and responsive design (desktop-first, usable on mobile)

## Where data is stored

Nothing is saved in the browser. When you add an expense, the React app calls the API and the server writes to:

```
server/data.json
```

The file is created on first save, loaded when the server starts, and listed in `.gitignore` so your local data is not committed. You need the backend running for saves to work.

## Approach

Quality over quantity — a small feature set done well, not a long wishlist.

- Client validation mirrors the API (`validateExpense.js`) so bad input is caught before a request
- After add/edit/delete, data refreshes without a full-page loading spinner
- Server helpers handle filtering, summary, and validation (`server/lib/expenseHelpers.js`)
- API tests cover real flows (create, reject bad input, filter, update, delete)
- UI built with CSS Modules, design tokens, and Google Fonts (Fraunces, Outfit, DM Mono)
- Git history is split into incremental commits (backend → tests → client → UI → docs)

## Live demo

Not deployed yet — update when live:

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express |
| Frontend | React, Vite |
| Styling | CSS Modules |
| Charts | Recharts |
| Storage | JSON file (`server/data.json`) |
| Tests | Jest, Supertest |

Both `server/` and `client/` include `package-lock.json` for reproducible installs.

## Getting it running

Node 18+ required.

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

cd server && npm install && cd ..
cd client && npm install && cd ..
```

**Terminal 1** — API (port 3001):

```bash
cd server && npm run dev
```

**Terminal 2** — UI (port 5173):

```bash
cd client && npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to the backend, so CORS is not needed locally.

### Tests

```bash
cd server && npm test
```

## API

Base URL: `http://localhost:3001/api`

### `GET /expenses`

Filtered list plus summary. Query params (all optional): `category`, `startDate`, `endDate`.

Filters apply only to `expenses`. `summary` is always for the current calendar month.

```json
{
  "expenses": [
    {
      "id": "uuid",
      "amount": 250.00,
      "category": "Food",
      "date": "2025-06-04",
      "note": "Lunch",
      "createdAt": "2025-06-04T10:00:00.000Z"
    }
  ],
  "summary": {
    "totalThisMonth": 4800.00,
    "totalByCategory": { "Food": 1200.00, "Transport": 800.00 },
    "highestExpense": { "id": "...", "amount": 2000.00, "category": "Bills" }
  }
}
```

### `GET /expenses/:id`

Single expense, or `404`.

### `POST /expenses`

```json
{
  "amount": 250,
  "category": "Food",
  "date": "2025-06-04",
  "note": "optional"
}
```

Rules: amount > 0; category ∈ Food, Transport, Bills, Entertainment, Other; date not in the future.

Returns `201` or `400` with `{ "errors": [...] }`.

### `PUT /expenses/:id`

Same body as POST. `200` or `404`.

### `DELETE /expenses/:id`

`204` or `404`.

## Project layout

```
expense-tracker/
├── client/
│   ├── package-lock.json
│   ├── vite.config.js          # proxies /api → localhost:3001
│   └── src/
│       ├── App.jsx
│       ├── index.css             # design tokens, global styles
│       ├── components/           # form, list, filters, summary, export
│       ├── hooks/useExpenses.js
│       └── utils/                # api, formatters, validateExpense
├── server/
│   ├── package-lock.json
│   ├── data.json                 # your expenses (gitignored, auto-created)
│   ├── index.js
│   ├── lib/expenseHelpers.js
│   ├── routes/expenses.js
│   ├── routes/expenses.test.js
│   └── store/expenses.js
└── package.json                  # install:all, dev:server, dev:client, test
```

## If I had more time

- SQLite instead of JSON for safer concurrent writes
- Stronger mobile layout for add/edit (bottom sheet)
- Deploy frontend + backend with CI on push to `main`
