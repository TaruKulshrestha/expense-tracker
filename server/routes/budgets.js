const express = require('express');
const budgetStore = require('../store/budgets');

const router = express.Router();

function validateBudgets(body) {
  const errors = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    errors.push('budgets must be an object');
    return errors;
  }

  for (const [key, value] of Object.entries(body)) {
    if (!budgetStore.VALID_CATEGORIES.includes(key)) {
      errors.push(`unknown category: ${key}`);
      continue;
    }
    const num = parseFloat(value);
    if (value !== '' && value != null && (isNaN(num) || num < 0)) {
      errors.push(`${key} budget must be a non-negative number`);
    }
  }

  return errors;
}

function normalizeBudgets(body) {
  const result = {};
  for (const cat of budgetStore.VALID_CATEGORIES) {
    const val = body[cat];
    if (val === '' || val == null) continue;
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) result[cat] = num;
  }
  return result;
}

router.get('/', (req, res) => {
  res.json(budgetStore.getAll());
});

router.put('/', (req, res) => {
  const errors = validateBudgets(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const updated = budgetStore.updateAll(normalizeBudgets(req.body));
  res.json(updated);
});

module.exports = router;
