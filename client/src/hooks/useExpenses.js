import { useState, useEffect, useCallback } from 'react';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../utils/api';

export function useExpenses(filters = {}) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses(filters);
      setExpenses(data.expenses);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filters.category, filters.startDate, filters.endDate]);

  useEffect(() => {
    load();
  }, [load]);

  async function addExpense(data) {
    const created = await createExpense(data);
    await load({ silent: true });
    return created;
  }

  async function editExpense(id, data) {
    const updated = await updateExpense(id, data);
    await load({ silent: true });
    return updated;
  }

  async function removeExpense(id) {
    await deleteExpense(id);
    await load({ silent: true });
  }

  return { expenses, summary, loading, error, addExpense, editExpense, removeExpense, reload: load };
}
