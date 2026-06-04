import { CATEGORIES } from './formatters';

/** Mirrors server rules so invalid data is caught before a network round-trip. */
export function validateExpense({ amount, category, date }) {
  const errors = [];
  const num = typeof amount === 'number' ? amount : parseFloat(amount);

  if (isNaN(num) || num <= 0) {
    errors.push('amount must be a positive number');
  }

  if (!category || !CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);
  }

  if (!date) {
    errors.push('date is required');
  } else {
    const inputDate = new Date(date);
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
