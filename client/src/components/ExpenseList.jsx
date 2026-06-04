import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/formatters';
import ExpenseForm from './ExpenseForm';
import styles from './ExpenseList.module.css';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="confirm-msg">
      <div className={styles.dialog}>
        <p id="confirm-msg">{message}</p>
        <div className={styles.dialogActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
          <button className={styles.deleteBtn} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ExpenseRow({ expense, onEdit, onDelete }) {
  const color = CATEGORY_COLORS[expense.category] || '#999';

  return (
    <div className={`${styles.row} fade-in`}>
      <span className={styles.categoryDot} style={{ background: color }} />
      <div className={styles.meta}>
        <span className={styles.category}>{expense.category}</span>
        {expense.note && <span className={styles.note}>{expense.note}</span>}
      </div>
      <span className={styles.date}>{formatDate(expense.date)}</span>
      <span className={styles.amount}>{formatCurrency(expense.amount)}</span>
      <div className={styles.rowActions}>
        <button className={styles.editBtn} onClick={() => onEdit(expense)} aria-label="Edit expense">
          ✎
        </button>
        <button className={styles.delBtn} onClick={() => onDelete(expense)} aria-label="Delete expense">
          ✕
        </button>
      </div>
    </div>
  );
}

export default function ExpenseList({ expenses, loading, error, onEdit, onDelete }) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function handleEditSubmit(data) {
    setActionError(null);
    try {
      await onEdit(editingExpense.id, data);
      setEditingExpense(null);
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDeleteConfirm() {
    setActionError(null);
    try {
      await onDelete(deletingExpense.id);
      setDeletingExpense(null);
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) {
    return (
      <div className={styles.state}>
        <div className={styles.spinner} aria-label="Loading" />
        <span>Loading expenses…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.state} ${styles.errorState}`}>
        <span>⚠ {error}</span>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>₹</span>
        <p>No expenses yet.</p>
        <p className={styles.emptyHint}>Add one above to get started.</p>
      </div>
    );
  }

  return (
    <>
      {actionError && (
        <div className={`${styles.state} ${styles.errorState}`} role="alert">
          <span>⚠ {actionError}</span>
        </div>
      )}

      {editingExpense && (
        <div className={styles.editWrap}>
          <ExpenseForm
            initial={editingExpense}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingExpense(null)}
          />
        </div>
      )}

      <div className={styles.list}>
        <div className={styles.header}>
          <span>Category</span>
          <span className={styles.headerDate}>Date</span>
          <span className={styles.headerAmount}>Amount</span>
          <span />
        </div>

        {expenses.map((expense) => (
          <ExpenseRow
            key={expense.id}
            expense={expense}
            onEdit={setEditingExpense}
            onDelete={setDeletingExpense}
          />
        ))}
      </div>

      {deletingExpense && (
        <ConfirmDialog
          message={`Delete this ${deletingExpense.category} expense of ${formatCurrency(deletingExpense.amount)}?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingExpense(null)}
        />
      )}
    </>
  );
}
