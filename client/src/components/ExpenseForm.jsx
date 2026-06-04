import { useState, useEffect } from 'react';
import { CATEGORIES, todayString } from '../utils/formatters';
import { validateExpense } from '../utils/validateExpense';
import styles from './ExpenseForm.module.css';

const EMPTY_FORM = {
  amount: '',
  category: '',
  date: todayString(),
  note: '',
};

export default function ExpenseForm({ onSubmit, onCancel, initial = null }) {
  const [form, setForm] = useState(initial ? {
    amount: String(initial.amount),
    category: initial.category,
    date: initial.date,
    note: initial.note || '',
  } : EMPTY_FORM);

  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        amount: String(initial.amount),
        category: initial.category,
        date: initial.date,
        note: initial.note || '',
      });
    }
  }, [initial?.id]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      note: form.note,
    };

    const clientErrors = validateExpense(payload);
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setErrors([]);
    try {
      await onSubmit(payload);
      if (!initial) setForm(EMPTY_FORM);
    } catch (err) {
      setErrors(err.message.split(', '));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>{initial ? 'Edit Expense' : 'New Expense'}</h2>

      {errors.length > 0 && (
        <ul className={styles.errors} role="alert">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            max={todayString()}
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="note">Note (optional)</label>
          <input
            id="note"
            name="note"
            type="text"
            placeholder="e.g. Lunch with client"
            value={form.note}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save Changes' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
