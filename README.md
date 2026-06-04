# Expense Tracker

Small full-stack app for tracking daily spending. Add expenses by category, filter the list, and check a summary panel with monthly totals and a donut chart.

Built for the Studio Graphene Node.js + React take-home (Exercise 2). Data is stored in a JSON file on the server, so it sticks around after restarts.

## Approach

Quality over quantity: a small feature set done well beats a long wishlist.

- Validation on the client matches the API, so bad requests are caught early
- After add/edit/delete, the list refreshes without flashing a full-page loader
- Server logic is split into small helpers (filter, summary, validate) instead of one huge route file
- Tests cover real behaviour (create, reject bad input, filter, update, delete) — not dozens of shallow cases

## Live demo

Haven't deployed yet — update these when it's live:

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`

## Stack

- **Backend:** Node + Express
- **Frontend:** React + Vite
- **Styling:** CSS Modules
- **Charts:** Recharts
- **Storage:** JSON file via `fs` (simple, no DB setup)
- **Tests:** Jest + Supertest on the API routes

## Getting it running

You'll need Node 18+.

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

cd server && npm install && cd ..
cd client && npm install && cd ..
```

Start the backend first (port 3001):

```bash
cd server && npm run dev
```

Then the frontend in another terminal (port 5173):

```bash
cd client && npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to the backend, so you don't need to mess with CORS locally.

### Tests

```bash
cd server && npm test
```

## API

Base URL: `http://localhost:3001/api`

### GET /expenses

Returns a filtered list plus summary stats.

Query params (all optional):

| Param | Example |
|---|---|
| `category` | `Food` |
| `startDate` | `2025-06-01` |
| `endDate` | `2025-06-30` |

Example response:

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
    "totalByCategory": {
      "Food": 1200.00,
      "Transport": 800.00,
      "Bills": 2000.00,
      "Entertainment": 600.00,
      "Other": 200.00
    },
    "highestExpense": { "id": "...", "amount": 2000.00, "category": "Bills" }
  }
}
```

Note: filters only affect the `expenses` array. The summary is always for the current calendar month.

### GET /expenses/:id

Single expense, or 404 if not found.

### POST /expenses

```json
{
  "amount": 250,
  "category": "Food",
  "date": "2025-06-04",
  "note": "optional"
}
```

Rules: amount has to be positive, category must be one of Food / Transport / Bills / Entertainment / Other, and the date can't be in the future.

Returns 201 with the new expense, or 400 with `{ "errors": [...] }`.

### PUT /expenses/:id

Same body as POST. 200 on success, 404 if the id doesn't exist.

### DELETE /expenses/:id

204 on success, 404 if not found.

## Project layout

```
expense-tracker/
├── client/
│   ├── vite.config.js       # proxies /api → localhost:3001
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── ExpenseForm    # add / edit
│       │   ├── ExpenseList    # table, inline edit, delete
│       │   ├── SummaryPanel   # monthly stats + chart
│       │   ├── Filters        # date presets + category
│       │   └── ExportButton   # CSV of what's on screen
│       ├── hooks/useExpenses.js
│       └── utils/             # api, formatters, validateExpense
└── server/
    ├── index.js
    ├── data.json              # created on first save (gitignored)
    ├── lib/expenseHelpers.js  # validate, filter, summary
    ├── routes/expenses.js
    └── store/expenses.js      # in-memory + file persistence
```

## If I had more time

Only things that would materially improve the app:

- SQLite instead of a JSON file (safer if multiple requests hit at once)
- A proper mobile layout for the add/edit form
- Deploy + CI so the live demo stays in sync with `main`
