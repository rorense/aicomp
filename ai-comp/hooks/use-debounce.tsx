import { useEffect, useState } from "react";

// A hook that causes a slight delay in the value of the input field for searching
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
