import { useState, useMemo } from 'react';
import { useExpenses } from './hooks/useExpenses';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryPanel from './components/SummaryPanel';
import Filters from './components/Filters';
import ExportButton from './components/ExportButton';
import { formatCurrency } from './utils/formatters';
import styles from './App.module.css';

export default function App() {
  const [filters, setFilters] = useState({ preset: 'all', category: '', startDate: '', endDate: '' });

  const apiFilters = useMemo(() => ({
    category: filters.category || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  }), [filters.category, filters.startDate, filters.endDate]);

  const { expenses, loading, error, addExpense, editExpense, removeExpense } = useExpenses(apiFilters);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = {};
    let highest = null;

    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      if (!highest || e.amount > highest.amount) highest = e;
    }

    let topCategory = null;
    let topAmount = 0;
    for (const [cat, amt] of Object.entries(byCategory)) {
      if (amt > topAmount) {
        topAmount = amt;
        topCategory = cat;
      }
    }

    const avg = expenses.length > 0 ? total / expenses.length : 0;
    return { total, byCategory, topCategory, topAmount, highest, avg, count: expenses.length };
  }, [expenses]);

  async function handleAdd(data) {
    await addExpense(data);
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">₹</div>
          <div>
            <h1 className={styles.title}>SpendWise</h1>
            <p className={styles.subtitle}>Your personal spending ledger</p>
          </div>
        </div>
        <ExportButton expenses={expenses} />
      </header>

      {!loading && (
        <section className={styles.hero} aria-label="Spending overview">
          <div className={styles.heroMain}>
            <span className={styles.heroLabel}>Filtered total</span>
            <span className={styles.heroAmount}>{formatCurrency(stats.total)}</span>
          </div>
          <div className={styles.heroDivider} aria-hidden="true" />
          <div className={styles.heroMetric}>
            <span className={styles.heroMetricLabel}>Transactions</span>
            <span className={styles.heroMetricValue}>{stats.count}</span>
          </div>
          <div className={styles.heroDivider} aria-hidden="true" />
          <div className={styles.heroMetric}>
            <span className={styles.heroMetricLabel}>Daily avg</span>
            <span className={styles.heroMetricValue}>{formatCurrency(stats.avg)}</span>
          </div>
          <div className={styles.heroDivider} aria-hidden="true" />
          <div className={styles.heroMetric}>
            <span className={styles.heroMetricLabel}>Peak spend</span>
            <span className={styles.heroMetricValue}>
              {stats.highest ? formatCurrency(stats.highest.amount) : '—'}
            </span>
            {stats.highest && (
              <span className={styles.heroMetricSub}>{stats.highest.category}</span>
            )}
          </div>
        </section>
      )}

      <main className={styles.main}>
        <div className={styles.contentCol}>
          <div className={styles.toolbar}>
            <h2 className={styles.sectionTitle}>Activity</h2>
            <Filters filters={filters} onChange={setFilters} />
          </div>

          <div className={styles.listCard}>
            <ExpenseList
              expenses={expenses}
              loading={loading}
              error={error}
              onEdit={editExpense}
              onDelete={removeExpense}
            />
          </div>

          <SummaryPanel
            total={stats.total}
            byCategory={stats.byCategory}
            topCategory={stats.topCategory}
            topAmount={stats.topAmount}
            loading={loading}
          />
        </div>

        <aside className={styles.formCol}>
          <ExpenseForm onSubmit={handleAdd} />
        </aside>
      </main>
    </div>
  );
}
