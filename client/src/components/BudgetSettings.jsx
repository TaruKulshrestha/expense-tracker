import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/formatters';
import styles from './BudgetSettings.module.css';

const EMPTY = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: '' }), {});

export default function BudgetSettings({ budgets, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm(CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat]: budgets[cat] != null ? String(budgets[cat]) : '',
    }), {}));
  }, [budgets]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleChange(cat, value) {
    setForm((prev) => ({ ...prev, [cat]: value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="budget-title">
      <div className={styles.modal}>
        <div className={styles.head}>
          <h2 id="budget-title" className={styles.title}>Monthly budgets</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className={styles.desc}>Set a spending limit per category. You&apos;ll see a warning when this month&apos;s spend exceeds it.</p>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {CATEGORIES.map((cat) => (
            <div key={cat} className={styles.row}>
              <label htmlFor={`budget-${cat}`}>{cat}</label>
              <div className={styles.inputWrap}>
                <span className={styles.prefix}>₹</span>
                <input
                  id={`budget-${cat}`}
                  type="number"
                  min="0"
                  step="100"
                  placeholder="No limit"
                  value={form[cat]}
                  onChange={(e) => handleChange(cat, e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving…' : 'Save budgets'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
