const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'budgets.json');
const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

function loadFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return sanitize(parsed);
    }
  } catch (err) {
    console.warn('Could not load budgets file, starting fresh:', err.message);
  }
  return {};
}

function sanitize(budgets) {
  const clean = {};
  for (const cat of VALID_CATEGORIES) {
    const val = budgets?.[cat];
    if (typeof val === 'number' && val > 0) clean[cat] = val;
  }
  return clean;
}

function saveToFile(budgets) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(budgets, null, 2), 'utf8');
  } catch (err) {
    console.error('Could not persist budgets:', err.message);
  }
}

let budgets = loadFromFile();

function getAll() {
  return { ...budgets };
}

function updateAll(updates) {
  budgets = sanitize(updates);
  saveToFile(budgets);
  return getAll();
}

module.exports = { getAll, updateAll, VALID_CATEGORIES };
