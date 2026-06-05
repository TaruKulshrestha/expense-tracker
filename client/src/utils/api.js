const API_ORIGIN = import.meta.env.DEV
  ? ''
  : 'https://expense-tracker-mp7m.onrender.com';

const EXPENSES_BASE = `${API_ORIGIN}/api/expenses`;
const BUDGETS_BASE = `${API_ORIGIN}/api/budgets`;

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors ? data.errors.join(', ') : data.error || 'Unknown error';
    throw new Error(msg);
  }
  return data;
}

export async function fetchExpenses({ category, startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  const res = await fetch(`${EXPENSES_BASE}?${params}`);
  return handleResponse(res);
}

export async function createExpense(data) {
  const res = await fetch(EXPENSES_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateExpense(id, data) {
  const res = await fetch(`${EXPENSES_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`${EXPENSES_BASE}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

export async function fetchBudgets() {
  const res = await fetch(BUDGETS_BASE);
  return handleResponse(res);
}

export async function updateBudgets(budgets) {
  const res = await fetch(BUDGETS_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budgets),
  });
  return handleResponse(res);
}
