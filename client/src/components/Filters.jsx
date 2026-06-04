import { CATEGORIES, getMonthRange, getLastMonthRange, todayString } from '../utils/formatters';
import styles from './Filters.module.css';

const PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
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
    } else if (value === 'all') {
      onChange({ ...filters, preset: value, startDate: '', endDate: '' });
    } else {
      onChange({ ...filters, preset: value });
    }
  }

  function handleCategory(e) {
    onChange({ ...filters, category: e.target.value });
  }

  function handleDateChange(field) {
    return (e) => onChange({ ...filters, [field]: e.target.value, preset: 'custom' });
  }

  return (
    <div className={styles.bar}>
      <div className={styles.presets}>
        {PRESETS.map((p) => (
          <button
            key={p.value}
            className={`${styles.preset} ${preset === p.value ? styles.active : ''}`}
            onClick={() => handlePreset(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <select className={styles.select} value={category} onChange={handleCategory}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {preset === 'custom' && (
          <>
            <input
              type="date"
              className={styles.dateInput}
              value={startDate}
              max={endDate || todayString()}
              onChange={handleDateChange('startDate')}
            />
            <span className={styles.sep}>→</span>
            <input
              type="date"
              className={styles.dateInput}
              value={endDate}
              min={startDate}
              max={todayString()}
              onChange={handleDateChange('endDate')}
            />
          </>
        )}
      </div>
    </div>
  );
}
