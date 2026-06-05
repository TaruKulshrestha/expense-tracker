import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  formatCurrency, CATEGORIES, CATEGORY_COLORS, getMonthLabel,
} from '../utils/formatters';
import styles from './SummaryPanel.module.css';

function ChartTooltip({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className={styles.tooltip}>
        <span>{payload[0].name}</span>
        <strong>{formatCurrency(payload[0].value)}</strong>
      </div>
    );
  }
  return null;
}

function budgetStatus(spent, limit) {
  if (!limit || limit <= 0) return 'none';
  const ratio = spent / limit;
  if (ratio > 1) return 'over';
  if (ratio >= 0.8) return 'warn';
  return 'ok';
}

export default function SummaryPanel({ summary, budgets = {}, loading }) {
  const [chartType, setChartType] = useState('pie');

  if (loading || !summary) {
    return <div className={styles.skeleton} />;
  }

  const { totalThisMonth, totalByCategory, highestExpense } = summary;

  const chartData = CATEGORIES
    .filter((cat) => (totalByCategory[cat] || 0) > 0)
    .map((cat) => ({
      name: cat,
      value: totalByCategory[cat],
    }));

  const hasData = totalThisMonth > 0;

  return (
    <section className={styles.panel} aria-label="Monthly summary">
      <div className={styles.head}>
        <div>
          <h3 className={styles.title}>Monthly summary</h3>
          <span className={styles.month}>{getMonthLabel()}</span>
        </div>
        {hasData && (
          <div className={styles.toggle} role="group" aria-label="Chart type">
            <button
              type="button"
              className={`${styles.toggleBtn} ${chartType === 'pie' ? styles.toggleActive : ''}`}
              onClick={() => setChartType('pie')}
            >
              Pie
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${chartType === 'bar' ? styles.toggleActive : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total this month</span>
          <span className={styles.statValue}>{formatCurrency(totalThisMonth)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Highest expense</span>
          {highestExpense ? (
            <>
              <span className={styles.statValue}>{formatCurrency(highestExpense.amount)}</span>
              <span className={styles.statSub}>{highestExpense.category}</span>
            </>
          ) : (
            <span className={styles.statEmpty}>—</span>
          )}
        </div>
      </div>

      {!hasData ? (
        <div className={styles.empty}>
          <p>No spending logged this month yet.</p>
        </div>
      ) : (
        <>
          <div className={styles.chartWrap}>
            {chartType === 'pie' ? (
              <div className={styles.pieArea}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      cornerRadius={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.pieCenter} aria-hidden="true">
                  <span className={styles.pieTotal}>{formatCurrency(totalThisMonth)}</span>
                  <span className={styles.pieLabel}>this month</span>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(45,212,191,0.08)' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className={styles.breakdown}>
            <h4 className={styles.breakdownTitle}>By category</h4>
            {CATEGORIES.map((cat) => {
              const spent = totalByCategory[cat] || 0;
              if (spent === 0 && !budgets[cat]) return null;

              const limit = budgets[cat];
              const status = budgetStatus(spent, limit);
              const pctOfMonth = totalThisMonth > 0 ? (spent / totalThisMonth) * 100 : 0;
              const pctOfBudget = limit > 0 ? Math.min((spent / limit) * 100, 100) : pctOfMonth;

              return (
                <div key={cat} className={styles.catRow}>
                  <div className={styles.catTop}>
                    <span className={styles.catName}>
                      <span className={styles.dot} style={{ background: CATEGORY_COLORS[cat] }} />
                      {cat}
                    </span>
                    <span className={styles.catAmount}>{formatCurrency(spent)}</span>
                  </div>
                  <div className={styles.catTrack}>
                    <div
                      className={`${styles.catFill} ${styles[`fill_${status}`]}`}
                      style={{
                        width: `${limit > 0 ? pctOfBudget : pctOfMonth}%`,
                        background: status === 'over' ? 'var(--danger)' : CATEGORY_COLORS[cat],
                      }}
                    />
                  </div>
                  <div className={styles.catMeta}>
                    {limit > 0 ? (
                      <>
                        <span className={status === 'over' ? styles.overBudget : styles.budgetMeta}>
                          {status === 'over' ? 'Over budget' : `${Math.round((spent / limit) * 100)}% of ${formatCurrency(limit)}`}
                        </span>
                      </>
                    ) : (
                      <span className={styles.budgetMeta}>{Math.round(pctOfMonth)}% of month</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
