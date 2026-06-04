const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function validateExpense(body) {
  const errors = [];

  const amount = parseFloat(body.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push('amount must be a positive number');
  }

  if (!body.category || !VALID_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!body.date) {
    errors.push('date is required');
  } else {
    const inputDate = new Date(body.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (isNaN(inputDate.getTime())) {
      errors.push('date is invalid');
    } else if (inputDate > today) {
      errors.push('date cannot be in the future');
    }
  }

  return errors;
}

function filterExpenses(expenses, { category, startDate, endDate }) {
  let result = expenses;

  if (category && VALID_CATEGORIES.includes(category)) {
    result = result.filter((e) => e.category === category);
  }

  if (startDate) {
    const start = new Date(startDate);
    if (!isNaN(start)) {
      result = result.filter((e) => new Date(e.date) >= start);
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (!isNaN(end)) {
      end.setHours(23, 59, 59, 999);
      result = result.filter((e) => new Date(e.date) <= end);
    }
  }

  return result;
}

function buildSummary(allExpenses) {
  const now = new Date();
  const thisMonthExpenses = allExpenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const totalByCategory = VALID_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = thisMonthExpenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {});

  const highestExpense = allExpenses.reduce(
    (max, e) => (e.amount > (max?.amount ?? -Infinity) ? e : max),
    null
  );

  return { totalThisMonth, totalByCategory, highestExpense };
}

module.exports = { VALID_CATEGORIES, validateExpense, filterExpenses, buildSummary };
