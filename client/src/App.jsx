import { useState, useMemo } from 'react';
import { useExpenses } from './hooks/useExpenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryPanel from './components/SummaryPanel';
import Filters from './components/Filters';
import ExportButton from './components/ExportButton';
import styles from './App.module.css';

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ preset: 'all', category: '', startDate: '', endDate: '' });

  const apiFilters = useMemo(() => ({
    category: filters.category || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  }), [filters.category, filters.startDate, filters.endDate]);

  const { expenses, summary, loading, error, addExpense, editExpense, removeExpense } = useExpenses(apiFilters);

  async function handleAdd(data) {
    await addExpense(data);
    setShowForm(false);
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>₹</span>
          <div>
            <h1 className={styles.title}>Expense Tracker</h1>
            <p className={styles.subtitle}>where does it all go</p>
          </div>
        </div>
        <button
          className={`${styles.addBtn} ${showForm ? styles.addBtnActive : ''}`}
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          {showForm ? '✕ Cancel' : '+ Add Expense'}
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.left}>
          {showForm && (
            <ExpenseForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
          )}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Filters filters={filters} onChange={setFilters} />
              <ExportButton expenses={expenses} />
            </div>

            <ExpenseList
              expenses={expenses}
              loading={loading}
              error={error}
              onEdit={editExpense}
              onDelete={removeExpense}
            />
          </section>
        </div>

        <aside className={styles.aside}>
          <SummaryPanel summary={summary} />
        </aside>
      </main>
    </div>
  );
}
