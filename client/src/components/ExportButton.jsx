import { formatDate } from '../utils/formatters';
import styles from './ExportButton.module.css';

function toCsv(expenses) {
  const header = ['Date', 'Category', 'Amount', 'Note'];
  const rows = expenses.map((e) => [
    formatDate(e.date),
    e.category,
    e.amount.toFixed(2),
    `"${(e.note || '').replace(/"/g, '""')}"`,
  ]);
  return [header, ...rows].map((r) => r.join(',')).join('\n');
}

export default function ExportButton({ expenses }) {
  function handleExport() {
    const csv = toCsv(expenses);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      className={styles.btn}
      onClick={handleExport}
      disabled={expenses.length === 0}
      title="Export visible expenses as CSV"
    >
      Export CSV
    </button>
  );
}
