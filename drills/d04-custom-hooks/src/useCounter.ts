import { useState } from "react";

export interface CounterOptions {
  min?: number;
  max?: number;
}

export interface Counter {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export function useCounter(initial = 0, { min = -Infinity, max = Infinity }: CounterOptions = {}): Counter {
  const [count, setCount] = useState(initial);

  return {
    count,
    increment: () => setCount((c) => Math.min(c + 1, max)),
    decrement: () => setCount((c) => Math.max(c - 1, min)),
    reset: () => setCount(initial),
  };
}
