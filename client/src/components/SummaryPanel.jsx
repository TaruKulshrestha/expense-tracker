import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, CATEGORIES, CATEGORY_COLORS } from '../utils/formatters';
import styles from './SummaryPanel.module.css';

function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    return (
      <div className={styles.tooltip}>
        <span>{payload[0].name}: </span>
        <strong>{formatCurrency(payload[0].value)}</strong>
      </div>
    );
  }
  return null;
}

export default function SummaryPanel({ summary }) {
  if (!summary) return null;

  const { totalThisMonth, totalByCategory, highestExpense } = summary;

  const chartData = CATEGORIES
    .filter((cat) => totalByCategory[cat] > 0)
    .map((cat) => ({ name: cat, value: totalByCategory[cat] }));

  return (
    <div className={styles.panel}>
      <div className={styles.stat}>
        <span className={styles.label}>This Month</span>
        <span className={styles.bigNumber}>{formatCurrency(totalThisMonth)}</span>
      </div>

      {highestExpense && (
        <div className={styles.stat}>
          <span className={styles.label}>Highest Expense</span>
          <span className={styles.highlight}>{formatCurrency(highestExpense.amount)}</span>
          <span className={styles.sub}>{highestExpense.category} · {highestExpense.note || '—'}</span>
        </div>
      )}

      {chartData.length > 0 && (
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={styles.breakdown}>
        {CATEGORIES.map((cat) => (
          totalByCategory[cat] > 0 && (
            <div key={cat} className={styles.breakdownRow}>
              <span className={styles.dot} style={{ background: CATEGORY_COLORS[cat] }} />
              <span className={styles.catName}>{cat}</span>
              <span className={styles.catAmount}>{formatCurrency(totalByCategory[cat])}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
