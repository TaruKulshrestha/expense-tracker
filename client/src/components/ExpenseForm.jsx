import { useState, useEffect } from 'react';
import { CATEGORIES, CATEGORY_COLORS, todayString } from '../utils/formatters';
import { validateExpense } from '../utils/validateExpense';
import styles from './ExpenseForm.module.css';

const NOTE_MAX = 200;

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
    const { name, value } = e.target;
    if (name === 'note' && value.length > NOTE_MAX) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors([]);
  }

  function handleCategory(cat) {
    setForm((prev) => ({ ...prev, category: cat }));
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
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <div className={styles.cardHead}>
        <h2 className={styles.heading}>{initial ? 'Edit entry' : 'Log expense'}</h2>
        <p className={styles.hint}>Record a new transaction</p>
      </div>

      {errors.length > 0 && (
        <ul className={styles.errors} role="alert">
          {errors.map((e) => <li key={e}>{e}</li>)}
        </ul>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="amount">Amount</label>
          <div className={styles.amountWrap}>
            <span className={styles.prefix}>₹</span>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className={styles.amountInput}
              required
            />
          </div>
        </div>
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
      </div>

      <div className={styles.field}>
        <span className={styles.catLabel}>Category</span>
        <div className={styles.catGrid} role="group" aria-label="Category">
          {CATEGORIES.map((cat) => {
            const color = CATEGORY_COLORS[cat];
            const active = form.category === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`${styles.catBtn} ${active ? styles.catBtnActive : ''}`}
                style={active ? {
                  borderColor: color,
                  color,
                  background: `${color}18`,
                } : undefined}
                onClick={() => handleCategory(cat)}
                aria-pressed={active}
              >
                <span className={styles.catDot} style={{ background: color }} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="note">Memo</label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="What was this for?"
          value={form.note}
          onChange={handleChange}
          maxLength={NOTE_MAX}
        />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Update' : 'Record expense'}
        </button>
      </div>
    </form>
  );
}
