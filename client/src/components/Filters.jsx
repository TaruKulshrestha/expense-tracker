import { CATEGORIES, getMonthRange, getLastMonthRange, getLastNDaysRange, todayString } from '../utils/formatters';
import styles from './Filters.module.css';

const PRESETS = [
  { label: 'All', value: 'all' },
  { label: 'Month', value: 'this_month' },
  { label: 'Last mo.', value: 'last_month' },
  { label: '7d', value: 'last_7' },
  { label: '30d', value: 'last_30' },
  { label: 'Custom', value: 'custom' },
];

export default function Filters({ filters, onChange }) {
  const { preset = 'all', category = '', startDate = '', endDate = '' } = filters;

  function handlePreset(value) {
    if (value === 'this_month') {
      const { startDate: s, endDate: e } = getMonthRange();
      onChange({ ...filters, preset: value, startDate: s, endDate: e });
    } else if (value === 'last_month') {
      const { startDate: s, endDate: e } = getLastMonthRange();
      onChange({ ...filters, preset: value, startDate: s, endDate: e });
    } else if (value === 'last_7') {
      const { startDate: s, endDate: e } = getLastNDaysRange(7);
      onChange({ ...filters, preset: value, startDate: s, endDate: e });
    } else if (value === 'last_30') {
      const { startDate: s, endDate: e } = getLastNDaysRange(30);
      onChange({ ...filters, preset: value, startDate: s, endDate: e });
    } else if (value === 'all') {
      onChange({ ...filters, preset: value, startDate: '', endDate: '' });
    } else {
      onChange({ ...filters, preset: value });
    }
  }

  return (
    <div className={styles.bar}>
      <div className={styles.tabs} role="tablist" aria-label="Date range">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            role="tab"
            aria-selected={preset === p.value}
            className={`${styles.tab} ${preset === p.value ? styles.tabActive : ''}`}
            onClick={() => handlePreset(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <select
        className={styles.categorySelect}
        value={category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        aria-label="Filter by category"
      >
        <option value="">Every category</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {preset === 'custom' && (
        <div className={styles.customRow}>
          <input
            type="date"
            value={startDate}
            max={endDate || todayString()}
            onChange={(e) => onChange({ ...filters, startDate: e.target.value, preset: 'custom' })}
            aria-label="From"
          />
          <span className={styles.sep}>—</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={todayString()}
            onChange={(e) => onChange({ ...filters, endDate: e.target.value, preset: 'custom' })}
            aria-label="To"
          />
        </div>
      )}
    </div>
  );
}
