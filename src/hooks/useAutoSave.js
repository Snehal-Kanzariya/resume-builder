import { useEffect, useRef } from 'react';
import { saveToStorage } from '../utils/storage';

export function useAutoSave(data, delay = 5000) {
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveToStorage(data);
    }, delay);

    return () => clearTimeout(timer.current);
  }, [data, delay]);
}
