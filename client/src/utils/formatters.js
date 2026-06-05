export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#34d399',
  Transport: '#38bdf8',
  Bills: '#f472b6',
  Entertainment: '#fb923c',
  Other: '#a78bfa',
};

export const CATEGORY_ICONS = {
  Food: 'F',
  Transport: 'T',
  Bills: 'B',
  Entertainment: 'E',
  Other: 'O',
};

export function getMonthLabel() {
  return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export function getLastMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export function todayString() {
  return new Date().toISOString().split('T')[0];
}

export function getLastNDaysRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

export function getTopCategory(totalByCategory) {
  let top = null;
  let max = 0;
  for (const [cat, amount] of Object.entries(totalByCategory)) {
    if (amount > max) {
      max = amount;
      top = cat;
    }
  }
  return top ? { category: top, amount: max } : null;
}

export function buildCategoryTotals(expenses) {
  const totals = {};
  for (const cat of CATEGORIES) totals[cat] = 0;
  for (const e of expenses) {
    if (totals[e.category] !== undefined) totals[e.category] += e.amount;
  }
  return totals;
}
