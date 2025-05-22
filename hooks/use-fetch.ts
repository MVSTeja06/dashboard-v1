

//useFetch.js
import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      setLoading(true)
      setData(null);
      setError(null);
      fetch(url)
      .then(res => {
        if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
      })
      .then(data => {
          setData(data);
          setLoading(false);
      })
      .catch(() => {
          setLoading(false)
          setError('An error occurred. Awkward..')
      })
  }, [url])

  return { data, loading, error }
}

export default useFetch;