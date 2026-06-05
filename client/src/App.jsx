import { useState, useMemo } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useBudgets } from './hooks/useBudgets';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryPanel from './components/SummaryPanel';
import Filters from './components/Filters';
import ExportButton from './components/ExportButton';
import BudgetSettings from './components/BudgetSettings';
import { formatCurrency } from './utils/formatters';
import styles from './App.module.css';

export default function App() {
  const [filters, setFilters] = useState({ preset: 'all', category: '', startDate: '', endDate: '' });
  const [showBudgets, setShowBudgets] = useState(false);

  const apiFilters = useMemo(() => ({
    category: filters.category || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  }), [filters.category, filters.startDate, filters.endDate]);

  const { expenses, summary, loading, error, addExpense, editExpense, removeExpense } = useExpenses(apiFilters);
  const { budgets, saveBudgets } = useBudgets();

  const filteredStats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return { total, count: expenses.length };
  }, [expenses]);

  const hasActiveFilters = filters.preset !== 'all' || !!filters.category;

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
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.budgetsBtn}
            onClick={() => setShowBudgets(true)}
          >
            Budgets
          </button>
          <ExportButton expenses={expenses} />
        </div>
      </header>

      {!loading && summary && (
        <section className={styles.hero} aria-label="Spending overview">
          <div className={styles.heroMain}>
            <span className={styles.heroLabel}>This month</span>
            <span className={styles.heroAmount}>{formatCurrency(summary.totalThisMonth)}</span>
          </div>
          {hasActiveFilters && (
            <>
              <div className={styles.heroDivider} aria-hidden="true" />
              <div className={styles.heroMetric}>
                <span className={styles.heroMetricLabel}>Filtered total</span>
                <span className={styles.heroMetricValue}>{formatCurrency(filteredStats.total)}</span>
              </div>
            </>
          )}
          <div className={styles.heroDivider} aria-hidden="true" />
          <div className={styles.heroMetric}>
            <span className={styles.heroMetricLabel}>Showing</span>
            <span className={styles.heroMetricValue}>{filteredStats.count}</span>
            <span className={styles.heroMetricSub}>transactions</span>
          </div>
          <div className={styles.heroDivider} aria-hidden="true" />
          <div className={styles.heroMetric}>
            <span className={styles.heroMetricLabel}>Highest ever</span>
            <span className={styles.heroMetricValue}>
              {summary.highestExpense
                ? formatCurrency(summary.highestExpense.amount)
                : '—'}
            </span>
            {summary.highestExpense && (
              <span className={styles.heroMetricSub}>{summary.highestExpense.category}</span>
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
            summary={summary}
            budgets={budgets}
            loading={loading}
          />
        </div>

        <aside className={styles.formCol}>
          <ExpenseForm onSubmit={handleAdd} />
        </aside>
      </main>

      {showBudgets && (
        <BudgetSettings
          budgets={budgets}
          onSave={saveBudgets}
          onClose={() => setShowBudgets(false)}
        />
      )}
    </div>
  );
}
