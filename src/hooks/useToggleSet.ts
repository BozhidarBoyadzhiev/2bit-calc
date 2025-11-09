import { useState, useCallback } from 'react';

export const useToggleSet = <T>(initialValues?: Set<T>) => {
  const [set, setSet] = useState<Set<T>>(initialValues || new Set());

  const toggle = useCallback((value: T) => {
    setSet(prev => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  const add = useCallback((value: T) => {
    setSet(prev => new Set(prev).add(value));
  }, []);

  const remove = useCallback((value: T) => {
    setSet(prev => {
      const next = new Set(prev);
      next.delete(value);
      return next;
    });
  }, []);

  return { set, toggle, clear, add, remove };
};
