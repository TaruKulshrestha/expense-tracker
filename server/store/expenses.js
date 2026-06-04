const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Load persisted data on startup, fall back to empty array
function loadFromFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not load data file, starting fresh:', err.message);
  }
  return [];
}

function saveToFile(expenses) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2), 'utf8');
  } catch (err) {
    console.error('Could not persist data:', err.message);
  }
}

let expenses = loadFromFile();

function getAll() {
  return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getById(id) {
  return expenses.find((e) => e.id === id) || null;
}

function create(expense) {
  expenses.unshift(expense);
  saveToFile(expenses);
  return expense;
}

function update(id, updates) {
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  expenses[idx] = { ...expenses[idx], ...updates, id };
  saveToFile(expenses);
  return expenses[idx];
}

function remove(id) {
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  expenses.splice(idx, 1);
  saveToFile(expenses);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
