import { useState, useEffect } from 'react';

export function useApiData<T>(
  fetchFn: () => Promise<T>,
  errorMessage: string = 'Failed to load data'
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : errorMessage);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}