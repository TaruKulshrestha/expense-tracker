import { useState, useEffect, useCallback } from 'react';
import { fetchBudgets, updateBudgets } from '../utils/api';

export function useBudgets() {
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveBudgets(next) {
    const updated = await updateBudgets(next);
    setBudgets(updated);
    return updated;
  }

  return { budgets, loading, error, saveBudgets, reload: load };
}
