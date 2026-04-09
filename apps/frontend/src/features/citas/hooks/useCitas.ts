import { useState, useEffect } from 'react';
import { getCitas } from '../services/citaService';

export const useCitas = () => {
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCitas()
      .then(data => {
        setCitas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { citas, loading, error };
};
