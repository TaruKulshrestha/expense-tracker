import {
  formatCurrency, CATEGORIES, CATEGORY_COLORS,
} from '../utils/formatters';
import styles from './SummaryPanel.module.css';

export default function SummaryPanel({
  total, byCategory, topCategory, topAmount, loading,
}) {
  const chartData = CATEGORIES
    .filter((cat) => (byCategory[cat] || 0) > 0)
    .map((cat) => ({
      name: cat,
      value: byCategory[cat],
      pct: total > 0 ? (byCategory[cat] / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (loading) {
    return <div className={styles.skeleton} />;
  }

  if (chartData.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Category breakdown will appear once you log expenses.</p>
      </div>
    );
  }

  return (
    <section className={styles.panel} aria-label="Category breakdown">
      <div className={styles.head}>
        <h3 className={styles.title}>Where it went</h3>
        {topCategory && (
          <span className={styles.badge}>
            Most: {topCategory} · {formatCurrency(topAmount)}
          </span>
        )}
      </div>

      <div className={styles.bars}>
        {chartData.map((item) => (
          <div key={item.name} className={styles.barRow}>
            <div className={styles.barMeta}>
              <span className={styles.barName}>{item.name}</span>
              <span className={styles.barAmount}>{formatCurrency(item.value)}</span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${item.pct}%`,
                  background: CATEGORY_COLORS[item.name],
                }}
              />
            </div>
            <span className={styles.barPct}>{Math.round(item.pct)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
