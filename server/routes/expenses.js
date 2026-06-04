const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store/expenses');
const { validateExpense, filterExpenses, buildSummary } = require('../lib/expenseHelpers');

const router = express.Router();

router.get('/', (req, res) => {
  const all = store.getAll();
  const expenses = filterExpenses(all, req.query);

  res.json({
    expenses,
    summary: buildSummary(all),
  });
});

router.get('/:id', (req, res) => {
  const expense = store.getById(req.params.id);
  if (!expense) return res.status(404).json({ error: 'Expense not found' });
  res.json(expense);
});

router.post('/', (req, res) => {
  const errors = validateExpense(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const expense = {
    id: uuidv4(),
    amount: parseFloat(req.body.amount),
    category: req.body.category,
    date: req.body.date,
    note: req.body.note?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  const created = store.create(expense);
  res.status(201).json(created);
});

router.put('/:id', (req, res) => {
  const existing = store.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Expense not found' });

  const errors = validateExpense(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const updated = store.update(req.params.id, {
    amount: parseFloat(req.body.amount),
    category: req.body.category,
    date: req.body.date,
    note: req.body.note?.trim() || '',
  });

  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Expense not found' });
  res.status(204).send();
});

module.exports = router;
